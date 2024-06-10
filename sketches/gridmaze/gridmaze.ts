const sizeX = 800;
const sizeY = 800;

const cellSize = 20;

const grid = new Grid(new vec2(200, 200), new vec2(40, 40), 10);

const drawConnections = false;
const drawBorders = false;
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
			stroke(180);
			// draw clockwise
			beginShape();
			cell.getPoints().forEach(v => {
				vertex(v.x, v.y);
			});
			endShape(CLOSE);
		pop();
	}

	if (drawConnections) {
	push();
			stroke("red");
			cell.getConnections().forEach(conn => {
				line(cell.worldCoords.x, cell.worldCoords.y, conn.worldCoords.x, conn.worldCoords.y);
			});
		pop();
	}

	if (drawWalls) {
		push();
			stroke(50);
			// always draw outer lines
			let p = cell.getPoints();

			if (cell.gridCoords.y == 0) {
				vecLine(p[0], p[1]);
			} else if (cell.gridCoords.y == grid.gridSize.y-1) {
				vecLine(p[2], p[3])
			}

			if (cell.gridCoords.x == 0) {
				vecLine(p[3], p[0]);
			} else if (cell.gridCoords.x == grid.gridSize.x-1) {
				vecLine(p[1], p[2]);
			}

			cell.getUnconnectedNeighbors().forEach(c => {
				// only draw top and left walls
				if (c.worldCoords.x < cell.worldCoords.x) {
					vecLine(p[3], p[0])
				}

				if (c.worldCoords.y < cell.worldCoords.y) {
					vecLine(p[0], p[1]);
				}
			})
		pop();
	}
}

function vecLine(a: vec2, b: vec2): void {
	line(a.x, a.y, b.x, b.y);
}
