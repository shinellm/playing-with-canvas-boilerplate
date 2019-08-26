import utils from './utils'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Sets the mouse's intial load position to be in the center of the canvas
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

// Array of hexidecimal colors
const colors = ['#2185C5', '#7ECEFD', '#9c73ff', '#40bd44', '#a22727', '#FF7F66', '#f15a92', '#f1ca5a'];

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

//Utility Functions

/**
 * Generates a random integer within range of the provided min and max values
 * 
 * @param {Int} min | Range's minimum value 
 * @param {Int} max | Range's maximum value 
 * @return {Object} | The altered x and y velocities after the coordinate system has been rotated
 */
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Selects a random color from the colors array
 * 
 * @param {Array[String]} colors | Array of hexidecimal colors
 * @return {String} | A random color
 */
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Uses the Phythagorean Theorem to calculate the distance between two points
 * 
 * @param {Float} x1 | The x value of the first point
 * @param {Float} y1 | The y value of the first point
 * @param {Float} x2 | The x value of the other point
 * @param {Float} y2 | The y value of the other point
 * @return {Float} | The distance between the two points provided
 */
function distance(x1, y1, x2, y2) {
const xDist = x2 - x1;
const yDist = y2 - y1;

return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/**
 * Rotates coordinate system for velocities
 * 
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 * 
 * @param {Object} velocity | Velocity of an individual particle
 * @param {Float} angle | The angle of collision between two objects in radians
 * @return {Object} | The altered x and y velocities after the coordinate system has been rotated
 */
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 * 
 * @param {Object} particle | A particle object with x and y coordinates, plus velocity
 * @param {Object} otherParticle | A particle object with x and y coordinates, plus velocity
 * @return {Null} | No value is returned
 */
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        
        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity after 1d collision equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Final velocity after rotating axis back to original location
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), 
                     y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), 
                     y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for a realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// The Object
function Particle(x, y, radius, color, text) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
    };
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.mass = 1;
    this.opacity = 0;

    addEventListener('click', event => {
        if (event.target) {
            let xTarget = event.clientX;
            let yTarget = event.clientY;

            if (distance(xTarget, yTarget, this.x, this.y) < this.radius) {
                console.log("click position, x: " + xTarget + ", y: " + yTarget);
                console.log("this position, x: " + this.x + ", y: " + this.y);
                console.log("You've clicked on '" + this.text +"'");
            }
        }
    });
}

// Draws the object
Object.prototype.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.font = "bolder " + this.radius/2 + "px Times New Roman";
    c.textAlign = "center";
    c.textBaseline = "middle"; 
    c.fillStyle = this.color;
    c.fillText(this.text, this.x, this.y, this.radius * 2.5);
    c.globalAlpha = this.opacity;
    c.fill();
    c.restore();
    // c.strokeStyle = this.color;
    // c.stroke();
    c.closePath();
}

// Updates the object
Object.prototype.update = function(particles) {
    this.draw();

    // Resolve collisions that happen between the particles on the page
    for (let i = 0; i < particles.length; i++) {
        if (this === particles[i]) continue;
        if (distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0) {
            // console.log('has collided');
            resolveCollision(this, particles[i]);
        }
    }

    // If the words circle has touched the sides of the page, invert its velocity
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
        this.velocity.y = -this.velocity.y;
    }

    // Mouse collision detection

    // Increases opacity of the word's circle on hover and momentarily stops the particle from moving
    if (distance(mouse.x, mouse.y, this.x, this.y) < 30 && this.opacity < 0.2) {
        // console.log('mouse collision');
        this.opacity += 0.02; 
        this.velocity.x = 0; 
        this.velocity.y = 0;
    }
    // Decreases opacity of the word's circle on mouse exit and ensures that opacity isn't ever negative
    else if (this.opacity > 0) {
        this.opacity -= 0.02; 
        this.opacity = Math.max(0, this.opacity); 
    }

    // On each updated add the current x and y velocities 
    // to the current x and y coords
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

// Implementation
let particles;
let genres;

function init() {
    particles = [];
    genres = ["alternative r&b", "k-pop girl group", "k-pop", "boy band", 
    "southern hip hop", "r&b", "glam rock", "rap", "europop", "neo mellow",
    "hip pop", "malaysian pop", "rock", "hip hop", "pop", "mellow gold", 
    "g funk", "urban contemporary", "philly rap", "dance pop", "j-pop girl group", 
    "piano rock", "pop rap", "west coast rap", "gangster rap"];

    // Iterates through the genres array and creates new particles
    for (let i = 0; i < genres.length; i++) {
        let radius = randomIntFromRange(25, 75);
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);
        const color = randomColor(colors);

        // Ensure that after the first particle has been created, the rest of
        // particles are not rendered on top of each other
        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);

                    j = -1;
                }
            }
        }
        particles.push(new Particle(x, y, radius, color, genres[i]));
    }
    // console.log(particles)
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    //canvas.style.border = '1px solid #32a98d';
    //canvas.style.margin = '15px 0px';
    canvas.style.letterSpacing = '2px';
    
    particles.forEach(particle => {
        particle.update(particles);
    })
}

init();
animate();
