const cellSize = 128;

const sizeX = 64 * 16;
const sizeY = 64 * 16;

const cellAmount = new vec2(6, 6);
const totalWidth = new vec2(cellSize*cellAmount.x, cellSize*cellAmount.y);
const margin = new vec2((sizeX - totalWidth.x)/2, (sizeY - totalWidth.y)/2);
let noiseScale = 0.001;

const grid = new Grid(margin, cellAmount, cellSize);

let cellSquare: XImage;

let cellCount = 0;
let shadowPass = true;

let shadowBuffer: p5.Graphics;

let isoSize = new vec2(cellAmount.x, cellAmount.y/2).scale(cellSize);
// half isosize up from center
let isoOrigin = new vec2((sizeX/2), (sizeY/2)-(isoSize.y/2));

let wallTopRight: XImage;
let wallBottomRight: XImage;
let wallTopLeft: XImage;
let wallBottomLeft: XImage;


const bigSquares = new Set<string>();

function preload() {
	cellSquare = new XImage("cellBase");
	wallTopRight = new XImage("wallTopRight");
	wallBottomRight = new XImage("wallBottomRight");
	wallTopLeft = new XImage("wallTopLeft");
	wallBottomLeft = new XImage("wallBottomLeft");
}

function setup(): void {
	let p5Canvas = createCanvas(sizeX, sizeY);
	hardscale(p5Canvas);	

	shadowBuffer = createGraphics(sizeX, sizeY);
	hardscale(shadowBuffer);

	imageMode(CENTER);
	textAlign(CENTER);
	noLoop();
	pixelDensity(1);

	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(random() * allCells.length)];
	carveMaze(startCell);
	// carveBigSquares();
}

function carveBigSquares(): void {
	function canMakeSquare(pos: vec2): boolean {
		return !bigSquares.has(pos.str());
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
				bigSquares.add(new vec2(x+1+j, y+k).str());
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
	background(50);
	stroke(50);
	noFill();
	// draw the basic squares
	for (let x=margin.x-(cellSize*8); x<sizeX; x+=cellSize) {
		for (let y=margin.y-(cellSize*8); y<sizeY; y+=cellSize) {
			push();
				translate(x+cellSize/2, y+cellSize/2);
				if (random() < 0.5) {
					scale(-1, 1);
				}
			pop();
		}
	}

	// draw geometry
	grid.applyIso(drawFloor);
	grid.applyIso(drawGeometry);
}

function drawShadowPass(): void {
	// really really bad mixing of global and local variables here but whatever
	// It Works and it's fine. OK
	shadowPass = true;
	grid.applyLtR(drawShadow);
	push();
	tint(150, 150, 255, 200);
	blendMode(MULTIPLY);
	image(shadowBuffer, sizeX/2 - cellSize, sizeY/2 - cellSize, sizeX, sizeY)
	shadowPass = false;
	pop();
}

function drawShadow(cell: SquareCell) {
	return drawCell(cell, true);
}

function drawGeometry(cell: SquareCell) {
	return drawCell(cell, false);
}

function drawFloor(cell: SquareCell): void {
	let isoCoords = squareToIso(cell.gridCoords);
	cellSquare.draw(isoCoords, shadowPass);
}

function drawCell(cell: SquareCell, shadowPass: boolean): void {
	let isoCoords = squareToIso(cell.gridCoords);
	// cellSquare.draw(isoCoords, shadowPass);

	push();
		cell.getUnconnectedNeighbors().forEach(neighbor => {
			if (neighbor.gridCoords.y < cell.gridCoords.y) {
				wallTopRight.draw(isoCoords, shadowPass);
			} else if (neighbor.gridCoords.x < cell.gridCoords.x) {
				wallTopLeft.draw(isoCoords, shadowPass);
			} else if (neighbor.gridCoords.y > cell.gridCoords.y) {
				wallBottomLeft.draw(isoCoords, shadowPass);
			} else if (neighbor.gridCoords.x > cell.gridCoords.x) {
				wallBottomRight.draw(isoCoords, shadowPass);
			}
		})

		// top wall
		if (cell.gridCoords.y == 0 && cell.gridCoords.x > 0) {
			wallTopRight.draw(isoCoords, shadowPass);
		}

		// left wall
		if (cell.gridCoords.x == 0) {
			wallTopLeft.draw(isoCoords, shadowPass);
		}

		// right wall
		if (cell.gridCoords.x == grid.gridSize.x-1) {
			wallBottomRight.draw(isoCoords, shadowPass);
		}

		// bottom wall
		if (cell.gridCoords.y == grid.gridSize.y-1 && cell.gridCoords.x != grid.gridSize.x-1) {
			wallBottomLeft.draw(isoCoords, shadowPass);
		}

	// pop();

	stroke(50);
	rectMode(CENTER);
	// hmm, maybe this needs to be an IsoGrid...pain?
	// just do it sloppy for now and then refactor it\
	// img(cellSquare, isoCoords);

	// if (!shadowPass) {
	// 	stroke(255);
	// 	text(cellCount++, isoCoords.x, isoCoords.y+cellSize/4);
	// }
}

function squareToIso(gridPos: vec2): vec2 {
	// on an n*n grid rotated 45 degrees clockwise
	// 0, 0 needs to be in the middle top
	// 0, n is middle left
	// n, 0 is middle right
	// n, n is bottom
	// start at top middle
	// move right: x/2
	// move left: y/2
	// move down: x/4
	// move down: y/4;
	let x = isoOrigin.x;
	x += gridPos.x/2 * cellSize;
	x -= gridPos.y/2 * cellSize;

	let y = isoOrigin.y;
	y += gridPos.x/4 * cellSize;
	y += gridPos.y/4 * cellSize;

	return new vec2(x, y);
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
	return loadImage("./assets/dungeon/"+imageName+".png");
}

function img(i: p5.Image, worldCoords: vec2) {
	image(i, worldCoords.x, worldCoords.y, cellSize*2, cellSize*2);
}

class XImage {
	readonly mainTex: p5.Image;

	constructor(name: string) {
		this.mainTex = quickload(name);
	}

	draw(pos: vec2, shadowPass: boolean=false): void {
		// if (shadowPass) {
		// 	shadowBuffer.image(this.shadowTex, pos.x, pos.y, cellSize*2, cellSize*2);
		// } else {
			image(this.mainTex, pos.x, pos.y, cellSize*2, cellSize*2);
		// }
	}
}
