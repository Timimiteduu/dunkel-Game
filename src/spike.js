export class Spike {
    curentStateAnimation = "default"
    nocollition = true
    type="spike"
    width=40
    height=15
    _spritebox={
        x:0,
        y:-10,
        width:50,
        height:25,
    }
    get spritebox() {
        return({
        x:this.x+this._spritebox.x,
        y:this.y+this._spritebox.y,
        width:this._spritebox.width,
        height:this._spritebox.height})
    }  
    constructor(x, y)
    {
        this.x=x
        this.y=y
    }
    
}