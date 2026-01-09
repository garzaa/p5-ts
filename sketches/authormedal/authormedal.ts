
function setup(): void {
	createCanvas(512, 512);
	noLoop();
}

function draw(): void {
	background(0);
	stroke("#00cdf9");
	strokeWeight(32);
	strokeJoin(ROUND);
	noFill();

	translate(256, 256);

	translate(0, -128-64);
	scale(1, 1.25);
	beginShape();
	vertex(-64, 64);
	vertex(0, 0);
	vertex(64, 64);
	endShape();

	translate(0, 96);

	beginShape();
	vertex(-64, 64);
	vertex(0, 0);
	vertex(64, 64);
	endShape();
}


