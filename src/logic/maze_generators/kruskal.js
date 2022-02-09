import { walkLevel } from "../level";
import { randomSample } from "../util";

export default function kruskal(level, edgeLength = 2) {
	// edges are shuffeled once to choose randomly
	let edges = genEdges(level, edgeLength, true, false);
	console.log("found " + edges.length + " edges");
	edges = randomSample(edges, edges.length);
	console.log("selected " + edges.length + " edges");
	// edges.forEach(e => e.forEach(t => console.log(t)));

	// gives each tile its own identifier; used to check if two tiles are part of the same connected tree
	let count = 0;
	for (let x = 0; x < level.length; x++) {
		for (let y = 0; y < level[x].length; y++) {
			level[x][y].partition = count++
		}
	}

	while (edges.length > 0) {
		let currentEdge = edges.pop();

		if (allSeperate(level, currentEdge)) {
			// print2d(level, t => t.partition);
			// console.log("adding edge from " + currentEdge[0].x + ", " + currentEdge[0].y + " to " + currentEdge[currentEdge.length-1].x + ", " + currentEdge[currentEdge.length-1].y);
			let newPartition = level[currentEdge[0].x][currentEdge[0].y].partition;
			for (const pos of currentEdge) {
				// carve the new edge into the level
				level[pos.x][pos.y].accessible = true;

				// joins the partitions of the edge's starting and the current tile
				let oldPartition = level[pos.x][pos.y].partition;
				if (oldPartition !== newPartition) {
					// console.log("walking from " + pos.x + ", " + pos.y + " with partition " + oldPartition);
					walkLevel(level, pos, p => level[p.x][p.y].partition === oldPartition, p => level[p.x][p.y].partition = newPartition);
				}
			}
		}
	}
	// print2d(level, t => t.partition);

	return level;
}

/**
 * Creates a list of all possible sets of linearly contiunuos adjacent tiles of length edgeLength within level
 */
function genEdges(level, edgeLength, modulated = false, includeSmaller = false) {
	if (edgeLength < 1) edgeLength = 1;

	if (includeSmaller) return genSubEdges(level, edgeLength, modulated);

	let edges = [];

	let increment = modulated ? edgeLength : 1;

	for (let x = 0; x < level.length; x += increment) {
		for (let y = 0; y < level[x].length; y += increment) {
			if (x + edgeLength < level.length) {
				let edge = [];
				for (let i = 0; i <= edgeLength; i++) {
					edge.push({ "x": x + i, "y": y });
				}
				edges.push(edge);
			}

			if (y + edgeLength < level[x].length) {
				let edge = [];
				for (let i = 0; i <= edgeLength; i++) {
					edge.push({ "x": x, "y": y + i });
				}
				edges.push(edge);
			}
		}
	}

	return edges;
}

function genSubEdges(level, edgeLength, modulated = true) {
	let edges = [];

	for(let l=edgeLength; l > 0; l--) {
		edges.pushAll(genEdges(level, l, modulated));
	}

	return edges;
}

/**
 * check if alle tiles at coordinates contained in edge are part of different partitions
 * @param {C} level 
 * @param {*} edge 
 * @returns true if alle partitions are different
 */
function allSeperate(level, edge) {
	let partitions = new Set([]);
	// console.log("partition check");

	for (const pos of edge) {
		// console.log("checking partition " + level[pos.x][pos.y].partition + " of " + pos.x + ", " + pos.y);
		if (partitions.has(level[pos.x][pos.y].partition)) {
			// console.log(partitions + " contains " + level[pos.x][pos.y].partition);
			return false;
		}

		partitions.add(level[pos.x][pos.y].partition)
	}

	return true;
}