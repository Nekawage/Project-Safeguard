class Asteroid {
    constructor(game, x, y, size) {
        Object.assign(this, {game, x, y, size});

        if (this.size === 0) {
            this.height = 128;
            this.width = 128;
            this.health = 5;
            this.spriteindex = Math.floor(Math.random() * 2);
        } else if (this.size === 1) {
            this.height = 64;
            this.width = 64;
            this.health = 3;
            this.spriteindex = Math.floor(Math.random() * 3);
        } else {
            this.height = 32;
            this.width = 32;
            this.health = 1;
            this.spriteindex = Math.floor(Math.random() * 4);
        }
        this.rotation = Math.floor(Math.random() * 3);
        this.rotate = 0;

        this.sprites = [
            [  // big asteroids (index 0)
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_big1.png"),
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_big2.png")
            ],
            [  // medium asteroids (index 1)
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_medium1.png"),
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_medium2.png"),
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_medium3.png")
            ],
            [  // small asteroids (index 2)
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_small1.png"),
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_small2.png"),
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_small3.png"),
                ASSET_MANAGER.getAsset("./sprites/asteroid/asteroid_small4.png")
            ]
        ];
        this.animators = [];
        this.loadAnimators();
        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    loadAnimators() {
        for (let i = 0; i < this.sprites.length; i++) {
            this.animators[i] = []; 
            for (let j = 0; j < this.sprites[i].length; j++) {
                if (i === 0) this.animators[i][j] = new Animator(this.sprites[i][j], 0, 0, 128, 128, 1, 1);
                else if (i === 1) this.animators[i][j] = new Animator(this.sprites[i][j], 0, 0, 64, 64, 1, 1);
                else this.animators[i][j] = new Animator(this.sprites[i][j], 0, 0, 32, 32, 1, 1);
            }
        }
    }
    
    update(){
        const TICK = this.game.clockTick;
        // not moving currently.
        if (this.rotation === 0) {
            this.rotate += 1.5 * TICK;
        } else if (this.rotation === 1) {
            this.rotate -= 1.5 * TICK;
        }
        if (this.health <= 0) {
            this.removeFromWorld = true;
        }
        this.updateLastBB();
        this.updateBB();
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        this.animators[this.size][this.spriteindex].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.rotate);
    }

    updateBB() {
        this.BB = new BoundingCircle(this.x, this.y, this.width, this.height, this.width / 2);
    }

    updateLastBB() {
        this.lastBB = this.BB;
    };
}