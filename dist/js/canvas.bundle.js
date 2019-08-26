/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(/*! ./utils */ "./src/js/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Sets the mouse's intial load position to be in the center of the canvas
var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

// Array of hexidecimal colors
var colors = ['#2185C5', '#7ECEFD', '#9c73ff', '#40bd44', '#a22727', '#FF7F66', '#f15a92', '#f1ca5a'];

// Event Listeners
addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

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
    var xDist = x2 - x1;
    var yDist = y2 - y1;

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
    var rotatedVelocities = {
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
    var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    var xDist = otherParticle.x - particle.x;
    var yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        var m1 = particle.mass;
        var m2 = otherParticle.mass;

        // Velocity after 1d collision equation
        var u1 = rotate(particle.velocity, angle);
        var u2 = rotate(otherParticle.velocity, angle);

        // Final velocity after rotating axis back to original location
        var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y };
        var v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
            y: u2.y };

        var vFinal1 = rotate(v1, -angle);
        var vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for a realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// The Object
function Particle(x, y, radius, color, text) {
    var _this = this;

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

    addEventListener('click', function (event) {
        if (event.target) {
            var xTarget = event.clientX;
            var yTarget = event.clientY;

            if (distance(xTarget, yTarget, _this.x, _this.y) < _this.radius) {
                console.log("click position, x: " + xTarget + ", y: " + yTarget);
                console.log("this position, x: " + _this.x + ", y: " + _this.y);
                console.log("You've clicked on '" + _this.text + "'");
            }
        }
    });
}

// Draws the object
Object.prototype.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.font = "bolder " + this.radius / 2 + "px Times New Roman";
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
};

// Updates the object
Object.prototype.update = function (particles) {
    this.draw();

    // Resolve collisions that happen between the particles on the page
    for (var i = 0; i < particles.length; i++) {
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
};

// Implementation
var particles = void 0;
var genres = void 0;

function init() {
    particles = [];
    genres = ["alternative r&b", "k-pop girl group", "k-pop", "boy band", "southern hip hop", "r&b", "glam rock", "rap", "europop", "neo mellow", "hip pop", "malaysian pop", "rock", "hip hop", "pop", "mellow gold", "g funk", "urban contemporary", "philly rap", "dance pop", "j-pop girl group", "piano rock", "pop rap", "west coast rap", "gangster rap"];

    // Iterates through the genres array and creates new particles
    for (var i = 0; i < genres.length; i++) {
        var radius = randomIntFromRange(25, 75);
        var x = randomIntFromRange(radius, canvas.width - radius);
        var y = randomIntFromRange(radius, canvas.height - radius);
        var color = randomColor(colors);

        // Ensure that after the first particle has been created, the rest of
        // particles are not rendered on top of each other
        if (i !== 0) {
            for (var j = 0; j < particles.length; j++) {
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

    particles.forEach(function (particle) {
        particle.update(particles);
    });
}

init();
animate();

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

module.exports = { randomIntFromRange: randomIntFromRange, randomColor: randomColor, distance: distance };

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map