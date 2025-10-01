function setup(): void {
	createCanvas(900, 900);
	noLoop();
}

// TODO: forget about all this bullshit, do a 270 degree arc with gears in the bottom right. god
// GOD
function draw(): void {
	const redline = 180;
	const totalArc = TWO_PI*0.75;
	background(color(0, 0, 0, 0));
	translate(450, 450);
	fill(color(20, 20, 20, 200));
	noStroke();
	ellipse(0, 0, 800, 800);
	// arc(0, 0, 800, 800, -totalArc, 0);
	
	fill(color(255, 255, 255, 255));
	textSize(48);
	textFont("IBM Plex Sans");
	textAlign(CENTER, CENTER);
	stroke(255, 255, 255, 255);

	const radius = 400-90;
	const steps = redline/20;

	// draw the redline
	// stroke(color(255, 0, 0, 200));
	// strokeWeight(20);
	// strokeCap(SQUARE);
	// noFill();
	// arc(0, 0, 800-17, 800-17, -totalArc * (1000/redline) - 0.005, totalArc * (500/redline)+0.005);

	fill(255, 255, 255, 255);
	// draw numbers
	strokeWeight(0);
	for (let i=0; i<=steps; i++) {
		let frac = (i/steps)*totalArc;
		push();
			translate(-sin(frac) * radius, cos(frac)*radius);
			text((i/steps) * redline, 0, 0);
		pop();
	}

	let b = true;
	for (let i=0; i<steps+1; i+= 0.5) {
		let frac = (i/steps)*totalArc;
		push();
			translate(-sin(frac) * 400, cos(frac)*400)
			rotate((i/steps)*totalArc);
			strokeWeight(5);
			strokeCap(SQUARE);
			stroke(color(255, 255, 255, 100));
			if (b) {
				line(0, 0, 0, -40);
			} else {
				line(0, 0, 0, -30);
			}
			b = !b;
		pop();
	}
}
