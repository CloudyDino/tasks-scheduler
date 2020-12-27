import React from 'react';
import './css/Topic.css'
import { Task } from './Task';

export class Topic extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return <div className="topic" style={{backgroundColor: this.props.color}}>
            <p>{this.props.topic}</p>
            <div className="container">
                {this.props.tasks.map((note) => <Task note={note} color={this.props.color}/>)}
            </div>
        </div>
    }
}