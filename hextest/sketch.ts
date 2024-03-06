let grid: HexGrid;

function setup(): void {
	grid = new HexGrid(new vec2(100, 100), new vec2(6, 6), 100);
	createCanvas(800, 800);
	noLoop();
}

function draw(): void {
	noFill();
	background(200);
	stroke(50);
	strokeWeight(1);
	grid.apply(drawCell);

	let v: vec2 = grid.rows[3][3].worldCoords;
	stroke("#ff0000");
	ellipse(v.x, v.y, 10, 10);
	let neighbors: Cell[] = grid.rows[3][3].getNeighbors();
	neighbors.forEach(x => debugCell(x as HexCell));
}

function drawCell(cell: HexCell): void {
	let points: vec2[] = cell.getPoints();
	beginShape();
	for (let i=0; i<points.length; i++) {
		vertex(points[i].x, points[i].y);
	}
	endShape(CLOSE);
}

function debugCell(cell: HexCell): void {
	stroke("#ffff00")
	ellipse(cell.worldCoords.x, cell.worldCoords.y, 10, 10);
}
