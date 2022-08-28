import * as Plotly from "plotly.js";
import linspace from "linspace";

export function lines(element, values, names=null, x=null, title=undefined, smooth=true) {
	x = x?x:linspace(1, values[0].length, values[0].length);
	let data = [];
	for (const set of values) {
		data.push({
			x: x,
			y: set,
			mode: 'lines',
			name: names?names.pop():undefined,
			line: {shape: smooth?'spline':'linear'}
		})
	}

	let layout = {
		title: title,
		legend: {
			y: 0.5,
			font: {size: 16},
			yref: 'paper'
	}};

	Plotly.newPlot(element, data, layout);
}

export function bars(element, values, x=null, title=undefined, name=undefined) {
	console.log(values);
	x = x?x:linspace(1, values[0].length-1, values[0].length-1);
	let data = [{
		x: x,
		y: values,
		type: 'bar',
		name: name
	}]

	let layout = {
		title: title,
		legend: {
			y: 0.5,
			traceorder: 'reversed',
			font: {size: 16},
			yref: 'paper'
	}};

	Plotly.newPlot(element, data, layout);
}