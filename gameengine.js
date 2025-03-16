// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};
        this.ASTEROID_TIMER  = 0;
        this.ASTEROID_SPAWN = 1.5;

        // Options and the Details
        this.options = options || {
            // debugging: true,
            debugging: false,
        };

        this.inMenu = true;
        this.score = 0;
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            // if (this.options.debugging) {
            //     console.log("MOUSE_MOVE", getXandY(e));
            // }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key.toLowerCase()] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key.toLowerCase()] = false);
    };

    addEntity(entity) {
        if (this.options.debugging) {
            console.log("adding entity:" + entity);
        }
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // // Draw latest things first
        // for (let i = this.entities.length - 1; i >= 0; i--) {
        //     this.entities[i].draw(this.ctx, this);
        // }
        
        // Draw earliest things first
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, this);
        }

        if (!this.inMenu) { // draw score if not in menu
            this.ctx.font = '24px monospace';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('SCORE: ' + this.score, 20, 30);
        }
        
        if (this.inMenu) {
            // Draw translucent overlay
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            
            // Draw game title
            this.ctx.font = '64px monospace';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PR0JECT ASTER01DS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 100);
            
            // Draw subtitle
            this.ctx.font = '24px monospace';
            this.ctx.fillStyle = '#888888';
            this.ctx.fillText('There\'s no sound in space!', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 50);
            
            // Draw "Press Enter" message with pulsing effect
            const pulseAmount = 0.7 + 0.3 * Math.sin(Date.now() / 500);
            this.ctx.font = '36px monospace';
            this.ctx.fillStyle = `rgba(255, 255, 255, ${pulseAmount})`;
            this.ctx.fillText('PRESS ENTER TO START', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);
            
            // Draw controls
            this.ctx.font = '20px monospace';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('CONTROLS:', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 120);
            this.ctx.fillText('W - Thrust', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 150);
            this.ctx.fillText('A/D - Rotate', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 180);
            this.ctx.fillText('SPACE - Fire', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 210);
        }
    };

    update() {
        if (this.inMenu && this.keys['enter']) {
            this.score = 0;
            this.inMenu = false;
        }
        if (!this.inMenu) {
            this.ASTEROID_TIMER += gameEngine.clockTick;
            if (this.ASTEROID_TIMER >= this.ASTEROID_SPAWN) {
                console.log("Trying to create Asteroid")
                let side = Math.floor(Math.random() * 4); // 0 to 3
                let rand = Math.floor(Math.random() * 1025); // 0 to 1024
                switch (side) { // -128 & 1024+128 is chosen to stop largest asteroid from spawning on screen.
                    case 0: // top
                        this.addEntity(new Asteroid(this, rand, -128, Math.floor(Math.random() * 3), "TOP"));
                        break;
                    case 1: // right
                        this.addEntity(new Asteroid(this, 1152, rand, Math.floor(Math.random() * 3), "RIGHT"));
                        break;
                    case 2: // bottom
                        this.addEntity(new Asteroid(this, rand, 1152, Math.floor(Math.random() * 3), "BOTTOM"));
                        break;
                    case 3: // left
                        this.addEntity(new Asteroid(this, -128, rand, Math.floor(Math.random() * 3), "LEFT"));
                        break;
                }
                console.log("Asteroid Created")
                this.ASTEROID_TIMER = 0;
            }
            
            let entitiesCount = this.entities.length;

            for (let i = 0; i < entitiesCount; i++) {
                let entity = this.entities[i];

                if (!entity.removeFromWorld) {
                    entity.update();
                }
            }

            for (let i = this.entities.length - 1; i >= 0; --i) {
                if (this.entities[i].removeFromWorld) {
                    this.entities.splice(i, 1);
                }
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)