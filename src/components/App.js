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
    if (!store.has("topicsOrder")) {
      store.set("topicsOrder", []);
    }

    this.state = store.store;

    this.createTask = this.createTask.bind(this);
    this.updateTaskDate = this.updateTaskDate.bind(this);
    this.updateTaskContent = this.updateTaskContent.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.createTopic = this.createTopic.bind(this);
    this.updateTopic = this.updateTopic.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
  }

  componentDidUpdate() {
    store.store = this.state;
  }

  createTask(content, topicUuid) {
    if (content === null || content.length === 0) {
      return;
    }
    const task = {
      uuid: uuid(),
      topicUuid,
      content,
    };
    this.setState((state) => {
      const tasks = { ...state.tasks };
      tasks[task.uuid] = task;

      const schedule = [...state.schedule];
      const topics = JSON.parse(JSON.stringify(state.topics));

      if (topicUuid != null) {
        topics[topicUuid].tasks.push(task.uuid);
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

  updateTaskDate(taskUuid, date) {
    if (taskUuid != null) {
      this.setState((state) => {
        const tasks = { ...state.tasks };

        if (date == null) {
          delete tasks[taskUuid].date;
        } else {
          tasks[taskUuid].date = date;
        }

        return {
          tasks,
        };
      });
    }
  }

  updateTaskContent(taskUuid, content) {
    if (content === null || content.length === 0) {
      this.deleteTask(taskUuid);
    } else {
      this.setState((state) => {
        const tasks = { ...state.tasks };
        tasks[taskUuid].content = content;

        return {
          tasks,
        };
      });
    }
  }

  deleteTask(taskUuid) {
    if (taskUuid != null) {
      this.setState((state) => {
        const tasks = { ...state.tasks };
        delete tasks[taskUuid];

        const schedule = [...state.schedule];
        const index = schedule.indexOf(taskUuid);
        if (index !== -1) {
          schedule.splice(index, 1);
        }

        const { topicUuid } = state.tasks[taskUuid];
        const topics = JSON.parse(JSON.stringify(state.topics));
        if (topicUuid != null) {
          topics[topicUuid].tasks.splice(
            topics[topicUuid].tasks.indexOf(taskUuid),
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
      const topicUuid = uuid();
      const topics = JSON.parse(JSON.stringify(state.topics));
      const topicsOrder = [...state.topicsOrder];

      topics[topicUuid] = {
        uuid: topicUuid,
        name: topic,
        color: color != null ? color : randomColor(),
        tasks: [],
      };

      topicsOrder.push(topicUuid);

      return {
        topics,
        topicsOrder,
      };
    });
  }

  updateTopic(topicUuid, name, color) {
    this.setState((state) => {
      const topics = JSON.parse(JSON.stringify(state.topics));

      topics[topicUuid].name = name;
      topics[topicUuid].color = color;

      return {
        topics,
      };
    });
  }

  deleteTopic(topicUuid) {
    this.setState((state) => {
      const tasks = { ...state.tasks };
      const topics = JSON.parse(JSON.stringify(state.topics));
      const schedule = [...state.schedule];
      const topicsOrder = [...state.topicsOrder];

      topics[topicUuid].tasks.forEach((taskUuid) => {
        delete tasks[taskUuid];

        const index = schedule.indexOf(taskUuid);
        if (index !== -1) {
          schedule.splice(index, 1);
        }
      });

      topicsOrder.splice(topicsOrder.indexOf(topicUuid), 1);

      delete topics[topicUuid];

      return {
        tasks,
        topics,
        schedule,
        topicsOrder,
      };
    });
  }

  reorderTaskWithinTopic(topicUuid, startIndex, endIndex) {
    this.setState((state) => {
      const topics = JSON.parse(JSON.stringify(state.topics));
      const [reorderedItem] = topics[topicUuid].tasks.splice(startIndex, 1);
      topics[topicUuid].tasks.splice(endIndex, 0, reorderedItem);

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

  changeTopic(taskUuid, newTopicUuid, index) {
    this.setState((state) => {
      const tasks = JSON.parse(JSON.stringify(state.tasks));
      const task = tasks[taskUuid];
      const topics = JSON.parse(JSON.stringify(state.topics));

      if (task.topicUuid != null) {
        topics[task.topicUuid].tasks.splice(
          topics[task.topicUuid].tasks.indexOf(taskUuid),
          1
        );
      }

      tasks[taskUuid].topicUuid = newTopicUuid;
      topics[newTopicUuid].tasks.splice(index, 0, taskUuid);

      return {
        tasks,
        topics,
      };
    });
  }

  handleOnDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.type === "task") {
      this.handleOnDragTaskEnd(result);
    } else if (result.type === "topic") {
      this.handleOnDragTopicEnd(result);
    }
  }

  handleOnDragTaskEnd(result) {
    const { destination, source, draggableId } = result;

    const taskUuid = draggableId.split(":")[1];

    if (source.droppableId === "schedule") {
      const { topicUuid } = this.state.tasks[taskUuid];

      if (destination.droppableId === "schedule") {
        this.reorderScheduledTask(
          source.index,
          destination.index
        );
      } else {
        this.setState((state) => {
          const schedule = [...state.schedule];
          schedule.splice(schedule.indexOf(taskUuid), 1);

          return {
            schedule,
          };
        });

        if (topicUuid === destination.droppableId) {
          const startIndex = this.state.topics[topicUuid].tasks.indexOf(
            taskUuid
          );
          let endIndex = destination.index;
          if (endIndex > startIndex) {
            endIndex--;
          }
          this.reorderTaskWithinTopic(topicUuid, startIndex, endIndex);
        } else {
          this.changeTopic(
            taskUuid,
            destination.droppableId,
            destination.index
          );
        }
      }
    } else {
      if (destination.droppableId === "schedule") {
        const startIndex = this.state.schedule.indexOf(taskUuid);
        let endIndex = destination.index;
        if (startIndex < 0) {
          this.setState((state) => {
            const schedule = [...state.schedule];
            schedule.splice(endIndex, 0, taskUuid);

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
      } else if (source.droppableId === destination.droppableId) {
        this.reorderTaskWithinTopic(
          source.droppableId,
          source.index,
          destination.index
        );
      } else {
        this.changeTopic(
          taskUuid,
          destination.droppableId,
          destination.index
        );
      }
    }
  }

  handleOnDragTopicEnd(result) {
    const { destination, source } = result;

    this.setState((state) => {
      const topicsOrder = [...state.topicsOrder];
      const [reorderedItem] = topicsOrder.splice(source.index, 1);
      topicsOrder.splice(destination.index, 0, reorderedItem);

      return {
        topicsOrder,
      };
    });
  }

  render() {
    return (
      <div className="App">
        <DragDropContext onDragEnd={this.handleOnDragEnd}>
          <Schedule
            tasks={this.state.tasks}
            tasksOrder={this.state.schedule}
            topics={this.state.topics}
            createTask={this.createTask}
            updateTaskDate={this.updateTaskDate}
            updateTaskCote={this.updateTaskContent}
            deleteTask={this.deleteTask}
          />

          <TopicList
            tasks={this.state.tasks}
            topics={this.state.topics}
            topicsOrder={this.state.topicsOrder}
            createTask={this.createTask}
            updateTaskDate={this.updateTaskDate}
            updateTaskContent={this.updateTaskContent}
            deleteTask={this.deleteTask}
            createTopic={this.createTopic}
            updateTopic={this.updateTopic}
            deleteTopic={this.deleteTopic}
          />
        </DragDropContext>
      </div>
    );
  }
}

export default App;
