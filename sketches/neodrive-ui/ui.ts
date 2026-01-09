
function setup(): void {
	createCanvas(1000, 1000);
	noLoop();
}

function draw(): void {
	// background(0);
	noStroke();
	fill(255);

	beginShape();
	vertex(0, 100);
	vertex(30, 0);
	vertex(330, 0);
	vertex(300, 100);
	endShape(CLOSE);

	push();
		translate(400, 8);
		noFill();
		stroke(255);
		strokeWeight(8);
		vertex(0, 100);
		vertex(30, 0);
		vertex(330, 0);
		vertex(300, 100);
		endShape(CLOSE);
	pop();

	push();
	translate(750, 10);
	beginShape();
	vertex(0, 0);
	vertex(0, 80);
	vertex(70, 40);
	endShape(CLOSE);
	pop();

	push();
		translate(900, 60);
		
		stroke(255);
		noFill();
		strokeWeight(16);
		
		beginShape();
		vertex(-20, 0);
		vertex(0, 20);
		vertex(30, -40);
		endShape();
	pop();

	push();
		translate(50, 150);
		stroke(255);
		noFill();
		strokeWeight(16);
		beginShape();
		vertex(-20, 0);
		vertex(0, 10);
		vertex(20, 0);
		endShape();

	pop();
}


