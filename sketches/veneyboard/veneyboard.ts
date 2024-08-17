// pen plotter is 1/75 inches from start to pen tip with the ruler edge. otherwise it's 2 inches flat
// ok yeah 2 inches flat actually with the ruler edge
const dpi = 96;
const sizeX = 8 * dpi;
const sizeY = 8 * dpi;

const pointSpacing = 50;
const noiseScale = 0.001;
const collisionSize = 6;
const pointDistance = 2;
const cellDimensions = new vec2(4, 4)
const margin = new vec2((sizeX - (cellDimensions.x * dpi)) / 2, (sizeY - (cellDimensions.y * dpi))/ 2);
const maxVertices = 100;

const mazeCellSize = 6;
const drawGreenCellBorders = false;

const exportSVG = false;

const fieldTree = new Quadtree<Circle>({
	width: sizeX,
	height: sizeY,
	x: 0,
	y: 0,
	maxObjects: 10
})

const boardGrid = new Grid(margin, cellDimensions, 1*dpi);

function setup(): void {
	// need this in order to make p5-types play nice with the injected SVG renderer
	// @ts-ignore
	if (exportSVG) createCanvas(sizeX, sizeY, SVG);
	else createCanvas(sizeX, sizeY);
	noLoop();
	strokeWeight(4);
	stroke(50);
	noFill();
	angleMode(RADIANS);
	strokeJoin(ROUND);
}

function draw(): void {
	if (!exportSVG) background(255);
	drawCheckers();
	if (exportSVG) save("checkers.svg")
	if (exportSVG) clear();
	strokeCap(ROUND);
	drawFlowField();
	if (exportSVG) save("flowfield.svg");
}

function drawCheckers(): void {
	stroke("black");
	fill("black");
	strokeCap(PROJECT);
	boardGrid.apply(drawCheckerSquare);
}
	
function drawCheckerSquare(cell: SquareCell) {
	// 0, 0 is black if it's the top right
	// https://veney.xyz/#board
	if (cell.gridCoords.x % 2 == 0) {
		if (cell.gridCoords.y % 2 == 0) {
			makeMaze(cell);
		} else if (drawGreenCellBorders) {
			let p = cell.getPoints();
			if (cell.gridCoords.x == 0) {
				vecLine(p[3], p[0]);
			} 
			
			if (cell.gridCoords.y == cell.grid.rows[cell.gridCoords.x].length - 1) {
				vecLine(p[2], p[3])
			}

			if (cell.gridCoords.x == cell.grid.rows.length - 1) {
				vecLine(p[1], p[2])
			}
		}
	} else {
		if (cell.gridCoords.y % 2 == 1) {
			makeMaze(cell);
		} else if (drawGreenCellBorders) {
			let p = cell.getPoints();
			if (cell.gridCoords.x == cell.grid.rows.length - 1) {
				vecLine(p[3], p[0]);
			}
			
			if (cell.gridCoords.y == cell.grid.rows.length - 1) {
				vecLine(p[2], p[3])
			}

			if (cell.gridCoords.y == 0) {
				vecLine(p[0], p[1]);
			}

			if (cell.gridCoords.x == cell.grid.rows.length - 1) {
				vecLine(p[1], p[2])
			}
		}
	}
}

function makeMaze(cell: SquareCell) {
	// draw a maze inside the cell
	let cellGrid = new Grid(cell.worldCoords.sub(cell.radius), new vec2(dpi/mazeCellSize, dpi/mazeCellSize), mazeCellSize);
	let allCells = cellGrid.getAllCells();
	let startCell = allCells[Math.floor(Math.random() * allCells.length)];
	carveMaze(startCell);
	allCells.forEach(subCell => drawCell(subCell as SquareCell, cellGrid));
}

function drawCell(cell: SquareCell, grid: Grid): void {
	push();
		
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

function drawFlowField(): void {
	stroke("red");
	noFill();
	for (let x=margin.x; x<=sizeX-margin.x; x+=pointSpacing/2 * (noise(x))) {
		for (let y=margin.y; y<=sizeY-margin.y; y+=pointSpacing/2 * noise(x, y)) {
			// ellipse(x, y, 50, 50);
			// draw until it's either:
			// 1. out of bounds
			// 2. intersecting
			let px = x;
			let py = y;
			// don't intersect with self, keep a list of circles to add
			// and do them at the end
			let lineCollision: Array<Circle> = [];
			let vertexCount = 0;
			beginShape();
			while (canMakePoint(px, py, ++vertexCount)) {
				vertex(px, py);
				// drop a circle in the quadtree for that point's intersection
				lineCollision.push(new Circle({
					x: px,
					y: py,
					r: collisionSize
				}));

				// then sample noise to determine next direction
				let noiseVariance = 1 + 0.5*map(noise(px * noiseScale, py * noiseScale, 1000), 0, 1, -1, 5);
				let ang = PI/2 + (PI*(1)*(noise(px * noiseScale * noiseVariance, py * noiseScale * noiseVariance)*2 - 1));
				// then move the angle towards down??
				// move in the direction * 4 px
				px += cos(ang) * pointDistance;
				py += sin(ang) * pointDistance;
			}
			// add the line to the collision quadtree only if it's more than 1 vertex
			if (lineCollision.length > 1) {
				for (let i=0; i<lineCollision.length; i++) {
					fieldTree.insert(lineCollision[i]);
				}
			}
			endShape();
		}
	}
}

function canMakePoint(xPos: number, yPos: number, v: number): boolean {
	// don't put lines in the checkerboards
	// convert from pixels to whether or not it's in a checkerboard square
	// TODO: add a little margin with collisionSize.x
	let squarePos = new vec2(floor((xPos-margin.x) / dpi), floor((yPos-margin.y) / dpi));
	if (squarePos.x % 2 == 0 && squarePos.y % 2 == 0) {
		return false;
	} else if (squarePos.x % 2 == 1 && squarePos.y % 2 == 1) {
		return false;``
	}

	let overlap = fieldTree.retrieve(new Circle({
		x: xPos,
		y: yPos,
		r: collisionSize
	}));

	let hasOverlap = false;

	for (let circle of overlap) {
		let distance = getDistance(circle.x, xPos, circle.y, yPos);
		if (distance < circle.r) {
			hasOverlap = true;
			break;
		}
	}
	
	return xPos >= (0+margin.x) && xPos <= (sizeX-margin.x)
		&& yPos >= (0+margin.y) && yPos <= (sizeY-margin.y)
		&& v < maxVertices
		&& !hasOverlap;
}

function getDistance(x1: number, x2: number, y1: number, y2: number): number {
	let xDist = x2 - x1;
	let yDist = y2 - y1;
	return sqrt(xDist*xDist + yDist*yDist);
}

function vecLine(a: vec2, b: vec2): void {
	line(a.x, a.y, b.x, b.y);
}
