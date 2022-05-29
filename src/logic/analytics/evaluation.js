import Requirements from "../checks";
import {carveDFS} from '../maze_generators/backtracker';
import carveKruskal from '../maze_generators/kruskal';
import {hamiltonian} from '../maze_generators/unicursal';
import { carveNoise} from '../maze_generators/random';
import create from "../levelGeneration";
import { Date } from "core-js";

const perfectLabyrinthReq = new Requirements();
perfectLabyrinthReq._name = "Perfect";
perfectLabyrinthReq.carver = carveDFS;

const braidedLabyrinthReq = new Requirements();
braidedLabyrinthReq._name = "Braid";
braidedLabyrinthReq.carver = carveKruskal;
braidedLabyrinthReq.braid = true;

const hamCycleLabyrinthReq = new Requirements();
hamCycleLabyrinthReq._name = "Hamiltonian Cycle";
hamCycleLabyrinthReq.carver = hamiltonian;

const whiteNoiseReq = new Requirements();
whiteNoiseReq._name = "White Noise";
whiteNoiseReq.carver = carveNoise;
whiteNoiseReq.carverArgs = {
	generator: "white",
	bias: 0.5
};

const whiteNoiseBlurReq = new Requirements();
whiteNoiseBlurReq._name = "Blurred White Noise";
whiteNoiseBlurReq.carver = carveNoise;
whiteNoiseBlurReq.carverArgs = {
	generator: "white",
	bias: 0.5,
	blur: true,
	kernel: "gaus3"
};

const perlinNoiseReq = new Requirements();
perlinNoiseReq._name = "Perlin Noise";
perlinNoiseReq.carver = carveNoise;
perlinNoiseReq.carverArgs = {
	generator: "perlin",
	bias: 0.5,
	frequency: 4
};

const perlinNoiseFractalReq = new Requirements();
perlinNoiseFractalReq._name = "Fractal Perlin Noise"
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

export default async function evaluate() {
	for (const req of requirementsGenerator()) {
		console.log("checking " + req.name);
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
			let mdp = await create(req, 1)
			req.check(mdp);

			for (let constraint in satisfactions) {
				if (req.satisfaction[constraint]) {
					satisfactions[constraint]++;
				}
			}
		}

		console.log("took: " + (Date.now() - startTime) + "ms");
		// console.log("succeeded " + successes + " time(s)");
		console.log({...satisfactions});
	}
}

function* requirementsGenerator() {
	for (const req of requirementsList) {
		for (const config of configs) {
			req.width = config.width;
			req.height = config.height;
			req.goals = config.goals;
			req.traps = config.traps;
			req.name = req._name + "-w:" + config.width + "-h:" + config.height + "-g:" + config.goals + "-t:" + config.traps;
			req.connected = 'required';
			req.deadEnds = 'required';
			req.winnable = 'required';
			req.partiallyWinnable = 'required';
			req.survivable = 'required';
			req.partiallySurvivable = 'required';
			req.dangerous = 'required';
			req.partiallyLost = 'required';
			req.lost = 'required';
			req.ambiguousPolicy = 'required';
			req.trivialPolicy = 'required';
			yield req;
		}
	}
}