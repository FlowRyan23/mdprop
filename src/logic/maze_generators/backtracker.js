import { shuffle, inBounds } from "../util";

export default function carveDFS(level, start={"x": 0, "y": 0}) {
	let fringe = [];

	start.entry = start;
	fringe.push(start);

	while (fringe.length > 0) {
		let current = fringe.pop();
		if (level[current.x][current.y].closed) {
			continue;
		}

		level[current.x][current.y].closed = true;

		level[current.x][current.y].accessible = true;
		level[current.entry.x][current.entry.y].accessible = true;

		let children = [];
		if (inBounds(current.x - 2, current.y, level) && !level[current.x - 2][current.y].closed) {
			children.push({
				"x": current.x - 2,
				"y": current.y,
				"entry": {
					"x": current.x - 1,
					"y": current.y
				}
			});
		}
		
		if (inBounds(current.x + 2, current.y, level) && !level[current.x + 2][current.y].closed) {
			children.push({
				"x": current.x + 2,
				"y": current.y,
				"entry": {
					"x": current.x + 1,
					"y": current.y
				}
			});
		}

		if (inBounds(current.x, current.y - 2, level) && !level[current.x][current.y - 2].closed) {
			children.push({
				"x": current.x,
				"y": current.y - 2,
				"entry": {
					"x": current.x,
					"y": current.y - 1
				}
			});
		}

		if (inBounds(current.x, current.y + 2, level) && !level[current.x][current.y + 2].closed) {
			children.push({
				"x": current.x,
				"y": current.y + 2,
				"entry": {
					"x": current.x,
					"y": current.y + 1
				}
			});
		}

		for (let c of shuffle(children)) {
			if (!closed[level[c.x][c.y]]) {
				fringe.push(c);
			}
		}
	}

	return level;
}