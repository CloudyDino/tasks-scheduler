export const colors = ["#1574b9", "#168758", "#191e22", "#19579d", "#1a9b7f", "#1c95a0", "#1c95a0", "#2a454c", "#483c9a", "#4b9bb8", "#558687", "#7b952a", "#949380", "#9c2b78", "#9d052c", "#9db7d3", "#b18f68", "#bb211d", "#bb8a7f", "#bd6ca7", "#c41751", "#cf9f34", "#db4319", "#e78e2b"];
// some colors are being excluded since they don't work with white text that well
// TODO: display text color based on background color

export function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
