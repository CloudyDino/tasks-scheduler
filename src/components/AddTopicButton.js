import "./css/AddTopicButton.css";

export default function AddTopicButton(props) {
  return (
    <div className="add-topic-button" onClick={props.onClick}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
      >
        <line x1="1.5" y1="12.5" x2="23.5" y2="12.5"></line>
        <line x1="12.5" y1="23.5" x2="12.5" y2="1.5"></line>
      </svg>
    </div>
  );
}
