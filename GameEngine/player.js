class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 48;
        this.width = 48;
        this.degree = 0;

        this.game.Player = this;

        this.sprites = [];
        // sprites for each damage state for player ship.
        this.ship0 = ASSET_MANAGER.getAsset("./sprites/ship/ship0.png");
        this.ship1 = ASSET_MANAGER.getAsset("./sprites/ship/ship1.png");
        this.ship2 = ASSET_MANAGER.getAsset("./sprites/ship/ship2.png");
        this.ship3 = ASSET_MANAGER.getAsset("./sprites/ship/ship3.png");
        this.loadSprites(this.sprites);

        this.state = 0; // 0 = full hp, 1 = slightly damaged, 2 = damaged, 3 = very damaged.
        this.dead = false;

        this.velocity = {x: 0, y: 0};

        //this.updateBB();

    }
    loadSprites(sprites) {
        sprites[0] = new Animator(this.ship0, 0, 0, 48, 48, 1, 1);
        sprites[1] = new Animator(this.ship1, 0, 0, 48, 48, 1, 1);
        sprites[2] = new Animator(this.ship2, 0, 0, 48, 48, 1, 1);
        sprites[3] = new Animator(this.ship3, 0, 0, 48, 48, 1, 1);
    }
    update() {
        const TICK = this.game.clockTick;

        const ACCEL = 200;
        const DECEL = 50;
        const MAX_SPEED = 500;
        const ROTATE = 180;

        if (this.game.keys['a'] && !this.game.keys['d']) this.degree -= ROTATE * TICK;
        if (this.game.keys['d'] && !this.game.keys['a']) this.degree += ROTATE * TICK;
        if (this.game.keys['w']) {
            this.velocity.x += ACCEL * Math.cos(this.degreeToRadians(this.degree + 270)) * TICK;
            this.velocity.y += ACCEL * Math.sin(this.degreeToRadians(this.degree + 270)) * TICK;
        }

        let decelX = DECEL * Math.sign(this.velocity.x) * TICK;
        if (this.velocity.x !== 0 && !this.game.keys['w']) {
            if (Math.abs(this.velocity.x) < Math.abs(decelX)) {
                this.velocity.x = 0; 
            } else {
                this.velocity.x -= decelX;
            }
        }

        let decelY = DECEL * Math.sign(this.velocity.y) * TICK;
        if (this.velocity.y !== 0 && !this.game.keys['w']) {
            if (Math.abs(this.velocity.y) < Math.abs(decelY)) {
                this.velocity.y = 0; 
            } else {
                this.velocity.y -= decelY;
            }
        }

        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

        if (this.velocity.x > MAX_SPEED) this.velocity.x = MAX_SPEED;
        if (this.velocity.y > MAX_SPEED) this.velocity.y = MAX_SPEED;
        
        if (this.x > 1024) this.x = 0;
        else if (this.x < 0) this.x = 1024;
        
        if (this.y > 1024) this.y = 0;
        else if (this.y < 0) this.y = 1024;
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.75, 0, Math.PI * 2);
            ctx.stroke();
        }
        this.sprites[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.degreeToRadians(this.degree));
        // TODO: just have an animator for engine jet blast whatever and then draw it "behind" the ship w/ same rotation.
    }

    degreeToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}