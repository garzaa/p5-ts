let grid: HexGrid;

function setup(): void {
	grid = new HexGrid(new vec2(200, 200), new vec2(6, 6), 100);
	createCanvas(800, 800);
	noLoop();
}

function draw(): void {
	noFill();
	background(200);
	stroke(50);
	strokeWeight(1);
	grid.apply(drawCell)
}

function drawCell(cell: HexCell): void {
	let points: vec2[] = cell.getPoints();
	beginShape();
	for (let i=0; i<points.length; i++) {
		vertex(points[i].x, points[i].y);
	}
	endShape(CLOSE);
}
