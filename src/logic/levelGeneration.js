import GridMDP from './mdp_prop';
import {tileWall, tileGoal, tileTrap, fill, braid, neighbors, tilePath} from './level';
import { inBounds, randomSample, shuffle } from './util';
import { placeRandom } from './maze_generators/random';
import { Date } from 'core-js';
import store from './sharedData';

export default async function create(requirements, attempts=1000) {
	let startTime = Date.now();
	let result = {
		status: "failure",
		mdp: null
	};

	do {
		attempts--;

		// build initial level (filled with walls)
		let level = fill(requirements.width, requirements.height, tileWall);
	
		// carver places empty tiles according to the chosen algorithm
		// console.log(requirements.carver);
		requirements.carver(level, requirements.carverArgs);
		if (requirements.braid) {
			braid(level);
		}
	
		placeTerminals(level, requirements.goals, requirements.traps, requirements.connected==="forbidden");
	
		if(store.state.dev) {
			makeInitial(level);
		} else {
			placeInitial(level);
		}

		result.mdp = new GridMDP(level);

		var terminate = attempts <= 0 || Date.now() - startTime > 2000;
		if (requirements.check(result.mdp)) {
			terminate = true;
			result.status = "success";
		}

		if (store.state.dev) {
			// let failed = [];
			// for (const key in requirements.satisfaction) {
			// 	if (!requirements.satisfaction[key]) {
			// 		failed.push(key);
			// 	}
			// }
			// console.log("failed: " + failed.join(", "));
		}
	} while (!terminate);

	if (store.state.dev) {
		console.log("attempts: " + (1000-attempts) + " in " + (Date.now()-startTime) + "ms");
	}

	return result;
}

function placeInitial(level, all=true, onTraps=false) {
	let succeeded = false;
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			if(level[x][y].terminal && level[x][y].accessible && (onTraps || level[x][y].reward > 0)) {
				if (inBounds(x-1, y, level) && level[x-1][y].accessible && !level[x-1][y].terminal) {
					level[x-1][y].initial = true;
					succeeded = true;
					if(!all) return;
				} 
				
				if (inBounds(x+1, y, level) && level[x+1][y].accessible && !level[x+1][y].terminal) {
					level[x+1][y].initial = true;
					succeeded = true;
					if(!all) return;
				}
				
				if (inBounds(x, y-1, level) && level[x][y-1].accessible && !level[x][y-1].terminal) {
					level[x][y-1].initial = true;
					succeeded = true;
					if(!all) return;
				}
				
				if (inBounds(x, y+1, level) && level[x][y+1].accessible && !level[x][y+1].terminal) {
					level[x][y+1].initial = true;
					succeeded = true;
					if(!all) return;
				}
				
			}
		}
	}

	if (!succeeded) {
		if (!onTraps) {
			placeInitial(level, all, true);
		} else {
			let initial = {...tilePath};
			initial.initial = true;
			placeRandom(level, initial, 1, tile => tile.accessible === true);
		}
	}
	
}

function makeInitial(level) {
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			if (level[x][y].accessible && !level[x][y].terminal) {
				level[x][y].initial = true;
			}
		}
	}
}

function placeTerminals(level, nGoals, nTraps, invasive=false) {
	// non-invasive placing
	let elegible = pos => {
		let nAccessibleNeighbors = neighbors(level, pos).filter(p => level[p.x][p.y].accessible && !level[p.x][p.y].terminal).length;
		return (!level[pos.x][pos.y].accessible || nAccessibleNeighbors === 1) && nAccessibleNeighbors > 0 && !level[pos.x][pos.y].terminal;
	}

	if (invasive) {
		elegible = pos => {
			return level[pos.x][pos.y].accessible;
		}
	}

	let candidates = randomSample([...allCoords(level).filter(elegible)], nGoals + nTraps);

	// random placing (fallback)
	if (nGoals + nTraps >= level.length*level[0].length) {
		// too many terminals requested
		candidates = shuffle(allCoords(level));
	} else {
		// add random tiles until the desired amount is reached
		while (candidates.length < nGoals + nTraps) {
			let cand = randomCoord(level);
			if(!candidates.includes(cand)) {
				candidates.push(cand);
			}
		}
	}

	for (const tile of candidates) {
		if (nGoals > 0) {
			level[tile.x][tile.y] = {...tileGoal};
			nGoals--;
		} else {
			level[tile.x][tile.y] = {...tileTrap};
		}
	}

	return level;
}

function* allCoords(level) {
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			yield {x: x, y: y};
		}
	}
}

function randomCoord(level) {
	let x = Math.floor(Math.random()*level.length)
	let y = Math.floor(Math.random()*level[0].length)
	return {x: x, y: y};
}
