import React from 'react';
import './css/App.css';
import { Schedule } from "./Schedule";
import { TopicList } from "./TopicList";
import { store } from '../util/storage';
import uuid from '../util/uuid'
import { DragDropContext } from 'react-beautiful-dnd';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.store;

    this.createTask = this.createTask.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
  }

  componentDidUpdate() {
    console.log("updated state");
    console.log(this.state);
    store.store = this.state;
  }

  createTask(note, topic_uuid) {
    const task = {
      "uuid": uuid(),
      "topic_uuid": topic_uuid,
      "note": note
    }
    this.setState((state) => {
      let tasks = { ...state.tasks };
      tasks[task.uuid] = task;

      return ({
        "tasks": tasks,
        "schedule": topic_uuid != null ? state.schedule : state.schedule.concat(task.uuid)
      });
    });
  }

  deleteNote(task_uuid) {
    this.setState(state => {
      const tasks = Object.assign({}, state.tasks);
      delete tasks[task_uuid];

      var schedule = [...state.schedule];
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

  reorderScheduledTask(startIndex, endIndex) {
    this.setState(state => {
      let schedule = [...state.schedule];
      console.log(schedule);
      const [reorderedItem] = schedule.splice(startIndex, 1);
      schedule.splice(endIndex, 0, reorderedItem);
      console.log(schedule);

      return ({
        "schedule": schedule
      });
    });
  }

  handleOnDragEnd(result) {
    if (result.source.droppableId === "schedule" && result.destination.droppableId === "schedule") {
      this.reorderScheduledTask(result.source.index, result.destination.index);
    } else {
      console.log("TODO");
    }
  }


  render() {
    return (
      <div className="App">
        <DragDropContext onDragEnd={this.handleOnDragEnd}>
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
        </DragDropContext>
      </div>
    );
  }
}

export default App;
