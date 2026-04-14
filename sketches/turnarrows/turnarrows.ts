function setup(): void {
	createCanvas(2048, 2048);
	noLoop();
}

const debug = false;

function draw(): void {
	// make pngs for turn/danger signs
	// rounded edges would be nice on the outside of the arrow
	// actually yeah you can do that
	background(color(0, 0, 0, 0));
	// four arrows - left, right, left u-turn, right u-turn
	// left turn
	fill(0);
	stroke(0);
	strokeWeight(2);
	if (debug) line(width/2, 0, width/2, height);
	if (debug) line(0, height/2, width, height/2);
	noFill();
	if (debug) rect(0, 0, width, height);
	fill(255);
	noStroke();
	if (debug) {
		for (let i=0; i<2048; i+= 64) {
			for (let j=0; j<2048; j+= 64) {
				ellipse(i, j, 2, 2);
			}
		}
	}
	// move towards the center so you can do it again when mirrored
	translate(width/2, 0);
	drawArrows();
	scale(-1, 1);
	drawArrows();
}

function drawArrows(): void {
	push();
		scale(64, 64);
		translate(1, 0);
		rect(3, 6, 2, 6);
		rect(3, 5, 2, 2, 0.5);
		rect(4, 5, 4, 2);
		triangle(8, 3, 8, 9, 11, 6);

		translate(0, 16);
	
		rect(3, 6, 2, 6);
		rect(3, 5, 2, 2, 0.5);
		rect(4, 5, 5, 2);
		// curve it again
		rect(8, 5, 2, 6, 0.5);
		triangle(7, 10, 11, 10, 9, 13);
	pop();
}
