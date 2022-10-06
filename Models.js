
class Vector extends Array {
    constructor(x,y){
        super(2);
        this[0] = x;
        this[1] = y;
    }
    scale(v){
        return this.map(x=>x*v);
    }
    get x(){ return this[0]; }
    get y(){ return this[1]; }
    set x(v){ return this[0] = v; }
    set y(v){ return this[1] = v; }
}

class Entity {
    constructor(pos, color){
        this.position = pos;
        this.radius = 10;
        this.color = color;
    }
    draw(){
        fill(this.color)
        strokeWeight(0)
        circle(this.position.x, this.position.y, this.radius)
    }
    static createNew(x = 0, y = 0, color){
        return new Entity(new Vector(x,y), color);
    }
}

