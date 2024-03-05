/**
 * @description Creates a grid of pointy-top hexagons
 */
class HexGrid {
	readonly cellSize: vec2;
	readonly cellRadius: vec2;
	readonly origin: vec2;
	readonly rows: HexCell[][];
	readonly sideLength: number;
	readonly gridSize: vec2;

	constructor(origin: vec2, gridSize: vec2, cellHeight: number) {
		// set up everything
		this.cellSize = new vec2((cellHeight/2) * sqrt(3), cellHeight)
		this.cellRadius = this.cellSize.scale(0.5);
		this.rows = [];
		this.sideLength = cellHeight/2;
		this.gridSize = gridSize;

		// ok now create the start point
		// this depends on how many rows are in the grid
		// https://www.redblobgames.com/grids/hexagons/
		// EVEN: origin of the first hex is 1*w, 0.5*h
		// ODD: origin of the first hex is 0.75*w, 0.5*h
		let originX = gridSize.y % 2 == 0 ? origin.x + this.cellSize.x : origin.x + (0.75 * this.cellSize.x);
		this.origin = new vec2(originX, origin.y + (1.25 * this.cellSize.y));

		for (let x=0; x<gridSize.x; x++) {
			let row = [];
			for (let y=0; y<gridSize.y; y++) {
				let gridPos = new vec2(x, y);
				row.push(new HexCell(gridPos, this.cellToWorld(gridPos), this.cellRadius, this));
			}
			this.rows.push(row);
		}
	}

	cellToWorld(cellPos: vec2) {
		let c = new vec2(
			this.origin.x + (cellPos.x*(this.cellSize.x)),
			this.origin.y + (cellPos.y*(this.cellSize.y * 0.75))
		);
		// if even, it needs to be moved left half a cell
		if (cellPos.y % 2 == 0) {
			c.x -= this.cellRadius.x;
		}
		return c;
	}

	apply(f: (cell: HexCell) => void) {
		for (let x=0; x<this.rows.length; x++) {
			for (let y=0; y<this.rows[x].length; y++) {
				f(this.rows[x][y]);
			}
		}
	}
}

class HexCell extends Cell {
	readonly gridCoords: vec2;
	readonly worldCoords: vec2;
	readonly radius: vec2;
	readonly grid: HexGrid;

	constructor(gridCoords: vec2, worldCoords: vec2, radius: vec2, grid: HexGrid) {
		super();
		this.gridCoords = gridCoords;
		this.worldCoords = worldCoords;
		this.radius = radius;
		this.grid = grid;
	}

	getPoints(): vec2[] {
		let points: vec2[] = [];
		// add the points from all the world coords
		// start clockwise from the top center
		for (let i=0; i<6; i++) {
			let p = new vec2(cos((i/6)*TWO_PI - (PI/6.0)), sin((i/6) *TWO_PI - (PI/6))).scale(this.radius.y);
			points.push(this.worldCoords.add(p));
		}

		return points;
	}

	getNeighbors(): Cell[] {
		let odd = this.gridCoords.y % 2 == 1;
		let neighborCoords: number[] = [];
		
		if (odd) {
			neighborCoords.push(
				1, 0,
				1, 1, 
				0, 1,
				-1, 0,
				0, -1, 
				1, -1
			)
		} else {
			neighborCoords.push(
				1, 0,
				0, 1,
				-1, 1,
				-1, 0,
				-1, -1,
				0, -1
			)
		}

		let neighbors: Cell[] = [];
		for (let i=0; i<neighborCoords.length-1; i+= 2) {
			let gridCoords: vec2 = new vec2(
				this.gridCoords.x + neighborCoords[i],
				this.gridCoords.y + neighborCoords[i+1]
			);
			if (
				gridCoords.x >= 0
				&& gridCoords.x < this.grid.gridSize.x
				&& gridCoords.y >= 0
				&& gridCoords.y < this.grid.gridSize.y
			) {
				neighbors.push(grid.rows[gridCoords.x][gridCoords.y]);
			}
		}
		return neighbors;
	}
}
