const sizeX = 800;
const sizeY = 800;

const cellSize = 20;

const grid = new Grid(new vec2(0, 0), new vec2(sizeX/cellSize, sizeY/cellSize), 10);

const drawConnections = true;
const drawBorders = true;
const drawWalls = true;

function setup(): void {
	createCanvas(sizeX, sizeY);
	noLoop();
	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(Math.random() * allCells.length)];
	carveMaze(startCell);
}

function draw(): void {
	background(200);
	stroke(50);
	noFill();
	grid.apply(drawCell);
}

function drawCell(cell: SquareCell): void {
	if (drawBorders) {
		push();
			translate(cell.worldCoords.x, cell.worldCoords.y);
			stroke(180);
			// draw clockwise
			beginShape();
				vertex(-cell.radius.x, -cell.radius.y);
				vertex(cell.radius.x, -cell.radius.y);
				vertex(cell.radius.x, cell.radius.y);
			endShape(CLOSE);
		pop();
	}

	if (drawConnections) {
		push();
			stroke("red");
			cell.getConnections().forEach(conn => {
				line(cell.worldCoords.x, cell.worldCoords.y, conn.worldCoords.x, conn.worldCoords.y);
			})
		pop();
	}
}
