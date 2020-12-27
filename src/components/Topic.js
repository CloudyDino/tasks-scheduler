import React from 'react';
import './css/Topic.css'
import { Task } from './Task';

export class Topic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topic: this.props.topic,
            color: this.props.color,
            tasks: this.props.tasks
        };

        this.createTask = this.createTask.bind(this);
    }

    createTask() {
        var note = prompt("Enter task");

        this.setState((state, props) => ({
            tasks: state.tasks.concat(note)
        }))
    }

    render() {
        return <div className="topic" style={{ backgroundColor: this.props.color }}>
            <p>{this.state.topic}</p>
            <div className="container">
                {this.state.tasks.map((note) => <Task note={note} color={this.state.color} />)}
            </div>
            <div className="add-task-button" onClick={this.createTask}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><line x1="10" y1="2" x2="10" y2="18"></line><line x1="18" y1="10" x2="2" y2="10"></line></svg>
            </div>
        </div>
    }
}