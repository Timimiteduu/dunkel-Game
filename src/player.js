export class Player {
    constructor(x, y) {
        this.x=x
        this.y=y
    }
    curentStateAnimation= "idle"
    height=50
    width=40
    jumpging=false
    moving=0
    flip=false
    onground=false
    velocityX=0
    velocityY=0
    _spritebox={
        x:-3.75,
        y:-8,
        width:52.3,
        height:57.5,
    }
    get spritebox() {
        return({
        x:this.x+this._spritebox.x,
        y:this.y+this._spritebox.y,
        width:this._spritebox.width,
        height:this._spritebox.height,})
    }
    
}