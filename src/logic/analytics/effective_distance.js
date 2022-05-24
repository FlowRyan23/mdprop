import * as Plotly from "plotly.js";
import { walkLevel } from "../level";
import GridMDP from "../mdp_prop";

export function amigousPrediction(level) {
	let dEff = {};

	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[0].length; y++) {
			// walkLevel(level, {x: x, y:y}, pos => level[pos.x][pos.y].accessible, )
		}
	}
}

export function plotAvrgDistance(element, level) {
	let mdp = new GridMDP(level, 1, 1);
	let start = mdp.getAny(t=>t.terminal);
	walkLevel(mdp.level, {x:start.x, y:start.y}, t => mdp.level[t.x][t.y].accessible);
	// print2d(mdp.level, t=>t.pathCost);

	let data = [];
	let settings =  {
		stepCost: 1,
		discount: 1,
		"scFront": 1,
		"scLeft": 0,
		"scRight": 0,
		"scBack": 0
	};

	let fidelity = 50;
	for (let noise = 0; noise <= fidelity; noise++) {
		let row = [];
		for (let back = 0; back <= fidelity; back++) {
			if (back <= noise) {
				settings.scFront = 1 - (noise/fidelity);
				settings.scLeft = (noise - back) / (2*fidelity);
				settings.scRight = (noise - back) / (2*fidelity);
				settings.scBack = back / fidelity;
	
				mdp.reset();
				mdp.apply(settings);
				
				mdp.calculate(100);
				row.push(averageDistanceRatio(mdp));
			}
		}
		data.push(row);
	}

	// print2d(data);
	let dt = fidelity / 5;
	let layout =  {
		autosize: false,
		width: 500,
		height: 500,
		xaxis: {
			tickmode: "array",
			tickvals: [0, 1*dt, 2*dt, 3*dt, 4*dt, 5*dt],
			ticktext: [0 + "%", 1*dt*100/fidelity + "%", 2*dt*100/fidelity + "%", 3*dt*100/fidelity + "%", 4*dt*100/fidelity + "%", 5*dt*100/fidelity + "%"]
		},
		yaxis: {
			tickmode: "array",
			tickvals: [0, 1*dt, 2*dt, 3*dt, 4*dt, 5*dt],
			ticktext: [0 + "%", 1*dt*100/fidelity + "%", 2*dt*100/fidelity + "%", 3*dt*100/fidelity + "%", 4*dt*100/fidelity + "%", 5*dt*100/fidelity + "%"]
		}
	}
	Plotly.newPlot(element, [{z: data, type: 'heatmap'}], layout);
}

export function plotFitting(element) {
	let data = [];
	let fidelity = 5;
	for (let noise = 0; noise <= fidelity; noise++) {
		let row = [];
		for (let back = 0; back <= fidelity; back++) {
			if (back <= noise) {
				let x = noise/fidelity;
				let y = back/fidelity;
				x = x - 0.75;
				y = y - 0.25;
				// let a = 1/Math.log(0.1*(x**2 + y**2));
				// let b = Math.abs(x-y);
				row.push(-10*x*y - (x**2 + y**2)**0.4);
			}
		}
		data.push(row);
	}

	let layout =  {
		title: "Fitting AED",
		autosize: false,
		width: 500,
		height: 500
	}
	Plotly.newPlot(element, [{z: data, type: 'heatmap'}], layout);
}

function averageDistanceRatio(mdp) {
	// let max = 0;
	let sum = 0;
	let count = 0;
	for (let x = 0; x < mdp.tiles.length; x++) {
		for (let y = 0; y < mdp.tiles[0].length; y++) {
			if (mdp.level[x][y].accessible && !mdp.level[x][y].terminal) {
				// if(mdp.tiles[x][y].getQValue() < max) {
				// 	max = mdp.tiles[x][y].getQValue()
				// }

				// console.log("q: " + mdp.tiles[x][y].getQValue() + ", d: " + mdp.level[x][y].pathCost);

				sum += mdp.tiles[x][y].getQValue() / mdp.level[x][y].pathCost;
				count++;
			}
		}
	}
	return - sum / count; // cost is calculated as negative values
	// return -max;
}