import { stage } from "./main.js";
export function checkCollision(a, b) {
    let nocollition = b?.nocollition??false
    const isColliding = 
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y


    if (!isColliding) {
        return null;
    }
    const overlapTop = (a.y + a.height) - b.y;
    const overlapBottom = (b.y + b.height) - a.y;
    const overlapLeft = (a.x + a.width) - b.x;
    const overlapRight = (b.x + b.width) - a.x;

    const minOverlap = Math.min(
        overlapTop,
        overlapBottom,
        overlapLeft,
        overlapRight
    );
    // oben
    if (minOverlap === overlapTop && nocollition === false) {
        if (!nocollition) {
            a.velocityY = 0;   
            a.y = b.y - a.height;               
            a.onground = true;
            return "top";
        }
    }

    // unten
    else if (minOverlap === overlapBottom && nocollition === false) {
        a.y = b.y + b.height;
        a.velocityY = 0;
        return "bottom";
    }

    // links
    else if (minOverlap === overlapLeft && nocollition === false) {
        a.x = b.x - a.width;
        return "left";
    }

    // rechts
    else if (minOverlap === overlapRight && nocollition === false) {
        a.x = b.x + b.width;
        return "right";
    }
    else if (nocollition) {
        return true
    }
}