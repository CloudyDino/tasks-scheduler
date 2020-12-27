import React from 'react';
import './css/App.css';
import { Schedule } from "./Schedule";
import { TopicList } from "./TopicList";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: ["task10", "task11", "task12", "task13", "task14", "task15", "task16", "task17", "task18", "task19", "task20"],
      topic: {
        "topic1": ["task2", "task3"],
        "topic2": [],
        "topic3": ["task2", "task3"],
        "topic4": ["task2", "task3", "task2", "task3", "task2", "task3"],
      },
      completed: ["completed task"]
    };
  }

  render() {
    return (
      <div className="App">
        <div id="schedule">
          <h1>Schedule</h1>
          <Schedule
            tasks={this.state.schedule}
          />
        </div>
        <div id="tasks">
          <h1>Tasks</h1>
          <TopicList
            tasks={this.state.topic}
          />
        </div>
      </div>
    );
  }
}

export default App;
