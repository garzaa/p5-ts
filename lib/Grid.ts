class Grid {
	readonly cellSize: vec2;
	readonly cellRadius: vec2;
	readonly origin: vec2;
	readonly rows: Cell[][];
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

	applyLtR(f: (cell: Cell) => void) {
		// applies the function row by row instead of column by column
		// 0th element of every row
		// then 1st element of every row
		
		let j = 0;
		while (j < this.rows[0].length) {
			let k = 0;
			while (k < this.rows.length) {
				// every row 0th element
				f(this.rows[k][j]);
				k++
			}
			// then every row 1st element
			// and continue until at last element of row (rows[0].length)
			j++;
		}
	}

	applyIso(f: (cell: Cell) => void) {
		// iso, top to bottom, left to right
		for (let k = 0; k <= 2 * (this.rows.length - 1); k++) {
			let yMin = max(0, k - this.rows.length + 1);
			let yMax = min(this.rows.length - 1, k);
			for (let y = yMin; y <= yMax; y++) {
				let x = k - y;
				f(this.rows[y][x]);
			}
		}
	}
}

class SquareCell extends Cell {
	readonly radius: vec2;
	readonly grid: Grid;
	readonly gridCoords: vec2;
	readonly worldCoords: vec2;
	// need to do strings because can't override object equality in js
	readonly connectionDirections: Set<string>;

	constructor(gridCoords: vec2, worldCoords: vec2, radius: vec2, grid: Grid) {
		super();
		this.gridCoords = gridCoords;
		this.worldCoords = worldCoords;
		this.radius = radius;
		this.grid = grid;
		this.connectionDirections = new Set<string>();
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

	addConnection(cell: Cell): void {
		super.addConnection(cell);
		this.connectionDirections.add(cell.gridCoords.sub(this.gridCoords).str());
	}

	removeConnection(cell: Cell): void {
		super.removeConnection(cell);
		this.connectionDirections.delete(cell.gridCoords.sub(this.gridCoords).str());
	}

	/**
	 * @returns points in a clockwise order, starting from top left
	 */
	getPoints() : vec2[] {
		let points: vec2[] = [];
		points.push(this.worldCoords.add(new vec2(-this.radius.x, -this.radius.y)));
		points.push(this.worldCoords.add(new vec2(this.radius.x, -this.radius.y)));
		points.push(this.worldCoords.add(new vec2(this.radius.x, this.radius.y)));
		points.push(this.worldCoords.add(new vec2(-this.radius.x, this.radius.y)));
		return points;
	}

	hasConnection(direction: vec2): boolean {
		return this.connectionDirections.has(direction.str());
	}
}
