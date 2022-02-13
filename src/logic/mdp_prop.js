import store from "./sharedData";

export default class GridMDP {
	constructor(level, discount=store.state.settings.discount, stepCost=store.state.settings.stepCost) {
		// todo the level in memory is transposed to how it is displayed
		this.level = level;
		this.iteration = 0;
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
					leftAction.addResult(new Result(this.tiles[x][y-1], "scFront"));
					downAction.addResult(new Result(this.tiles[x][y-1], "scRight"));
					rightAction.addResult(new Result(this.tiles[x][y-1], "scBack"));
					upAction.addResult(new Result(this.tiles[x][y-1], "scLeft"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "scFront"));
					downAction.addResult(new Result(this.tiles[x][y], "scRight"));
					rightAction.addResult(new Result(this.tiles[x][y], "scBack"));
					upAction.addResult(new Result(this.tiles[x][y], "scLeft"));
				}

				if (this.inBounds(x, y+1)) {
					leftAction.addResult(new Result(this.tiles[x][y+1], "scBack"));
					downAction.addResult(new Result(this.tiles[x][y+1], "scLeft"));
					rightAction.addResult(new Result(this.tiles[x][y+1], "scFront"));
					upAction.addResult(new Result(this.tiles[x][y+1], "scRight"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "scBack"));
					downAction.addResult(new Result(this.tiles[x][y], "scLeft"));
					rightAction.addResult(new Result(this.tiles[x][y], "scFront"));
					upAction.addResult(new Result(this.tiles[x][y], "scRight"));
				}

				if (this.inBounds(x-1, y)) {
					leftAction.addResult(new Result(this.tiles[x-1][y], "scRight"));
					downAction.addResult(new Result(this.tiles[x-1][y], "scBack"));
					rightAction.addResult(new Result(this.tiles[x-1][y], "scLeft"));
					upAction.addResult(new Result(this.tiles[x-1][y], "scFront"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "scRight"));
					downAction.addResult(new Result(this.tiles[x][y], "scBack"));
					rightAction.addResult(new Result(this.tiles[x][y], "scLeft"));
					upAction.addResult(new Result(this.tiles[x][y], "scFront"));
				}

				if (this.inBounds(x+1, y)) {
					leftAction.addResult(new Result(this.tiles[x+1][y], "scLeft"));
					downAction.addResult(new Result(this.tiles[x+1][y], "scFront"));
					rightAction.addResult(new Result(this.tiles[x+1][y], "scRight"));
					upAction.addResult(new Result(this.tiles[x+1][y], "scBack"));
				} else {
					leftAction.addResult(new Result(this.tiles[x][y], "scLeft"));
					downAction.addResult(new Result(this.tiles[x][y], "scFront"));
					rightAction.addResult(new Result(this.tiles[x][y], "scRight"));
					upAction.addResult(new Result(this.tiles[x][y], "scBack"));
				}

				this.tiles[x][y].addAction(upAction);
				this.tiles[x][y].addAction(downAction);
				this.tiles[x][y].addAction(leftAction);
				this.tiles[x][y].addAction(rightAction);
			}
		}
	}

	apply(settings) {
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

	next() {
		this.iteration++;
		
		let policyChange = false;
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].next();
				if (this.tiles[x][y].policyChanged)
					policyChange = true;
			}
		}
		//todo if no tile is set to initial an error message should be displayed
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
		let mdp = [];
		for (let x=0; x<this.tiles.length; x++) {
			mdp[x] = [];
			for (let y=0; y<this.tiles[x].length; y++) {
				mdp[x][y] = {
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

	getSolution(iteration=this.iteration) {
		// todo this should probably recalculate the policy to avoid confusion if the world was edited mid-calculation
		
		while(this.iteration < iteration) {
			this.next();
		}

		let solution = "Solution\n\n";
		for(let it=0; it<=iteration; it++) {
			solution += "\nk=" + it.toString() + ":";
			for(let t of this.allTiles()) {
				// console.log(t);
				if(t.reachedAt(it)) {
					solution += "\n\tField " + t.getFormula() + "\n";
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

	reset(hard=true) {
		if (hard) {
			this.reached = store.state.level[this.x][this.y].initial;
			this.accessible = store.state.level[this.x][this.y].accessible;
			this.reward = store.state.level[this.x][this.y].reward;
			this.terminal = store.state.level[this.x][this.y].terminal;
		}
		this.marked = false;
		this.reached = this.initial;
		this.qMemory = [0];
		this.policyMemory = [{}];
		this.policyChanged = true;
		for(let aName in this.actions)
			this.actions[aName].reset(hard);
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
		if (this.terminal || !this.accessible || !this.reached) {
			this.qMemory.push(0);
			this.policyMemory.push({});
			for (let aName in this.actions)
				this.actions[aName].qMemory.push(0);
			return;
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
		this.policyChanged = false;
		for (let aName in this.actions) {
			if (this.actions[aName].getQValue() >= maxQ) {
				newPolicy[aName] = true;
				if (!(aName in this.getPolicy()))
					this.policyChanged = true;
			}
		}
		this.policyMemory.push(newPolicy);

		if (store.state.settings.useRounded) maxQ = Math.round(maxQ * 100) / 100;
		this.qMemory.push(maxQ);
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
			return this.reward.toFixed(2);
		} else  {
			return this.getQValue(iteration).toFixed(2);
		}
	}

	reachedAt(iteration) {
		if (!this.accessible || this.terminal) return false;
		if (this.reached === true) return true;		// reached is only bool if it got its value from initial
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

	getName() {
		return '' + (this.y+1) + '-' + (this.x+1);
	}

	getFormula(iteration=this.qMemory.length -1) {
		let formula = this.getName();
		for (let aName in this.actions) {
				formula += "\n\t" + this.actions[aName].getFormula(iteration);
		}
		return formula;
	}
}

class Action {
	constructor(name, defaultResult=null, cost=store.state.settings.stepCost, discount=store.state.settings.discount, results=[], reward=0) {
		this.name = name;

		this.defaultReward = reward;
		this.reward = reward;
		this.discount = discount;
		this.cost = cost;

		this.results = results;
		for(let res of results) {
			// forces Vues observer creation to go breath-first through the level, to reduce call stack size
			Object.freeze(res);
		}
		this.defaultResult = defaultResult;
		this.qMemory = [0];
	}

	apply(settings) {
		this.cost = settings.stepCost;
		this.discount = settings.discount;

		// TODO stepChances
	}

	addResult(result) {
		// TODO should warn if total chance of results is greater than 1
		Object.freeze(result);
		this.results.push(result);
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
			chance += res.getChance();
			if (!res.node.accessible) {
				qValue += res.getChance() * (this.reward - this.cost + this.discount * this.defaultResult.node.getQValue(this.qMemory.length - 1));
			} else if (useNewest) {
				qValue += res.getChance() * (this.reward - this.cost + this.discount * res.node.getQValue());
			} else {
				qValue += res.getChance() * (this.reward - this.cost + this.discount * res.node.getQValue(this.qMemory.length - 1));
			}
		}

		qValue += this.discount * (1 - chance) * (this.reward - this.cost + this.defaultResult.node.getQValue(this.qMemory.length -1));
		
		if (store.state.settings.useRounded) qValue = Math.round(qValue * 100) / 100;
		this.qMemory.push(qValue);
		return qValue;
	}

	getQValue(iteration=this.qMemory.length-1) {
		if (iteration < this.qMemory.length) return this.reward + this.qMemory[iteration];
		else return 0;
	}

	reset(hard=true) {
		if (hard) {
			this.reward = this.defaultReward;
			this.discount = store.state.settings.discount;
			this.cost = store.state.settings.stepCost;
		}
		this.qMemory = [0];
	}

	toString() {
		return this.name;
	}

	getFormula(iteration=this.qMemory.length-1) {
		let formula = this.nts(this.discount) + " * (";
		let sumChance = 0;
		for (let res of this.results) {
			if (res.getChance() === 0)
				continue;
			sumChance += res.getChance();
			formula += this.nts(res.getChance()) + " * " + (this.nts(res.node.accessible?res.node.getQValue(iteration-1):this.defaultResult.node.getQValue(iteration-1))) + " + ";
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
		try {
			return n.toFixed(2);
		} catch {
			return n.toString();
		}
	}
}

class Result {
	constructor(node, chanceID) {
		this.node = node;		// the target node when successfully performing an action
		this.chanceID = chanceID;	// the chance of moving to the node after performing the action
	}

	getChance() {
		return store.state.settings[this.chanceID];
	}
}
