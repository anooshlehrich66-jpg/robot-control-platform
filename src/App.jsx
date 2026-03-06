import { useState, useEffect } from 'react'
import RobotPanel from './components/RobotPanel/RobotPanel'
import MapPanel from './components/MapPanel/MapPanel'
import VideoPanel from './components/VideoPanel/VideoPanel'
import TaskPanel from './components/TaskPanel/TaskPanel'
import StatusBar from './components/StatusBar/StatusBar'
import './App.css'

function App() {
  const [robotStatus, setRobotStatus] = useState({
    power: 85,
    online: true,
    ip: '192.168.1.100',
    model: 'UGV-Robot-V2',
    cpu: 45,
    memory: 62,
    temperature: 38,
  })

  const [mapData, setMapData] = useState(null)
  const [videoStream, setVideoStream] = useState('ws://192.168.1.100:8080/stream')
  const [tasks, setTasks] = useState([
    { id: 1, name: '巡检任务A', status: 'idle' },
    { id: 2, name: '返回充电', status: 'idle' },
    { id: 3, name: '定点拍摄', status: 'idle' },
  ])

  const handlePowerToggle = () => {
    setRobotStatus(prev => ({ ...prev, online: !prev.online }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>机器人控制平台</h1>
        <StatusBar status={robotStatus} />
      </header>
      
      <main className="app-main">
        <div className="left-panel">
          <RobotPanel 
            status={robotStatus} 
            onPowerToggle={handlePowerToggle} 
          />
          <VideoPanel streamUrl={videoStream} />
          <TaskPanel tasks={tasks} setTasks={setTasks} />
        </div>
        
        <div className="right-panel">
          <MapPanel mapData={mapData} setMapData={setMapData} />
        </div>
      </main>
    </div>
  )
}

export default App
