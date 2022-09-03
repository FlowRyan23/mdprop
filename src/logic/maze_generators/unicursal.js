import { fill } from "../level";
import { inBounds } from "../util";
import { carveDFS } from "./backtracker";
import { carveSnake } from "./random";

export function carveUnicursal(level, args) {
	if((level.length - 3) % 4 !== 0 || (level[0].length - 3) % 4 !== 0) {
		return carveSnake(level, args);
	}

	let template = fill(Math.floor((level[0].length-1) / 2), Math.floor((level.length-1) / 2));
	carveDFS(template);
	// print2d(template, t => t.accessible);

	for (let x = 0; x < template.length; x++) {
		for (let y = 0; y < template[x].length; y++) {
			for (let dx = -1; dx < 2; dx++) {
				for (let dy = -1; dy < 2; dy++) {
					let cur = {"x": 1 + 2*x + dx, "y": 1 + 2*y + dy};
					if (inBounds(cur.x, cur.y, level) && template[x][y].accessible) {
						if (!inBounds(x+dx, y+dy, template) || !template[x+dx][y+dy].accessible) {
							level[cur.x][cur.y].accessible = true;
						}
					}
				}
			}
		}
	}
}