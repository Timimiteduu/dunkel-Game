import { canvas, ctx, keys, init, gameframe } from "./engine.js";
const player_spriteWidth = 575;
const player_spriteHeight = 523;
const coin1_spritewidth = 16;
const coin1_spriteheight = 16;
const health_spritewidth = 11;
const health_spriteheight = 11;
const platform_spritewidth = 14;
const platform_spriteheight = 14;
const spike_spritewidth = 18;
const spike_spriteheight = 10;
const staggerframes = 5; //fps
const spriteanimations = {};
const animationstatesspike = [
  {
    name:"default",
    frames:1
  }
]
const animationstatesplatform = [
  {
    name:"dirt",
    frames:1,
  },
  {
    name:"grass",
    frames:1,
  }
]
const animationstateshealth = [
  {
    name:"3/3",
    frames:1
  },
  {
    name:"platzhalter1",
    frames:1
  },
  {
    name:"2/3",
    frames:1
  },
  {
    name:"platzhalter2",
    frames:1
  },
  {
    name:"1/3",
    frames:1
  },
  {
    name:"platzhalter3",
    frames:1
  },
  {
    name:"0/3",
    frames:1
  },
]
const animationstatescoin = [
  {
    name: "coin1",
    frames:15,
  }
]
const animationstatesplayer = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "fly",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "die",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
]




function addToSpriteanimations(animstatesname, obj_spriteheight, obj_spritewidth) {
  animstatesname.forEach((state, index) => {
    let frames = {
      loc: [],
    }
    for (let j = 0; j < state.frames; j++){
      let positionx = j * obj_spritewidth;
      let positiony = index * obj_spriteheight;
      frames.loc.push({x: positionx, y: positiony});
    }
    spriteanimations[state.name] = frames;
  });
}
addToSpriteanimations(animationstatesspike, spike_spriteheight, spike_spritewidth)
addToSpriteanimations(animationstatescoin, coin1_spriteheight, coin1_spritewidth)
addToSpriteanimations(animationstatesplatform, platform_spriteheight, platform_spritewidth)
addToSpriteanimations(animationstateshealth, health_spriteheight, health_spritewidth)
addToSpriteanimations(animationstatesplayer, player_spriteHeight, player_spriteWidth)


export function draw_sprite(name,x, y, width, height, flip, sprite) {
  // Clear
  let position = Math.floor(gameframe/staggerframes) % spriteanimations[name].loc.length;
  let frameX = sprite.spritewidth * position;
  let frameY = spriteanimations[name].loc[position].y;
  ctx.save();
  if(flip) {
    ctx.translate(x+width, y)
    ctx.scale(-1, 1);
  }
  else{
  ctx.translate(x, y)
  }
  ctx.drawImage(sprite.image, frameX , frameY ,sprite.spritewidth, sprite.spriteheight, 0, 0, width, height);
    ctx.restore();
}