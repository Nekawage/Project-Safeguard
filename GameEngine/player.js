class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 48;
        this.width = 48;
        this.degree = 0;

        this.game.Player = this;

        this.sprites = [];
        this.loadSprites(this.sprites);

        this.state = 0; // 0 = full hp, 1 = slightly damaged, 2 = damaged, 3 = very damaged.
        this.dead = false;
        this.fireCD = 0.5;
        this.invulSwitch = 0;
        this.invulTimer = 0;

        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    loadSprites(sprites) {
        sprites[0] = new Animator(ASSET_MANAGER.getAsset("./sprites/ship/ship0.png"), 0, 0, 48, 48, 1, 1);
        sprites[1] = new Animator(ASSET_MANAGER.getAsset("./sprites/ship/ship1.png"), 0, 0, 48, 48, 1, 1);
        sprites[2] = new Animator(ASSET_MANAGER.getAsset("./sprites/ship/ship2.png"), 0, 0, 48, 48, 1, 1);
        sprites[3] = new Animator(ASSET_MANAGER.getAsset("./sprites/ship/ship3.png"), 0, 0, 48, 48, 1, 1);
    }

    update() {
        const TICK = this.game.clockTick;

        const ACCEL = 200;
        const DECEL = 50;
        const MAX_SPEED = 500;
        const ROTATE = 180;
        const PROJ_OFFSET = 10;

        //console.log(this.degree);
        //console.log(this.x);
        //console.log(this.y);

        if (this.game.keys['a'] && !this.game.keys['d']) this.degree -= ROTATE * TICK;
        if (this.game.keys['d'] && !this.game.keys['a']) this.degree += ROTATE * TICK;
        if (this.game.keys['w']) {
            this.velocity.x += ACCEL * -Math.cos(this.degreeToRadians(this.degree + 90)) * TICK;
            this.velocity.y += ACCEL * -Math.sin(this.degreeToRadians(this.degree + 90)) * TICK;
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
        
        if (this.game.keys[' '] && this.fireCD <= 0) {
            this.game.addEntity(new Projectile(this.game, 
                this.shipNoseX() + PROJ_OFFSET * Math.cos(this.degreeToRadians(this.degree + 90)) - 16, 
                this.shipNoseY() - PROJ_OFFSET * Math.sin(this.degreeToRadians(this.degree + 90)) - 16, 
                this.degree))
            this.fireCD = 0.5;
        }

        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
        this.fireCD -= TICK;
        this.updateLastBB();
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && entity instanceof Asteroid && that.BB.collide(entity.BB) && that.invulSwitch != 1 && that.state < 3) {
                that.state += 1;
                that.invulSwitch = 1;
            }
        });

        if (this.invulSwitch === 1) {
            this.invulTimer -= TICK;
            if (this.invulTimer <= 0) {
                this.invulSwitch = 0;
                this.invulTimer = 3;
            }
        }

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
        if (this.game.options.debugging) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.shipNoseX(), this.shipNoseY(), 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    degreeToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    shipNoseX() {
        return (this.x + this.width / 2) + 24 * -Math.cos(this.degreeToRadians(this.degree + 90));
    }

    shipNoseY() {
        return (this.y + this.height / 2) + 24 * -Math.sin(this.degreeToRadians(this.degree + 90));
    }

    updateBB() {
        this.BB = new BoundingCircle(this.x, this.y, this.width, this.height, this.width / 2.75);
    }

    updateLastBB() {
        this.lastBB = this.BB;
    };
}

class Projectile {
    constructor(game, x, y, degree) {
        Object.assign(this, {game, x, y, degree});

        this.height = 32;
        this.width = 32;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ship/ship_rocket.png");
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 3, 0.1);

        this.velocity = {x: 20 * -Math.cos(this.degreeToRadians(this.degree + 90)), 
                         y: 20 * -Math.sin(this.degreeToRadians(this.degree + 90))};
        this.speed = 200;
        this.updateBB();
    }

    update() {
        const TICK = this.game.clockTick;
        const MAX_SPEED = 800;
        const ACCEL = 300;

        this.velocity.x += ACCEL * -Math.cos(this.degreeToRadians(this.degree + 90)) * TICK;
        this.velocity.y += ACCEL * -Math.sin(this.degreeToRadians(this.degree + 90)) * TICK;

        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

        if (this.velocity.x > MAX_SPEED) this.velocity.x = MAX_SPEED;
        if (this.velocity.y > MAX_SPEED) this.velocity.y = MAX_SPEED;

        if (this.x > 1056 || this.x < -32) this.removeFromWorld = true;
        if (this.y > 1056 || this.y < -32) this.removeFromWorld = true;

        this.updateLastBB();
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && entity instanceof Asteroid && that.BB.collide(entity.BB)) {
                entity.health -= 1;
                that.removeFromWorld = true;
            }
        });
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.5, 0, Math.PI * 2);
            ctx.stroke();
        }
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.degreeToRadians(this.degree));
    }

    degreeToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    updateBB() {
        this.BB = new BoundingCircle(this.x, this.y, this.width, this.height, this.width / 2.5);
    }

    updateLastBB() {
        this.lastBB = this.BB;
    };
}