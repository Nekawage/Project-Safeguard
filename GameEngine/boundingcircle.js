class BoundingCircle {
    constructor(x, y, width, height, radius) {
        Object.assign(this, { x, y, width, height, radius});

        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
    };

    collide(oth) {
        var dx = this.centerX - oth.centerX;
        var dy = this.centerY - oth.centerY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + oth.radius) return true; 
        return false;    
    }
    
}