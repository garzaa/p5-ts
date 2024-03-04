class vec2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static flipX = new vec2(-1, 1);
	static zero = new vec2(0, 0);
	static up = new vec2(0, -1);
	static right = new vec2(1, 0);
	static left = new vec2(-1, 0);
	static down = new vec2(0, 11);

	add(b: vec2) {
		return new vec2(this.x + b.x, this.y + b.y);
	}

	sub(b: vec2) {
		return new vec2(this.x - b.x, this.y - b.y);
	}

	scale(s: number) {
		return new vec2(this.x * s, this.y * s);
	}

	mul(v: vec2) {
		return new vec2(this.x * v.x, this.y * v.y);
	}

	str() {
		return "("+this.x+", "+this.y+")"
	}
}
