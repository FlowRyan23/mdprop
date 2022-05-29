import GridMDP from './mdp_prop';
import {tileWall, tileGoal, tileTrap, fill, braid, neighbors} from './level';
import { inBounds } from './util';
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
		requirements.carver(level, requirements.carverArgs);
		if (requirements.braid) {
			braid(level);
		}
	
		// place goals and traps in usefull (accessible) places
		let elegibility = pos => {
			let nAccessibleNeighbors = neighbors(level, pos).filter(p => level[p.x][p.y].accessible && !level[p.x][p.y].terminal).length;
			return (!level[pos.x][pos.y].accessible || nAccessibleNeighbors === 1) && nAccessibleNeighbors > 0;
		}
		placeRandom(level, tileGoal, requirements.goals, elegibility);
		placeRandom(level, tileTrap, requirements.traps, elegibility);
	
		placeInitial(level);

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

	if(store.state.def) console.log(500 - attempts);
	return result;
}

function placeInitial(level, all=true, onTraps=false) {
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			if(level[x][y].terminal && level[x][y].accessible && (onTraps || level[x][y].reward > 0)) {
				if (inBounds(x-1, y, level) && level[x-1][y].accessible && !level[x-1][y].terminal) {
					level[x-1][y].initial = true;
					if(!all) return;
				} 
				
				if (inBounds(x+1, y, level) && level[x+1][y].accessible && !level[x+1][y].terminal) {
					level[x+1][y].initial = true;
					if(!all) return;
				}
				
				if (inBounds(x, y-1, level) && level[x][y-1].accessible && !level[x][y-1].terminal) {
					level[x][y-1].initial = true;
					if(!all) return;
				}
				
				if (inBounds(x, y+1, level) && level[x][y+1].accessible && !level[x][y+1].terminal) {
					level[x][y+1].initial = true;
					if(!all) return;
				}
				
			}
		}
	}		
	
}
