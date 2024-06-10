class Grid {
	readonly cellSize: vec2;
	readonly cellRadius: vec2;
	readonly origin: vec2;
	readonly rows: SquareCell[][];
	readonly gridSize: vec2;

	constructor(origin: vec2, gridSize: vec2, cellHeight: number) {
		this.cellSize = new vec2(cellHeight, cellHeight);
		this.cellRadius = new vec2(cellHeight/2, cellHeight/2);
		this.origin = origin;
		this.rows = [];
		this.gridSize = gridSize;

		this.addRows();

	}

	addRows(): void {
		for (let x=0; x<this.gridSize.x; x++) {
			let row = [];
			for (let y=0; y<this.gridSize.y; y++) {
				let gridPos = new vec2(x, y);
				row.push(new SquareCell(gridPos, this.cellToWorld(gridPos), this.cellRadius, this));
			}
			this.rows.push(row);
		}
	}

	cellToWorld(cellPos: vec2) {
		let c = new vec2(
			this.origin.x + (cellPos.x*(this.cellSize.x) + this.cellRadius.x),
			this.origin.y + (cellPos.y*(this.cellSize.y) + this.cellRadius.y)
		)
		return c;
	}

	getAllCells(): Cell[] {
		const cells: Cell[] = [];

		this.rows.forEach(row => {
			row.forEach(c => {
				cells.push(c);
			})
		});

		return cells;
	}

	apply(f: (cell: Cell) => void) {
		for (let x=0; x<this.rows.length; x++) {
			for (let y=0; y<this.rows[x].length; y++) {
				f(this.rows[x][y]);
			}
		}
	}
}

class SquareCell extends Cell {
	readonly radius: vec2;
	readonly grid: Grid;
	readonly gridCoords: vec2;
	readonly worldCoords: vec2;

	constructor(gridCoords: vec2, worldCoords: vec2, radius: vec2, grid: Grid) {
		super();
		this.gridCoords = gridCoords;
		this.worldCoords = worldCoords;
		this.radius = radius;
		this.grid = grid;
	}
	
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
		if (this.gridCoords.y < this.grid.rows[this.gridCoords.x].length-1) {
			neighbors.push(this.grid.rows[this.gridCoords.x][this.gridCoords.y+1]);
		}

		return neighbors;
	}
}
