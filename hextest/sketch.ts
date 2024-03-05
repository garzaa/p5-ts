let grid: HexGrid;

function setup(): void {
	grid = new HexGrid(new vec2(400, 400), new vec2(600, 600), 100);
	createCanvas(800, 800);
}

function draw(): void {
	noFill();
	background(200);
	stroke(50);
	strokeWeight(5);
	translate(400, 400);
	ellipse(0, 0, 20, 20);
}
