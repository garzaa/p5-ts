
// TODO: look at pixels for the control color, if found then add some random scenery there
// TODO: other control pixel colors?
// TODO: pivot point for things should be the center. waste of more pixels but avoids other issues

const cellSize = 256;

const cellAmount = new vec2(8, 8);
const margin = new vec2(2*cellSize, 2*cellSize);
const canvasSize = cellAmount.scale(cellSize).add(margin);

const grid = new Grid(margin, cellAmount, cellSize);

let isoSize = new vec2(cellAmount.x, cellAmount.y/2).scale(cellSize);
// half isosize up from center
let isoOrigin = new vec2((canvasSize.x/2), (canvasSize.y/2)-(isoSize.y/2));

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

	constructor(name: string) {
		// TODO: add another constructor with control pixels
		// and quickloading to pass them through to the function
		this.name = name;
		this.corner = new XImage(this.name+"Corner");
		this.cornerB = new XImage(this.name+"CornerB");
		this.cornerT = new XImage(this.name+"CornerT");
		this.pipeH = new XImage(this.name+"PipeH");
		this.pipeV = new XImage(this.name+"PipeV");
		this.empty = new XImage(this.name+"Empty");
		this.cross = new XImage(this.name+"Cross");
		this.endBL = new XImage(this.name+"EndBL");
		this.endTL = new XImage(this.name+"EndTL");
		this.TBL = new XImage(this.name+"TBL");
		this.TTL = new XImage(this.name+"TTL");
	}
}

function quickload(imageName: string): p5.Image {
	return loadImage("./assets/forestmaze/"+imageName+".png");
}

class XImage {
	readonly mainTex: p5.Image;
	readonly mainTextures: p5.Image[];

	// TODO: preload pixels with object modifiers, then calculate when to do it via Draw

	constructor(name: string, numImages: number=1) {
		this.mainTextures = [];
		if (numImages > 1) {
			for (let i=1; i<=numImages; i++) {
				this.mainTextures.push(quickload(name+""+i))
			}
		} else {
			this.mainTex = quickload(name);
		}
	}

	draw(pos: vec2): void {
		if (this.mainTex) image(this.mainTex, pos.x, pos.y, cellSize, cellSize);
		else image(this.mainTextures[floor(random(0, this.mainTextures.length))], pos.x, pos.y, cellSize*2, cellSize*2);
	}

	drawFlipped(pos: vec2): void {
		push();
			translate(pos.x, pos.y);
			scale(-1, 1);
			this.draw(new vec2(0, 0));
		pop();
	}
}

let grass: TiledSquare;

function preload(): void {
	grass = new TiledSquare("grass"); 
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
	// ok, now actually draw the damn thing. LOL
	// ok maybe instead of matching based on neighbors, combine them and
	// average the vectors? hmmmm mmmmmm
	// that would give a unique direction
	// except of course if they average out...LOL
	// or wait...USE WORLD COORDS FOR THAT SINCE IT'S ISO LOL
	// wait no same problem. damn
	// maybe make positive ones worth twice as much?

	// maybe also branch based on number of connections: zero, one, two, three, four
	// ok that's maybe more doable
	let sum = new vec2(0, 0);
	cell.getConnections().forEach(otherCell => {
		let toAdd = otherCell.gridCoords.sub(cell.gridCoords);
		if (toAdd.x > 0)  toAdd.x *= 2;
		if (toAdd.y > 0) toAdd.y *= 4;
		sum = sum.add(otherCell.gridCoords.sub(cell.gridCoords));
	})

	let connections = cell.getConnections();
	switch (connections.length) {
		case 0:
			grass.empty.draw(isoCoords);
		case 1:
			let v = connections[0].gridCoords;
			if (v.x < cell.gridCoords.x) {
				grass.endTL.draw(isoCoords);
			} else if (v.x > cell.gridCoords.x) {
				grass.endBL.drawFlipped(isoCoords);
			} else if (v.y > cell.gridCoords.y) {
				grass.endBL.draw(isoCoords);
			} else if (v.y < cell.gridCoords.y) {
				grass.endTL.drawFlipped(isoCoords);
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
					grass.corner.drawFlipped(isoCoords);
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
				grass.TBL.drawFlipped(isoCoords);
			} else if (sum.y < 0) {
				grass.TTL.drawFlipped(isoCoords);
			} else if (sum.y > 0) {
				grass.TBL.draw(isoCoords);
			}
			break;
		case 4:
			grass.cross.draw(isoCoords);
			break;
	}
	text(connections.length + ": " + sum.str(), isoCoords.x, isoCoords.y+64);
}
