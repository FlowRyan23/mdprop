import { walkLevel } from "./level";

export default class Requirements {
	constructor() {
		this.carver = null;
		this.carverArgs = {};

		// integer constraints - can be > 0 or optional(null)
		// this.timeToConverge = null;			// number of iterations after wich the policy does not change
		this.size = { "width": 7, "height": 5 };
		this.numberOfGoals = null;
		this.numberOfTraps = null;

		// boolean constraints - can be required(true), optional(null) or disallowed(false)
		this.connected = null;					// every tile an agent can be on must be reachable from all other tiles
		this.deadEnds = null;						// dead ends exist in the world
		this.winnable = null;						// from all tiles a goal can be reached with a positve score
		this.partiallyWinnable = null;	// at least one tile has access to a goal with positve score
		this.survivable = null;					// from all tiles a goal can be reached
		this.partiallySurvivable = null	// at least one tile has acess to a goal
		this.dangerous = null;					// from all tiles a trap can be reached
		this.partiallyLost = null;			// at least one tile has a guaranteed negative score
		this.lost = null;								// all tiles have guaranteed negative scores
		this.ambiguousPolicy = null;		// the policy must atleast at one tile have two or more optimal actions
		this.trivialPolicy = null;			// the policy is equivalent to an optimal search for goals

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
			ambiguousPolicy: this.ambiguousPolicy===null?true:null,
			//phase5
			trivialPolicy: this.trivialPolicy===null?true:null
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

		let components = [];
		let tag = 1;
		for (const candidate of compCands) {
			if (!candidate.tag) {
				components.push(makeComponent(candidate, tag));
				tag++;
			}
		}

		let goals = this.phase3(components, strict);
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
			|| this.satisfaction.ambiguousPolicy === false)) {
			return false;
		}

		this.phase5(mdp, goals);
		mdp.reset();

		// console.log(JSON.stringify(this.satisfaction));
		for (const constraint in this.satisfaction) {
			if (Object.hasOwnProperty.call(this.satisfaction, constraint)) {
				if (!this.satisfaction[constraint]) {
					return false;
				}
			}
		}
		return true;
	}

	phase1(mdp, strict = false) {
		if (!mdp || !mdp.tiles) {
			throw new Error("level generation did not produce a mdp");
		}

		this.satisfaction.width = mdp.tiles.length !== this.size.width;
		if(strict && !this.satisfaction.width) return;
		
		this.satisfaction.height = mdp.tiles[0].length !== this.size.height;
		if(strict && !this.satisfaction.height) return;
	}

	phase2(mdp, strict = false) {
		let componentCandidates = [];	// will be used in phase3 to calculate subcomponents
		let tileCounts = {
			wall: 0,
			free: 0,
			rewarding: 0,
			penalising: 0,
			goal: 0,
			trap: 0,
			exit: 0
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

			// dead end check; only performed if relevant and not yet determined
			// TODO should dead ends that are terminal be considered dead?
			if (this.deadEnds !== null
				&& this.satisfaction.deadEnds === null
				&& tile.neighbors().filter(t => t.accessible).length < 2) {
				this.satisfaction.deadEnds = this.deadEnds;
				if (strict) {
					return;
				}
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

		if(this.satisfaction.deadEnds === null) this.satisfaction.deadEnds = !this.deadEnds;
		this.satisfaction.goals = tileCounts.goal === this.numberOfGoals;
		this.satisfaction.traps = tileCounts.trap === this.numberOfTraps;

		return componentCandidates;
	}

	phase3(components, strict=false) {
		let goals = [];

		// full reacability can be checked by length of component list
		this.satisfaction.connected = matches(this.connected, components.length===1);
		if (strict && !this.satisfaction.connected) {
			return;
		}

		// TODO strict exits
		let survivable = 0;
		let dangerous = 0;
		for (const component of components) {
			for (const terminal of component.terminals) {
				if (terminal.reward > 0) {
					survivable++;
					goals.push({x:terminal.x, y:terminal.y});
				} else if (terminal.reward < 0) {
					dangerous++;
				}
			}
		}


		this.satisfaction.survivable = matches(this.survivable, components.length === survivable);
		// TODO are survivable worlds also parially survivable?
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
		let ambiguousPolicy = false;
		
		for (const tile of mdp.allMatching(t => t.accessible && !t.terminal)) {
			counts.total++;
			let qValue = tile.getQValue();
			if (qValue > 0) {
				counts.winnable++;
			} else if(qValue < 0) {
				counts.lost++;
			}

			if (tile.isAmbiguous()) {
				ambiguousPolicy = true;
			}
		}

		this.satisfaction.winnable = matches(this.winnable, counts.winnable === counts.total);
		this.satisfaction.partiallyWinnable = matches(this.partiallyWinnable, counts.winnable > 0 && counts.winnable < counts.total);
		this.satisfaction.lost = matches(this.lost, counts.lost === counts.total);
		this.satisfaction.partiallyLost = matches(this.partiallyLost, counts.lost > 0 && counts.lost < counts.total);
		this.satisfaction.ambiguousPolicy = matches(this.ambiguousPolicy, ambiguousPolicy);
	}

	phase5(mdp, goals) {
		walkLevel(mdp.tiles, goals, t => t.accessible);
		for (const tile of mdp.allMatching(t => t.accessible && !t.terminal)) {
			let target = tile.actions[tile.bestAction()].getResult("front").node;
			if (target.pathCost !== tile.pathCost - 1) {
				this.satisfaction.trivialPolicy = matches(this.trivialPolicy, false);
				return;
			}
		}
		this.satisfaction.trivialPolicy = matches(this.trivialPolicy, true);
	}

}

function matches(constraint, value) {
	return constraint===null || constraint===value;
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

		current.tag = tag;
		current.closed = true;
		component.tiles.push(current);
		if (current.terminal) {
			component.terminals.push(current);
			continue;
		}

		for (const neighbor of current.neighbors().filter(t => t.accessible && !t.closed)) {
			fringe.unshift(neighbor);
		}
	}

	return component;
}
