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

    if (!store.has('tasks')) { store.set('tasks', {}); }
    if (!store.has('topics')) { store.set('topics', {}); }
    if (!store.has('schedule')) { store.set('schedule', []); }

    this.state = store.store;

    this.createTask = this.createTask.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
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
    this.setState((state) => {
      let tasks = { ...state.tasks };
      tasks[task.uuid] = task;

      let schedule = [...state.schedule];
      let topics = JSON.parse(JSON.stringify(state.topics));

      if (topic_uuid != null) {
        topics[topic_uuid].tasks.push(task.uuid);
      } else {
        schedule.push(task.uuid);
      }

      return ({
        "tasks": tasks,
        "schedule": schedule,
        "topics": topics
      });
    });
  }

  deleteNote(task_uuid) {
    this.setState(state => {
      const tasks = Object.assign({}, state.tasks);
      delete tasks[task_uuid];

      let schedule = [...state.schedule];
      let index = schedule.indexOf(task_uuid);
      if (index !== -1) {
        schedule.splice(index, 1);
      }

      const topic_uuid = state.tasks[task_uuid].topic_uuid;
      let topics = JSON.parse(JSON.stringify(state.topics));
      if (topic_uuid != null) {
        topics[topic_uuid].tasks.splice(topics[topic_uuid].tasks.indexOf(task_uuid), 1);
      }

      return ({
        "tasks": tasks,
        "schedule": schedule,
        "topics": topics
      });
    });
  }

  reorderTaskWithinTopic(topic_uuid, startIndex, endIndex) {
    this.setState(state => {
      let topics = JSON.parse(JSON.stringify(state.topics));
      const [reorderedItem] = topics[topic_uuid].tasks.splice(startIndex, 1);
      topics[topic_uuid].tasks.splice(endIndex, 0, reorderedItem);

      return ({
        "topics": topics
      });
    });
  }

  reorderScheduledTask(startIndex, endIndex) {
    this.setState(state => {
      let schedule = [...state.schedule];
      const [reorderedItem] = schedule.splice(startIndex, 1);
      schedule.splice(endIndex, 0, reorderedItem);

      return ({
        "schedule": schedule
      });
    });
  }

  changeTopic(task_uuid, new_topic_uuid, index) {
    this.setState(state => {
      let tasks = JSON.parse(JSON.stringify(state.tasks));
      let task = tasks[task_uuid];
      let topics = JSON.parse(JSON.stringify(state.topics));

      if (task.topic_uuid != null) {
        topics[task.topic_uuid].tasks.splice(topics[task.topic_uuid].tasks.indexOf(task_uuid), 1);
      }

      tasks[task_uuid].topic_uuid = new_topic_uuid;
      topics[new_topic_uuid].tasks.splice(index, 0, task_uuid);

      return ({
        "tasks": tasks,
        "topics": topics
      })
    })
  }

  handleOnDragEnd(result) {
    if (!result.destination) return;

    if (result.source.droppableId === "schedule") {
      const task_uuid = result.draggableId.slice('schedule:'.length);
      const topic_uuid = this.state.tasks[task_uuid].topic_uuid;

      if (result.destination.droppableId === "schedule") {
        this.reorderScheduledTask(result.source.index, result.destination.index);
      } else {
        this.setState(state => {
          let schedule = [...state.schedule];
          schedule.splice(schedule.indexOf(task_uuid), 1);

          return ({
            "schedule": schedule
          });
        });

        if (topic_uuid === result.destination.droppableId) {
          let startIndex = this.state.topics[topic_uuid].tasks.indexOf(task_uuid);
          let endIndex = result.destination.index;
          if (endIndex > startIndex) {
            endIndex--;
          }
          this.reorderTaskWithinTopic(topic_uuid, startIndex, endIndex);
        } else {
          this.changeTopic(task_uuid, result.destination.droppableId, result.destination.index);
        }
      }
    } else {
      const task_uuid = result.draggableId;
      if (result.destination.droppableId === "schedule") {
        let startIndex = this.state.schedule.indexOf(task_uuid);
        let endIndex = result.destination.index;
        if (startIndex < 0) {
          this.setState(state => {
            let schedule = [...state.schedule];
            schedule.splice(endIndex, 0, task_uuid);

            return ({
              "schedule": schedule
            })
          })
        } else {
          if (endIndex > startIndex) {
            endIndex--;
          }
          this.reorderScheduledTask(startIndex, endIndex);
        }
      } else if (result.source.droppableId === result.destination.droppableId) {
        this.reorderTaskWithinTopic(result.source.droppableId, result.source.index, result.destination.index);
      } else {
        this.changeTopic(task_uuid, result.destination.droppableId, result.destination.index);
      }
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
              topics={this.state.topics}
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
