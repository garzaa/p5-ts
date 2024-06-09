// import { Quadtree } from "@timohausmann/quadtree-ts"
// import { Circle } from "@timohausmann/quadtree-ts";

const pointSpacing = 40;
const noiseScale = 0.001;
const collisionSize = 4;
const pointDistance = 4;
const margin = 0;

const fieldTree = new Quadtree<Circle>({
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
	stroke("red");
	noFill();
	angleMode(RADIANS);
	strokeJoin(ROUND);
}

function draw(): void {
	console.log("unga bunga!");
	background(200);
	for (let x=margin; x<=800-margin; x+=pointSpacing) {
		for (let y=margin; y<=800-margin; y+=pointSpacing) {
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
				let noiseVariance = 1 + map(noise(px * noiseScale, py * noiseScale, 1000), 0, 1, -1, 1);
				let ang = noise(px * noiseScale * noiseVariance, py * noiseScale * noiseVariance) * TWO_PI;
				// move in the direction * 4 px
				px += cos(ang) * pointDistance;
				py += sin(ang) * pointDistance;
			}
			endShape();
			// add the line to the collision quadtree
			for (let i=0; i<lineCollision.length; i++) {
				fieldTree.insert(lineCollision[i]);
				// ellipse(lineCollision[i].x, lineCollision[i].y, collisionSize, collisionSize);
			}
		}
	}
}

function canMakePoint(xPos: number, yPos: number, v: number): boolean {
	// TODO: this is returning everything??
	// right beacuse the tree hasnt split yet
	// ok so now just test those for collision. great
	// do this tomorrow, fuck 
	let overlap = fieldTree.retrieve(new Circle({
		x: xPos,
		y: yPos,
		r: collisionSize
	}));

	let hasOverlap = false;

	for (let circle of overlap) {
		let distance = circle.r + collisionSize;
		if ((abs(xPos - circle.x) < distance) && (abs(yPos - circle.y) < distance)) {
			hasOverlap = true;
			break;
		}
	}
	
	return xPos >= 0 && xPos <= 800
		&& yPos >= 0 && yPos <= 800
		&& v < 50
		&& !hasOverlap;
}
