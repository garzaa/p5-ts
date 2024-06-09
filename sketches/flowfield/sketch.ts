// import { Quadtree } from "@timohausmann/quadtree-ts"
// import { Circle } from "@timohausmann/quadtree-ts";

const pointSpacing = 500;
const noiseScale = 1;
const collisionSize = 10;
const pointDistance = 100;

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
	stroke("red");
	noFill();
	angleMode(RADIANS);
	strokeJoin(ROUND);
}

function draw(): void {
	console.log("unga bunga!");
	background(200);
	for (let x=100; x<700; x+=pointSpacing) {
		for (let y=100; y<700; y+=pointSpacing) {
			ellipse(x, y, 50, 50);
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
				let ang = noise(px * noiseScale, py * noiseScale) * TWO_PI;
				// move in the direction * 4 px
				px += cos(ang) * pointDistance;
				py += sin(ang) * pointDistance;
			}
			endShape();
			// add the line to the collision quadtree
			for (let i=0; i<lineCollision.length; i++) {
				console.log("adding new vertex point")
				fieldTree.insert(lineCollision[i]);
				ellipse(lineCollision[i].x, lineCollision[i].y, collisionSize, collisionSize);
			}
		}
	}
}

function canMakePoint(xPos: number, yPos: number, v: number): boolean {
	console.log("checking "+xPos+", "+yPos+", "+collisionSize);
	// TODO: this is returning everything??
	// right beacuse the tree hasnt split yet
	// ok so now just test those for collision. great
	// do this tomorrow, fuck 
	let overlap = fieldTree.retrieve(new Circle({
		x: xPos,
		y: yPos,
		r: collisionSize
	}));
	
	let hasOverlap: boolean = overlap.length > 0;
	if (hasOverlap) console.log(overlap);

	return xPos >= 0 && xPos <= 800
		&& yPos >= 0 && yPos <= 800
		&& v < 50
		&& !hasOverlap;
}
