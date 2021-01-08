import React from 'react';
import { randomColor } from '../util/colors';
import AddTopicButton from './AddTopicButton';
import './css/TopicList.css';
import { Topic } from './Topic';

export class TopicList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "addTopic": false,
            "color": randomColor()
        }

        this.addTopicKeyDown = this.addTopicKeyDown.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.stopAddingTopic = this.stopAddingTopic.bind(this);
    }

    addTopic() {
        this.setState({ "addTopic": true });
    }

    stopAddingTopic() {
        this.setState({
            "addTopic": false,
            "color": randomColor()
        });
    }

    createTopic(topic, color) {
        this.props.createTopic(topic, color);
    }

    addTopicKeyDown(event) {
        if ("Enter" === event.key) {
            event.preventDefault();
            const text = document.querySelector(".add-topic-text").value;
            const color = this.state.color;
            this.stopAddingTopic();
            this.createTopic(text, color);
        } else if ("Escape" === event.key) {
            event.stopPropagation()
            this.stopAddingTopic();
        }
    }

    render() {
        return <div className="topic-grid">
            {
                Object.keys(this.props.topics).map((topic_uuid, index) => {
                    return <Topic
                        key={topic_uuid}
                        topic={this.props.topics[topic_uuid]}
                        tasks={this.props.tasks}
                        createTask={this.props.createTask}
                        deleteTask={this.props.deleteTask}
                        editTopic={this.props.editTopic}
                        deleteTopic={this.props.deleteTopic}
                    />
                })
            }

            {this.state.addTopic ?
                <div className="topic" style={{ backgroundColor: this.state.color }}>
                    <textarea autoFocus className="add-topic-text" placeholder="Add Topic" onKeyDown={this.addTopicKeyDown} onBlur={this.stopAddingTopic} rows="1"/>
                </div> : ''}
            <AddTopicButton onClick={this.addTopic} />
        </div>;
    }
}