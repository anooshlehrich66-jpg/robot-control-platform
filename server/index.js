import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import mqtt from 'mqtt'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const server = createServer(app)
const wss = new WebSocketServer({ server })

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883'
const MQTT_USERNAME = process.env.MQTT_USERNAME || ''
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || ''

let robotData = {
  status: {
    power: 85,
    online: false,
    ip: '',
    model: '',
    cpu: 0,
    memory: 0,
    temperature: 0
  },
  position: { x: 0, y: 0, angle: 0 },
  video: '',
  tasks: []
}

const clients = new Set()

wss.on('connection', (ws) => {
  clients.add(ws)
  console.log('Client connected')

  ws.send(JSON.stringify({ type: 'init', data: robotData }))

  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected')
  })
})

function broadcast(data) {
  const message = JSON.stringify(data)
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message)
    }
  })
}

const mqttOptions = {
  clientId: `robot_server_${Math.random().toString(16).slice(2, 10)}`
}

if (MQTT_USERNAME && MQTT_PASSWORD) {
  mqttOptions.username = MQTT_USERNAME
  mqttOptions.password = MQTT_PASSWORD
}

const mqttClient = mqtt.connect(MQTT_BROKER, mqttOptions)

mqttClient.on('connect', () => {
  console.log(`Connected to MQTT broker: ${MQTT_BROKER}`)
  
  mqttClient.subscribe('robot/#', (err) => {
    if (err) {
      console.error('Subscribe error:', err)
    } else {
      console.log('Subscribed to robot/#')
    }
  })
})

mqttClient.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString())
    const baseTopic = topic.replace('robot/', '').replace(/\/.*/, '')
    
    switch (baseTopic) {
      case 'status':
        robotData.status = { ...robotData.status, ...payload }
        broadcast({ type: 'status', data: robotData.status })
        break
      case 'position':
        robotData.position = payload
        broadcast({ type: 'position', data: payload })
        break
      case 'video':
        robotData.video = payload.url || payload
        broadcast({ type: 'video', data: robotData.video })
        break
      case 'tasks':
        robotData.tasks = payload
        broadcast({ type: 'tasks', data: payload })
        break
      default:
        if (topic.startsWith('robot/status/')) {
          const key = topic.replace('robot/status/', '')
          robotData.status[key] = payload
          broadcast({ type: 'status', data: robotData.status })
        }
    }
  } catch (e) {
    console.error('Parse message error:', e)
  }
})

mqttClient.on('error', (err) => {
  console.error('MQTT error:', err.message)
})

app.get('/api/robot/status', (req, res) => {
  res.json(robotData.status)
})

app.get('/api/robot/position', (req, res) => {
  res.json(robotData.position)
})

app.post('/api/robot/command', (req, res) => {
  const { action, params } = req.body
  const topic = `robot/command/${action}`
  mqttClient.publish(topic, JSON.stringify(params || {}))
  res.json({ success: true })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    mqtt: mqttClient.connected ? 'connected' : 'disconnected',
    clients: clients.size
  })
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`WebSocket available at ws://localhost:${PORT}`)
})
