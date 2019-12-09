function gmdp(level, stepChances=[0.8, 0.1, 0.1, 0], discount=0.9) {
	return new GridMDP(level, stepChances, discount);
}

export {gmdp};

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
				this.tiles[x][y] = new MDPTile(x, y, level[x][y], false, this.accessible(x, y))
			}
		}

		for (let x=0; x<level.length; x++) {
			for (let y=0; y<level[x].length; y++) {
				if (level[x][y] === 0) {
					let upAction = new Action("up");
					let downAction = new Action("down");
					let leftAction = new Action("left");
					let rightAction = new Action("right");

					if (this.accessible(x, y-1)) {
						upAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[0]));
						rightAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[2]));
						downAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[3]));
						leftAction.addResult(new Result(this.tiles[x][y-1], this.stepChances[1]));
					} else {
						upAction.addResult(new Result(this.tiles[x][y], this.stepChances[0]));
						rightAction.addResult(new Result(this.tiles[x][y], this.stepChances[2]));
						downAction.addResult(new Result(this.tiles[x][y], this.stepChances[3]));
						leftAction.addResult(new Result(this.tiles[x][y], this.stepChances[1]));
					}

					if (this.accessible(x, y+1)) {
						upAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[3]));
						rightAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[1]));
						downAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[0]));
						leftAction.addResult(new Result(this.tiles[x][y+1], this.stepChances[2]));
					} else {
						upAction.addResult(new Result(this.tiles[x][y], this.stepChances[3]));
						rightAction.addResult(new Result(this.tiles[x][y], this.stepChances[1]));
						downAction.addResult(new Result(this.tiles[x][y], this.stepChances[0]));
						leftAction.addResult(new Result(this.tiles[x][y], this.stepChances[2]));
					}

					if (this.accessible(x-1, y)) {
						upAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[2]));
						rightAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[3]));
						downAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[1]));
						leftAction.addResult(new Result(this.tiles[x-1][y], this.stepChances[0]));
					} else {
						upAction.addResult(new Result(this.tiles[x][y], this.stepChances[2]));
						rightAction.addResult(new Result(this.tiles[x][y], this.stepChances[3]));
						downAction.addResult(new Result(this.tiles[x][y], this.stepChances[1]));
						leftAction.addResult(new Result(this.tiles[x][y], this.stepChances[0]));
					}

					if (this.accessible(x+1, y)) {
						upAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[1]));
						rightAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[0]));
						downAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[2]));
						leftAction.addResult(new Result(this.tiles[x+1][y], this.stepChances[3]));
					} else {
						upAction.addResult(new Result(this.tiles[x][y], this.stepChances[1]));
						rightAction.addResult(new Result(this.tiles[x][y], this.stepChances[0]));
						downAction.addResult(new Result(this.tiles[x][y], this.stepChances[2]));
						leftAction.addResult(new Result(this.tiles[x][y], this.stepChances[3]));
					}

					this.tiles[x][y].addAction(upAction);
					this.tiles[x][y].addAction(rightAction);
					this.tiles[x][y].addAction(downAction);
					this.tiles[x][y].addAction(leftAction);
				}
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
		if (0 <= x && x < this.level.length && 0 <= y && y < this.level[0].length)
			return this.level[x][y] !== null;
		else return false;
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
		return this.reward + this.qMemory[iteration];
	}

	toString() {
		return this.getQValue().toFixed(2);
	}
}

class Action {
	constructor(name, results=[]) {
		this.name = name;
		this.results = results;
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
		let qValue = discount * this.results.map(a => {
			if (useNewest)
				return a.chance * (a.reward - a.cost + a.node.getQValue());
			else
				return a.chance * (a.reward - a.cost + a.node.getQValue(this.qMemory.length - 1));
		}).reduce((a, b) => a+b);

		this.qMemory.push(qValue);
		return qValue;
	}

	getQValue(iteration=this.qMemory.length-1) {
		return this.qMemory[iteration];
	}

	reset() {
		this.qMemory = [0];
	}
}

class Result {
	constructor(node, chance, cost=0, reward=0) {
		this.node = node;		// the target node when performing an action
		this.chance = chance;	// the chance of moving to the node after performing the action
		this.cost = cost;		// the step cost for moving to the target node
		this.reward = reward;	// the reward given for the action/movement (NOT the same as reward of node)
	}
}
