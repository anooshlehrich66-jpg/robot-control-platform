import './VideoPanel.css'

function VideoPanel({ streamUrl }) {
  const isConnected = Boolean(streamUrl)

  return (
    <div className="video-panel">
      <div className="video-header">
        <h2>视频监控</h2>
        <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '已连接' : '未连接'}
        </span>
      </div>
      <div className="video-container">
        {isConnected ? (
          <div className="video-placeholder">
            <div className="video-icon">📹</div>
            <span>视频流: {streamUrl}</span>
            <small>点击连接WebSocket视频流</small>
          </div>
        ) : (
          <div className="video-placeholder offline">
            <div className="video-icon">📹</div>
            <span>等待视频流...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPanel
