const sizeX = 64 * 15;
const sizeY = 64 * 15;

const cellSize = 32;
const cellAmount = new vec2(24, 24);
const totalWidth = new vec2(cellSize*cellAmount.x, cellSize*cellAmount.y);
const margin = new vec2((sizeX - totalWidth.x)/2, (sizeY - totalWidth.y)/2);
let noiseScale = 0.001;

const grid = new Grid(margin, cellAmount, cellSize);

let hedgeTop: ShadowImage;
let hedgeLeft: ShadowImage;
let hedgeRight: ShadowImage;
let hedgeBottom: ShadowImage;

let benchX: ShadowImage;
let benchY: ShadowImage;

let grasses: p5.Image[];
let flowers: p5.Image;

let cellCount = 0;
let shadowPass = true;

let benchChance = 0.1;
let scenery = new Set<number>();

let shadowBuffer: p5.Graphics;

const bigSquareTree = new Set<string>();

function preload() {
	hedgeTop = new ShadowImage("hedgeTop");
	hedgeLeft = new ShadowImage("hedgeLeft");
	hedgeRight = new ShadowImage("hedgeRight");
	hedgeBottom = new ShadowImage("hedgeBottom");

	benchX = new ShadowImage("benchX");
	benchY = new ShadowImage("benchY");

	grasses = [
		quickload("grass1"),
		quickload("grass1.5"),
		quickload("grass2"),
	];

	flowers = quickload("flowers");
}

function setup(): void {
	let p5Canvas = createCanvas(sizeX, sizeY);
	hardscale(p5Canvas);	

	shadowBuffer = createGraphics(sizeX, sizeY);
	hardscale(shadowBuffer);

	imageMode(CENTER);
	noLoop();
	pixelDensity(1);

	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(random() * allCells.length)];
	carveMaze(startCell);
	carveBigSquares();
}

function carveBigSquares(): void {
	function canMakeSquare(pos: vec2): boolean {
		return !bigSquareTree.has(pos.str());
	}

	// then add random big squares
	let bigSquareAmount = random(2, 5);
	for (let i=0; i<bigSquareAmount; i++) {
		let x = Math.floor(random(2, cellAmount.x-3));
		let y = Math.floor(random(2, cellAmount.y-3));

		if (!canMakeSquare(new vec2(x, y))) {
			console.log("square collision, skipping");
			continue;
		}

		console.log("big box @ "+new vec2(x, y).str());

		for (let j=0; j<3; j++) {
			for (let k=0; k<3; k++) {
				// connect to lower and right neighbors, bidirectionally
				// console.log("connecting cell "+grid.rows[x+j][y+k].gridCoords.str() +" to "+grid.rows[x+j+1][y+k+1].gridCoords.str())
				grid.rows[x+j][y+k].addBiConnection(grid.rows[x+j+1][y+k])
				grid.rows[x+j][y+k].addBiConnection(grid.rows[x+j][y+k+1])
			}
		}

		// then update the collisions
		for (let j=-4; j<7; j++) {
			for (let k=-4; k<7; k++) {
				bigSquareTree.add(new vec2(x+1+j, y+k).str());
			}
		}
	}
}

function hardscale(buffer: p5.Renderer) {
	let canvasElement = buffer.elt;
	let context = canvasElement.getContext('2d');
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
}

function draw(): void {
	background(200);
	stroke(50);
	noFill();
	// draw the grass squares
	for (let x=margin.x-(cellSize*8); x<sizeX; x+=cellSize) {
		for (let y=margin.y-(cellSize*8); y<sizeY; y+=cellSize) {
			let noiseVal = floor(noise(x, y) * 3);
			let grassTex = grasses[noiseVal];
			push();
				translate(x+cellSize/2, y+cellSize/2);
				if (random() < 0.5) {
					scale(-1, 1);
				}
				img(grassTex, vec2.zero);
			pop();
		}
	}

	// draw flowers
	for (let x=margin.x-(cellSize*8); x<sizeX; x+=cellSize) {
		for (let y=margin.y-(cellSize*8); y<sizeY; y+=cellSize) {
			push();
				translate(x+cellSize/2, y+cellSize/2);
				if (noise(x*0.1, y*0.1, 100) < 0.3) {
					if (random() < 0.5) {
						scale(-1, 1);
					}
					img(flowers, vec2.zero);
				}
			pop();
		}
	}

	// really really bad mixing of global and local variables here but whatever
	// It Works and it's fine. OK
	shadowPass = true;
	grid.applyLtR(drawShadow);
	tint(150, 150, 255, 200);
	blendMode(MULTIPLY);
	image(shadowBuffer, sizeX/2 - cellSize, sizeY/2 - cellSize, sizeX, sizeY)
	shadowPass = false;
	cellCount = 0;

	tint("white");
	blendMode(BLEND);
	grid.applyLtR(drawGeometry);
}

function drawShadow(cell: SquareCell) {
	return drawCell(cell, true);
}

function drawGeometry(cell: SquareCell) {
	return drawCell(cell, false);
}


function drawCell(cell: SquareCell, shadowPass: boolean): void {
	push();
		// first pass: top wall
		cell.getUnconnectedNeighbors().forEach(neighbor => {
			if (neighbor.worldCoords.y < cell.worldCoords.y) {
				hedgeTop.draw(cell.worldCoords, shadowPass);
			}
		})
		if (cell.gridCoords.y == 0 && cell.gridCoords.x > 0) {
			hedgeTop.draw(cell.worldCoords, shadowPass);
		}

		// left wall
		cell.getUnconnectedNeighbors().forEach(neighbor => {
			if (neighbor.worldCoords.x < cell.worldCoords.x) {
				hedgeLeft.draw(cell.worldCoords, shadowPass);
			}
		})
		if (cell.gridCoords.x == 0) {
			hedgeLeft.draw(cell.worldCoords, shadowPass);
		}

		// right wall
		if (cell.gridCoords.x == grid.gridSize.x-1) {
			hedgeRight.draw(cell.worldCoords, shadowPass);
		}

		// bench X and Y
		// don't put two benches next to each other
		if (cell.hasConnection(vec2.up)
			&& cell.hasConnection(vec2.down)
			&& !cell.hasConnection(vec2.left)
			&& random() < benchChance
			&& !scenery.has(cell.gridCoords.hash())
		) {
			benchY.draw(cell.worldCoords, shadowPass);
			scenery.add(cell.gridCoords.hash());
			scenery.add(cell.gridCoords.add(vec2.up).hash());
			scenery.add(cell.gridCoords.add(vec2.down).hash());
		}

		if (cell.hasConnection(vec2.left)
			&& cell.hasConnection(vec2.right)
			&& !cell.hasConnection(vec2.up)
			&& random(0, 1) < benchChance
			&& !scenery.has(cell.gridCoords.hash())
		) {
			benchX.draw(cell.worldCoords, shadowPass);
			scenery.add(cell.gridCoords.hash());
			scenery.add(cell.gridCoords.add(vec2.left).hash());
			scenery.add(cell.gridCoords.add(vec2.right).hash());
		}

		// bottom wall
		if (cell.gridCoords.y == grid.gridSize.y-1 && cell.gridCoords.x != grid.gridSize.x-1) {
			hedgeBottom.draw(cell.worldCoords, shadowPass);
		}

	pop();

	// if (!shadowPass) {
	// 	stroke(255);
	// 	text(cell.gridCoords.str(), cell.worldCoords.x - cellSize/4, cell.worldCoords.y-cellSize/4);
	// }

	if (!shadowPass) cellCount++;
}

function vecLine(a: vec2, b: vec2): void {
	line(a.x, a.y, b.x, b.y);
}

class ShadowImage {
	readonly shadowTex: p5.Image;
	readonly mainTex: p5.Image;

	constructor(name: string) {
		this.mainTex= quickload(name);
		this.shadowTex = quickload(name+"Shadow");
	}

	draw(pos: vec2, shadowPass: boolean=false): void {
		if (shadowPass) {
			shadowBuffer.image(this.shadowTex, pos.x, pos.y, cellSize*2, cellSize*2);
		} else {
			image(this.mainTex, pos.x, pos.y, cellSize*2, cellSize*2);
		}
	}
}

function quickload(imageName: string): p5.Image {
	return loadImage("./assets/hedgemaze/"+imageName+".png");
}

function img(i: p5.Image, worldCoords: vec2) {
	image(i, worldCoords.x, worldCoords.y, cellSize*2, cellSize*2);
}
