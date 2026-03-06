import './RobotPanel.css'

function RobotPanel({ status, onPowerToggle }) {
  return (
    <div className="robot-panel">
      <div className="robot-header">
        <h2>机器人状态</h2>
        <button 
          className={`power-btn ${status.online ? 'on' : 'off'}`}
          onClick={onPowerToggle}
        >
          {status.online ? '关机' : '开机'}
        </button>
      </div>
      
      <div className="robot-model">
        <div className="model-placeholder">
          <div className="robot-icon">
            <div className="robot-body"></div>
            <div className="robot-wheel left"></div>
            <div className="robot-wheel right"></div>
          </div>
          <span>{status.model}</span>
        </div>
      </div>
      
      <div className="robot-info">
        <div className="info-item">
          <span className="label">IP地址</span>
          <span className="value">{status.ip}</span>
        </div>
        <div className="info-item">
          <span className="label">电量</span>
          <div className="power-bar">
            <div 
              className="power-fill" 
              style={{ width: `${status.power}%` }}
            ></div>
          </div>
          <span className="value">{status.power}%</span>
        </div>
        <div className="info-item">
          <span className="label">CPU</span>
          <div className="stat-bar">
            <div className="stat-fill cpu" style={{ width: `${status.cpu}%` }}></div>
          </div>
          <span className="value">{status.cpu}%</span>
        </div>
        <div className="info-item">
          <span className="label">内存</span>
          <div className="stat-bar">
            <div className="stat-fill memory" style={{ width: `${status.memory}%` }}></div>
          </div>
          <span className="value">{status.memory}%</span>
        </div>
        <div className="info-item">
          <span className="label">温度</span>
          <span className="value">{status.temperature}°C</span>
        </div>
      </div>
    </div>
  )
}

export default RobotPanel
