const sizeX = 960;
const sizeY = 960;

const cellSize = 64;
const cellAmount = new vec2(8, 13);
const totalWidth = new vec2(cellSize*cellAmount.x, cellSize*cellAmount.y);
const margin = new vec2((sizeX - totalWidth.x)/2, (sizeY - totalWidth.y)/2);
let noiseScale = 0.001;

const grid = new Grid(margin, cellAmount, cellSize);

let hedgeTop: ShadowImage;
let hedgeLeft: ShadowImage;
let hedgeRight: ShadowImage;
let hedgeBottom: ShadowImage;

let benchX: p5.Image;
let benchY: p5.Image;

let grasses: p5.Image[];

let cellCount = 0;
let shadowPass = true;

let benchChance = 0.2;

function preload() {
	hedgeTop = new ShadowImage("hedgeTop");
	hedgeLeft = new ShadowImage("hedgeLeft");
	hedgeRight = new ShadowImage("hedgeRight");
	hedgeBottom = new ShadowImage("hedgeBottom");

	benchX = quickload("benchX");
	benchY = quickload("benchY");

	grasses = [
		quickload("grass1"),
		quickload("grass1.5"),
		quickload("grass2"),
	];
}

function setup(): void {
	let canvasElement = createCanvas(sizeX, sizeY).elt;
	let context = canvasElement.getContext('2d');
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;


	imageMode(CENTER);
	noLoop();
	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(Math.random() * allCells.length)];
	carveMaze(startCell);


	// then add random squares
	let bigSquareAmount = random(2, 5);
	for (let i=0; i<bigSquareAmount; i++) {
		let x = Math.floor(random(1, cellAmount.x-2));
		let y = Math.floor(random(1, cellAmount.y-2));
		let cell = grid.rows[x][y];
		cell.addConnection(grid.rows[x+1][y]);
		cell.addConnection(grid.rows[x][y+1]);

		grid.rows[x][y+1].addConnection(grid.rows[x+1][y+1]);
		grid.rows[x][y+1].addConnection(grid.rows[x][y]);

		grid.rows[x+1][y].addConnection(grid.rows[x+1][y+1]);
		grid.rows[x+1][y].addConnection(grid.rows[x][y]);

		grid.rows[x+1][y+1].addConnection(grid.rows[x+1][y]);
		grid.rows[x+1][y+1].addConnection(grid.rows[x][y+1]);
	}
}

function draw(): void {
	background(200);
	stroke(50);
	noFill();
	// now: draw the grass squares
	for (let x=margin.x-(cellSize*8); x<sizeX; x+=cellSize) {
		for (let y=margin.y-(cellSize*8); y<sizeY; y+=cellSize) {
			let noiseVal = floor(noise(x, y) * 3);
			let grassTex = grasses[noiseVal];
			push();
				translate(x+cellSize/2, y+cellSize/2);
				if (random(0, 1) < 0.5) {
					scale(-1, 1);
				}
				img(grassTex, vec2.zero);
			pop();
		}
	}
	// really really bad mixing of global and local variables here but whatever
	// It Works and it's fine. OK
	shadowPass = true;
	grid.apply(drawCell);
	shadowPass = false;
	grid.apply(drawCell);
}

function drawCell(cell: SquareCell): void {
	// text(cellCount++, cell.worldCoords.x, cell.worldCoords.y);
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
		if (cell.hasConnection(vec2.up) && cell.hasConnection(vec2.down) && !cell.hasConnection(vec2.left) && Math.random() < benchChance) {
			img(benchY, cell.worldCoords);
		}

		if (cell.hasConnection(vec2.left) && cell.hasConnection(vec2.right) && !cell.hasConnection(vec2.up) && Math.random() < benchChance) {
			img(benchX, cell.worldCoords);
		}
		

		// bottom wall
		if (cell.gridCoords.y == grid.gridSize.y-1 && cell.gridCoords.x != grid.gridSize.x-1) {
			hedgeBottom.draw(cell.worldCoords, shadowPass);
		}

		pop();
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

	draw(pos: vec2, shadowPass: boolean = false): void {
		img(shadowPass ? this.shadowTex : this.mainTex, pos);
	}
}

function quickload(imageName: string): p5.Image {
	return loadImage("./assets/hedgemaze/"+imageName+".png");
}

function img(i: p5.Image, worldCoords: vec2) {
	image(i, worldCoords.x, worldCoords.y, cellSize*2, cellSize*2);
}
