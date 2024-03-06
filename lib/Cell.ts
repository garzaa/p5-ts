abstract class Cell {
	connections: Set<Cell> = new Set<Cell>();	
	getConnections(): Cell[] {
		return Array.from(this.connections);
	}
	addConnection(cell: Cell) {
		this.connections.add(cell);
	}
	removeConnection(cell: Cell) {
		this.connections.delete(cell);
	}

	gridCoords: vec2;
	worldCoords: vec2;

	abstract getNeighbors(): Cell[];

	getUnconnectedNeighbors(): Cell[] {
		return this.getNeighbors().filter(x => !this.connections.has(x));
	}
}
