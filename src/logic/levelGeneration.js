import GridMDP from './mdp_prop';

const tileWall = {
	"accessible": false,
	"reward": 0,
	"terminal": false,
	"initial": false
};

// const tilePath = {
// 	"accessible": true,
// 	"reward": 0,
// 	"terminal": false,
// 	"initial": false
// };

const tileGoal = {
	"accessible": true,
	"reward": 1,
	"terminal": true,
	"initial": false
};

const tileDeath = {
	"accessible": true,
	"reward": -1,
	"terminal": true,
	"initial": false
};

export default function create(requirements) {
	// TODO create a level fulfilling the constraints set by requirements
	//let level = random(requirements.size.height, requirements.size.width, requirements.connectivity);
	let level = fill(requirements.size.width, requirements.size.height);
	carveDFS(level);
	carveRandom(level, requirements.connectivity);
	let goalPos = placeRandom(level, tileGoal, requirements.numberOfGoals);
	placeInitial(level, goalPos[0], goalPos[1]);
	placeRandom(level, tileDeath, requirements.numberOfDeaths);
	return new GridMDP(level);
}

function fill(width, height, type=tileWall) {
	let level = [];
	for(let x=0; x<height; x++) {
		level[x] = [];
		for(let y=0; y<width; y++) {
			level[x][y] = {...type};
		}
	}
	return level;
}

function carveRandom(level, chance) {
	for(let x in level)
		for(let y in level[x])
			if(Math.random() < chance)
				level[x][y].accessible = true;

	return level;
}

function carveDFS(level, start={"x": 0, "y": 0}) {
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

function placeRandom(level, tile, number) {
	let tries = 0;
	let x, y = -1;
	while (number > 0 && tries < 10) {
		x = Math.round(Math.random() * (level.length -1));
		y = Math.round(Math.random() * (level[0].length -1));

		if (level[x][y] !== tile) {
			level[x][y] = tile;
			number--;
			tries = 0;
		} else {
			tries++;
		}
	}
	return [x, y];
}

function placeInitial(level, goalX, goalY) {
	if (inBounds(goalX-1, goalY, level) && level[goalX-1][goalY].accessible && !level[goalX-1][goalY].terminal) {
		level[goalX-1][goalY].initial = true;
	} else if (inBounds(goalX+1, goalY, level) && level[goalX+1][goalY].accessible && !level[goalX+1][goalY].terminal) {
		level[goalX+1][goalY].initial = true;
	} else if (inBounds(goalX, goalY-1, level) && level[goalX][goalY-1].accessible && !level[goalX][goalY-1].terminal) {
		level[goalX][goalY-1].initial = true;
	} else if (inBounds(goalX, goalY+1, level) && level[goalX][goalY+1].accessible && !level[goalX][goalY+1].terminal) {
		level[goalX][goalY+1].initial = true;
	}
}

function inBounds(x, y, array) {
	return x >= 0 && x < array.length && y >= 0 && y < array[0].length;
}

function shuffle(array) {
	let m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}
