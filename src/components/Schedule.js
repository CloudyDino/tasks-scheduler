import React from "react";
import "./css/Schedule.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";
import AddTaskButton from "./AddTaskButton";

export class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addTask: false,
    };

    this.addTask = this.addTask.bind(this);
    this.createTask = this.createTask.bind(this);
    this.stopAddingTask = this.stopAddingTask.bind(this);
  }

  addTask() {
    this.setState({ addTask: true });
  }

  stopAddingTask() {
    this.setState({ addTask: false });
  }

  createTask(note) {
    this.props.createTask(note, null);
  }

  render() {
    return (
      <div className="schedule">
        <Droppable droppableId="schedule">
          {(provided) => (
            <div
              className="schedule-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.props.schedule.map((task_uuid, index) => (
                <Draggable
                  key={task_uuid}
                  draggableId={`schedule:${task_uuid}`}
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
                        color={
                          this.props.tasks[task_uuid].topic_uuid != null
                            ? this.props.topics[
                                this.props.tasks[task_uuid].topic_uuid
                              ].color
                            : "transparent"
                        }
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
        <AddTaskButton onClick={this.addTask} />
      </div>
    );
  }
}
