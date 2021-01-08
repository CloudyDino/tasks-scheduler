import React from 'react'
import './css/Task.css'

export class Task extends React.Component {

    constructor(props) {
        super(props);

        this.deleteTask = this.deleteTask.bind(this);
    }

    deleteTask() {
        console.log("TODO: split into delete and complete");
        this.props.deleteTask(this.props.task.uuid);
    }

    render() {
        return (
            <div className="task"
                style={{ backgroundColor: this.props.color }}>
                <div className="task-inner">
                    <div className="task-action" onClick={this.deleteTask}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </div>
                    <div className="task-note">
                        {this.props.task.note}
                    </div>
                    <div className="task-action" onClick={this.deleteTask}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
            </div>
        );
    }
}
