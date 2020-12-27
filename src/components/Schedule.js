import React from 'react';
import './css/Schedule.css';
import { Task } from './Task';
import AddTaskButton from './AddTaskButton'

export class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "addTask": false
        }

        this.addTaskKeyDown = this.addTaskKeyDown.bind(this);
        this.addTask = this.addTask.bind(this);
    }

    addTask() {
        this.setState({ "addTask": true });
    }

    createTask(note) {
        this.props.createTask(note, null);
    }

    addTaskKeyDown(event) {
        if ("Enter" === event.key) {
            event.preventDefault();
            let text = document.querySelector(".add-task-text").value;
            this.setState({ "addTask": false });
            this.createTask(text);
        } else if ("Escape" === event.key) {
            event.stopPropagation()
            this.setState({ "addTask": false });
        }
    }
    
    render() {
        return (
            <div>
                <div className="schedule-list">
                    {
                        this.props.schedule.map(task_uuid => {
                            return (
                                <Task
                                    key={task_uuid}
                                    task={this.props.tasks[task_uuid]}
                                    deleteNote={this.props.deleteNote}
                                />
                            )
                        }
                        )
                    }
                    {this.state.addTask ?
                    <div className="task">
                        <div className="task-inner">
                            <textarea className="add-task-text" placeholder="Add Task" onKeyDown={this.addTaskKeyDown} />
                        </div>
                    </div> : ''}
                </div>
                <AddTaskButton onClick={this.addTask} />
            </div>
        );
    }
}