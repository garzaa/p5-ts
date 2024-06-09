function vec2line(start: vec2, end: vec2, points:number = 2): void {
	start = start.distort(0, 1, 100);
	end = end.distort(0, 1, 100);
	line(start.x, start.y, end.x, end.y);
}
