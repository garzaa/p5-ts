let grid: HexGrid;

const drawConnections = true;
const drawBorders = true;
const drawWalls = true;

function setup(): void {
	createCanvas(800, 800);
	noLoop();
	textAlign(CENTER);	textSize(14);

	grid = new HexGrid(new vec2(100, 100), new vec2(6, 6), 100);
	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(Math.random() * allCells.length)];
	carveMaze(startCell);
}

function draw(): void {
	noFill();
	background(200);
	stroke(50);
	strokeWeight(1);
	grid.apply(drawCell);
}

function drawCell(cell: HexCell): void {
	let points: vec2[] = cell.getPoints();
	if (drawBorders) {
		push();
			stroke(180);
			beginShape();
			for (let i=0; i<points.length; i++) {
				vertex(points[i].x, points[i].y);
			}
			endShape(CLOSE);
		pop();
	}
	
	if (drawConnections) {
		push();
			stroke("#ff0000");
			cell.getConnections().forEach(conn => {
				line(cell.worldCoords.x, cell.worldCoords.y, conn.worldCoords.x, conn.worldCoords.y);
			})
		pop();
	}

	// actually, let's put some text there. lol
	push();
		fill(20);
		text(cell.gridCoords.str(), cell.worldCoords.x, cell.worldCoords.y);
	pop();

	// ok, now draw the neighbors
	if (drawWalls) {
		push();
			cell.getUnconnectedNeighbors().forEach(n => {
				// midpoint between the two
				let midpoint:vec2 = n.worldCoords.add(
					cell.worldCoords.sub(n.worldCoords).scale(0.5)
				);
				stroke("#00ffff");
				ellipse(midpoint.x, midpoint.y, 5, 5);
			})
		pop();
	}
}

function debugCell(cell: HexCell): void {
	stroke("#ffff00")
	ellipse(cell.worldCoords.x, cell.worldCoords.y, 10, 10);
}
