
// TODO: look at pixels for the control color, if found then add some random scenery there
// TODO: other control pixel colors?
// TODO: pivot point for things should be the center. waste of more pixels but avoids other issues

const cellSize = 128;

const cellAmount = new vec2(16, 16);
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

	constructor(name: string) {
		this.name = name;
		this.corner = new XImage(this.name+"Corner");
		this.cornerB = new XImage(this.name+"CornerB");
		this.cornerT = new XImage(this.name+"CornerT");
		this.pipeH = new XImage(this.name+"PipeH");
		this.pipeV = new XImage(this.name+"PipeV");
		this.empty = new XImage(this.name+"Empty");
		
	}
}

function quickload(imageName: string): p5.Image {
	return loadImage("./assets/forestmaze/"+imageName+".png");
}

class XImage {
	readonly mainTex: p5.Image;
	readonly mainTextures: p5.Image[];

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
}

function setup(): void {
	let p5Canvas = createCanvas(canvasSize.x, canvasSize.y);
	hardscale(p5Canvas);
	imageMode(CENTER);
	textAlign(CENTER);
	noLoop();
	pixelDensity(2);

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
}
