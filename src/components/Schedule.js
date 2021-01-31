import React from "react";
import "./css/Schedule.css";
import { TaskList } from "./TaskList";
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

  createTask(content) {
    this.props.createTask(content, null);
  }

  render() {
    return (
      <div id="schedule" className="scroll-enabled">
        <h1>Schedule</h1>
        <TaskList
          id="schedule"
          topics={this.props.topics}
          tasksOrder={this.props.tasksOrder}
          tasks={this.props.tasks}
          createTask={this.props.createTask}
          updateTaskDate={this.props.updateTaskDate}
          updateTaskContent={this.props.updateTaskContent}
          deleteTask={this.props.deleteTask}
          addTask={this.state.addTask}
          onCancelAddingTask={this.stopAddingTask}
        />
        <AddTaskButton onClick={this.addTask} />
      </div>
    );
  }
}
