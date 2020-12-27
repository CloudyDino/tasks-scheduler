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
    }

    addTask() {
        this.setState({ "addTask": true });
    }

    createTask(note) {
        this.props.createTask(note, null);
    }

    addTaskKeyDown(event) {
        if ("Enter" === event.key) {
            event.preventDefault();
            let text = document.querySelector(".add-task-text").value;
            this.setState({ "addTask": false });
            this.createTask(text);
        } else if ("Escape" === event.key) {
            event.stopPropagation()
            this.setState({ "addTask": false });
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
                                    <Draggable key={task_uuid} draggableId={task_uuid + 'schedule'} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <Task
                                                    task={this.props.tasks[task_uuid]}
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
                                        <textarea className="add-task-text" placeholder="Add Task" onKeyDown={this.addTaskKeyDown} />
                                    </div>
                                </div> : ''}
                        </div>
                    )}
                </Droppable>
                <AddTaskButton onClick={this.addTask} />
            </div>
        );
    }
}