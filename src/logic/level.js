import { shuffle } from "./util";

export const tileWall = {
	"accessible": false,
	"reward": 0,
	"terminal": false,
	"initial": false
};

export const tilePath = {
	"accessible": true,
	"reward": 0,
	"terminal": false,
	"initial": false
};

export const tileGoal = {
	"accessible": true,
	"reward": 1,
	"terminal": true,
	"initial": false
};

export const tileTrap = {
	"accessible": true,
	"reward": -1,
	"terminal": true,
	"initial": false
};

export function fill(width, height, type=tileWall) {
	let level = [];
	for(let x=0; x<height; x++) {
		level[x] = [];
		for(let y=0; y<width; y++) {
			level[x][y] = {...type};
		}
	}
	return level;
}

export function walkAll(level, accessCondidion, operation=()=>null) {
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			level[x][y].closed = false;
			level[x][y].pathCost = 10000000;
			level[x][y].predecessor = null;
		}
	}
	
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			let start = {x:x,y:y};
			if (accessCondidion(start)) {
				walkLevel(level, start, accessCondidion, operation, false);
			}
		}
	}
}

export function walkLevel(level, start, accessCondidion, operation=()=>null, clear=true) {
	let fringe = [start];
	if (clear) {
		for (let x = 0; x < level.length; x++) {
			for (let y = 0; y < level[x].length; y++) {
				level[x][y].closed = false;
				level[x][y].pathCost = 10000000;
				level[x][y].predecessor = null;
			}
		}
	}
	level[start.x][start.y].pathCost = 0;
	
	while(fringe.length > 0) {
		let current = fringe.pop();
		// console.log("visiting " + current.x + ", " + current.y);
		if(level[current.x][current.y].closed) {
			continue;
		}

		// console.log("visited " + current.x + ", " + current.y);
		operation(current);
		level[current.x][current.y].closed = true;
		for(const neighbor of neighbors(level, current)) {
			if (accessCondidion(neighbor) && !level[neighbor.x][neighbor.y].closed) {
				level[neighbor.x][neighbor.y].pathCost = level[current.x][current.y].pathCost+1;
				level[neighbor.x][neighbor.y].predecessor = current;
				fringe[fringe.length] = neighbor;
			}
		}
	}
}

export function neighbors(level, pos) {
	let n = [];
	if(pos.x + 1 < level.length) {
		n.push({"x": pos.x + 1, "y": pos.y});
	}
	if(pos.x - 1 >= 0) {
		n.push({"x": pos.x - 1, "y": pos.y});
	}
	if(pos.y + 1 < level[0].length) {
		n.push({"x": pos.x, "y": pos.y+1});
	}
	if(pos.y - 1 >= 0) {
		n.push({"x": pos.x, "y": pos.y-1});
	}
	return n;
}

function isDeadEnd(level, pos) {
	return neighbors(level, pos).filter(e => level[e.x][e.y].accessible).length === 1;
}

export function braid(level, start=null, degree=1) {
	// if no accesible starting tile is given, one must found to start walking the maze
	if(start===null || !level[start.x][start.y].accessible) {
		for(let x=0; start===null && x<level.length; x++) {
			for(let y=0; start===null && y<level[x].length; y++) {
				if(level[x][y].accessible) {
					start = {"x": x, "y": y};
				}
			}
		}
	}


	// find all dead end tiles in the level
	walkLevel(level, start, p => level[p.x][p.y].accessible, p => {
		if(Math.random() > degree) return;

		let current = p;
		// carve through walls in dead ends until they reach a previous exiting path
		while(isDeadEnd(level, current)) {
			let cut = shuffle(neighbors(level, current).filter(e => !level[e.x][e.y].accessible))[0];
			level[cut.x][cut.y].accessible = true;
			current = cut;
		}
	})

	return level
}