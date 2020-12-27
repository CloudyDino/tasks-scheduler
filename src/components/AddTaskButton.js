export default function AddTaskButton(props) {
    return (
        <div className="add-task-button" onClick={props.onClick}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><line x1="10" y1="2" x2="10" y2="18"></line><line x1="18" y1="10" x2="2" y2="10"></line></svg>
        </div>
    );
}