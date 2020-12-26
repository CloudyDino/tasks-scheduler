import './css/Task.css'

export function Task(props) {
    return (
        <li draggable="true" style={{ backgroundColor: props.color }}>
            <div style={{backgroundColor: "#ffffff20"}}>
                {props.note}
            </div>
        </li>
    );
}
