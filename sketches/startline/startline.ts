
function setup(): void {
	createCanvas(1024, 1024);
	noLoop();
}

function draw(): void {
	// background(0);
	stroke(255);
	strokeWeight(64);
	noFill();

	translate(512, 512);
	beginShape();
	vertex(-128*3, 128);
	vertex(-128*3, 256);
	vertex(-128*2, 256);
	endShape();

	push();
	textSize(128);
	textFont("IBM Plex Sans");
	strokeWeight(4);
	fill(255);
	text("STARTLINE", -256-96, 256+128+32);
	pop();

	push();
		rotate(PI);
		beginShape();
		vertex(-128*3, 128);
		vertex(-128*3, 256);
		vertex(-128*2, 256);
		endShape();

		push();
		textSize(128);
		textFont("IBM Plex Sans");
		strokeWeight(4);
		fill(255);
		text("STARTLINE", -256-96, 256+128+32);
		pop();
	pop();

	strokeWeight(16);
	line(-64, 0, 64, 0);
	line(64, 0, 64-32, 32);
	line(64, 0, 64-32, -32);
}


