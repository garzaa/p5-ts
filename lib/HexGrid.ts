class HexGrid {
	cellSize: vec2;
	origin: vec2;
	rows: HexCell[][];
	sideLength: number;

	constructor(origin: vec2, gridSize: vec2, cellDiameter: number) {
		this.cellSize = new vec2(cellDiameter, (cellDiameter / 2) * sqrt(3));
		this.origin = origin;
		this.rows = [];
		this.sideLength = cellDiameter/2;
		for (let x=0; x<gridSize.x; x++) {
			let row = [];
			for (let y=0; y<gridSize.y; y++) {
				let gridPos = new vec2(x, y);
				row.push(new HexCell(gridPos, this.cellToWorld(gridPos)));
			}
			this.rows.push(row);
		}
	}

	cellToWorld(cellPos: vec2) {
		let c = new vec2(
			this.origin.x + (cellPos.x*(this.cellSize.x + this.sideLength)),
			this.origin.y + (cellPos.y*(this.cellSize.y * 0.5))
		);
		if (cellPos.y % 2 == 0) {
			// this should be something based on side length maybe
			c.x += this.sideLength * 0.75;
		} else {
			c.x -= this.sideLength * 0.75;
		}
		return c;
	}

	iterate(f: (cell: HexCell) => void) {
		for (let x=0; x<this.rows.length; x++) {
			for (let y=0; y<this.rows[x].length; y++) {
				f(this.rows[x][y]);
			}
		}
	}
}

class HexCell {
	gridCoords: vec2;
	worldCoords: vec2;

	constructor(gridCoords: vec2, worldCoords: vec2) {
		this.gridCoords = gridCoords;
		this.worldCoords = worldCoords;
	}
}
