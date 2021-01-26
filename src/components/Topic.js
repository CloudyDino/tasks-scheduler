import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { randomColor } from "../util/colors";
import AddTaskButton from "./AddTaskButton";
import "./css/Topic.css";
import { Task } from "./Task";

export class Topic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addTask: false,
    };

    this.addTask = this.addTask.bind(this);
    this.createTask = this.createTask.bind(this);
    this.stopAddingTask = this.stopAddingTask.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
    this.adjustTopicColor = this.adjustTopicColor.bind(this);
  }

  addTask() {
    this.setState({ addTask: true });
  }

  stopAddingTask() {
    this.setState({ addTask: false });
  }

  createTask(note) {
    this.props.createTask(note, this.props.topic.uuid);
  }

  deleteTopic() {
    this.props.deleteTopic(this.props.topic.uuid);
  }

  adjustTopicColor() {
    this.props.editTopic(
      this.props.topic.uuid,
      this.props.topic.name,
      randomColor()
    );
  }

  render() {
    return (
      <div
        className="topic"
        style={{ backgroundColor: this.props.topic.color }}
      >
        <p>{this.props.topic.name}</p>
        <Droppable droppableId={this.props.topic.uuid}>
          {(provided) => (
            <div
              className="container scroll-enabled"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.props.topic.tasks.map((task_uuid, index) => (
                <Draggable
                  key={task_uuid}
                  draggableId={task_uuid}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task
                        task={this.props.tasks[task_uuid]}
                        updateTaskDate={this.props.updateTaskDate}
                        updateTaskNote={this.props.updateTaskNote}
                        deleteTask={this.props.deleteTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {this.state.addTask ? (
                <Task
                  createTask={this.createTask}
                  onCancel={this.stopAddingTask}
                />
              ) : (
                ""
              )}
            </div>
          )}
        </Droppable>
        <div className="topic-actions">
          <button
            aria-label="Change Topic Color"
            className="topic-action"
            onClick={this.adjustTopicColor}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="9.012" cy="14.313" r="4.313" />
              <circle cx="7.574" cy="4.608" r="3.235" />
              <circle cx="16.2" cy="8.742" r="3.055" />
              <circle cx="2.541" cy="9.461" r="1.797" />
              <circle cx="16.111" cy="15.122" r="1.348" />
              <circle cx="13.415" cy="3.44" r="1.348" />
            </svg>{" "}
          </button>

          <AddTaskButton onClick={this.addTask} />

          <button
            aria-label="Delete Topic"
            className="topic-action"
            onClick={this.deleteTopic}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.3,17.439c-.615,0-1.136-.357-1.159-.8L4.476,4.561h11.13l-.663,12.081c-.023.44-.544.8-1.159.8Z" />
              <path d="M15.015,5.121l-.63,11.489c0,.069-.217.269-.6.269H6.3c-.384,0-.6-.2-.6-.268L5.067,5.121h9.948M16.2,4H3.884l.695,12.672A1.594,1.594,0,0,0,6.3,18h7.486A1.594,1.594,0,0,0,15.5,16.672L16.2,4Z" />
              <path d="M15.476,2H4.524a.739.739,0,0,0-.751.734V3H16.227V2.734A.739.739,0,0,0,15.476,2Z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}
