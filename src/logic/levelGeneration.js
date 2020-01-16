import GridMDP from './mdp_prop';

function random(height, width, connectivity=0.5) {
	let level = [];
	for(let x=0; x<width; x++) {
		level[x] = []
		for(let y=0; y<height; y++) {
			level[x][y] = {
				"accessible": Math.random() < connectivity,
				"reward": 0,
				"terminal": false,
				"initial": false,

				"closed": false
			}
		}
	}

	let fringe = [];
	fringe.push({
		"x": 0,	//Math.round(Math.random() * (width - 1)),
		"y": 0, 	//Math.round(Math.random() * (height -1)),
		"entry": {
			"x": 0,	//Math.round(Math.random() * (width - 1)),
			"y": 0	//Math.round(Math.random() * (height -1))
		}
	});

	while (fringe.length > 0) {
		let current = fringe.pop();
		if (level[current.x][current.y].closed) {
			// if (Math.random() < connectivity) {
			// 	level[current.x][current.y].accessible = true;
			// 	level[current.entry.x][current.entry.y].accessible = true;
			// }
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
			})
		}

		if (inBounds(current.x + 2, current.y, level) && !level[current.x + 2][current.y].closed) {
			children.push({
				"x": current.x + 2,
				"y": current.y,
				"entry": {
					"x": current.x + 1,
					"y": current.y
				}
			})
		}

		if (inBounds(current.x, current.y - 2, level) && !level[current.x][current.y - 2].closed) {
			children.push({
				"x": current.x,
				"y": current.y - 2,
				"entry": {
					"x": current.x,
					"y": current.y - 1
				}
			})
		}

		if (inBounds(current.x, current.y + 2, level) && !level[current.x][current.y + 2].closed) {
			children.push({
				"x": current.x,
				"y": current.y + 2,
				"entry": {
					"x": current.x,
					"y": current.y + 1
				}
			})
		}

		for (let c of shuffle(children)) {
			if (!level[c.x][c.y].closed) {
				fringe.push(c);
			}
		}
	}

	return new GridMDP(level);
}

function inBounds(x, y, array) {
	return x >= 0 && x < array.length && y >= 0 && y < array[0].length;
}

function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

export {random}