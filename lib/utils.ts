function vec2line(start: vec2, end: vec2, points:number = 2): void {
	start = start.distort(0, 1, 100);
	end = end.distort(0, 1, 100);
	line(start.x, start.y, end.x, end.y);
}

function hardscale(buffer: p5.Renderer) {
	let canvasElement = buffer.elt;
	let context = canvasElement.getContext('2d');
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
}

function stoi(gridPos: vec2, cellSize: number, isoOrigin: vec2): vec2 {
	// on an n*n grid rotated 45 degrees clockwise
	// 0, 0 needs to be in the middle top
	// 0, n is middle left
	// n, 0 is middle right
	// n, n is bottom
	// start at top middle
	// move right: x/2
	// move left: y/2
	// move down: x/4
	// move down: y/4;
	let x = isoOrigin.x;
	x += gridPos.x/2 * cellSize;
	x -= gridPos.y/2 * cellSize;

	let y = isoOrigin.y;
	y += gridPos.x/4 * cellSize;
	y += gridPos.y/4 * cellSize;

	return new vec2(x, y);
}
