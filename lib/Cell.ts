abstract class Cell {
	readonly connections: Set<Cell> = new Set<Cell>();
	getConnections(): Cell[] {
		return Array.from(this.connections);
	}
	addConnection(cell: Cell): void {
		this.connections.add(cell);
	}
	removeConnection(cell: Cell): void {
		this.connections.delete(cell);
	}
	addBiConnection(cell: Cell): void {
		this.addConnection(cell);
		cell.addConnection(this);
	}

	gridCoords: vec2;
	worldCoords: vec2;

	abstract getNeighbors(): Cell[];

	getUnconnectedNeighbors(): Cell[] {
		return this.getNeighbors().filter(x => !this.connections.has(x));
	}
}
