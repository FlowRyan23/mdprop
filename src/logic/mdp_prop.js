import store from "./sharedData";

export default class GridMDP {
	constructor(level, discount=store.state.discount, stepCost=store.state.stepCost) {
		// TODO the level in memory is transposed to how it is displayed
		this.level = level;
		this.iteration = 0;
		this.discount = discount;
		this.stepCost = stepCost;
		
		this.tiles = [];
		for (let x=0; x<level.length; x++) {
			this.tiles[x] = [];
			for (let y=0; y<level[x].length; y++) {
				this.tiles[x][y] = new MDPTile(x, y, level[x][y].reward, level[x][y].terminal, level[x][y].accessible, level[x][y].initial);
			}
		}

		for (let x=0; x<level.length; x++) {
			for (let y=0; y<level[x].length; y++) {
				let upAction = new Action("up", new Result(this.tiles[x][y], 1), stepCost, discount);
				let downAction = new Action("down", new Result(this.tiles[x][y], 1), stepCost, discount);
				let leftAction = new Action("left", new Result(this.tiles[x][y], 1), stepCost, discount);
				let rightAction = new Action("right", new Result(this.tiles[x][y], 1), stepCost, discount);

				if (this.inBounds(x, y-1)) {
					leftAction.addResult(new Result(this.tiles[x][y-1], "front"));
					downAction.addResult(new Result(this.tiles[x][y-1], "right"));
					rightAction.addResult(new Result(this.tiles[x][y-1], "back"));
					upAction.addResult(new Result(this.tiles[x][y-1], "left"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "front"));
					downAction.addResult(new Result(this.tiles[x][y], "right"));
					rightAction.addResult(new Result(this.tiles[x][y], "back"));
					upAction.addResult(new Result(this.tiles[x][y], "left"));
				}

				if (this.inBounds(x, y+1)) {
					leftAction.addResult(new Result(this.tiles[x][y+1], "back"));
					downAction.addResult(new Result(this.tiles[x][y+1], "left"));
					rightAction.addResult(new Result(this.tiles[x][y+1], "front"));
					upAction.addResult(new Result(this.tiles[x][y+1], "right"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "back"));
					downAction.addResult(new Result(this.tiles[x][y], "left"));
					rightAction.addResult(new Result(this.tiles[x][y], "front"));
					upAction.addResult(new Result(this.tiles[x][y], "right"));
				}

				if (this.inBounds(x-1, y)) {
					leftAction.addResult(new Result(this.tiles[x-1][y], "right"));
					downAction.addResult(new Result(this.tiles[x-1][y], "back"));
					rightAction.addResult(new Result(this.tiles[x-1][y], "left"));
					upAction.addResult(new Result(this.tiles[x-1][y], "front"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "right"));
					downAction.addResult(new Result(this.tiles[x][y], "back"));
					rightAction.addResult(new Result(this.tiles[x][y], "left"));
					upAction.addResult(new Result(this.tiles[x][y], "front"));
				}

				if (this.inBounds(x+1, y)) {
					leftAction.addResult(new Result(this.tiles[x+1][y], "left"));
					downAction.addResult(new Result(this.tiles[x+1][y], "front"));
					rightAction.addResult(new Result(this.tiles[x+1][y], "right"));
					upAction.addResult(new Result(this.tiles[x+1][y], "back"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "left"));
					downAction.addResult(new Result(this.tiles[x][y], "front"));
					rightAction.addResult(new Result(this.tiles[x][y], "right"));
					upAction.addResult(new Result(this.tiles[x][y], "back"));
				}

				this.tiles[x][y].addAction(upAction);
				this.tiles[x][y].addAction(downAction);
				this.tiles[x][y].addAction(leftAction);
				this.tiles[x][y].addAction(rightAction);
			}
		}
	}

	apply(settings) {
		this.stepCost = settings.stepCost;
		this.discount = settings.discount;
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].apply(settings);
			}
		}
	}

	reset() {
		this.iteration = 0;
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].reset();
			}
		}
	}

	calculate(iterations=100) {
		for (let i = 0; i < iterations; i++) {
			this.next();
		}
	}

	next() {
		this.iteration++;
		
		let policyChange = false;
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				if (this.tiles[x][y].next())
					policyChange = true;
			}
		}
		// console.log("i: " + this.iteration + ", change: " + policyChange);

		//TODO if no tile is set to initial an error message should be displayed
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				if (this.tiles[x][y].marked && !this.tiles[x][y].reached)
					this.tiles[x][y].reached = this.iteration;
			}
		}
		return policyChange;
	}

	inBounds(x, y) {
		return 0 <= x && x < this.level.length && 0 <= y && y < this.level[0].length;
	}

	compact() {
		let mdp = {
			level: [],
			discount: this.discount,
			stepCost: this.stepCost
		};
		for (let x=0; x<this.tiles.length; x++) {
			mdp.level[x] = [];
			for (let y=0; y<this.tiles[x].length; y++) {
				mdp.level[x][y] = {
					accessible: this.tiles[x][y].accessible,
					reward: this.tiles[x][y].reward,
					terminal: this.tiles[x][y].terminal,
					initial: this.tiles[x][y].initial
				};
			}
		}
		return mdp;
	}

	size() {
		return {"witdth": this.tiles[0].length, "height": this.tiles.length};
	}

	getSolution(iteration=this.iteration, includeActionNames=false) {
		// TODO this should probably recalculate the policy to avoid confusion if the world was edited mid-calculation
		
		while(this.iteration < iteration) {
			this.next();
		}

		let solution = "Solution\n";
		for(let it=1; it<=iteration; it++) {
			solution += "\nk=" + it.toString() + ":";
			for(let t of this.allTiles()) {
				// console.log(t);
				if(t.reachedAt(it-1)) {
					solution += "\n\tField " + t.getFormula(it, includeActionNames) + "\n";
				}
			}
		}
		return solution;
	}

	* allTiles() {
		for(let x=0; x<this.tiles.length; x++) {
			for(let y=0; y<this.tiles[x].length; y++) {
				yield this.tiles[x][y];
			}
		}
	}

	getAny(condition) {
		for (let tile of this.allTiles())
			if (condition(tile))
				return tile;
		return null;
	}

	* allMatching(condition) {
		for (let tile of this.allTiles())
			if (condition(tile))
				yield tile
	}
}

class MDPTile {
	constructor(x, y, reward=0, terminal=false, accessible=true, initial=false) {
		this.x = x;
		this.y = y;

		this.reward = reward;
		this.terminal = terminal;
		this.accessible = accessible;
		this.actions = {};

		this.initial = initial;
		this.reached = initial;
		this.marked = false;

		this.qMemory = [0];
		this.policyMemory = [{}];
		this.policyChanged = true;
	}

	reset() {
		this.marked = false;
		this.reached = this.initial;
		this.qMemory = [0];
		this.policyMemory = [{}];
		this.policyChanged = true;
		for(let aName in this.actions)
			this.actions[aName].reset();
	}

	apply(settings) {
		for (let aName in this.actions) {
			this.actions[aName].apply(settings);
		}
	}

	addAction(action) {
		this.actions[action.name] = action;
	}

	removeAction(action) {
		delete this.actions[action.name]
	}

	next(useNewest=false) {
		if (this.terminal || !this.accessible || (!this.initial && !this.reached)) {
			this.qMemory.push(0);
			this.policyMemory.push({});
			for (let aName in this.actions)
				this.actions[aName].qMemory.push(0);
			return false;
		}

		let maxQ = null;
		
		for (let aName in this.actions) {
			// let qValue = this.actions[aName].recalculate(useNewest);
			let qValue = this.actions[aName].next(useNewest);
			if (maxQ === null || qValue > maxQ) {
				maxQ = qValue;
			}
		}

		let newPolicy = {};
		let policyChanged = false;
		for (let aName in this.actions) {
			if (this.actions[aName].getQValue() >= maxQ) {
				newPolicy[aName] = true;
				if (!(aName in this.getPolicy())) {
					policyChanged = true;
				}
			}
		}
		this.policyMemory.push(newPolicy);

		if (store.state.useRounded) maxQ = Math.round(maxQ * 100) / 100;
		this.qMemory.push(maxQ);
		return policyChanged;
	}

	getQValue(iteration=this.qMemory.length-1) {
		if (!this.accessible || iteration < 0) return 0;
		if (this.terminal || this.qMemory.length <= iteration) return this.reward;
		else return this.reward + this.qMemory[iteration]
	}

	getPolicy(iteration=this.policyMemory.length-1) {
		if (iteration < 0 || iteration >= this.policyMemory.length) return {};
		return this.policyMemory[iteration];
	}

	getLabel(iteration=this.qMemory.length - 1) {
		if (this.terminal) { 
			return Math.abs(this.reward) < 0.01?"0.00":this.reward.toFixed(2);
		} else  {
			let l = this.getQValue(iteration).toFixed(2)
			return Math.abs(l) < 0.01?"0.00":l;
		}
	}

	reachedAt(iteration) {
		if (!this.accessible || this.terminal) return false;
		if (this.reached === true || this.initial) return true;		// reached is only bool if it got its value from initial
		if (this.reached === false) return false;
		return this.reached <= iteration;
	}

	bestAction(iteration=this.qMemory.length-1) {
		let bestAction = null;
		for (let aName in this.actions) {
			if (!bestAction || this.actions[aName].getQValue(iteration) > bestAction.getQValue(iteration))
				bestAction = this.actions[aName];
		}
		return bestAction;
	}

	isAmbiguous(iteration=this.qMemory.length-1) {
		if (!this.reachedAt(iteration)) {
			return false;
		}

		let action = null;
		for(let aName in this.policyMemory[iteration]) {
			if(this.policyMemory[iteration][aName]) {
				if (action !== null) {
					return true;
				} else {
					action = aName;
				}
			}
		}

		return false;
	}

	getName() {
		return '' + (this.y+1) + '-' + (this.x+1);
	}

	getFormula(iteration=this.qMemory.length -1, includeActionNames=false) {
		let formula = this.getName();
		for (let aName in this.actions) {
				formula += "\n\t" + this.actions[aName].getFormula(iteration, includeActionNames);
		}
		return formula;
	}

	neighbors() {
		let neighbors = [];
		for (let aName in this.actions) {
			let neighbor = this.actions[aName].getResult("front").node;
			if (neighbor !== this) {
				neighbors.push(neighbor);
			}
		}
		return neighbors;
	}
}

class Action {
	constructor(name, defaultResult=null, cost=store.state.mdp.stepCost, discount=store.state.mdp.discount, results=[], reward=0) {
		this.name = name;

		this.defaultReward = reward;
		this.reward = reward;
		this.discount = discount;
		this.cost = cost;

		this.results = results;
		for(let res of results) {
			// forces Vues observer creation to go breadth-first through the level, to reduce call stack size
			Object.freeze(res);
		}
		this.defaultResult = defaultResult;
		this.stepChances = {
			"front": store.state.scFront,
			"back": store.state.scBack,
			"left": store.state.scLeft,
			"right": store.state.scRight,
		};
		this.qMemory = [0];
	}

	apply(settings) {
		this.cost = settings.stepCost;
		this.discount = settings.discount;

		this.stepChances = {
			"front": settings.scFront,
			"back": settings.scBack,
			"left": settings.scLeft,
			"right": settings.scRight,
		};
	}

	addResult(result) {
		Object.freeze(result);
		this.results.push(result);
	}

	getResult(name) {
		for (const res of this.results) {
			if (res.chanceID === name) {
				return res;
			}
		}
	}

	removeResult(result) {
		if (typeof(result) === Result)
			this.results = this.results.filter(v => v !== result);
		else if (typeof(result) === MDPTile)
			this.results = this.results.filter(v => v.node !== result);
	}

	next(useNewest=false) {
		// discounted weighted sum of reward by chance
		let qValue = 0;
		let chance = 0;
		for(let i=0; i<this.results.length; i++) {
			let res = this.results[i];
			res.node.marked = true;
			chance += res.getChance(this.stepChances);
			if (!res.node.accessible) {
				qValue += res.getChance(this.stepChances) * (this.reward - this.cost + this.discount * this.defaultResult.node.getQValue(this.qMemory.length - 1));
			} else if (useNewest) {
				qValue += res.getChance(this.stepChances) * (this.reward - this.cost + this.discount * res.node.getQValue());
			} else {
				qValue += res.getChance(this.stepChances) * (this.reward - this.cost + this.discount * res.node.getQValue(this.qMemory.length - 1));
			}
		}
		qValue += this.discount * (1 - chance) * (this.reward - this.cost + this.defaultResult.node.getQValue(this.qMemory.length -1));
		
		if (store.state.useRounded) qValue = Math.round(qValue * 100) / 100;
		this.qMemory.push(qValue);
		return qValue;
	}

	getQValue(iteration=this.qMemory.length-1) {
		if (iteration < this.qMemory.length) return this.reward + this.qMemory[iteration];
		else return 0;
	}

	reset() {
		this.qMemory = [0];
	}

	toString() {
		return this.name;
	}

	getFormula(iteration=this.qMemory.length-1, includeName=false) {
		// TODO change names depending on locale
		let formula = includeName?this.name + ": ":"";
		formula += this.nts(this.discount) + " * (";
		let sumChance = 0;
		for (let res of this.results) {
			if (res.getChance(this.stepChances) === 0)
				continue;
			sumChance += res.getChance(this.stepChances);
			formula += this.nts(res.getChance(this.stepChances)) + " * " + (this.nts(res.node.accessible?res.node.getQValue(iteration-1):this.defaultResult.node.getQValue(iteration-1))) + " + ";
		}
		let defaultChance = (Math.round((1 - sumChance) * 100) / 100)
		if (defaultChance > 0)
			formula += this.nts(defaultChance) + " * " + this.nts(this.defaultResult.node.getQValue(iteration-1));
		else
			formula = formula.substring(0, formula.length - 3);
		formula += ")";

		let r = this.reward - this.cost
		formula += (r < 0? " - " : " + ") + this.nts(Math.abs(r));
		formula += " = " + this.nts(this.getQValue(iteration));
		return formula;
	}

	nts(n) {
		let s = "error";
		try {
			s = n.toFixed(2);
		} catch {
			s = n.toString();
		}
		if (s === "-0.00") {
			return "0.00";
		} else {
			return s;
		}
	}
}

class Result {
	constructor(node, chanceID) {
		this.node = node;		// the target node when successfully performing an action
		this.chanceID = chanceID;	// the chance of moving to the node after performing the action
	}

	getChance(stepChances) {
		return stepChances[this.chanceID];
	}
}
