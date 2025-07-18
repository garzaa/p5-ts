const cellSize = 256;

const cellAmount = new vec2(12, 12);
const margin = new vec2(0, -cellSize*2);
const canvasSize = cellAmount.scale(cellSize).add(margin);

const grid = new Grid(margin, cellAmount, cellSize);

let isoSize = new vec2(cellAmount.x, cellAmount.y/2).scale(cellSize);
let isoOrigin = new vec2((canvasSize.x/2), (canvasSize.y/2)-(isoSize.y/2));

let d1: number[] = [255, 0, 0];
let d2: number[] = [0, 255, 0];

// now: predefine the image classes for grass etc
class TiledSquare {
	readonly name: string;
	readonly corner: XImage;
	readonly cornerB: XImage;
	readonly cornerT: XImage;
	readonly pipeH: XImage;
	readonly pipeV: XImage;
	readonly empty: XImage;
	readonly cross: XImage;
	readonly endBL: XImage;
	readonly endTL: XImage;
	readonly TBL: XImage;
	readonly TTL: XImage;
	readonly details: p5.Image[][];

	// TODO: figure out a good way to integrate variants for specific tiles
	constructor(name: string, d: p5.Image[][], variants: string[] = null) {
		this.name = name;
		this.details = d;
		this.corner = this.load("Corner");
		this.cornerB = this.load("CornerB");
		this.cornerT = this.load("CornerT");
		this.pipeH = this.load("PipeH");
		this.pipeV = this.load("PipeV");
		this.empty = this.load("Empty");
		this.cross = this.load("Cross");
		this.endBL = this.load("EndBL");
		this.endTL = this.load("EndTL");
		this.TBL = this.load("TBL");
		this.TTL = this.load("TTL");
	}

	private load(imageName: string): XImage {
		// if there's a name in the strings that matches the imageName, grab the number at the end
		return new XImage(this.name+imageName, d1, this.details);
	}
}

function quickload(imageName: string): p5.Image {
	return loadImage("./assets/forestmaze/"+imageName+".png");
}

class XImage {
	readonly name: string;
	readonly mainTex: p5.Image;
	readonly c: number[];
	markedDetails: boolean = false;

	detailCoords: vec2[] = [];
	details: p5.Image[][] = [];

	constructor(name: string, c: number[], details: p5.Image[][]) {
		this.mainTex = quickload(name);
		this.details = details;
		this.c = c;
		this.name = name;
	}

	private markDetails() {
		this.mainTex.loadPixels();
		let p = this.mainTex.pixels;
		for (let i=0; i<this.mainTex.pixels.length; i += 4) {
			if (p[i]==this.c[0] && p[i+1]==this.c[1] && p[i+2]==this.c[2]) {
				let v = new vec2(floor(i/4) % this.mainTex.width, floor(floor(i/4) / this.mainTex.height));
				// convert to distance from center
				v = v.add(new vec2(-this.mainTex.width/2, -this.mainTex.height/2));
				this.detailCoords.push(v);
			}
		}
		this.markedDetails = true;
	}

	// TODO: separate detail pass....pain...
	draw(pos: vec2, flipped: boolean = false): void {
		if (!this.markedDetails) this.markDetails();

		push();
			translate(pos.x, pos.y);
			if (flipped) scale(-1, 1);
			image(this.mainTex, 0, 0, cellSize, cellSize);
			this.detailCoords.forEach(v => {
				// get noise from the position
				let c = 0.005;
				let n = Math.round(noise((pos.x+v.x) * c, (pos.y+v.y) * c) * this.details.length);
				let d1 = this.details[n]
				let d: p5.Image = d1[Math.floor(Math.random() * d1.length)]
				push();	
					translate(v.x, v.y);
					if (random() > 0.5) {
						scale(-1, 1);
					}
					image(d, 0, 0, d.width, d.height);
				pop();
			})
		pop();
	}
}

let grass: TiledSquare;
let treeDetails: p5.Image[];
let rockDetails: p5.Image[];
let flowerDetails: p5.Image[];

function preload(): void {
	treeDetails = [
		quickload("tree1"),
		quickload("tree2"),
		quickload("tree3"),
	];
	rockDetails = [
		quickload("rock1"),
		quickload("rock1"),
		quickload("rock4"),
		quickload("rock4"),
		quickload("rock4"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("empty"),
		quickload("rock4"),
		quickload("rock2"),
		quickload("rock2"),
		quickload("rock3"),
	];
	flowerDetails = [
		quickload("flowers1"),
		quickload("flowers2"),
		quickload("flowers3"),
	]
	grass = new TiledSquare("grass", [treeDetails, treeDetails, rockDetails, flowerDetails]);
}

function setup(): void {
	let p5Canvas = createCanvas(canvasSize.x, canvasSize.y);
	hardscale(p5Canvas);
	imageMode(CENTER);
	textAlign(CENTER);
	noLoop();

	const allCells = grid.getAllCells();
	const startCell = allCells[Math.floor(random() * allCells.length)];
	carveMaze(startCell);
	// remove all cells with dead ends
	grid.getAllCells().forEach(cell => {
		if (cell.connections.size == 1) {
			console.log(cell.getConnections().length);
			let other = cell.getConnections()[0];
			other.removeConnection(cell);
			cell.removeConnection(other);
			console.log(cell);
		}
	});
}

function draw(): void {
	background(200);
	stroke(50);
	noFill();

	// draw grass squares
	grid.applyIso(drawCell);
}

function drawCell(cell: SquareCell) {
	let isoCoords = stoi(cell.gridCoords, cellSize, isoOrigin);
	let sum = new vec2(0, 0);
	cell.getConnections().forEach(otherCell => {
		sum = sum.add(otherCell.gridCoords.sub(cell.gridCoords));
	})

	let connections = cell.getConnections();
	switch (connections.length) {
		case 0:
			grass.empty.draw(isoCoords);
		case 1:
			console.log("checking connections for: ");
			console.log(connections)
			console.log(cell.getConnections())
			console.log(cell.connections)
			if (connections[0] === undefined) {
				grass.empty.draw(isoCoords);
				break;
			}
			let v = connections[0].gridCoords;
			if (v.x < cell.gridCoords.x) {
				grass.endTL.draw(isoCoords);
			} else if (v.x > cell.gridCoords.x) {
				grass.endBL.draw(isoCoords, true);
			} else if (v.y > cell.gridCoords.y) {
				grass.endBL.draw(isoCoords);
			} else if (v.y < cell.gridCoords.y) {
				grass.endTL.draw(isoCoords, true);
			}
			break;
		case 2:
			// now decide if it's a pipe or a corner
			if (sum.sqrMagnitude() == 0) {
				// then it's a pipe
				// look at connection direction for first one
				// if no X difference, draw the pipe on the Y axis
				if (abs(connections[0].gridCoords.x - cell.gridCoords.x) == 0) {
					grass.pipeV.draw(isoCoords);
				} else {
					// otherwise, pipe on Y axis
					grass.pipeH.draw(isoCoords);
				}
			} else {
				// now tne fun part: drawing corners
				let x = sum.x;
				let y = sum.y;
				if (x > 0 && y > 0) {
					grass.cornerB.draw(isoCoords);
				} else if (x > 0 && y < 0) {
					grass.corner.draw(isoCoords, true);
				} else if (x < 0 && y < 0) {
					grass.cornerT.draw(isoCoords);
				} else if (x < 0 && y > 0) {
					grass.corner.draw(isoCoords);
				}
			}
			break;
		case 3: 
			// make a T depending on where the sum is pointing
			if (sum.x < 0) {
				grass.TTL.draw(isoCoords);
			} else if (sum.x > 0) {
				grass.TBL.draw(isoCoords, true);
			} else if (sum.y < 0) {
				grass.TTL.draw(isoCoords, true);
			} else if (sum.y > 0) {
				grass.TBL.draw(isoCoords);
			}
			break;
		case 4:
			grass.cross.draw(isoCoords);
			break;
	}
	// text(connections.length + ": " + sum.str(), isoCoords.x, isoCoords.y+64);
}
