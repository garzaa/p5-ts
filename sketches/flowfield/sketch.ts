// import { Quadtree } from "@timohausmann/quadtree-ts"
// import { Circle } from "@timohausmann/quadtree-ts";

const dpi = 96;
const sizeX = 6 * dpi;
const sizeY = 6 * dpi;

const pointSpacing = 50;
const noiseScale = 0.0005;
const collisionSize = 5;
const pointDistance = 4;
const margin = 10;
const maxVertices = 100;

const exportSVG = true;

const fieldTree = new Quadtree<Circle>({
	width: sizeX,
	height: sizeY,
	x: 0,
	y: 0,
	maxObjects: 10
})

function setup(): void {
	// @ts-expect-error
	createCanvas(sizeX, sizeY, exportSVG ? SVG : P2D, null);
	noLoop();
	strokeWeight(4);
	stroke(50);
	noFill();
	angleMode(RADIANS);
	strokeJoin(ROUND);
}

function draw(): void {
	console.log("unga bunga!");
	for (let x=margin; x<=sizeX-margin; x+=pointSpacing/2 * (noise(x))) {
		for (let y=margin; y<=sizeY-margin; y+=pointSpacing * noise(x, y)) {
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
				let noiseVariance = 1 + 0.5*map(noise(px * noiseScale, py * noiseScale, 1000), 0, 1, -1, 10);
				let ang = PI/2 + (PI*(0.75 * (1+noiseVariance/5)))*(noise(px * noiseScale * noiseVariance, py * noiseScale * noiseVariance)*2 - 1);
				// then move the angle towards down??
				// move in the direction * 4 px
				px += cos(ang) * pointDistance;
				py += sin(ang) * pointDistance;
			}
			// add the line to the collision quadtree only if it's more than 1 vertex
			if (lineCollision.length > 1) {
				for (let i=0; i<lineCollision.length; i++) {
					fieldTree.insert(lineCollision[i]);
					// push();
					// 	stroke("red");
					// 	noFill();
					// 	strokeWeight(1);
					// 	ellipse(lineCollision[i].x, lineCollision[i].y, collisionSize*2, collisionSize*2);
					// pop();
				}
			}
			endShape();
		}
	}
}

function canMakePoint(xPos: number, yPos: number, v: number): boolean {
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
	
	return xPos >= (0+margin) && xPos <= (sizeX-margin)
		&& yPos >= (0+margin) && yPos <= (sizeY-margin)
		&& v < maxVertices
		&& !hasOverlap;
}

function getDistance(x1: number, x2: number, y1: number, y2: number): number {
	let xDist = x2 - x1;
	let yDist = y2 - y1;
	return sqrt(xDist*xDist + yDist*yDist);
}
