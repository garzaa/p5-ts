function setup(): void {
	createCanvas(1024, 1024);
	noLoop();
}

const chevronWidth = 64;
const chevronSpacing = chevronWidth * 3;

function draw(): void {
	// chevron
	// fill(255);
	// noStroke();
	// beginShape();
	// vertex(0, 0);
	// vertex(1024*.5, 512);
	// vertex(0, 1024);
	// vertex(1024*.5, 1024);
	// vertex(1024, 512);
	// vertex(1024*.5, 0);
	// endShape(CLOSE);
	// background(255);
	// const detail = 225;
	// fill(detail);
	// noStroke();

	push();
		translate(0, 512);
		rect(0, -100, 1024, 200);
		rect(0, -512+50, 1024, -512);
		rect(0, 512-50, 1024, 512);
	pop();

	for (let i=0; i<1024; i+=chevronSpacing+chevronWidth) {
		push();
			translate(i, 0);
			drawChevron();
		pop();
	}
}

function drawChevron(): void {
	beginShape();
	vertex(0, 50);
	vertex(chevronWidth, 512-100);
	vertex(chevronSpacing+chevronWidth, 512-100);
	vertex(chevronSpacing, 50);
	endShape();
}
