let grid: HexGrid;

const drawConnections = false;
const drawBorders = false;
const drawWalls = true;
const drawCoords = false;
const distortStrength = 1;

const canvasSize = 1000;
const canvasMiddle: vec2 = new vec2(canvasSize/2, canvasSize/2);

let pg: p5.Graphics;

function setup(): void {
	createCanvas(canvasSize, canvasSize);
	noLoop();
	textAlign(CENTER);
	textSize(14);
	pixelDensity(1);

	pg = createGraphics(canvasSize, canvasSize);
	
	grid = new HexGrid(new vec2(200, 200), new vec2(30, 35), 25);
	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(Math.random() * allCells.length)];
	carveMaze(startCell);
}

function draw(): void {
	background(10);
	stroke(200);
	pg.strokeWeight(3);
	noFill();
	
	grid.apply(drawCell);
	translate(-50, -50);
	image(pg, 0, 0, canvasSize, canvasSize);
	filter(BLUR, 5);
	translate(-50, -50);
	image(pg, 0, 0, canvasSize, canvasSize);
}

function drawCell(cell: HexCell): void {
	let points: vec2[] = cell.getPoints();
	if (drawBorders) {
		push();
			stroke(180);
			beginShape();
			for (let i=0; i<4; i++) {
				vertex(points[i].x, points[i].y);
			}
			endShape();
		pop();
	}
	
	if (drawConnections) {
		push();
			stroke("#ff0000");
			cell.getConnections().forEach(conn => {
				vec2lineD(cell.worldCoords, conn.worldCoords);
			})
		pop();
	}

	// actually, let's put some text there. lol
	if (drawCoords) {
		push();
			fill(20);
			text(cell.gridCoords.str(), cell.worldCoords.x, cell.worldCoords.y);
		pop();
	}

	// ok, now draw the neighbors
	if (drawWalls) {
		push();
			if (cell.gridCoords.y == 0){
				// if it's at the top row, always draw the top two
				vec2lineD(points[4], points[5]);
				vec2lineD(points[5], points[0]);
			} else if (cell.gridCoords.y == grid.gridSize.y-1) {
				// same for bottom two
				vec2lineD(points[1], points[2]);
				vec2lineD(points[2], points[3]);
			}

			if (cell.gridCoords.x == 0) {
				vec2lineD(points[3], points[4]);
				if (!cell.odd) {
					vec2lineD(points[2], points[3]);
					vec2lineD(points[4], points[5]);
				}
			} else if (cell.gridCoords.x == grid.gridSize.x-1) {
				if (cell.odd) {
					vec2lineD(points[5], points[0]);
					vec2lineD(points[1], points[2]);
				}
				vec2lineD(points[0], points[1]);
			}
		
			cell.getUnconnectedNeighbors().forEach(n => {
				// only draw walls on the left three
				if (n.worldCoords.x > cell.worldCoords.x) return;

				// midpoint between the two
				let dir: vec2 = cell.worldCoords.sub(n.worldCoords);
				let midpoint: vec2 = n.worldCoords.add(
					dir.scale(0.5)
				);

				// now draw the wall between them
				// vector orthogonal to the direction - dir rotated 90 degrees
				// ortho magnitude is cellSize - to get to a wall length it has to be sqrt(3)/2
				let ortho: vec2 = new vec2(dir.y, -dir.x).scale(sqrt(3)/6);
				let start: vec2 = midpoint.add(ortho.scale(-1));
				let end: vec2 = midpoint.add(ortho);
				stroke(200);
				vec2lineD(start, end);
			})
		pop();
	}
}

function debugCell(cell: HexCell): void {
	stroke("#ffff00")
	ellipse(cell.worldCoords.x, cell.worldCoords.y, 10, 10);
}

function vec2lineD(start: vec2, end: vec2) {
	pg.beginShape();
	let distanceFromMiddle: number = sqrt(abs(canvasMiddle.sub(start).sqrMagnitude()));
	let totalPossibleDistance: number = canvasSize/2 - 100; // since it's an 800px canvas and there's a 100px margin
	let closenessToMiddle: number = abs(1 - (distanceFromMiddle/totalPossibleDistance));
	console.log(closenessToMiddle);
	pg.stroke(255);
	for (let i=0; i<20; i++) {
		let v: vec2 = new vec2(lerp(start.x, end.x, i/19), lerp(start.y, end.y, i/19));
		distanceFromMiddle = sqrt(abs(canvasMiddle.sub(v).sqrMagnitude()));
		totalPossibleDistance = canvasSize/2 - 100; // since it's an 800px canvas and there's a 100px margin
		closenessToMiddle = max(1 - (distanceFromMiddle/totalPossibleDistance), 0);
		v = v.distort(0, 0.001, 100 * closenessToMiddle * distortStrength);
		v = v.distort(0, 0.002, 150 * closenessToMiddle * distortStrength);
		pg.vertex(v.x, v.y);
	}
	pg.endShape();
}
