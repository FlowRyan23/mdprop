import { neighbors } from "../level";

export function carveRandom(level, args={}) {
	let chance = args.chance?args.chance:0;
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			if(Math.random() < chance) {
				level[x][y].accessible = true;
			}
		}
	}

	return level;
}

// export function carveSnake(level, args) {
// 	let start = args.start?args.start:{
// 		x:Math.floor(level.length/4)*2,
// 		y:Math.floor(level[0].length/4)*2
// 	};
// 	level[start.x][start.y].accessible = true;
// 	let head = extend(level, start);
// 	let tail = start;
// 	while(head || tail) {
// 		if(head) head = extend(level, head);
// 		if(tail) tail = extend(level, tail);
// 	}
// }

// function extend(level, pos) {
// 	let potentials = neighbors(level, pos, 2).filter(p=>!level[p.x][p.y].accessible);
// 	if (potentials.length > 0) {
// 		let next = randomSample(potentials, 1)[0];
// 		level[next.x][next.y].accessible = true;
// 		level[next.x - (next.x-pos.x)/2][next.y - (next.y-pos.y)/2].accessible = true;
// 		return next;
// 	} else return null;
// }

export function carveSnake(level, args) {
	let start = args.start?args.start:{
		x:Math.floor(level.length/4)*2,
		y:Math.floor(level[0].length/4)*2
	};
	level[start.x][start.y].accessible = true;
	level.tries = 0;
	extend(level, start);
}

function extend(level, pos, count=0) {
	if (level.tries++ > 10000) {
		return true;
	}

	let potentials = neighbors(level, pos, 2).filter(p=>!level[p.x][p.y].accessible);
	for (const neighbor of potentials) {
		level[neighbor.x][neighbor.y].accessible = true;
		level[neighbor.x - (neighbor.x-pos.x)/2][neighbor.y - (neighbor.y-pos.y)/2].accessible = true;
		if (extend(level, neighbor, count+1)) {
			return true;
		} else {
			level[neighbor.x][neighbor.y].accessible = false;
			level[neighbor.x - (neighbor.x-pos.x)/2][neighbor.y - (neighbor.y-pos.y)/2].accessible = false;
		}
	}
	let ratio = count / (Math.round(level.length/2) * Math.round(level[0].length/2));
	console.log("achived ratio " + ratio + " at count " + count);
	return ratio > 0.8;
}

export function placeRandom(level, tile, number, replace=()=>true) {
	let tries = 0;
	let x, y = -1;
	while (number > 0 && tries < number + 10) {
		x = Math.round(Math.random() * (level.length -1));
		y = Math.round(Math.random() * (level[0].length -1));

		if (replace(level[x][y])) {
			level[x][y] = tile;
			number--;
			tries = 0;
		} else {
			tries++;
		}
	}
	return [x, y];
}