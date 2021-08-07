class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}


class Style {
    constructor(fillColor, borderColor = null, borderWidth = 1) {
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
    }
}


class GameObject {
    constructor(id, origin, size, style) {
        this.id = id;
        this.origin = origin;
        this.size = size;
        this.style = style;

        this.speedX = 0;
        this.speedY = 0;
    }

    render() {
        let { fillColor, borderColor, borderWidth } = this.style;

        if (fillColor) {
            fill(fillColor);
        } else {
            noFill();
        }

        if (borderColor) {
            strokeWidth(borderWidth);
            stroke(borderColor);
        } else {
            noStroke();
        }

        let { x, y } = this.origin,
            { width, height } = this.size;

        rect(x - width / 2, y - height / 2, width, height);
    }

    move() {
        this.origin.x += this.speedX;
        this.origin.y += this.speedY;
    }
}


class Ship extends GameObject {
}


class EarthShip extends Ship {
    move() {
        super.move();

        this.origin.x = Math.min(this.origin.x, width - this.size.width / 2);
        this.origin.x = Math.max(this.origin.x, this.size.width / 2);
    }
}


class AlienShip extends Ship {
    constructor(id, origin, size, style) {
        super(id, origin, size, style);
        this.speedX -= 4   ;
    }

    move() {
        super.move();

        if(this.origin.x - this.size.width / 2 <= 0) {
            this.changeDirection();
        } else if (this.origin.x + this.size.width / 2 >= width) {
            this.changeDirection();
        }
    }
}


class Bullet extends GameObject {
    constructor(id, origin, size, style) {
        super(id, origin, size, style);
        this.speedY = -9;
    }

    move() {
        super.move();

        if (this.origin.y <= 0) {
            this.isDestroyed = true;
        }
    }

    checkHit(ship) {
        let {x, y} = ship.origin,
            {width, height} = ship.size;

        if(this.origin.x >= x - width / 2 &&
           this.origin.x <= x + width / 2 &&
           this.origin.y >= y - height / 2 &&
           this.origin.y <= y + height / 2) {

                this.isDestroyed = true;
                ship.isDestroyed = true;

                return true;
            }

        return false;
    }
}


class Game {
    constructor() {
        this.bulletId = 0;
        this.bullets = [];
        this.lastShot = Date.now();

        this.earthShip = new EarthShip("earthShip", new Point(width / 2, height - 20), new Size(50, 20), new Style("hsl(120, 100%, 50%)"));
        this.initAlienShips();

        this.status = "playing";
        this.timeStart = Date.now();
    }

    initAlienShips() {
        this.alienShips = [];

        let x = width - 40, y = 40,
            margin = 5, w = 30, h = 30;

        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 3; j++) {

                let ship = new AlienShip(`alien-${i}-${j}`, new Point(x, y), new Size(w, h), new Style("#111111", "hsl(200, 100%, 80%)"));
                ship.changeDirection = () => this.changeDirection = true;

                this.alienShips.push(ship);
                y += (h + margin)
            }

            x -= (w + margin);
            y = 40;
        }
    }

    render() {
        background("black");

        this.earthShip.render();
        this.bullets.forEach(b => b.render());
        this.alienShips.forEach(s => s.render());

        this.displayStatus();
    }

    computeState() {
        this.checkKeyboardCommands();

        this.earthShip.move();
        this.computeBullets();
        this.computeAlienShips();


        if(this.alienShips.length == 0) {
            this.status = "win";
        }

        this.alienShips.forEach(s => {
            if(s.origin.y >= this.earthShip.origin.y - this.earthShip.size.height) {
                this.status = "lose";
            }
        })
    }

    checkKeyboardCommands() {
        if (keyIsDown(RIGHT_ARROW)) {
            this.earthShip.speedX++;
        } else if (keyIsDown(LEFT_ARROW)) {
            this.earthShip.speedX--;
        } else {
            this.earthShip.speedX = 0;
        }

        if (keyIsDown(SPACE)) {
            if(Date.now() - this.lastShot > 150) {
                this.lastShot = Date.now();
                this.shoot();
            }
        }
    }

    computeBullets() {
        this.bullets.forEach(b => b.move());

        this.bullets.forEach(b => {
            this.alienShips.find(s => b.checkHit(s));
        });

        this.bullets = this.bullets.filter(b => !b.isDestroyed);
    }

    computeAlienShips() {
        this.alienShips = this.alienShips.filter(s => !s.isDestroyed);

        this.changeDirection = false;
        this.alienShips.forEach(s => s.move());

        if(this.changeDirection) {
            this.alienShips.forEach(s => {
                s.speedX = -s.speedX;
                s.origin.y += 20;
            });
        }

        this.changeDirection = false;
    }

    shoot() {
        this.bulletId++;

        let {x, y} = this.earthShip.origin,
            {height} = this.earthShip.size;

        let bullet = new Bullet(`bullet${this.bulletId}`, new Point(x, y - height / 2 - 1), new Size(4, 4), new Style("hsl(120, 100%, 70%)"));
        this.bullets.push(bullet);
    }

    displayStatus() {
        text("Click inside the game, then use keyboard", 10, 20);
        text("(arrows to move, and [space] to shoot)", 10, 35);


        let shipsDestroyed = 30 - this.alienShips.length,
            timePlayed = Date.now() - this.timeStart;

        text(`Time played: ${Math.round(timePlayed / 1000)} sec`, 650, 20);
        text(`Bullets shot: ${this.bulletId}`, 650, 35);
        text(`Ships destroyed: ${shipsDestroyed}`, 650, 50);

        if(shipsDestroyed > 0) {
            text(`Accuracy: ${Math.round(shipsDestroyed / this.bulletId * 100)}%`, 650, 65);
        }
    }
}


function loop() {
    if(game.status == "win" || game.status == "lose") {
        return game.status;
    }
    
    game.computeState();
    game.render();
}


