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

module.exports = { randomIntFromRange, randomColor, distance, resolveCollision }
