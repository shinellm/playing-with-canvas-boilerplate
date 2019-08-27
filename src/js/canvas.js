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

//Utility Functions are in the utils.js file

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

            if (utils.distance(xTarget, yTarget, this.x, this.y) < this.radius) {
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
        if (utils.distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0) {
            // console.log('has collided');
            utils.resolveCollision(this, particles[i]);
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
    if (utils.distance(mouse.x, mouse.y, this.x, this.y) < 30 && this.opacity < 0.2) {
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
        let radius = utils.randomIntFromRange(25, 75);
        let x = utils.randomIntFromRange(radius, canvas.width - radius);
        let y = utils.randomIntFromRange(radius, canvas.height - radius);
        const color = utils.randomColor(colors);

        // Ensure that after the first particle has been created, the rest of
        // particles are not rendered on top of each other
        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (utils.distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
                    x = utils.randomIntFromRange(radius, canvas.width - radius);
                    y = utils.randomIntFromRange(radius, canvas.height - radius);

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
