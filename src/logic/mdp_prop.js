function gmdp(level, stepChances=[0.8, 0.1, 0.1, 0], discount=0.9) {
	return new GridMDP(level, stepChances, discount);
}

class GridMDP {
	constructor(level, stepChances=[0.8, 0.1, 0.1, 0], discount=0.9) {
		this.level = level;
		this.discount = discount;

		//chances for each result when performing an action [success, offToRight, offToLeft, backward]
		this.stepChances = stepChances;
		
		this.tiles = [];
		for (let x=0; x<level.length; x++) {
			this.tiles[x] = [];
			for (let y=0; y<level[x].length; y++) {
				let accessible = this.level[x][y] !== null;
				let terminal = accessible && this.level[x][y] !== 0;
				this.tiles[x][y] = new MDPTile(x, y, level[x][y], terminal, accessible);
			}
		}

		for (let x=0; x<level.length; x++) {
			for (let y=0; y<level[x].length; y++) {
				let upAction = new Action("up", new Result(this.tiles[x][y], 1));
				let downAction = new Action("down", new Result(this.tiles[x][y], 1));
				let leftAction = new Action("left", new Result(this.tiles[x][y], 1));
				let rightAction = new Action("right", new Result(this.tiles[x][y], 1));

				if (this.inBounds(x, y-1)) {
					upAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[0]));
					rightAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[2]));
					downAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[3]));
					leftAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[1]));
				}

				if (this.inBounds(x, y+1)) {
					upAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[3]));
					rightAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[1]));
					downAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[0]));
					leftAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[2]));
				}

				if (this.inBounds(x-1, y)) {
					upAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[2]));
					rightAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[3]));
					downAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[1]));
					leftAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[0]));
				}

				if (this.inBounds(x+1, y)) {
					upAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[1]));
					rightAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[0]));
					downAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[2]));
					leftAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[3]));
				}

				this.tiles[x][y].addAction(upAction);
				this.tiles[x][y].addAction(rightAction);
				this.tiles[x][y].addAction(downAction);
				this.tiles[x][y].addAction(leftAction);
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
		for (let x=0; x<this.tiles.length; x++) {
			for (let y=0; y<this.tiles[x].length; y++) {
				this.tiles[x][y].recalculate(this.discount);
			}
		}
	}

	get(x, y) {
		return this.tiles[x][y].getQValue();
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
	constructor(x, y, reward=0, terminal=false, accessible=true) {
		this.x = x;
		this.y = y;
		this.reward = reward;
		this.terminal = terminal;
		this.accessible = accessible;

		this.qMemory = [0];
		this.actions = [];
	}

	reset() {
		this.qMemory = [0];
		for(let i=0; i<this.actions.length; i++)
			this.actions[i].reset();
	}

	addAction(action) {
		this.actions.push(action);
	}

	removeAction(action) {
		this.actions = this.neighbors.filter(a => a !== action);
	}

	recalculate(discount, useNewest=false) {
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

		if (iteration > this.qMemory.length -1) {
			return this.reward + this.qMemory[this.qMemory.length - 1];
		} else {
			return this.reward + this.qMemory[iteration];
		}
	}

	toString() {
		return this.getQValue().toFixed(2);
	}
}

class Action {
	constructor(name, defaultResult=null, results=[], reward=0) {
		this.name = name;
		this.reward = reward;
		this.results = results;
		this.defaultResult = defaultResult;
		this.qMemory = [0];

		let sumChance = this.results.reduce((a, b) => a.chance + b.chance, 0);
		if (sumChance >= 1 || sumChance < 0) {
			//console.warn("chances of possible outcomes should sum to 1");
		}
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
		// discounted weighted sum of reward by chance
		let qValue = 0;
		let chance = 0;
		for(let i=0; i<this.results.length; i++) {
			let res = this.results[i];
			chance += res.chance;
			if (!res.node.accessible) {
				qValue += discount * res.chance * (this.reward - res.cost + this.defaultResult.node.getQValue(this.qMemory.length - 1));
			} else if (useNewest) {
				qValue += discount * res.chance * (this.reward - res.cost + res.node.getQValue());
			} else {
				qValue += discount * res.chance * (this.reward - res.cost + res.node.getQValue(this.qMemory.length - 1));
			}
		}

		/*
		if (chance < 1) {
			console.log("" + this.defaultResult.node.x + "-" + this.defaultResult.node.y + ": " + (1-chance).toFixed(2));
			console.log(qValue);
			console.log((1 - chance) * (this.reward - this.defaultResult.cost + this.defaultResult.node.getQValue()) + "\n")
		}
		*/

		qValue += discount * (1 - chance) * (this.reward - this.defaultResult.cost + this.defaultResult.node.getQValue(this.qMemory.length -1));
		this.qMemory.push(qValue);
		return qValue;
	}

	getQValue(iteration=this.qMemory.length-1) {
		if (iteration > this.qMemory.length -1) {
			return this.reward + this.qMemory[this.qMemory.length - 1];
		} else {
			return this.reward + this.qMemory[iteration];
		}
	}

	reset() {
		this.qMemory = [0];
	}

	toString() {
		return this.name;
	}
}

class Result {
	constructor(node, chance, cost=0) {
		this.node = node;		// the target node when successfully performing an action
		this.chance = chance;	// the chance of moving to the node after performing the action
		this.cost = cost;		// the step cost for moving to the target node
	}
}

export {gmdp};

/*
let mdp = gmdp([
	[0, 0, 0, 0, 0, 0, -1, 0],
	[0, null, null, 0, null, 1, 0, -1],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, null, null, 0, null, 0, 0, 0],
	[0, 0, null, 0, null, null, null, null],
	[null, 0, null, 0, 0, 0, 0, 0],
	[0, 0, null, 0, 0, null, 0, 1]
]);
mdp.iteration();
mdp.iteration();
mdp.iteration();
*/
