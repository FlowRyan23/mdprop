import { walkLevel } from "./level";

export default class Requirements {
	constructor() {
		this.carver = null;
		this.carverArgs = {};

		// integer constraints - can be > 0 or optional(null)
		// this.timeToConverge = null;			// number of iterations after wich the policy does not change
		this.width = null;
		this.height = null;
		this.goals = null;
		this.traps = null;

		// boolean constraints - can be required(true), optional(null) or forbidden(false)
		this.connected = null;					// every tile an agent can be on must be reachable from all other tiles
		this.deadEnds = null;						// dead ends exist in the world
		this.winnable = null;						// from all tiles a goal can be reached with a positve score
		this.partiallyWinnable = null;	// at least one tile has access to a goal with positve score
		this.survivable = null;					// from all tiles a goal can be reached
		this.partiallySurvivable = null	// at least one tile has acess to a goal
		this.dangerous = null;					// from all tiles a trap can be reached
		this.partiallyLost = null;			// at least one tile has a guaranteed negative score
		this.lost = null;								// all tiles have guaranteed negative scores
		this.unambiguous = null;				// the policy must only recomend one action in each tile
		this.trivial = null;			// the policy is equivalent to an optimal search for goals

		this.satisfaction = null;		// keeps track of which constraints are met and which aren't
	}

	reset() {
		this.satisfaction = {
			// phase1
			width: null,
			height: null,
			// phase2
			goals: null,
			traps: null,
			deadEnds: this.deadEnds===null?true:null,
			// phase3
			connected: this.connected===null?true:null,
			survivable: this.survivable===null?true:null,
			partiallySurvivable: this.partiallySurvivable===null?true:null,
			dangerous: this.dangerous===null?true:null,
			// phase4
			winnable: this.winnable===null?true:null,
			partiallyWinnable: this.partiallyWinnable===null?true:null,
			lost: this.lost===null?true:null,
			partiallyLost: this.partiallyLost===null?true:null,
			unambiguous: this.unambiguous===null?true:null,
			//phase5
			trivial: this.trivial===null?true:null
		};
	}

	check(mdp, strict = false) {
		this.reset();
		this.phase1(mdp, strict);
		if (strict && (this.satisfaction.width === false || this.satisfaction.height === false)) {
			return false;
		}

		let compCands = this.phase2(mdp, strict);
		if (strict && (
			this.satisfaction.deadEnds === false
			|| this.satisfaction.goals === false
			|| this.satisfaction.traps === false)) {
			return false;
		}

		let goals = this.phase3(getComponents(compCands), strict);
		if (strict && (
			this.satisfaction.connected === false
			|| this.satisfaction.survivable === false
			|| this.satisfaction.partiallySurvivable === false
			|| this.satisfaction.dangerous === false)) {
			return false;
		}

		this.phase4(mdp);
		if (strict && (
			this.satisfaction.winnable === false
			|| this.satisfaction.partiallyWinnable === false
			|| this.satisfaction.lost === false
			|| this.satisfaction.partiallyLost === false
			|| this.satisfaction.unambiguous === false)) {
			return false;
		}

		this.phase5(mdp, goals);
		mdp.reset();

		// console.log(this.toString());
		for (const constraint in this.satisfaction) {
				if (!this.satisfaction[constraint]) {
					return false;
				}
		}
		return true;
	}

	phase1(mdp, strict = false) {
		if (!mdp || !mdp.tiles) {
			throw new Error("level generation did not produce a mdp");
		}

		this.satisfaction.width = mdp.tiles[0].length === this.width;
		if(strict && !this.satisfaction.width) return;
		
		this.satisfaction.height = mdp.tiles.length === this.height;
		if(strict && !this.satisfaction.height) return;
	}

	// TODO strict exits
	phase2(mdp) {
		let componentCandidates = [];	// will be used in phase3 to calculate subcomponents
		let tileCounts = {
			wall: 0,
			free: 0,
			rewarding: 0,
			penalising: 0,
			goal: 0,
			trap: 0,
			exit: 0,
			dead: 0
		}

		// for (let x = 0; x < mdp.tiles.length; x++) {
		// 	for (let y = 0; y < mdp.tiles[x].length; y++) {

		// 	}
		// }

		for (const tile of mdp.allTiles()) {
			// wall counter; walls are otherwise uninteresting -> skip to the next tile
			if (!tile.accessible) {
				tileCounts.wall++;
				continue;
			}

			// dead end check
			// TODO should dead ends that are terminal be considered dead?
			if (tile.neighbors().filter(t => t.accessible).length < 2) {
				tileCounts.dead++;
			}

			if (tile.terminal) {
				// counters for goals, traps and exits
				if (tile.reward > 0) {
					tileCounts.goal++;
				} else if (tile.reward < 0) {
					tileCounts.trap++;
				} else {
					tileCounts.exit++;
				}
			} else {
				// counters for goals, traps and exits
				if (tile.reward > 0) {
					tileCounts.rewarding++;
				} else if (tile.reward < 0) {
					tileCounts.penalising++;
				} else {
					tileCounts.free++;
				}

				// this tile is valid as anchor for a component
				componentCandidates.push(tile);
			}
		}

		// console.log("dead " + tileCounts.dead);
		this.satisfaction.deadEnds = matches(this.deadEnds, tileCounts.dead !== 0);
		this.satisfaction.goals = tileCounts.goal === this.goals;
		this.satisfaction.traps = tileCounts.trap === this.traps;

		return componentCandidates;
	}

	phase3(components, strict=false) {
		let goals = [];

		// full reachability can be checked by length of component list
		this.satisfaction.connected = matches(this.connected, components.length===1);
		if (strict && !this.satisfaction.connected) {
			return;
		}

		// TODO strict exits
		let survivable = 0;
		let dangerous = 0;
		for (const component of components) {
			let currentIsDangerous = false;
			let currentIsSurvivable = false;
			for (const terminal of component.terminals) {
				if (terminal.reward > 0 && !currentIsSurvivable) {
					survivable++;
					currentIsSurvivable = true;
					goals.push({x:terminal.x, y:terminal.y});
				} else if (terminal.reward < 0 && !currentIsDangerous) {
					dangerous++;
					currentIsDangerous=true;
				}
			}
		}


		this.satisfaction.survivable = matches(this.survivable, components.length === survivable);
		this.satisfaction.partiallySurvivable = matches(this.partiallySurvivable, survivable > 0 && survivable < components.length);
		this.satisfaction.dangerous = matches(this.dangerous, components.length === dangerous);

		return goals;
	}

	phase4(mdp) {
		// TODO strict breaks
		let policyStagnation = 0;
		let startTime = Date.now();
		while (policyStagnation < 5 && Date.now() - startTime < 1e+3) {
			// TODO use mdp.calculate(n) to reduce checks if neccessary
			if(mdp.next()) {
				policyStagnation = 0;
			} else {
				policyStagnation++;
			}
		}

		let counts = {
			total: 0,
			winnable: 0,
			lost: 0
		}
		let unambiguous = true;
		
		for (const tile of mdp.allMatching(t => t.accessible && !t.terminal)) {
			counts.total++;
			let qValue = tile.getQValue();
			if (qValue > 0) {
				counts.winnable++;
			} else if(qValue < 0) {
				counts.lost++;
			}

			if (tile.isAmbiguous()) {
				unambiguous = false;
			}
		}

		this.satisfaction.winnable = matches(this.winnable, counts.winnable === counts.total);
		this.satisfaction.partiallyWinnable = matches(this.partiallyWinnable, counts.winnable > 0 && counts.winnable < counts.total);
		this.satisfaction.lost = matches(this.lost, counts.lost === counts.total);
		this.satisfaction.partiallyLost = matches(this.partiallyLost, counts.lost > 0 && counts.lost < counts.total);
		this.satisfaction.unambiguous = matches(this.unambiguous, unambiguous);
	}

	phase5(mdp, goals) {
		// calculate distances of all tiles with policies (accessible and not terminal) from goals
		// tile.pathCost will contain the distance in steps from the nearest goals
		walkLevel(mdp.tiles, goals, p => mdp.tiles[p.x][p.y].accessible && !mdp.tiles[p.x][p.y].terminal);

		// converged policy from phase 4 is compared with distances
		for (const tile of mdp.allMatching(t => t.accessible && !t.terminal)) {
			let target = tile.actions[tile.bestAction()].getResult("front").node;

			// one step in the direction of the policy should reduce distance by 1 if the policy is trivial
			if (target.pathCost !== tile.pathCost - 1) {
				this.satisfaction.trivial = matches(this.trivial, false);
				return;
			}
		}
		this.satisfaction.trivial = matches(this.trivial, true);
	}

	toString() {
		let s = "Check results:\n";
		for (const criteria in this.satisfaction) {
			s += "\t" + criteria + ": " + this.satisfaction[criteria] + " (" + this[criteria] + ")\n";
		}
		return s;
	}

}

function matches(constraint, value) {
	return constraint==="optional" || constraint===(value?"required":"forbidden");
}

function getComponents(candidates) {
	let components = [];
		let tag = 1;
		for (const candidate of candidates) {
			if (!candidate.tag) {
				components.push(makeComponent(candidate, tag));
				tag++;
			}
		}
	return components;
}

/**
 * 
 * @param {MDPTile} start an initial accessible non terminal tile anchoring the component
 * @param {*} tag identifier added to tiles to facilitate component.contains
 * @returns Component with list of all connected tiles and a list of terminal tiles
 */
function makeComponent(start, tag) {
	let component = {
		tiles: [],
		terminals: []
	}
	let fringe = [start];
	while (fringe.length > 0) {
		let current = fringe.pop()
		if (current.closed) {
			continue;
		}

		component.tiles.push(current);
		if (current.terminal) {
			component.terminals.push(current);
			continue;
		} else {
			// terminals are not closed or tagged, because multiple components may share them
			current.tag = tag;
			current.closed = true;
		}

		for (const neighbor of current.neighbors().filter(t => t.accessible && !t.closed)) {
			fringe.unshift(neighbor);
		}
	}

	return component;
}
