function carveMaze(startCell: Cell) {
const visited = new Set<Cell>();
	const stack: Cell[] = [];

	visited.add(startCell);
	stack.push(startCell);
	while (stack.length > 0) {
		let current: Cell = stack.pop();
		let unvisitedNeighbors: Cell[] = current.getNeighbors().filter(c => !visited.has(c));
		if (unvisitedNeighbors.length > 0) {
			stack.push(current);
			let c = unvisitedNeighbors[Math.floor(Math.random()*unvisitedNeighbors.length)];
			c.addConnection(current);
			current.addConnection(c);
			visited.add(c);
			stack.push(c);
		}
	}
}
