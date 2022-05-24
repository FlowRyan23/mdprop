import GridMDP from './mdp_prop';
import {tileWall, tileGoal, tileTrap, fill, braid, neighbors} from './level';
import { inBounds } from './util';
import { placeRandom } from './maze_generators/random';

export default async function create(requirements) {
	let count = 0;
	do {
		// build initial level (filled with walls)
		let level = fill(requirements.width, requirements.height, tileWall);
	
		// carver places empty tiles according to its algorithm 
		requirements.carver(level, requirements.carverArgs);
		if (requirements.braid) {
			braid(level);
		}
	
		// place goals and traps in usefull (accessible) places
		let elegibility = pos => {
			return !level[pos.x][pos.y].accessible
				&& neighbors(level, pos).filter(p =>
						level[p.x][p.y].accessible
						&& !level[p.x][p.y].terminal).length > 0;
		}
		placeRandom(level, tileGoal, requirements.goals, elegibility);
		placeRandom(level, tileTrap, requirements.traps, elegibility);
	
		placeInitial(level);

		count++;
		var mdp = new GridMDP(level);
		var satisfied = requirements.check(mdp);
	} while (count < 50 && !satisfied);

	console.log(satisfied);
	console.log(count);
	if (!satisfied) {
		console.log(requirements.toString());
	}
	return mdp;
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
