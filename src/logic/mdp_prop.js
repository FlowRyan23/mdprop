import store from "./sharedData";

// function gmdp(level, stepChances=[0.8, 0.1, 0.1, 0], discount=0.9, stepCost=0) {
// 	return new GridMDP(level, stepChances, discount, stepCost);
// }

// export {gmdp};

export default class GridMDP {
	constructor(level, stepChances=store.state.settings.stepChances, discount=store.state.settings.discount, stepCost=store.state.settings.stepCost) {
		// todo the level in memory is transposed to how it is displayed
		this.level = level;
		this.iteration = 0;
		
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
					leftAction.addResult(new Result(this.tiles[x][y-1], stepChances["front"]), stepCost);
					downAction.addResult(new Result(this.tiles[x][y-1], stepChances["right"]), stepCost);
					rightAction.addResult(new Result(this.tiles[x][y-1], stepChances["back"]), stepCost);
					upAction.addResult(new Result(this.tiles[x][y-1], stepChances["left"]), stepCost);
				}

				if (this.inBounds(x, y+1)) {
					leftAction.addResult(new Result(this.tiles[x][y+1], stepChances["back"]), stepCost);
					downAction.addResult(new Result(this.tiles[x][y+1], stepChances["left"]), stepCost);
					rightAction.addResult(new Result(this.tiles[x][y+1], stepChances["front"]), stepCost);
					upAction.addResult(new Result(this.tiles[x][y+1], stepChances["right"]), stepCost);
				}

				if (this.inBounds(x-1, y)) {
					leftAction.addResult(new Result(this.tiles[x-1][y], stepChances["right"]), stepCost);
					downAction.addResult(new Result(this.tiles[x-1][y], stepChances["back"]), stepCost);
					rightAction.addResult(new Result(this.tiles[x-1][y], stepChances["left"]), stepCost);
					upAction.addResult(new Result(this.tiles[x-1][y], stepChances["front"]), stepCost);
				}

				if (this.inBounds(x+1, y)) {
					leftAction.addResult(new Result(this.tiles[x+1][y], stepChances["left"]), stepCost);
					downAction.addResult(new Result(this.tiles[x+1][y], stepChances["front"]), stepCost);
					rightAction.addResult(new Result(this.tiles[x+1][y], stepChances["right"]), stepCost);
					upAction.addResult(new Result(this.tiles[x+1][y], stepChances["back"]), stepCost);
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
		return {"witdth": this.tiles[0].length, "height": this.tilesMDP.length};
	}

	* allTiles() {
		for(let x in this.tiles)
			for(let y in this.tiles[x])
				yield this.tiles[x][y];
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
		if (this.qMemory.length <= iteration) return this.reward;
		else return this.reward + this.qMemory[iteration]
	}

	getPolicy(iteration=this.policyMemory.length-1) {
		if (iteration < 0 || iteration >= this.policyMemory.length) return {};
		return this.policyMemory[iteration];
	}

	getLabel(iteration=this.qMemory.length - 1) {
		return this.getQValue(iteration).toFixed(2)
			+ (this.reachedAt(store.state.displayIteration) && !this.terminal? "*":"");
	}

	reachedAt(iteration) {
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
}

class Action {
	constructor(name, defaultResult=null, cost=store.state.settings.stepCost, discount=store.state.settings.discount, results=[], reward=0) {
		this.name = name;

		this.defaultReward = reward;
		this.reward = reward;
		this.discount = discount;
		this.cost = cost;

		this.results = results;
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
			chance += res.chance;
			if (!res.node.accessible) {
				qValue += res.chance * (this.reward - this.cost + this.discount * this.defaultResult.node.getQValue(this.qMemory.length - 1));
			} else if (useNewest) {
				qValue += res.chance * (this.reward - this.cost + this.discount * res.node.getQValue());
			} else {
				qValue += res.chance * (this.reward - this.cost + this.discount * res.node.getQValue(this.qMemory.length - 1));
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
		let formula = this.discount + " * (";
		let sumChance = 0;
		for (let i in this.results) {
			let res = this.results[i];
			sumChance += res.chance;
			formula += res.chance + " * " + res.node.getQValue(iteration-1) + " + ";
		}
		formula += (Math.round((1 - sumChance) * 100) / 100) + " * " + this.defaultResult.node.getQValue(iteration-1) + ")"

		let r = this.reward - this.cost
		formula += (r < 0? " - " : " + ") + Math.abs(r);
		return formula;
	}
}

class Result {
	constructor(node, chance) {
		this.node = node;		// the target node when successfully performing an action
		this.chance = chance;	// the chance of moving to the node after performing the action
	}
}
