import React from 'react';
import './css/Schedule.css';
import { Task } from './Task';
import AddTaskButton from './AddTaskButton'
import { Draggable, Droppable } from 'react-beautiful-dnd';

export class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "addTask": false
        }

        this.addTaskKeyDown = this.addTaskKeyDown.bind(this);
        this.addTask = this.addTask.bind(this);
        this.stopAddingTask = this.stopAddingTask.bind(this);
    }

    addTask() {
        this.setState({ "addTask": true });
    }

    stopAddingTask() {
        this.setState({ "addTask": false });
    }

    createTask(note) {
        this.props.createTask(note, null);
    }

    addTaskKeyDown(event) {
        if ("Enter" === event.key) {
            event.preventDefault();
            let text = document.querySelector(".add-task-text").value;
            document.querySelector(".add-task-text").value = "";
            this.createTask(text);
        } else if ("Escape" === event.key) {
            event.stopPropagation()
            this.stopAddingTask();
        }
    }

    render() {
        return (
            <div>
                <Droppable droppableId="schedule">
                    {(provided) => (
                        <div className="schedule-list" {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                this.props.schedule.map((task_uuid, index) => (
                                    <Draggable key={task_uuid} draggableId={'schedule:' + task_uuid} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <Task
                                                    task={this.props.tasks[task_uuid]}
                                                    color={this.props.tasks[task_uuid].topic_uuid != null ? this.props.topics[this.props.tasks[task_uuid].topic_uuid].color : 'transparent'}
                                                    deleteNote={this.props.deleteNote}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                            {this.state.addTask ?
                                <div className="task">
                                    <div className="task-inner">
                                        <textarea autoFocus className="add-task-text" placeholder="Add Task" onKeyDown={this.addTaskKeyDown} onBlur={this.stopAddingTask}/>
                                    </div>
                                </div> : ''}
                        </div>
                    )}
                </Droppable>
                <AddTaskButton onClick={this.addTask}/>
            </div>
        );
    }
}