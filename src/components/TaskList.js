import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";
import "./css/TaskList.css";

export class TaskList extends React.Component {
  render() {
    return (
      <Droppable droppableId={this.props.id}>
        {(provided) => (
          <div
            className="task-list scroll-enabled"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {this.props.tasksOrder.map((taskUuid, index) => (
              <Task
                key={taskUuid}
                parentId={this.props.id}
                index={index}
                task={this.props.tasks[taskUuid]}
                updateTaskDate={this.props.updateTaskDate}
                updateTaskContent={this.props.updateTaskContent}
                createTask={this.props.createTask}
                deleteTask={this.props.deleteTask}
                color={
                  this.props.tasks[taskUuid].topicUuid != null
                    ? this.props.topics[this.props.tasks[taskUuid].topicUuid]
                        .color
                    : "transparent"
                }
              />
            ))}
            {provided.placeholder}
            {this.props.addTask === true ? (
              <Task
                key="newTask"
                parentId={this.props.id}
                index={this.props.tasksOrder.length}
                createTask={this.props.createTask}
                onCancelAddingTask={this.props.onCancelAddingTask}
              />
            ) : (
              ""
            )}
          </div>
        )}
      </Droppable>
    );
  }
}
