const STATUS_LABELS = { OPEN: 'Open', IN_PROGRESS: 'In progress', DONE: 'Done' };

function priorityClass(priority) {
  return `priority-${(priority || 'medium').toLowerCase()}`;
}

function titleCase(value) {
  return value ? value.charAt(0) + value.slice(1).toLowerCase() : '';
}

export default function TaskTable({ tasks, loading, error }) {
  if (loading) {
    return (
      <div className="table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td className="col-id"><div className="skeleton skeleton-text" style={{ width: '40px' }}></div></td>
                <td>
                  <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '8px' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                </td>
                <td><div className="skeleton skeleton-badge"></div></td>
                <td><div className="skeleton skeleton-text" style={{ width: '60px' }}></div></td>
                <td>
                  <div className="assignee">
                    <div className="skeleton skeleton-avatar"></div>
                    <div className="skeleton skeleton-text" style={{ width: '80px' }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-message error" role="alert">
        Couldn’t load tasks ({error}). Check that the backend is running, then change your search to retry.
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="state-message">
        No tasks match your search. Try a different word or clear the status filter.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={priorityClass(task.priority)}>
              <td className="col-id">#{task.id}</td>
              <td>
                <div className="task-title">{task.title}</div>
                <div className="task-desc">{task.description}</div>
              </td>
              <td>
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {STATUS_LABELS[task.status] || task.status}
                </span>
              </td>
              <td className="priority-cell">{titleCase(task.priority)}</td>
              <td>
                {task.assignee ? (
                  <span className="assignee">
                    <span className="avatar" aria-hidden="true">{task.assignee.charAt(0)}</span>
                    {task.assignee}
                  </span>
                ) : (
                  <span className="muted">Unassigned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
