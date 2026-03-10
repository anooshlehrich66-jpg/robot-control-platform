import { useState, useEffect, useRef } from 'react'
import RobotPanel from './components/RobotPanel/RobotPanel'
import MapPanel from './components/MapPanel/MapPanel'
import VideoPanel from './components/VideoPanel/VideoPanel'
import StatusBar from './components/StatusBar/StatusBar'
import './App.css'

const WS_URL = 'ws://localhost:3001'

function App() {
  const [robotStatus, setRobotStatus] = useState({
    power: 85,
    online: false,
    ip: '192.168.1.100',
    model: 'UGV-Robot-V2',
    cpu: 0,
    memory: 0,
    temperature: 0,
  })

  const [mapData, setMapData] = useState(null)
  const [videoStream, setVideoStream] = useState('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(WS_URL)

      wsRef.current.onopen = () => {
        setConnected(true)
        console.log('Connected to server')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          switch (message.type) {
            case 'init':
              if (message.data.status) setRobotStatus(prev => ({ ...prev, ...message.data.status }))
              if (message.data.position) setMapData(message.data.position)
              if (message.data.video) setVideoStream(message.data.video)
              break
            case 'status':
              setRobotStatus(prev => ({ ...prev, ...message.data }))
              break
            case 'position':
              setMapData(message.data)
              break
            case 'video':
              setVideoStream(message.data)
              break
          }
        } catch (e) {
          console.error('Parse error:', e)
        }
      }

      wsRef.current.onclose = () => {
        setConnected(false)
        console.log('Disconnected, retrying...')
        setTimeout(connectWebSocket, 3000)
      }

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const sendCommand = (action, params = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, params }))
    }
  }

  const handlePowerToggle = () => {
    const newOnline = !robotStatus.online
    sendCommand('power', { online: newOnline })
    setRobotStatus(prev => ({ ...prev, online: newOnline }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>机器人控制平台</h1>
        <StatusBar status={{ ...robotStatus, connected }} />
      </header>
      
      <main className="app-main">
        <div className="left-panel">
          <RobotPanel 
            status={robotStatus} 
            onPowerToggle={handlePowerToggle} 
          />
          <VideoPanel streamUrl={videoStream} />
        </div>
        
        <div className="right-panel">
          <MapPanel mapData={mapData} setMapData={setMapData} />
        </div>
      </main>
    </div>
  )
}

export default App
