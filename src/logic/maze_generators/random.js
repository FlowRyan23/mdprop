import { neighbors } from "../level";
import getNoise from "../noise/noise";
import store from "../sharedData";
import { randomSample, shuffle } from "../util";

const noKernel = [[1]];
// from https://www.researchgate.net/figure/Discrete-approximation-of-the-Gaussian-kernels-3x3-5x5-7x7_fig2_325768087
const gausKernel3 = [
	[1, 2, 1],
	[2, 4, 2],
	[1, 2, 1]
];
const gausKernel5 = [
	[1, 4, 7, 4, 1],
	[4, 16, 26, 16, 4],
	[7, 26, 41, 26, 7],
	[4, 16, 26, 16, 4],
	[1, 4, 7, 4, 1]
]

export function carveNoise(level, args={}) {
	let noise = getNoise(args);

	if (args.blur) {
		noise = sample(noise, level.length, level[0].length);
		let kernel = getKernel(args.kernel);
		if(store.state.dev) {
			if (args.width*args.height > 100) {
				kernel = gausKernel5;
			}
		}
		convolve(noise, kernel);
	}


	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			let X = x/level.length + 1e-6;
			let Y = y/level[x].length + 1e-6;

			let value = args.blur?
				noise[x][y]
				:noise.get(X, Y);
			if (value > args.bias) {
				level[x][y].accessible = true;
			}
		}
	}

	args.blur?
		store.commit("setPlotData", noise)
		:store.commit("setPlotData", sample(noise, level.length, level[0].length));

	return level;
}

function getKernel(name) {
	switch (name) {
		case "gaus3":
			return gausKernel3;
		case "gaus5":
			return gausKernel5;
		default:
			return noKernel;
	}
}

function sample(noise, width, height) {
	let s = [];
	for (let x = 0; x < width; x++) {
		s[x] = [];
		for (let y = 0; y < height; y++) {
			s[x][y] = noise.get(x/width +1e-6, y/height +1e-6);
		}
	}
	return s;
}

function convolve(values, kernel) {
	let valuesCopie = JSON.parse(JSON.stringify(values));
	for (let vx = 0; vx < values.length; vx++) {
		for (let vy = 0; vy < values[vx].length; vy++) {
			let sum = 0;
			let scale = 0;
			for (let kx = 0; kx < kernel.length; kx++) {
				for (let ky = 0; ky < kernel[kx].length; ky++) {
					let x = vx + kx - Math.floor(kernel.length / 2);
					let y = vy + ky - Math.floor(kernel[kx].length / 2);

					if(x >= 0 && x < values.length && y >= 0 && y < values[0].length) {
						sum += valuesCopie[x][y] * kernel[kx][ky];
						scale += kernel[kx][ky];
					}
				}
			}

			values[vx][vy] = sum / scale;
		}
	}
	return values;
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

	if (level.length < 5 || level[0].length < 5) {
		start = {x: 0, y: 0};
	}

	level[start.x][start.y].accessible = true;
	level.tries = 0;
	extend(level, start);
}

function extend(level, pos, count=0) {
	if (level.tries++ > 10000) {
		return true;
	}

	let potentials = shuffle(neighbors(level, pos, 2).filter(p=>!level[p.x][p.y].accessible));
	for (const neighbor of potentials) {
		// console.log("opened " + neighbor.x + ", " + neighbor.y);
		level[neighbor.x][neighbor.y].accessible = true;
		level[neighbor.x - (neighbor.x-pos.x)/2][neighbor.y - (neighbor.y-pos.y)/2].accessible = true;
		if (extend(level, neighbor, count+1)) {
			return true;
		} else {
			// console.log("closed " + neighbor.x + ", " + neighbor.y);
			level[neighbor.x][neighbor.y].accessible = false;
			level[neighbor.x - (neighbor.x-pos.x)/2][neighbor.y - (neighbor.y-pos.y)/2].accessible = false;
		}
	}
	let ratio = count / (Math.floor(level.length/2) * Math.floor(level[0].length/2));
	// console.log(count + " " + ratio);
	return ratio > 0.8;
}

export function placeRandom(level, tile, number, condition=()=>true) {
	if (number < 1) {
		return;
	}

	let selection = []
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			if (condition({x:x, y:y})) {
				selection.push({x: x, y: y});
			}
		}
	}
	selection = randomSample(selection, number);
	for (const pos of selection) {
		level[pos.x][pos.y] = tile;
	}
}