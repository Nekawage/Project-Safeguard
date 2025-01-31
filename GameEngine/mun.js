class Mun {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 144;
        this.width = 144;
        this.degree = 0;

        this.game.Player = this;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/munbig.png");
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 60, .6)

        this.state = 0; // 0 = full hp, 1 = slightly damaged, 2 = damaged, 3 = very damaged.
        this.dead = false;
    }

    update() {

    }
    
    draw(ctx) {
        if (this.game.options.debugging) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.75, 0, Math.PI * 2);
            ctx.stroke();
        }
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}