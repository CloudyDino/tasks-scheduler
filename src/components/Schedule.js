import React from 'react';
import './css/Schedule.css';
import { randomColor } from '../util/colors';
import { Task } from './Task';

export class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: this.props.tasks.map(it => randomColor())
        }
    }

    render() {
        return (
            <div className="schedule-list container">
                {
                    this.props.tasks.map((taskString, index) => {
                        return (
                            <Task
                                note={taskString}
                                color={this.state.colors[index]}
                            />
                        )
                    }
                    )
                }
            </div>
        );
    }
}