import { fill } from "../level";
import store from "../sharedData";
import { inBounds } from "../util";
import { carveDFS } from "./backtracker";

export function hamiltonian(level) {
	if (store.state.dev) {
		if((level.length - 3) % 4 !== 0) console.warn("level width should be one less than a multiple of 4 (is " + level.length + ")");
		if((level[0].length - 3) % 4 !== 0) console.warn("level height should be one less than a multiple of 4 (is " + level[0].length + ")");
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