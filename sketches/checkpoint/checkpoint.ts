function setup(): void {
	noLoop();
	createCanvas(512, 512);
}

function draw(): void {
	noStroke();
	background(color(0, 0, 0, 0));
	fill("#30a15d");
	// fill("#b32424")
	rect(0, 0, 512, 96);
	stroke(255);
	strokeWeight(4);
	noFill();
	rect(2, 2, 508, 94, 8);

	textFont("Bebas Neue");
	textAlign(CENTER, CENTER);
	noStroke();
	fill(255);
	textSize(48);
	// text("CHECKPOINT", 512/2, 96/2+6);
	text("START", 512/2, 96/2+6);
}
