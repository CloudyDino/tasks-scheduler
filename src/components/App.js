import React from 'react';
import './css/App.css';
import { Schedule } from "./Schedule";
import { TopicList } from "./TopicList";
import { store } from '../util/storage';
import uuid from '../util/uuid'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.store;

    this.createTask = this.createTask.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidUpdate() {
    store.store = this.state;
  }

  createTask(note, topic_uuid) {
    const task = {
      "uuid": uuid(),
      "topic_uuid": topic_uuid,
      "note": note
    }
    this.setState((prevState) => {
      let tasks = { ...prevState.tasks };
      tasks[task.uuid] = task;

      return ({
        "tasks": tasks,
        "schedule": topic_uuid != null ? prevState.schedule : prevState.schedule.concat(task.uuid)
      });
    });
  }

  deleteNote(task_uuid) {
    this.setState(prevState => {
      const tasks = Object.assign({}, this.state.tasks);
      delete tasks[task_uuid];

      var schedule = [...this.state.schedule];
      var index = schedule.indexOf(task_uuid);
      if (index !== -1) {
        schedule.splice(index, 1);
      }

      return ({
        "tasks": tasks,
        "schedule": schedule
      });
    });
  }

  render() {
    return (
      <div className="App">
        <div id="schedule" className="scroll-enabled">
          <h1>Schedule</h1>
          <Schedule
            tasks={this.state.tasks}
            schedule={this.state.schedule}
            createTask={this.createTask}
            deleteNote={this.deleteNote}
          />
        </div>
        <div id="tasks" className="scroll-enabled">
          <h1>Tasks</h1>
          <TopicList
            tasks={this.state.tasks}
            topics={this.state.topics}
            createTask={this.createTask}
            deleteNote={this.deleteNote}
          />
        </div>
      </div>
    );
  }
}

export default App;
