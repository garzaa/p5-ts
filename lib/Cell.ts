abstract class Cell {
	connections: Set<Cell> = new Set<Cell>();	
	getConnections(): Set<Cell> {
		return this.connections;
	}
	addConnection(cell: Cell) {
		this.connections.add(cell);
	}
	removeConnection(cell: Cell) {
		this.connections.delete(cell);
	}

	abstract getNeighbors(): Cell[];
}
