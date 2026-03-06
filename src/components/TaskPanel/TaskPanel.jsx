import './TaskPanel.css'

function TaskPanel({ tasks, setTasks }) {
  const handleTaskAction = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'running' ? 'idle' : 'running'
        }
      }
      return task
    }))
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'running': return '执行中'
      case 'completed': return '已完成'
      default: return '待执行'
    }
  }

  return (
    <div className="task-panel">
      <div className="task-header">
        <h2>任务编排</h2>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.status}`}>
            <div className="task-info">
              <span className="task-name">{task.name}</span>
              <span className={`task-status ${task.status}`}>
                {getStatusText(task.status)}
              </span>
            </div>
            <button 
              className={`task-btn ${task.status}`}
              onClick={() => handleTaskAction(task.id)}
            >
              {task.status === 'running' ? '停止' : '执行'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskPanel
