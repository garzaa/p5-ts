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
	static down = new vec2(0, 1);

	add(b: vec2): vec2 {
		return new vec2(this.x + b.x, this.y + b.y);
	}

	sub(b: vec2): vec2 {
		return new vec2(this.x - b.x, this.y - b.y);
	}

	scale(s: number): vec2 {
		return new vec2(this.x * s, this.y * s);
	}

	mul(v: vec2): vec2 {
		return new vec2(this.x * v.x, this.y * v.y);
	}

	str(): string {
		return "("+this.x+", "+this.y+")"
	}
	
	sqrMagnitude(): number {
		return (this.x * this.x) + (this.y * this.y);
	}

	distort(offset: number, scale: number, strength: number): vec2 {
		let angle: number = noise((this.x + offset)*scale, (this.y+offset)*scale) * TWO_PI;
		let magnitude: number = noise(noise((this.x+offset)*scale, (this.y+offset)*scale, 1000)) * strength;

		let nudge: vec2 = new vec2(
			cos(angle) * magnitude,
			sin(angle) * magnitude
		);

		return this.add(nudge);
	}

	normalizeNoise(noise: number): number {
		return noise * 2 - 1;
	}

	hash(): number {
		return (this.x*10000) + this.y;
	}
}
