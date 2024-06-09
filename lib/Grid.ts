class Grid {
	readonly cellSize: vec2;
	readonly cellRadius: vec2;
	readonly origin: vec2;
	readonly rows: SquareCell[][];

	constructor(origin: vec2, gridSize: vec2, cellHeight: number) {
		
	}
}

class SquareCell extends Cell {
	readonly radius: vec2;
	readonly grid: Grid;
	
	getNeighbors(): Cell[] {
		let neighbors: Cell[] = [];

		if (this.gridCoords.x > 0) {
			neighbors.push(this.grid.rows[this.gridCoords.x-1][this.gridCoords.y]);
		}
		if (this.gridCoords.x < this.grid.rows.length-1) {
			neighbors.push(this.grid.rows[this.gridCoords.x+1][this.gridCoords.y]);
		}

		if (this.gridCoords.y > 0) {
			neighbors.push(this.grid.rows[this.gridCoords.x][this.gridCoords.y-1]);
		}
		if (this.gridCoords.y < this.grid.rows[0].length) {
			neighbors.push(this.grid.rows[this.gridCoords.x][this.gridCoords.y+1]);
		}

		return neighbors;
	}
}
