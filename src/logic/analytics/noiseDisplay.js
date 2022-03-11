import * as Plotly from "plotly.js";
import { Fractal, PerlinNoise } from "../noise/noise";
import store from "../sharedData";

export function perlin(element) {
	let noise = new PerlinNoise(5);
	let resolution = 50;
	let data = [];
	for (let x = 0; x < resolution; x++) {
		data[x] = [];
		for (let y = 0; y < resolution; y++) {
			data[x][y] = noise.get(x/resolution, y/resolution);
		}
	}

	Plotly.newPlot(element, [{z: data, type: 'heatmap'}]);
}

export function fractalPerlin(element) {
	let noise = new Fractal(new PerlinNoise(), 6, 1, 1, 0.6);

	let resolution = 50;
	let data = [];
	for (let x = 0; x < resolution; x++) {
		data[x] = [];
		for (let y = 0; y < resolution; y++) {
			data[x][y] = noise.get(x/resolution, y/resolution);
		}
	}

	Plotly.newPlot(element, [{z: data, type: 'heatmap'}]);
}

export function plotSaved(element) {
	let layout =  {
		width: 500,
		height: 500
	}
	Plotly.newPlot(element, [{z: store.state.savedPlotData, type: 'heatmap'}], layout);
}