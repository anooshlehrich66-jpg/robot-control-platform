import './StatusBar.css'

function StatusBar({ status }) {
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className={`indicator ${status.online ? 'online' : 'offline'}`}></span>
        <span>{status.online ? '在线' : '离线'}</span>
      </div>
      <div className="status-item">
        <span className="label">IP:</span>
        <span>{status.ip}</span>
      </div>
      <div className="status-item">
        <span className="label">电量:</span>
        <span className={status.power < 20 ? 'warning' : ''}>{status.power}%</span>
      </div>
    </div>
  )
}

export default StatusBar
