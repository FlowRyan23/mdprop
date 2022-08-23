import Requirements from "../checks";
import {carveDFS} from '../maze_generators/backtracker';
import carveKruskal, { carveErdosReny } from '../maze_generators/kruskal';
import {carveUnicursal} from '../maze_generators/unicursal';
import { carveNoise } from '../maze_generators/random';
import create from "../levelGeneration";
import { Date } from "core-js";
import { bars, lines } from "./plots";
import linspace from "linspace";

const perfectLabyrinthReq = new Requirements();
perfectLabyrinthReq._name = "Perfect";
perfectLabyrinthReq.carver = carveDFS;

const braidedLabyrinthReq = new Requirements();
braidedLabyrinthReq._name = "Braid";
braidedLabyrinthReq.carver = carveKruskal;
braidedLabyrinthReq.braid = true;

const hamCycleLabyrinthReq = new Requirements();
hamCycleLabyrinthReq._name = "Hamiltonian Cycle";
hamCycleLabyrinthReq.carver = carveUnicursal;

const erdosReq = new Requirements();
erdosReq._name = "Erdos-Renyi";
erdosReq.carver = carveErdosReny;
erdosReq.carverArgs = {
	probability: 0.2
};

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
	bias: 0.5,
	fractal: true,
	octaves: 4,
	amplitude: 1,
	fractalFrequency: 1,
	persistence: 0.8
};

const requirementsList = [perfectLabyrinthReq, braidedLabyrinthReq, hamCycleLabyrinthReq, erdosReq, whiteNoiseReq, whiteNoiseBlurReq, perlinNoiseReq, perlinNoiseFractalReq];
// const labGens = [perfectLabyrinthReq, braidedLabyrinthReq, hamCycleLabyrinthReq];
const noiseGens = [whiteNoiseReq, whiteNoiseBlurReq, perlinNoiseReq, perlinNoiseFractalReq];
const configs = [
	{width: 4, height: 3, goals: 1, traps: 1},
	{width: 7, height: 5, goals: 2, traps: 2},
	{width: 11, height: 11, goals: 4, traps: 2},
	{width: 19, height: 15, goals: 8, traps: 4}
];
const settings = [
	{
		stepCost: 0,
		discount: 0.9,
		scFront: 0.8,
		scBack: 0,
		scLeft: 0.1,
		scRight: 0.1
	},
	
	{
		stepCost: 0.1,
		discount: 0.95,
		scFront: 0.8,
		scBack: 0,
		scLeft: 0.1,
		scRight: 0.1
	},
	
	{
		stepCost: 0.1,
		discount: 0.9,
		scFront: 0.6,
		scBack: 0.1,
		scLeft: 0.15,
		scRight: 0.15
	}
]

export default async function evaluate() {
	let nSamples = 100;
	for (const base of requirementsList) {
		console.log("checking " + base._name);
		let satisfactions = {
			connected : 0,
			deadEnds : 0,
			winnable : 0,
			partiallyWinnable : 0,
			survivable : 0,
			partiallySurvivable : 0,
			partiallyDangerous: 0,
			dangerous : 0,
			partiallyLost : 0,
			lost : 0,
			unambiguous : 0,
			trivial : 0
		}

		let startTime = Date.now();
		for (const req of requirementsGenerator(base)) {
			// console.log("checking: " + base.name);
			for (let i = 0; i < nSamples; i++) {
				let result = await create(req, 1);
				result.mdp.apply(req.settings);
				req.check(result.mdp);
	
				for (let constraint in satisfactions) {
					if (req.satisfaction[constraint]) {
						satisfactions[constraint]++;
					}
				}
			}
		}

		let timeMS = Date.now() - startTime;
		console.log("took: " + timeMS + "ms | Avrg: " + timeMS/(nSamples*12));
		// console.log("succeeded " + successes + " time(s)");
		// console.log({...satisfactions});
		console.log(satTexStr(satisfactions, nSamples*12));
	}
}

function* requirementsGenerator(base) {
	for (const setting of settings) {
		for (const config of configs) {
			base.settings = setting;
			base.width = config.width;
			base.height = config.height;
			base.carverArgs.width = config.width;
			base.carverArgs.height = config.height;
			base.goals = config.goals;
			base.traps = config.traps;
			base.name = base._name + "-w:" + config.width + "-h:" + config.height + "-g:" + config.goals + "-t:" + config.traps;
			base.connected = 'required';
			base.deadEnds = 'required';
			base.winnable = 'required';
			base.partiallyWinnable = 'required';
			base.survivable = 'required';
			base.partiallySurvivable = 'required';
			base.partiallyDangerous = 'required';
			base.dangerous = 'required';
			base.partiallyLost = 'required';
			base.lost = 'required';
			base.unambiguous = 'required';
			base.trivial = 'required';
			yield base;
		}
	}
}

function satTexStr(sat, n) {
	let l = [sat.connected, sat.deadEnds, sat.winnable, sat.partiallyWinnable, sat.survivable,
		sat.partiallySurvivable, sat.partiallyDangerous, sat.dangerous, sat.lost, sat.partiallyLost, sat.unambiguous, sat.trivial];

	// console.log(l);
	
	l = l.map(v => (100*v/n).toFixed(1));
	// console.log(l);

	return l.join(" & ").replaceAll(".", ",") + " \\\\"; 
}

export async function noiseConnectivity(element) {
	let names = ["Fraktal", "Perlin", "Blur", "Weiß"];
	// let sizes = [3, 5, 11, 20, 50, 100, 200];
	let sizes = linspace(1, 25, 25);
	let samples = 100;
	
	let values = [];
	for (const req of noiseGens) {
		let set = [];
		for (const size of sizes) {
			req.connected = "required";
			req.width = size;
			req.height = size;
			req.carverArgs.width = size;
			req.carverArgs.height = size;
			
			let value = 0;
			for (let i = 0; i < samples; i++) {
				let result = await create(req, 1);
				req.check(result.mdp);
				if (req.satisfaction.connected) {
					value++;
				}
			}
			set.push(value/samples);
		}
		values.push(set);
	}

	lines(element, values, names, sizes, "Wahrscheinlichkeit der Verbundenheit");
}

export async function randomPathSparsity(element) {
	let req = new Requirements();
	req.carver = carveUnicursal;
	req.carverArgs = {};

	let samples = 10;
	let sizes = linspace(1, 50, 50);
	let values = [];
	for(let size of sizes) {
		console.log("doing " + size);
		req.width = size;
		req.height = size;

		let value = 0;
		for (let i = 0; i < samples; i++) {
			let result = await create(req, 1);
			req.check(result.mdp);
			
			let freeCount = [...result.mdp.allMatching(t => t.accessible)].length;
			let freeRatio = freeCount / (result.mdp.tileCount());
			value += freeRatio * 100;
			
			// console.log("----");
			// console.log(freeCount);
			// console.log(freeRatio);
			// console.log(freeRatio * 100);
		}
		values.push(value/samples);
	}

	bars(element, values, sizes, "Spärlichkeit in %");
}