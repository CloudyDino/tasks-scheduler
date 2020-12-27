import React from 'react';
import AddTaskButton from './AddTaskButton';
import './css/Topic.css'
import { Task } from './Task';

export class Topic extends React.Component {
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
        this.props.createTask(note, this.props.topic.uuid);
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
        return <div className="topic" style={{ backgroundColor: this.props.topic.color }}>
            <p>{this.props.topic.name}</p>
            <div className="container">
                {Object.keys(this.props.tasks).filter(task_uuid => this.props.tasks[task_uuid].topic_uuid === this.props.topic.uuid).map(task_uuid => <Task key={task_uuid} task={this.props.tasks[task_uuid]} deleteNote={this.props.deleteNote} />)}
                {this.state.addTask ?
                    <div className="task">
                        <div className="task-inner">
                            <textarea className="add-task-text" placeholder="Add Task" onKeyDown={this.addTaskKeyDown} />
                        </div>
                    </div> : ''}
            </div>
            <AddTaskButton onClick={this.addTask} />
        </div>
    }
}