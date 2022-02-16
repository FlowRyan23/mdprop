import GridMDP from './mdp_prop';
import {tileWall, tileGoal, tileDeath, fill, braid} from './level';
import { inBounds } from './util';
import { placeRandom } from './maze_generators/random';

export default function create(requirements) {
	// TODO create a level fulfilling the constraints set by requirements
	//let level = random(requirements.size.height, requirements.size.width, requirements.connectivity);
	let level = fill(requirements.size.width, requirements.size.height, tileWall);
	console.log(requirements.carver);
	requirements.carver(level, requirements.carverArgs);
	if (requirements.braid) {
		braid(level);
	}
	let goalPos = placeRandom(level, tileGoal, requirements.numberOfGoals);
	placeInitial(level, goalPos[0], goalPos[1]);
	placeRandom(level, tileDeath, requirements.numberOfDeaths);
	return new GridMDP(level);
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
