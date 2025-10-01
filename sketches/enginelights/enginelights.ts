function setup(): void {
	createCanvas(800, 800);
	noLoop();
}

function target(x: number, y: number, width: number, height: number): void {
	push();
		stroke("red");
		rect(x, y, width, height)
	pop();
}

function draw(): void {
	background(color(0, 0, 0, 0));
	// background(color(0, 0, 0, 255));

	strokeWeight(5);
	translate(10, 0);
	strokeCap(PROJECT);
	push();
		scale(20);
		stroke(color(252, 209, 68));
		strokeWeight(0.5);
		strokeJoin(ROUND);
		strokeCap(ROUND);
		noFill();
		beginShape();
		vertex(1, 3);
		vertex(2, 3);
		vertex(3, 2);
		vertex(7, 2);
		vertex(7, 3);
		vertex(8, 3);
		vertex(8, 4);
		vertex(9, 4);
		vertex(9, 3);
		vertex(10, 3);
		vertex(10, 6);
		vertex(9, 6);
		vertex(9, 5);
		vertex(8, 5)
		vertex(8, 6);
		vertex(7, 7);
		vertex(4, 7);
		vertex(3, 6);
		vertex(1, 6);
		endShape(CLOSE);
		line(0, 4.5, 1, 4.5);
		line(0, 3, 0, 6);
		line(3, 1, 7, 1);
		line(5, 1, 5, 2);
	pop();

	push();
		translate(300, 0);
		scale(20);
		stroke(color(252, 209, 68));
		strokeWeight(0.5);
		noFill();
		ellipse(5, 5, 6, 6);
		// @ts-ignore
		drawingContext.setLineDash([0.5, 1.45]);
		ellipse(5, 5, 6.9, 6.9)

		strokeCap(ROUND);
		fill(color(252, 209, 68));
		translate(5, 5);
		drawingContext.setLineDash([]);
		ellipse(-0.2, 1.5, 1, 1);
		strokeWeight(0.75);
		line(-0.2, 1.5, -0.2, -1.75);

		strokeWeight(0.5);
		strokeCap(SQUARE);
		translate(0, -0.5);
		line(-0.5, 0, 1.2, 0);
		line(-0.5, -0.7, 1.2, -0.7);
		line(-0.5, 0.7, 1.2, 0.7);
	pop();

	push();
		translate(20, 200);
		fill(color(252, 68, 68));
		noStroke();
		textFont("Bebas Neue");
		textAlign(CENTER, CENTER);
		textSize(32);
		text("TCS", 0, 0);
		text("LCS", 50, 0);
	pop();

	push();
		translate(500, 0);
		scale(20);
		stroke(color(252, 68, 68));
		noFill();
		translate(5, 5);
		strokeWeight(0.5);
		ellipse(0, 0, 5.5, 5.5);
		strokeCap(ROUND);
		arc(0, 0, 7, 7, -PI/4, PI/4);
		arc(0, 0, 7, 7, -PI/4 - PI, PI/4 - PI);
		
		fill(color(252, 68, 68));
		noStroke();
		ellipse(0, 1.5, 1, 1);
		stroke(color(252, 68, 68));
		strokeWeight(0.75);
		strokeCap(ROUND);
		line(0, 0.25, 0, -1.75);
	pop();

	const n20Color = color(150, 235, 255);
	push();
		translate(0, 200);
		scale(20);
		stroke(n20Color);
		strokeWeight(0.5);
		strokeJoin(ROUND);
		strokeCap(ROUND);
		noFill();
		translate(5, 5);
		triangle(0, -2, 4, 5, -4, 5);
		ellipse(0, 3.8, 0.5, 0.5);
		strokeWeight(0.8);
		line(0, 0.5, 0, 2.4);
	pop();
}
