function setup(): void {
	createCanvas(1024, 1024);
	noLoop();
}

function draw(): void {
	background(255);
	fill(0);
	textFont("IBM Plex Sans");
	textSize(64);

	const textGap = 512;
	const crossGap = 128;

	for (let i=0; i<1024; i+= textGap) {
		for (let j=-32; j<1024; j+= textGap/4) {
			push();
				translate(i, j);
				text("RUNWAY", 0, 0);
			pop();
		}
	}

	stroke(0);
	strokeWeight(4);
	for (let i=0; i<1024+crossGap; i+= crossGap) {
		for (let j= 0; j<1024+crossGap; j+= crossGap) {
			drawCross(i, j, 16);
		}
	}
}

function drawCross(x: number, y: number, size: number): void {
	line(x-size, y-size, x+size, y+size);
	line(x-size, y+size, x+size, y-size);
}
