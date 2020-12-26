import React from 'react';
import { randomColor } from '../colors';
import './css/TopicList.css';
import { Topic } from './Topic';

export class TopicList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: Object.keys(this.props.tasks).map(it => randomColor())
        }
    }

    render() {
        return <div class='topic-grid'>
            {
                Object.keys(this.props.tasks).map((topic, index) => {
                    return <Topic
                        topic={topic}
                        tasks={this.props.tasks[topic]}
                        color={this.state.colors[index]}
                    />
                  })
            }
        </div>;
    }
}