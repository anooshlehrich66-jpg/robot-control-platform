import { useEffect, useRef } from 'react'
import './MapPanel.css'

const mapButtons = [
  '跟踪', '激光', '路径', '校正', '标记导航', '添加点位', '控制', '添加区域', '全部路径'
]

function MapPanel({ mapData, setMapData }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, width, height)
    
    ctx.strokeStyle = '#1a3a5a'
    ctx.lineWidth = 1
    const gridSize = 30
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    if (mapData && mapData.points) {
      ctx.fillStyle = '#00ff88'
      mapData.points.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    } else {
      ctx.fillStyle = '#00d4ff'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('等待激光雷达数据...', width / 2, height / 2)
    }
    
    const robotX = mapData?.robotX || width / 2
    const robotY = mapData?.robotY || height / 2
    const robotAngle = mapData?.robotAngle || 0
    
    ctx.save()
    ctx.translate(robotX, robotY)
    ctx.rotate(robotAngle * Math.PI / 180)
    
    ctx.fillStyle = '#ff6b6b'
    ctx.beginPath()
    ctx.moveTo(15, 0)
    ctx.lineTo(-10, -10)
    ctx.lineTo(-10, 10)
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
    
    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(robotX, robotY, 20, 0, Math.PI * 2)
    ctx.stroke()
  }, [mapData])

  return (
    <div className="map-panel">
      <div className="map-header">
        <h2>激光雷达地图</h2>
        <div className="map-buttons">
          {mapButtons.map((btn, index) => (
            <button key={index} className="map-btn">{btn}</button>
          ))}
        </div>
      </div>
      <div className="map-toolbar">
        <button onClick={() => setMapData(null)}>刷新</button>
      </div>
      <div className="map-container">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={500}
        />
      </div>
      <div className="map-legend">
        <span><i className="dot blue"></i> 障碍物</span>
        <span><i className="dot red"></i> 机器人位置</span>
      </div>
    </div>
  )
}

export default MapPanel
