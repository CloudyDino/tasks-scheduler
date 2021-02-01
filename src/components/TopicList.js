import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { randomColor } from "../util/colors";
import AddTopicButton from "./AddTopicButton";
import "./css/TopicList.css";
import { Topic } from "./Topic";

export class TopicList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addTopic: false,
      color: randomColor(),
    };

    this.addTopicKeyDown = this.addTopicKeyDown.bind(this);
    this.addTopic = this.addTopic.bind(this);
    this.stopAddingTopic = this.stopAddingTopic.bind(this);
  }

  addTopic() {
    this.setState({ addTopic: true });
  }

  stopAddingTopic() {
    this.setState({
      addTopic: false,
      color: randomColor(),
    });
  }

  createTopic(topic, color) {
    this.props.createTopic(topic, color);
  }

  addTopicKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const text = document.querySelector(".add-topic-text").value;
      const { color } = this.state;
      this.stopAddingTopic();
      this.createTopic(text, color);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      this.stopAddingTopic();
    }
  }

  render() {
    return (
      <div id="topics" className="scroll-enabled">
        <h1>Lists</h1>
        <Droppable droppableId="topic-list" direction="grid" type="topic">
          {(provided) => (
            <div
              className="topic-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.props.topicsOrder.map((topicUuid, index) => (
                <Topic
                  key={topicUuid}
                  index={index}
                  topic={this.props.topics[topicUuid]}
                  tasks={this.props.tasks}
                  createTask={this.props.createTask}
                  updateTaskDate={this.props.updateTaskDate}
                  updateTaskContent={this.props.updateTaskContent}
                  deleteTask={this.props.deleteTask}
                  updateTopic={this.props.updateTopic}
                  deleteTopic={this.props.deleteTopic}
                />
              ))}

              {provided.placeholder}

              {this.state.addTopic ? (
                <div
                  key="newTopic"
                  className="topic"
                  style={{ backgroundColor: this.state.color }}
                >
                  <textarea
                    autoFocus
                    className="add-topic-text"
                    placeholder="Add Topic"
                    onKeyDown={this.addTopicKeyDown}
                    onBlur={this.stopAddingTopic}
                    rows="1"
                  />
                </div>
              ) : (
                ""
              )}

              <AddTopicButton onClick={this.addTopic} />
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}
