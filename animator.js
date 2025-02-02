class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration});
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
    }

    drawFrame(tick, ctx, x, y, rotation) {
        if (!ctx || !this.spritesheet || !this.spritesheet.complete) {
            return;
        }

        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();

        ctx.save()
        ctx.translate(x + this.width / 2, y + this.height / 2); 
        ctx.rotate(rotation); // THIS USES RADIANS, CONVERT DEGREES TO RADIANS FIRST

        ctx.drawImage(
            this.spritesheet,
            this.xStart + this.width * frame, 
            this.yStart,
            this.width, 
            this.height,
            - this.width / 2, 
            - this.height / 2,
            this.width,      
            this.height       
        );

        ctx.restore();
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration) % this.frameCount;
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}