
const attributes = {
    fill: "black",
    stroke: "black",
    strokeWidth: 1,
    useFill: true,
    useStroke: true,
    textSize: 12
}

const keyPressed = new Map();


function init(canvasId) {
  
    // Credit for background image:
    // https://wallpaperscraft.com/download/starry_sky_stars_night_175462/800x600
  
    const imgNightSky = new Image();
    imgNightSky.src = "img/night-sky.jpeg";
  
    imgNightSky.onload = function() {
      window.imgNightSky = imgNightSky;
    };


    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);


    // place a few constants in the global scope

    window.canvas = document.getElementById(canvasId);
    window.ctx = canvas.getContext('2d');

    window.width = canvas.width;
    window.height = canvas.height;
    window.LEFT_ARROW = 37;
    window.RIGHT_ARROW = 39;
    window.SPACE = 32;

    window.imgNightSky = imgNightSky;


    textSize(12);
    window.game = new Game();
  
    requestAnimationFrame(repeatOften);
}


function repeatOften() {
    // If you define a function called `loop` in your program, the engine will call it automatically
    if (window.loop) {
        let gameStatus = window.loop();

        if(gameStatus === "win") {
            if(!confirm("Congratulations, you win! Play another game?\n(Press [OK] to play again, or [Cancel] to exit)")) {
                return;
            }

            window.game = new Game();

        } else if(gameStatus === "lose") {
            if(!confirm("You lost! Try agin?\n(Press [OK] to play again, or [Cancel] to exit)")) {
                return;
            }

            window.game = new Game();
        }
    }

    requestAnimationFrame(repeatOften);
}


function handleKeyDown(eventArgs) {
    if (!keyPressed.has(eventArgs.keyCode)) {
        keyPressed.set(eventArgs.keyCode, eventArgs.keyCode);
    }
  
    if(eventArgs.keyCode == SPACE) {
      if(eventArgs.preventDefault) {
        // need to discard the [space] event, because it scrolls the window down!
        eventArgs.preventDefault();
      }
    }
}


function handleKeyUp(eventArgs) {
    if (keyPressed.has(eventArgs.keyCode)) {
        keyPressed.delete(eventArgs.keyCode);
    }
}


function background(color) {
    if(imgNightSky) {
      ctx.drawImage(imgNightSky, 0, 0);
      return;
    }
  
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// Specify that the next shape won't be filled
function noFill() {
    attributes.useFill = false;
}


// Specify that the next shaped should be filled with specified color
function fill(color) {
    attributes.useFill = true;
    attributes.fill = color;
}


// Specify that the next shape should not have a stroke stroke
function noStroke() {
    attributes.useStroke = false;
}


// Specify the stroke width for the next shape
function strokeWidth(n) {
    attributes.useStroke = true;
    attributes.strokeWidth = n;
}


// Specify the stroke color for the next shape
function stroke(color) {
    attributes.stroke = color;
}


// Draw a rectangle
function rect(x, y, width, height) {
    if (attributes.useFill) {
        ctx.fillStyle = attributes.fill;
        ctx.fillRect(x, y, width, height);
    }

    if (attributes.useStroke) {
        ctx.lineWidth = attributes.strokeWidth;
        ctx.strokeStyle = attributes.stroke;
        ctx.strokeRect(x, y, width, height);
    }
}


// Specify the text size of the next drawn text
function textSize(n) {
    attributes.textSize = n;
}


// Write a text at specified coordinates
function text(txt, x, y) {
    ctx.font = attributes.textSize + "px Consolas";

    ctx.fillStyle = "cyan";
    ctx.fillText(txt, x, y);
}


// Returns true if key with specified code is pres       sed
function keyIsDown(code) {
    if (keyPressed.has(code))
        return true;
}