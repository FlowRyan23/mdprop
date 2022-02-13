export default class Requirements {
	constructor() {
		/** 
		 * The different requirements have different probabilities for being met when
		 * set to optional, e.g. 'goal' and 'death' are likely to be true but 'fullyAmbigousPolicy'
		 * is likely to be false.
		 * 
		 * Some Requirements imply others:
		 * 		winnable -> goal
		 * 		losable -> death
		 * 		noUnreachableGoal -> goal
		 * 		noUnreachableDeath -> death
		 * 		fullyReachableGoals -> goal and winnable and noUnreachableGoal
		 * 		size.width + size.height > timeToConverge -> false (unless the level has thick edges)
		 * 		etc.
		 */

		this.size = {"width": 7, "height": 5};
		this.connectivity = 0.3;			// likelyhood of any tile being accessible

		this.carver = null;
		
		// boolean constraints - can be required(true), optional(null) or disallowed(false)
		this.fullReachability = null;		// every tile an agent can be on must be reachable from all other tiles
		this.winnable = null;				// from any location a goal can be reached
		this.losable = null;				// from any loaction a death can be reached
		this.noUnreachableGoal = null;		// every goal must be reachable from at least one location
		this.noUnreachableDeath = null;		// every death must be reachable from at least one location
		this.fullyReachableGoals = null;	// every goal must be reachable from all locations
		this.fullyReachableDeaths = null;	// every death must be reachable from all locations
		this.unambigousPolicy = null;		// the policy can not have any location at wich two or more actions are rated equally as best actions
		this.fullyAmbigousPolicy = null;	// at all locations the policy must have at least two equally rated actions as best actions
		
		// integer constraints - can be > 0 or optional(null)
		this.timeToConverge = null;			// number of iterations after wich the policy does not change
		this.numberOfGoals = null;
		this.numberOfTraps = null;
	}

	check(mdp, full=false) {
		let failed = [];
		// TODO implications can be used to improve performance -> ordring matters
		// TODO some tests are more costly so they should be done later

		// the size check is the fastest with O(1) so it is done first eventhough the
		// likelyhood of it being false is very low (would need to be provoked intentionally)
		if (mdp.size().width !== this.size.width || mdp.size().height !== this.size.height) {
			failed.push("size");
			if (!full) return false;
		}

		if (this.fullReachability !== null && this.fullReachability !== fullyReachable(mdp)) {
			failed.push("fullReachability");
			if(!full) return false;
		}

		if (this.goal !== null) {
			let goalTile = mdp.getAny(t => t.terminal && t.reward > 0)
			let fullfillsGoal = (goalTile !== null && this.goal) || (goalTile === null && !this.goal);
			if(!fullfillsGoal) failed.push("goal");
			if(!full && !fullfillsGoal) return false;
		}

		if (this.death !== null) {
			let deathTile = mdp.getAny(t => t.terminal && t.reward < 0)
			let fullfillsDeath = (deathTile !== null && this.death) || (deathTile === null && !this.death);
			if(!fullfillsDeath) failed.push("death");
			if(!full && !fullfillsDeath) return false;
		}

		// TODO winnable and losable could be combined
		if (this.winnable !== null && this.winnable !== winnable(mdp)) {
			failed.push("winnable");
			if(!full) return false;
		}

		if (this.losable !== null && this.losable !== losable(mdp)) {
			failed.push("losable");
			if(!full) return false;
		}

		if (this.noUnreachableGoal !== null && this.noUnreachableGoal !== noUnreachableGoal(mdp)) {
			failed.push("noUnreachableGoals");
			if(!full) return false;
		}

		if (this.noUnreachableDeath !== null && this.noUnreachableDeath !== noUnreachableDeath(mdp)) {
			failed.push("noUnreacheableDeaths");
			if(!full) return false;
		}

		if (this.fullyReachableGoals !== null && this.fullyReachableGoals !== fullyReachableGoals(mdp)) {
			failed.push("fullyReachableGoals");
			if(!full) return false;
		}

		if (this.fullyReachableDeaths !== null && this.fullyReachableDeaths !== fullyReachableDeaths(mdp)) {
			failed.push("fullyReachableDeaths");
			if(!full) return false;
		}

		// TODO policy tests
		if (full) return failed;
		else return true;
	}

	
}

function* traverse(start, mode="bfs") {
	let fringe = [start];
	let visited = {}
	while (fringe.length > 0) {
		let current = fringe.pop()
		visited[current] = true
		yield current

		if (!current.terminal)
			for (let action of current.actions)
				for (let result of action.results)
					if (!visited[result.node])
						if (mode === "bfs")
							fringe.unshift(result.node)
						else
							fringe.push(result.node)
	}
}

function fullyReachable(mdp) {
	/**
	 * 1. choose one starting tile
	 * 2. mark all tiles connected to this tile via breadth first search
	 * 3. check all tiles if they have been marked
	 * 
	 * time complexity:
	 * 	n = number of tiles (mdp.size.width * mdp.size.height)
	 * 	worst case:
	 * 		- getAny returns the last tile -> n	(this result could be cached to save time on subsequent calls)
	 * 		- all tiles are reachable -> traverseBFS -> n
	 * 		- all tiles were marked -> n
	 * 		=> O(3n)
	 */
	let marked = {}
	for(let tile of traverse(mdp.getAny(t => t.accessible)))
		marked[tile] = true

	for(let tile of mdp.allTiles) {
		if (!marked[tile]) {
			return false
		}
	}
	return true
}

function winnable(mdp) {
	/**
	 * 1. find all goals
	 * 2. mark all tiles connected to them via bfs
	 * 3. check if any tile is not marked
	 * 
	 * time complexity:
	 * 	n = number of tiles (mdp.size.width * mdp.size.height)
	 * 	
	 * 	as the number of goals increases more traversals are performed -> nGoals * n
	 * 	but at the same time less paths are available, because goals are terminal
	 * 	=> if all tiles are goal n traversals are started but they all finish in O(1)
	 * 		so the worst case is somewhere in between
	 */
	let marked = {}
	for(let goal of mdp.allMatching(t => t.terminal && t.reward > 0))
		for(let tile of traverse(goal))
			marked[tile] = true

	for(let tile of mdp.allTiles) {
		if (!marked[tile]) {
			return false
		}
	}
	return true
}

function losable(mdp) {
	/**
	 * 1. find all goals
	 * 2. mark all tiles connected to them via bfs
	 * 3. check if any tile is not marked
	 * 
	 * time complexity:
	 * 	see winnable
	 */
	let marked = {}
	for(let death of mdp.allMatching(t => t.terminal && t.reward < 0))
		for(let tile of traverse(death))
			marked[tile] = true

	for(let tile of mdp.allTiles) {
		if (!marked[tile]) {
			return false
		}
	}
	return true
}

function noUnreachableGoal(mdp) {
	/**
	 * 1. find all goals
	 * 2. check if the goal has at least one free tile next to it
	 * 
	 * time complexity:
	 * 	n = number of tiles (mdp.size.width * mdp.size.height)
	 * 	worst case:
	 * 		- finding all goals -> n
	 * 		- checking if free neighbor -> 4
	 * 		- most tiles are goals with one free neighbor except the last
	 * 			-> n
	 * 		=> O(2n)
	 */
	for(let goal of mdp.allMatching(t => t.terminal && t.reward > 0)) {
		let accessible = false
		for(let tile of traverse(goal))
			if (tile.accessible && !tile.terminal) {
				accessible = true
				break
			}
		if (!accessible) return false
	}
	return true
}

function noUnreachableDeath(mdp) {
	/**
	 * 1. find all deaths
	 * 2. check if the death has at least one free tile next to it
	 * 
	 * time complexity:
	 * 	see noUnreachableGoal
	 */
	for(let death of mdp.allMatching(t => t.terminal && t.reward < 0)) {
		let accessible = false
		for(let tile of traverse(death))
			if (tile.accessible && !tile.terminal) {
				accessible = true
				break
			}
		if (!accessible) return false
	}
	return true
}

function fullyReachableGoals(mdp) {
	/**
	 * 1. find all goals
	 * 2. traverse the mdp from all goals
	 * 3. check all tiles if they have been marked
	 * 
	 * time complexity:
	 * 	n = number of tiles (mdp.size.width * mdp.size.height)
	 * 	worst case:
	 * 		- finding goals -> n
	 * 		- traversal passes all tiles except one -> n
	 * 		- the only unmarked tile is the last one -> n
	 * 		=> O(n^2)
	 */
	for(let goal of mdp.allMatching(t => t.terminal && t.reward > 0)) {
		let marked = {};
		for(let tile of traverse(goal))
			marked[tile] = true;
		
		for (let tile of mdp.allTiles())
			if (!marked[tile]) return false;
	}
	return true
}

function fullyReachableDeaths(mdp) {
	/**
	 * 1. find all deaths
	 * 2. traverse the mdp from all deaths
	 * 3. check all tiles if they have been marked
	 * 
	 * time complexity:
	 * 	see fullyReachableGoals
	 */
	for(let death of mdp.allMatching(t => t.terminal && t.reward < 0)) {
		let marked = {};
		for(let tile of traverse(death))
			marked[tile] = true;
		
		for (let tile of mdp.allTiles())
			if (!marked[tile]) return false;
	}
	return true
}
