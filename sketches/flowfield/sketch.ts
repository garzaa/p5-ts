// import { Quadtree } from "@timohausmann/quadtree-ts"
// import { Circle } from "@timohausmann/quadtree-ts";

const pointSpacing = 10;
const noiseScale = 1;
const lineSpacing = 3;
const pointDistance = 5;

const fieldTree = new Quadtree({
	width: 800,
	height: 800,
	x: 0,
	y: 0,
	maxObjects: 10
})

function setup(): void {
	createCanvas(800, 800);
	noLoop();
	strokeWeight(5);
	stroke(0xff0000);
	noFill();
}

function draw(): void {
	console.log("unga bunga!");
	background(200);
	for (let x=0; x<800; x+=pointSpacing) {
		for (let y=0; y<800; y+=pointSpacing) {
			// draw until it's either:
			// 1. out of bounds
			// 2. intersecting
			let px = x;
			let py = y;
			beginShape(POINTS);
			// don't intersect with self, keep a list of circles to add
			// and do them at the end
			let lineCollision: Array<Circle> = [];
			while (canMakePoint(px, py)) {
				vertex(px, py);
				// drop a circle in the quadtree for that point's intersection
				lineCollision.push(new Circle({
					x: px,
					y: py,
					r: lineSpacing
				}));

				// then sample noise to determine next direction
				let ang = noise(px * noiseScale, py * noiseScale);
				// move in the direction * 4 px
				px += cos(ang) * 4;
				py += sin(ang) * 4;
			}
			endShape();
			// add the line to the collision quadtree
			for (let i=0; i<lineCollision.length; i++) {
				fieldTree.insert(lineCollision[i]);
			}
		}
	}
}

function canMakePoint(xPos: number, yPos: number): boolean {
	return xPos >= 0 && xPos <= 800
		&& yPos >= 0 && yPos <= 800
		&& (fieldTree.retrieve(new Circle({
			x: xPos,
			y: yPos,
			r: pointSpacing
		})).length == 0)
}
