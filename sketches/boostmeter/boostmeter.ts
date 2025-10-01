function setup(): void {
	createCanvas(900, 900);
	noLoop();
}

function draw(): void {
	// background(0, 0, 0, 255);
	const totalArc = PI;
	background(color(0, 0, 0, 0));
	translate(450, 450);
	fill(color(20, 20, 20, 200));
	noStroke();
	const dialRadius = 200;
	ellipse(0, 0, dialRadius*2, dialRadius*2);
	// arc(0, 0, 800, 800, -totalArc, 0);

	const n20Color = color(150, 235, 255);
	
	fill(color(255, 255, 255, 255));
	textSize(48);
	textFont("IBM Plex Sans");
	textAlign(CENTER, CENTER);
	stroke(255, 255, 255, 255);

	const radius = dialRadius-90;
	const steps = 4;

	// draw the redline
	// stroke(color(255, 0, 0, 200));
	// strokeWeight(20);
	// strokeCap(SQUARE);
	// noFill();
	// arc(0, 0, 800-17, 800-17, -totalArc * (1000/redline) - 0.005, totalArc * (500/redline)+0.005);

	fill(255, 255, 255, 255);
	// draw full/empty
	// strokeWeight(0);
	// for (let i=0; i<=steps; i++) {
	// 	let frac = (i/steps)*totalArc;
	// 	frac += PI * 0.125;
	// 	push();
	// 		translate(-sin(frac) * radius, cos(frac)*radius);
	// 		text((i/steps) * redline, 0, 0);
	// 	pop();
	// }
	push();
		text("F", 0, -dialRadius+90);
	pop();
	push();
		text("E", 0, dialRadius-90);
	pop();

	push();
		fill(n20Color);
		noStroke();
		textSize(24);
		text("N²O", 100, 0);
	pop();

	// draw the blue full line
	push();
	 	noFill();
		stroke(n20Color);
		strokeWeight(20);
		strokeCap(SQUARE);
		rotate(-PI/4);
		arc(0, 0, dialRadius*2 - 17, dialRadius*2 - 17, -PI/4 - 0.01, -PI/8 + 0.01);
	pop();

	let b = true;
	for (let i=0; i<steps+0.5; i+= 0.5) {
		let frac = (i/steps)*totalArc;
		push();
			translate(sin(frac) * dialRadius, cos(frac)*dialRadius)
			rotate(-(i/steps)*totalArc);
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
