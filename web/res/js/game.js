var context;

function startGame(canvas) {
    context = canvas.getContext('2d');

    context.fillStyle = "#FF0000";
    context.fillRect(0,0,150,75);
}

define({
    start: startGame
});