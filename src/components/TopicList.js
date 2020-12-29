import React from 'react';
import './css/TopicList.css';
import { Topic } from './Topic';

export class TopicList extends React.Component {

    render() {
        return <div className="topic-grid">
            {
                Object.keys(this.props.topics).map((topic_uuid, index) => {
                    return <Topic
                        key={topic_uuid}
                        topic={this.props.topics[topic_uuid]}
                        tasks={this.props.tasks}
                        createTask={this.props.createTask}
                        deleteNote={this.props.deleteNote}
                    />
                })
            }
        </div>;
    }
}