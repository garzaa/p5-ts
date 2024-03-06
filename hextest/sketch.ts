let grid: HexGrid;

const drawConnections = true;
const drawBorders = false;
const drawWalls = true;
const drawCoords = false;

let theShader: p5.Shader;

function preload(): void {
	theShader = loadShader("../assets/shaders/basic.vert", "../assets/shaders/basic.frag");
}

function setup(): void {
	createCanvas(800, 800, WEBGL);
	noLoop();
	textAlign(CENTER);
	textSize(14);
	pixelDensity(2);

	grid = new HexGrid(new vec2(100, 100), new vec2(6, 6), 100);
	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(Math.random() * allCells.length)];
	carveMaze(startCell);
}

function draw(): void {
	theShader.setUniform('u_resolution', [width, height]);
	shader(theShader);

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
				line(cell.worldCoords.x, cell.worldCoords.y, conn.worldCoords.x, conn.worldCoords.y);
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
				vec2line(points[4], points[5]);
				vec2line(points[5], points[0]);
			} else if (cell.gridCoords.y == grid.gridSize.y-1) {
				// same for bottom two
				vec2line(points[1], points[2]);
				vec2line(points[2], points[3]);
			}

			if (cell.gridCoords.x == 0) {
				vec2line(points[3], points[4]);
				if (!cell.odd) {
					vec2line(points[2], points[3]);
					vec2line(points[4], points[5]);
				}
			} else if (cell.gridCoords.x == grid.gridSize.x-1) {
				if (cell.odd) {
					vec2line(points[5], points[0]);
					vec2line(points[1], points[2]);
				}
				vec2line(points[0], points[1]);
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
				stroke(20);
				line(start.x, start.y, end.x, end.y);
			})
		pop();
	}
}

function debugCell(cell: HexCell): void {
	stroke("#ffff00")
	ellipse(cell.worldCoords.x, cell.worldCoords.y, 10, 10);
}
