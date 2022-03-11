import GridMDP from './mdp_prop';
import {tileWall, tileGoal, tileTrap, fill, braid, neighbors} from './level';
import { inBounds } from './util';
import { placeRandom } from './maze_generators/random';

export default async function create(requirements) {
	// TODO create a level fulfilling the constraints set by requirements
	//let level = random(requirements.size.height, requirements.size.width, requirements.connectivity);
	let level = fill(requirements.size.width, requirements.size.height, tileWall);
	requirements.carver(level, requirements.carverArgs);
	if (requirements.braid) {
		braid(level);
	}
	placeRandom(level, tileGoal, requirements.numberOfGoals, function(pos) {
		return !level[pos.x][pos.y].accessible && neighbors(level, pos).filter(p => level[p.x][p.y].accessible).length > 0;
	});
	placeRandom(level, tileTrap, requirements.numberOfTraps, function (pos) {
		return !level[pos.x][pos.y].accessible && neighbors(level, pos).filter(p => level[p.x][p.y].accessible).length > 0;
	});
	placeInitial(level);
	// this.checkRes = requirements.check(this.mdp, true);
	return new GridMDP(level);
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
