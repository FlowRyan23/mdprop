export function carveRandom(level, args={}) {
	let chance = args.chance?args.chance:0;
	console.log(level);
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			if(Math.random() < chance) {
				level[x][y].accessible = true;
			}
		}
	}

	return level;
}

export function placeRandom(level, tile, number) {
	let tries = 0;
	let x, y = -1;
	while (number > 0 && tries < number + 10) {
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