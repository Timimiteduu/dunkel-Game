import { draw_sprite } from "./animations.js";
import { canvas, ctx, keys, init, img } from "./engine.js";
import { applyGravity, applyMovement } from "./Physics.js";
import { checkCollision } from "./collitions.js";
import { Coin } from "./coins.js"
import { Platform } from "./platform.js";
import { Spike } from "./spike.js";
import { Player } from "./player.js";
import { Endpoint } from "./endpoint.js";
// --- Setup ---
canvas.width = 1200;
canvas.height = 600;

const coinSound = new Audio("./assets/sounds/coincollection.wav")
export let player = null;
export const playersprite = {
    width:5230,
    height:6876,
    spriteheight:523,
    spritewidth:575,
    image:img("../assets/sprites/Player.png")
}
const platformsprite = {
    width:14,
    height:28,
    spriteheight:14,
    spritewidth:14,
    image:img("../assets/sprites/Platform.png")
}
const coinsprite = {
    width:240,
    height:16,
    spritewidth:16,
    spriteheight:16,
    image:img("../assets/sprites/coin1.png")
}
export const health = {
    curentStateAnimation:"3/3",
    x:100,
    y:18,
    height:22,
    width:66,
}
export const healthsprite = {
    width:33,
    height:77,
    spritewidth:33,
    spriteheight:10,
    image:img("../assets/sprites/Health.png")
}
export const spikesprite = {
    width:18,
    height:10,
    spritewidth:18,
    spriteheight:10,
    image:img("../assets/sprites/Spike.png")
}
const gameoversprite = img("./assets/sprites/GAMEOVER.png")
const worldscale = 50
let level = Number(localStorage.getItem("level")??1);
export let stage = [
]
let map = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,3,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
        [0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0],
        [0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
        [0,1,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,5,5,5,5,5],
        [0,1,0,0,0,0,0,0,0,0,0,0,0.0,0,0,1,1,1,1,1,1,1,1,1],
        [0,1,0,4,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,3,0,3,0,3,0,3,0,2,0]
        ]
let backgroundImage = new Image();
backgroundImage.src = "../assets/Backgrounds/Mountain.png"
let biting = false;
let rolling = false;
let coins = 0;
let playsoundcoin = false
let canPlayCoinSound = true;
let health_num = 3;
let state = 0 //0=spielen, 1=gebonnen, 2=verloren
let hasDied = false;
let spawnpoint = null;
let win = false;
let gameoverscreen = false;
function checkstate() {
    if (state === 0) {
        applyGravity();
        applyMovement();
        checkCollision();
    }
    else if (state === 1) {
        alert("gewonnen!")
    }
    else if (state === 2) {
        gameOver()
    }
}
function levelup() {
    level += 1;
    localStorage.setItem("level", level)
}
function worldGenerate() {
    stage = []
    checkLevel();
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const element = map[y][x];
            if(element === 1) {
                const platform = new Platform(x*worldscale, y*worldscale)
                if (y>0 && map[y-1][x] === 1) {
                    platform.curentStateAnimation = "dirt"
                }
                else if (y>0 && map[y-1][x] != 1){
                    platform.curentStateAnimation = "grass"
                }
                stage.push(platform)
            }
            else if (element === 2) {
                const coin = new Coin(x*worldscale, y*worldscale)
                stage.push(coin)
            }
            else if (element === 3) {
                const spike = new Spike(x*worldscale, y*worldscale+35)
                stage.push(spike)
            }
            else if (element === 4) {
                player = new Player(x*worldscale, y*worldscale)
                spawnpoint = {
                    x:player.x,
                    y:player.y
                }
            }
            else if (element === 5) {
                stage.push(new Endpoint(x*worldscale, y*worldscale)) 
            }
        }
    }
}

function checkLevel() {
    if (level <= 0) {
        map = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    }
    else if (level === 1) {
        map = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,3,0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
        [0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0],
        [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
        [0,1,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,5,5,5,5,5],
        [0,1,0,0,0,0,0,0,0,0,0,0,0.0,0,0,1,1,1,1,1,1,1,1,1],
        [0,1,0,4,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,3,0,3,0,3,0,3,0,2,0]
        ]
    }
    else if (level === 2) {
        map = [
        [5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
        [1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,1,1,1,1,3.0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,4,0],
        [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        ]
    }
    else if (level === 3) {
        map = [
        [5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,0,0,1],
        [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
        [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,0,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,3,3,0,0,0,0,0,0,1],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,1]
        ] 
    }
    else {
        localStorage.clear()
        location.href="/"
    }

}

function healthdisplay()  {
    if (health_num === 3){
        health.curentStateAnimation = "3/3"
    }
    else if (health_num === 2){
        health.curentStateAnimation = "2/3"
    }
    else if (health_num === 1) {
        health.curentStateAnimation = "1/3"
    }
    else if (health_num < 1) {
        health.curentStateAnimation = "0/3"
        gameoverscreen = true
        localStorage.clear()
        level = 1
    }
}

function gameOver() {
    if(gameoverscreen) {
        ctx.drawImage(gameoversprite, 0, 0, canvas.width, canvas.height)
    }
}
function tryPlayCoinSound() {
    if (canPlayCoinSound) {
        playCoin();
        canPlayCoinSound = false;

        setTimeout (() => {
            canPlayCoinSound = true;
        }, 1000)
    }
}


function update() {
    let dontfall = false;
    healthdisplay();
    applyGravity();
    for (const element of stage) {
        if (element.type === "coin") {
            if(checkCollision(player, element)) {
                coins++;
                document.querySelector(".coindisplay_num").textContent = coins;
                element.enable=false;
            }
            if(element.enable === false) {
                stage = stage.filter(el => el !== element)
            }
        }
        else if (element.type === "platform") {
            checkCollision(player, element)
        }
        else if (element.type === "spike") {
            if(checkCollision(player, element)) {
                health_num--;
                player.x = spawnpoint.x
                player.y = spawnpoint.y
            } 
        }
        else if (element.type === "endpoint") {
            if(checkCollision(player, element)) {
                levelup();
                worldGenerate()
            }
        }
    }
    applyMovement();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    if (health_num < 1 && !hasDied) {
        player.curentStateAnimation = "die"
        hasDied = true
        console.log(hasDied)
    }
    else if (player.velocityY < 0) {
        player.curentStateAnimation = "jump"
    }
    else if (player.velocityY > 0) {
        player.curentStateAnimation = "fall"
    }
    else if (player.moving != 0) {
        player.curentStateAnimation = "run"
    }
    else if (keys["mouse"]) {
        player.curentStateAnimation = "bite"
        setTimeout (() => {    
        },500)
    }
    else if (keys["s"] || keys["ArrowDown"]) {
        player.curentStateAnimation = "roll"
        rolling = true
    }

    else {
        player.curentStateAnimation = "idle"
        biting = false
        rolling = false;
    }
    draw_sprite(health.curentStateAnimation, health.x, health.y, health.width, health.height,false,healthsprite)
    //ctx.fillRect(player.x, player.y, player.width, player.height)
    draw_sprite(player.curentStateAnimation, player.spritebox.x, player.spritebox.y, player.spritebox.width, player.spritebox.height, player.flip, playersprite); 
    for (const element of stage) {
        switch (element.type) {
            case "coin":
                draw_sprite(element.curentStateAnimation, element.x, element.y, element.width, element.height,false,coinsprite)
                break;
            case "platform":  
                draw_sprite(element.curentStateAnimation, element.x, element.y, element.width, element.height,false,platformsprite)
                break;
            case "spike":
                draw_sprite(element.curentStateAnimation, element.spritebox.x, element.spritebox.y, element.spritebox.width, element.spritebox.height,false,spikesprite)
                break;
            default:
                break;
        } 
    }
    gameOver();
}
worldGenerate()
init(update, draw)