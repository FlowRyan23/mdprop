import Requirements from "../checks";
import {carveDFS} from '../logic/maze_generators/backtracker';
import carveKruskal from '../logic/maze_generators/kruskal';
import {hamiltonian} from '../logic/maze_generators/unicursal';
import { carveNoise} from '../logic/maze_generators/random';
import create from "../levelGeneration";
import { Date } from "core-js";

const perfectLabyrinthReq = new Requirements();
perfectLabyrinthReq.name = "Perfect";
perfectLabyrinthReq.carver = carveDFS;

const braidedLabyrinthReq = new Requirements();
braidedLabyrinthReq.name = "Braid";
braidedLabyrinthReq.carver = carveKruskal;
braidedLabyrinthReq.braid = true;

const hamCycleLabyrinthReq = new Requirements();
hamCycleLabyrinthReq.name = "Hamiltonian Cycle";
hamCycleLabyrinthReq.carver = hamiltonian;

const whiteNoiseReq = new Requirements();
whiteNoiseReq.name = "White Noise";
whiteNoiseReq.carver = carveNoise;
whiteNoiseReq.carverArgs = {
	generator: "white",
	bias: 0.5
};

const whiteNoiseBlurReq = new Requirements();
whiteNoiseBlurReq.name = "Blurred White Noise";
whiteNoiseBlurReq.carver = carveNoise;
whiteNoiseBlurReq.carverArgs = {
	generator: "white",
	bias: 0.5,
	blur: true,
	kernel: "gaus3"
};

const perlinNoiseReq = new Requirements();
perlinNoiseReq.name = "Perlin Noise";
perlinNoiseReq.carver = carveNoise;
perlinNoiseReq.carverArgs = {
	generator: "perlin",
	bias: 0.5,
	frequency: 4
};

const perlinNoiseFractalReq = new Requirements();
perlinNoiseFractalReq.name = "Fractal Perlin Noise"
perlinNoiseFractalReq.carver = carveNoise;
perlinNoiseFractalReq.carverArgs = {
	generator: "perlin",
	frequency: 4,
	bias: 0.47,
	fractal: true,
	octaves: 4,
	fractalFrequency: 1,
	persistence: 0.8
};

const requirementsList = [perfectLabyrinthReq, braidedLabyrinthReq, hamCycleLabyrinthReq, whiteNoiseReq, whiteNoiseBlurReq, perlinNoiseReq, perlinNoiseFractalReq];
const configs = [
	{width: 4, height: 3, goals: 1, traps: 1},
	{width: 7, height: 5, goals: 2, traps: 2},
	{width: 11, height: 11, goals: 4, traps: 2},
	{width: 19, height: 15, goals: 8, traps: 4}
];


export default function evaluate() {
	for (const requirements of requirementsGenerator) {
		console.log("Checking: " + requirements.name);
		
		let successes = 0;
		let satisfactions = {
			connected : 0,
			deadEnds : 0,
			winnable : 0,
			partiallyWinnable : 0,
			survivable : 0,
			partiallySurvivable : 0,
			dangerous : 0,
			partiallyLost : 0,
			lost : 0,
			ambiguousPolicy : 0,
			trivialPolicy : 0
		}

		let startTime = Date.now();
		for (let i = 0; i < 100; i++) {
			let mdp = create(requirements, 1);
			
			if (requirements.check(mdp)) {
				successes++;
			}

			for (const constraint in satisfactions) {
				if (requirements.satisfaction[constraint]) {
					satisfactions[constraint]++;
				}
			}
		}
		
		console.log("took: " + Date.now() - startTime + "ms");
		console.log("succeeded " + successes + " time(s)");
		console.log(...satisfactions);
		
	}
}

function* requirementsGenerator() {
	for (const req of requirementsList) {
		for (const config of configs) {
			let currentReq = {...req};
			currentReq.width = config.width;
			currentReq.height = config.height;
			currentReq.goals = config.ngoals;
			currentReq.traps = config.ntraps;
			currentReq.name += "w:" + size.width + "-h:" + size.height + "-g:" + ngoals + "-t:" + ntraps;
			currentReq.connected = 'required';
			currentReq.deadEnds = 'required';
			currentReq.winnable = 'required';
			currentReq.partiallyWinnable = 'required';
			currentReq.survivable = 'required';
			currentReq.partiallySurvivable = 'required';
			currentReq.dangerous = 'required';
			currentReq.partiallyLost = 'required';
			currentReq.lost = 'required';
			currentReq.ambiguousPolicy = 'required';
			currentReq.trivialPolicy = 'required';
			yield currentReq;
		}
	}
}