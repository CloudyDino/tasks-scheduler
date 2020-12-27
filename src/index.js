import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
// import reportWebVitals from './reportWebVitals';

const app = <App />;
ReactDOM.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


document.addEventListener('DOMContentLoaded', (event) => {
  let draggables = document.getElementsByClassName("draggable");
  let containers = document.getElementsByClassName("container");

  for (let draggable of draggables) {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  }

  for (let container of containers) {
    container.addEventListener('dragover', e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (afterElement != null) {
        container.insertBefore(draggable, afterElement);
      } else {
        // if (container.classList.contains('schedule-list')) {
        //   app.update((state, props) => ({
        //     schedule: state.schedule.concat(draggable.)
        //   }));
        // }
        container.appendChild(draggable);
      }
    });
  };
});

function getDragAfterElement(container, y) {
  let draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}