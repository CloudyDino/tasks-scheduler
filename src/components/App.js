import React from "react";
import "./css/App.css";
import { DragDropContext } from "react-beautiful-dnd";
import { Schedule } from "./Schedule";
import { TopicList } from "./TopicList";
import { store } from "../util/storage";
import uuid from "../util/uuid";
import { randomColor } from "../util/colors";

class App extends React.Component {
  constructor(props) {
    super(props);

    if (!store.has("tasks")) {
      store.set("tasks", {});
    }
    if (!store.has("topics")) {
      store.set("topics", {});
    }
    if (!store.has("schedule")) {
      store.set("schedule", []);
    }

    this.state = store.store;

    this.createTask = this.createTask.bind(this);
    this.updateTaskDate = this.updateTaskDate.bind(this);
    this.updateTaskNote = this.updateTaskNote.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.createTopic = this.createTopic.bind(this);
    this.editTopic = this.editTopic.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
  }

  componentDidUpdate() {
    store.store = this.state;
  }

  createTask(note, topic_uuid) {
    if (note === null || note.length === 0) {
      return;
    }
    const task = {
      uuid: uuid(),
      topic_uuid,
      note,
    };
    this.setState((state) => {
      const tasks = { ...state.tasks };
      tasks[task.uuid] = task;

      const schedule = [...state.schedule];
      const topics = JSON.parse(JSON.stringify(state.topics));

      if (topic_uuid != null) {
        topics[topic_uuid].tasks.push(task.uuid);
      } else {
        schedule.push(task.uuid);
      }

      return {
        tasks,
        schedule,
        topics,
      };
    });
  }

  updateTaskDate(task_uuid, date) {
    if (task_uuid != null) {
      this.setState((state) => {
        const tasks = { ...state.tasks };

        if (date == null) {
          delete tasks[task_uuid].date;
        } else {
          tasks[task_uuid].date = date;
        }

        return {
          tasks,
        };
      });
    }
  }

  updateTaskNote(task_uuid, note) {
    if (note === null || note.length === 0) {
      this.deleteTask(task_uuid);
    } else {
      this.setState((state) => {
        const tasks = { ...state.tasks };
        tasks[task_uuid].note = note;

        return {
          tasks,
        };
      });
    }
  }

  deleteTask(task_uuid) {
    if (task_uuid != null) {
      this.setState((state) => {
        const tasks = { ...state.tasks };
        delete tasks[task_uuid];

        const schedule = [...state.schedule];
        const index = schedule.indexOf(task_uuid);
        if (index !== -1) {
          schedule.splice(index, 1);
        }

        const { topic_uuid } = state.tasks[task_uuid];
        const topics = JSON.parse(JSON.stringify(state.topics));
        if (topic_uuid != null) {
          topics[topic_uuid].tasks.splice(
            topics[topic_uuid].tasks.indexOf(task_uuid),
            1
          );
        }

        return {
          tasks,
          schedule,
          topics,
        };
      });
    }
  }

  createTopic(topic, color) {
    this.setState((state) => {
      const topic_uuid = uuid();
      const topics = JSON.parse(JSON.stringify(state.topics));

      topics[topic_uuid] = {
        uuid: topic_uuid,
        name: topic,
        color: color != null ? color : randomColor(),
        tasks: [],
      };

      return {
        topics,
      };
    });
  }

  editTopic(topic_uuid, name, color) {
    this.setState((state) => {
      const topics = JSON.parse(JSON.stringify(state.topics));

      topics[topic_uuid].name = name;
      topics[topic_uuid].color = color;

      return {
        topics,
      };
    });
  }

  deleteTopic(topic_uuid) {
    this.setState((state) => {
      const tasks = { ...state.tasks };
      const topics = JSON.parse(JSON.stringify(state.topics));
      const schedule = [...state.schedule];

      topics[topic_uuid].tasks.forEach((task_uuid) => {
        delete tasks[task_uuid];

        const index = schedule.indexOf(task_uuid);
        if (index !== -1) {
          schedule.splice(index, 1);
        }
      });

      delete topics[topic_uuid];

      return {
        tasks,
        schedule,
        topics,
      };
    });
  }

  reorderTaskWithinTopic(topic_uuid, startIndex, endIndex) {
    this.setState((state) => {
      const topics = JSON.parse(JSON.stringify(state.topics));
      const [reorderedItem] = topics[topic_uuid].tasks.splice(startIndex, 1);
      topics[topic_uuid].tasks.splice(endIndex, 0, reorderedItem);

      return {
        topics,
      };
    });
  }

  reorderScheduledTask(startIndex, endIndex) {
    this.setState((state) => {
      const schedule = [...state.schedule];
      const [reorderedItem] = schedule.splice(startIndex, 1);
      schedule.splice(endIndex, 0, reorderedItem);

      return {
        schedule,
      };
    });
  }

  changeTopic(task_uuid, new_topic_uuid, index) {
    this.setState((state) => {
      const tasks = JSON.parse(JSON.stringify(state.tasks));
      const task = tasks[task_uuid];
      const topics = JSON.parse(JSON.stringify(state.topics));

      if (task.topic_uuid != null) {
        topics[task.topic_uuid].tasks.splice(
          topics[task.topic_uuid].tasks.indexOf(task_uuid),
          1
        );
      }

      tasks[task_uuid].topic_uuid = new_topic_uuid;
      topics[new_topic_uuid].tasks.splice(index, 0, task_uuid);

      return {
        tasks,
        topics,
      };
    });
  }

  handleOnDragEnd(result) {
    if (!result.destination) return;

    if (result.source.droppableId === "schedule") {
      const task_uuid = result.draggableId.slice("schedule:".length);
      const { topic_uuid } = this.state.tasks[task_uuid];

      if (result.destination.droppableId === "schedule") {
        this.reorderScheduledTask(
          result.source.index,
          result.destination.index
        );
      } else {
        this.setState((state) => {
          const schedule = [...state.schedule];
          schedule.splice(schedule.indexOf(task_uuid), 1);

          return {
            schedule,
          };
        });

        if (topic_uuid === result.destination.droppableId) {
          const startIndex = this.state.topics[topic_uuid].tasks.indexOf(
            task_uuid
          );
          let endIndex = result.destination.index;
          if (endIndex > startIndex) {
            endIndex--;
          }
          this.reorderTaskWithinTopic(topic_uuid, startIndex, endIndex);
        } else {
          this.changeTopic(
            task_uuid,
            result.destination.droppableId,
            result.destination.index
          );
        }
      }
    } else {
      const task_uuid = result.draggableId;
      if (result.destination.droppableId === "schedule") {
        const startIndex = this.state.schedule.indexOf(task_uuid);
        let endIndex = result.destination.index;
        if (startIndex < 0) {
          this.setState((state) => {
            const schedule = [...state.schedule];
            schedule.splice(endIndex, 0, task_uuid);

            return {
              schedule,
            };
          });
        } else {
          if (endIndex > startIndex) {
            endIndex--;
          }
          this.reorderScheduledTask(startIndex, endIndex);
        }
      } else if (result.source.droppableId === result.destination.droppableId) {
        this.reorderTaskWithinTopic(
          result.source.droppableId,
          result.source.index,
          result.destination.index
        );
      } else {
        this.changeTopic(
          task_uuid,
          result.destination.droppableId,
          result.destination.index
        );
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
              updateTaskDate={this.updateTaskDate}
              updateTaskNote={this.updateTaskNote}
              deleteTask={this.deleteTask}
            />
          </div>
          <div id="topics" className="scroll-enabled">
            <h1>Lists</h1>
            <TopicList
              tasks={this.state.tasks}
              topics={this.state.topics}
              createTask={this.createTask}
              updateTaskDate={this.updateTaskDate}
              updateTaskNote={this.updateTaskNote}
              deleteTask={this.deleteTask}
              createTopic={this.createTopic}
              editTopic={this.editTopic}
              deleteTopic={this.deleteTopic}
            />
          </div>
        </DragDropContext>
      </div>
    );
  }
}

export default App;
