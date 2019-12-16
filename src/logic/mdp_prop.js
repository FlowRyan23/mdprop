import store from "./settings";

function gmdp(level, stepChances=[0.8, 0.1, 0.1, 0], discount=0.9, stepCost=0) {
	return new GridMDP(level, stepChances, discount, stepCost);
}


export {gmdp};

class GridMDP {
	constructor(level, stepChances=[0.8, 0.1, 0.1, 0], discount=0.9, stepCost=0) {
		// todo the level in memory is transposed to how it is displayed
		this.level = level;
		this.iterations = 0;
		this.discount = discount;
		this.stepCost = stepCost;

		//chances for each result when performing an action [success, offToRight, offToLeft, backward]
		this.stepChances = stepChances;
		
		this.tiles = [];
		for (let x=0; x<level.length; x++) {
			this.tiles[x] = [];
			for (let y=0; y<level[x].length; y++) {
				// if (typeof(level[x][y]) !== Object) {
				// 	let accessible = this.level[x][y] !== null;
				// 	let terminal = accessible && this.level[x][y] !== 0;
				// 	this.tiles[x][y] = new MDPTile(x, y, level[x][y], terminal, accessible);
				// } else {
					this.tiles[x][y] = new MDPTile(x, y, level[x][y].reward, level[x][y].terminal, level[x][y].accessible);
				// }
			}
		}

		for (let x=0; x<level.length; x++) {
			for (let y=0; y<level[x].length; y++) {
				let leftAction = new Action("left", new Result(this.tiles[x][y], 1), this.stepCost);
				let rightAction = new Action("right", new Result(this.tiles[x][y], 1), this.stepCost);
				let upAction = new Action("up", new Result(this.tiles[x][y], 1), this.stepCost);
				let downAction = new Action("down", new Result(this.tiles[x][y], 1), this.stepCost);

				if (this.inBounds(x, y-1)) {
					leftAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[0]), this.stepCost);
					downAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[2]), this.stepCost);
					rightAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[3]), this.stepCost);
					upAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[1]), this.stepCost);
				}

				if (this.inBounds(x, y+1)) {
					leftAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[3]), this.stepCost);
					downAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[1]), this.stepCost);
					rightAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[0]), this.stepCost);
					upAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[2]), this.stepCost);
				}

				if (this.inBounds(x-1, y)) {
					leftAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[2]), this.stepCost);
					downAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[3]), this.stepCost);
					rightAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[1]), this.stepCost);
					upAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[0]), this.stepCost);
				}

				if (this.inBounds(x+1, y)) {
					leftAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[1], this.stepCost), this.stepCost);
					downAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[0], this.stepCost), this.stepCost);
					rightAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[2], this.stepCost), this.stepCost);
					upAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[3], this.stepCost), this.stepCost);
				}

				this.tiles[x][y].addAction(upAction);
				this.tiles[x][y].addAction(leftAction);
				this.tiles[x][y].addAction(downAction);
				this.tiles[x][y].addAction(rightAction);
			}
		}
	}

	apply(settings) {
		this.discount = settings.discount;
		this.stepCost = settings.stepCost;

		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].apply(settings);
			}
		}
	}

	reset() {
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].reset();
			}
		}
	}
	
	accessible(x, y) {
		if (this.inBounds(x, y))
			return this.tiles[x][y].accessible;
		else return false;
	}

	inBounds(x, y) {
		return 0 <= x && x < this.level.length && 0 <= y && y < this.level[0].length;
	}

	iteration() {
		this.iterations++;
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].recalculate(this.discount);
			}
		}
	}

	compact() {
		let mdp = [];
		for (let x=0; x<this.tiles.length; x++) {
			mdp[x] = [];
			for (let y=0; y<this.tiles[x].length; y++) {
				mdp[x][y] = {
					accessible: this.tiles[x][y].accessible,
					reward: this.tiles[x][y].reward,
					terminal: this.tiles[x][y].terminal
				};
			}
		}
		return mdp;
	}

	toString() {
		let s = "";
		for (let x=0; x<this.tiles.length; x++) {
			let line = "";
			for (let y=0; y<this.tiles[x].length; y++) {
				line += this.tiles[x][y].getQValue().toFixed(2) + ", ";
			}
			s += line + "\n";
		}
		return s;
	}
}

class MDPTile {
	constructor(x, y, reward=0, terminal=false, accessible=true, discount=0.9) {
		this.x = x;
		this.y = y;

		this.reward = reward;
		this.terminal = terminal;
		this.accessible = accessible;
		this.discount = discount;

		this.qMemory = [0];
		this.actions = [];
	}

	reset(hard=true) {
		if (hard) {
			this.discount = store.state.settings.discount;
			this.accessible = store.state.level[this.x][this.y].accessible;
			this.reward = store.state.level[this.x][this.y].reward;
			this.terminal = store.state.level[this.x][this.y].terminal;
		}
		this.qMemory = [0];
		for(let i=0; i<this.actions.length; i++)
			this.actions[i].reset(hard);
	}

	apply(settings) {
		this.discount = settings.discount;

		for (let i=0; i<this.actions.length; i++) {
			this.actions[i].apply(settings);
		}
	}

	addAction(action) {
		this.actions.push(action);
	}

	removeAction(action) {
		this.actions = this.neighbors.filter(a => a !== action);
	}

	recalculate(discount=this.discount, useNewest=false) {
		if (!this.accessible) return 0;

		if (this.terminal) {
			this.qMemory.push(0);
			return this.reward;
		}

		let maxQ = null;
		for (let i=0; i<this.actions.length; i++) {
			let qValue = this.actions[i].recalculate(discount, useNewest);
			if (maxQ === null || qValue > maxQ) {
				maxQ = qValue;
			}
		}

		this.qMemory.push(maxQ);
		return maxQ;
	}

	getQValue(iteration=this.qMemory.length-1) {
		if (!this.accessible) return 0;

		while (this.qMemory.length - 1 < iteration)
			this.recalculate();
		
		return this.reward + this.qMemory[iteration];
	}

	bestAction(iteration=this.qMemory.length-1) {
		let bestAction = this.actions[0];
		for (let i=1; i<this.actions.length; i++) {
			if (this.actions[i].getQValue(iteration) > bestAction.getQValue(iteration))
				bestAction = this.actions[i];
		}
		return bestAction;
	}

	toString() {
		return this.getQValue().toFixed(2);
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

		// todo stepChances
	}

	addResult(result) {
		this.results.push(result);
	}

	removeResult(result) {
		if (typeof(result) === Result)
			this.results = this.results.filter(v => v !== result);
		else if (typeof(result) === MDPTile)
			this.results = this.results.filter(v => v.node !== result);
	}

	recalculate(discount, useNewest=false) {
		this.discount = discount;

		// discounted weighted sum of reward by chance
		let qValue = 0;
		let chance = 0;
		for(let i=0; i<this.results.length; i++) {
			let res = this.results[i];
			chance += res.chance;
			if (!res.node.accessible) {
				qValue += discount * res.chance * (this.reward - this.cost + this.defaultResult.node.getQValue(this.qMemory.length - 1));
			} else if (useNewest) {
				qValue += discount * res.chance * (this.reward - this.cost + res.node.getQValue());
			} else {
				qValue += discount * res.chance * (this.reward - this.cost + res.node.getQValue(this.qMemory.length - 1));
			}
		}

		/*
		if (chance < 1) {
			console.log("" + this.defaultResult.node.x + "-" + this.defaultResult.node.y + ": " + (1-chance).toFixed(2));
			console.log(qValue);
			console.log((1 - chance) * (this.reward - this.defaultResult.cost + this.defaultResult.node.getQValue()) + "\n")
		}
		*/

		qValue += discount * (1 - chance) * (this.reward - this.cost + this.defaultResult.node.getQValue(this.qMemory.length -1));
		this.qMemory.push(qValue);
		return qValue;
	}

	getQValue(iteration=this.qMemory.length-1) {
		while (iteration > this.qMemory.length -1)
			this.recalculate();

		return this.reward + this.qMemory[iteration];
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
}

class Result {
	constructor(node, chance) {
		this.node = node;		// the target node when successfully performing an action
		this.chance = chance;	// the chance of moving to the node after performing the action
	}
}
