import React from 'react';
import './css/Topic.css'
import { Task } from './Task';

export class Topic extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return <div draggable="true" class='topic' style={{backgroundColor: this.props.color}}>
            <p>{this.props.topic}</p>
            <ul>
                {this.props.tasks.map((note) => <Task note={note} color={this.props.color}/>)}
            </ul>
        </div>
    }
}