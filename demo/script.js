const canvas = document.getElementById('canvas');
const saveBtn = document.getElementById('saveImage');


canvas.width = window.innerWidth;
canvas.height = 500;

let context = canvas.getContext('2d');
context.fillStyle = 'white';
context.fillRect(0,0,canvas.width,canvas.height);

let startBackgroundColor = 'white';
let draw_color = 'black';
let draw_size = '5';
let is_drawing = false;

let restoreArray = [];
let index = -1;



saveBtn.addEventListener('click', function(){
    if(window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msSaveBlob(), 'canvas-image.png')
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = canvas.toDataURL();
        a.download = 'canvas-image.png';
        a.click();
        document.body.removeChild(a);
    }
});

canvas.addEventListener('touchstart', start, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('touchend', stop, false);

canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);


function color_change(e) {
    draw_color = e.style.backgroundColor;
}


function start(e) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft,
                   e.clientY - canvas.offsetTop)
    e.preventDefault();
}
function draw(e) {
    if(is_drawing) {
        context.lineTo(e.clientX - canvas.offsetLeft,
                       e.clientY - canvas.offsetTop)
        context.strokeStyle = draw_color;
        context.lineWidth = draw_size;
        context.lineCap = 'round';
        context.lineJoin = 'round'
        context.stroke()
    }

    e.preventDefault();
}

function stop(e) {
    // console.log('work!')
    if(is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    e.preventDefault();
    if(e.type != 'mouseout') {
        restoreArray.push(context.getImageData(0, 0, canvas.width, canvas.height))
        index += 1;
        console.log(restoreArray)
    }


}

function clear_canvas() {
    // console.log('work!')
    context.fillStyle = startBackgroundColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restoreArray = [];
    index = -1;
}


 function undoLast() {
    // console.log('work!')
    if(index <= 0) {
        clear_canvas();
    }
    else {
        index -= 1;
        restoreArray.pop();
        context.putImageData(restoreArray[index],0,0)
    }
 }
