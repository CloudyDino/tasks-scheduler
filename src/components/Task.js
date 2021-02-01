import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "./css/Task.css";
import autosize from "autosize";

export class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: this.props.task === undefined,
      new: this.props.task === undefined,
    };

    this.toggleDate = this.toggleDate.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.editTaskKeyDown = this.editTaskKeyDown.bind(this);
    this.stopEditingTask = this.stopEditingTask.bind(this);
    this.cancelEditingTask = this.cancelEditingTask.bind(this);
  }

  toggleDate() {
    let date = new Date();
    if (this.props.task?.date == null) {
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } else {
      date = null;
    }

    if (this.props.updateTaskDate !== undefined) {
      this.props.updateTaskDate(this.props.task?.uuid, date);
    }
  }

  updateDate(date) {
    this.props.updateTaskDate(this.props.task.uuid, date);
  }

  updateContent(content) {
    this.props.updateTaskContent(this.props.task.uuid, content);
  }

  deleteTask() {
    this.props.deleteTask(this.props.task?.uuid);
  }

  editTaskKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.stopEditingTask();
    } else if (event.key === "Escape") {
      event.stopPropagation();
      this.cancelEditingTask();
    }
    autosize(document.querySelector(".add-task-text"));
  }

  stopEditingTask() {
    const content = document.querySelector(".add-task-text").value;
    document.querySelector(".add-task-text").value = "";
    if (this.state.new) {
      this.props.createTask(content);
    } else {
      this.updateContent(content);
      this.setState({ editing: false });
    }
  }

  cancelEditingTask() {
    if (this.state.new) {
      this.props.onCancelAddingTask();
    } else {
      this.setState({ editing: false });
    }
  }

  render() {
    return (
      <Draggable
        key={this.props.task?.uuid ?? "newTask"}
        draggableId={`${this.props.parentId}:${
          this.props.task?.uuid ?? "newTask"
        }`}
        index={this.props.index}
      >
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="task-container"
          >
            <div className="task" style={{ backgroundColor: this.props.color }}>
              <div className="task-inner">
                <button
                  aria-label="Add/Remove Task Date"
                  className="task-action"
                  onClick={this.toggleDate}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <g fill="currentColor">
                      <path d="M10,19.375C2.457,19.375.723,17.623.723,10S2.457.625,10,.625,19.278,2.377,19.278,10,17.543,19.375,10,19.375ZM7.893,9.765a2.014,2.014,0,0,0,4.028,0,1.967,1.967,0,0,0-.017-.253l1.667-1.666A1.25,1.25,0,0,0,11.8,6.078L10.118,7.763a1.911,1.911,0,0,0-.211-.013,1.988,1.988,0,0,0-.336.029L6.006,4.214A1.25,1.25,0,1,0,4.238,5.981L7.9,9.641C7.894,9.682,7.893,9.724,7.893,9.765Z" />
                      <path d="M10,1.25c7.2,0,8.653,1.472,8.653,8.75S17.2,18.75,10,18.75,1.347,17.278,1.347,10,2.8,1.25,10,1.25M7.271,9.9a2.639,2.639,0,0,0,5.275-.134v-.01l1.466-1.466a1.875,1.875,0,1,0-2.651-2.652l-1.49,1.49H9.8L6.448,3.772A1.875,1.875,0,0,0,3.8,6.423L7.271,9.9M10,0C2.078,0,.1,2,.1,10S2.078,20,10,20s9.9-2,9.9-10S17.922,0,10,0ZM9.907,11.154a1.389,1.389,0,0,1-1.389-1.39,1.415,1.415,0,0,1,.046-.34L4.68,5.54a.625.625,0,0,1,.884-.884L9.386,8.478a1.316,1.316,0,0,1,.934-.033L12.245,6.52a.625.625,0,0,1,.884.884L11.215,9.317a1.356,1.356,0,0,1,.081.447,1.389,1.389,0,0,1-1.389,1.39Z" />
                    </g>
                  </svg>
                </button>
                <div className="task-inner-main">
                  {this.state.editing ? (
                    <textarea
                      autoFocus
                      className="add-task-text"
                      placeholder="Add Task"
                      onKeyDown={this.editTaskKeyDown}
                      onBlur={this.cancelEditingTask}
                      defaultValue={
                        this.state.new === false ? this.props.task.content : ""
                      }
                      rows={this.state.new === true ? "1" : ""}
                    />
                  ) : (
                    <div
                      onDoubleClick={() => {
                        this.setState({ editing: true });
                      }}
                      className="dont-break-out"
                    >
                      {this.props.task.content}
                    </div>
                  )}
                  {this.props.task?.date != null ? (
                    <input
                      className="task-date"
                      type="date"
                      value={this.props.task.date}
                      onChange={(event) => {
                        this.updateDate(event.target.value);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <button
                  aria-label="Delete Task"
                  className="task-action"
                  onClick={this.deleteTask}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}
