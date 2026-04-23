import { checkCollision } from "./collitions.js";
import { keys, canvas } from "./engine.js";
import { player, stage } from "./main.js";
import { Platform } from "./platform.js";

const GRAVITY = 0.5;
export const speed = 5;



export function applyGravity() {
  player.velocityY += GRAVITY;
  player.y += player.velocityY;
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.onground=true;
  }
  if (player.velocityY > 0) {
  player.onground = false
  }
}



export function applyMovement() {
  const jumping = (keys["ArrowUp"] || keys[" "] || keys["w"])
  let moving = 0;
  if (jumping && player.onground) {
    player.velocityY = -12; // jump strength
    player.onground = false
  }
  if(keys["d"] || keys["ArrowRight"]) {
    if(player.velocityX < 10) {
      moving = 1
      player.flip = false
    }
  }
  if(keys["a"] || keys["ArrowLeft"]) {
    if(player.velocityX > -10) {
      moving = -1
      player.flip = true
    }
  }
  if(keys["s"] || keys["ArrowDown"]) {
      
  }

  player.velocityX = moving*speed
  player.velocityX *= 0.8;
  player.x += player.velocityX;
  player.moving = moving
  player.jumping = jumping
}

