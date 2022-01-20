<template>
	<canvas
		:class="{'canvas': true, 'selected': editing}"
		:width="width"
		:height="height"
		:ref="id" @click="$emit('edit-tile', id)">
	</canvas>
</template>

<script>
import store from '../logic/sharedData';
import '../logic/renderUtils';
export default {
	name: "GridMDPTile",
	props: ["tile"],
	data() {return {
		editing: false
	}},
	methods: {
		redraw() {
			// todo reactive rendering to different Tile sizes
			let drawContext = this.$refs[this.id].getContext("2d");
			
			if (store.state.settings.detailedDisplay) {
				if (!this.tile.accessible || this.tile.terminal) {
					drawContext.fillStyle = this.color;
					drawContext.fillRect(0, 0, this.width, this.height);

					if (this.tile.terminal) {
						let textSize = Math.min(this.width*0.33, this.height/2);
						drawContext.drawText(this.tile.getLabel(store.state.displayIteration), this.width/2, this.height/2, "white", textSize);
					
						drawContext.beginPath();
						drawContext.strokeStyle = "white";
						// drawContext.strokeRect(this.inset, this.inset, this.width - 2 * this.inset, this.height - 2 * this.inset);
						drawContext.strokeRect(this.width * 0.05, this.height * 0.05, this.width - 2 * this.width * 0.05, this.height - 2 * this.height * 0.05);
					}
				} else {
					let center = [this.width/2, this.height/2];
					drawContext.fillPoly([[0, 0], [0, this.height], center], this.colorOf(this.tile.actions["left"].getQValue(store.state.displayIteration)), "white");
					drawContext.fillPoly([[0, 0], [this.width, 0], center], this.colorOf(this.tile.actions["up"].getQValue(store.state.displayIteration)), "white");
					drawContext.fillPoly([[this.width, this.height], [0, this.height], center], this.colorOf(this.tile.actions["down"].getQValue(store.state.displayIteration)), "white");
					drawContext.fillPoly([[this.width, this.height], [this.width, 0], center], this.colorOf(this.tile.actions["right"].getQValue(store.state.displayIteration)), "white");
				
					let textSize = Math.min(this.width/8, this.height/6);
					drawContext.drawText(this.tile.actions.up.getQValue(store.state.displayIteration).toFixed(2), this.width/2, this.height/5, "white", textSize);
					drawContext.drawText(this.tile.actions.down.getQValue(store.state.displayIteration).toFixed(2), this.width/2, 4 * this.height/5, "white", textSize);
					drawContext.drawText(this.tile.actions.left.getQValue(store.state.displayIteration).toFixed(2), this.width/5, this.height/2, "white", textSize);
					drawContext.drawText(this.tile.actions.right.getQValue(store.state.displayIteration).toFixed(2), 4 * this.width/5, this.height/2, "white", textSize);
				}
			} else {
				drawContext.fillStyle = this.color;
				drawContext.fillRect(0, 0, this.width, this.height);
				
				if (this.tile.accessible) {
					let textSize = Math.min(this.width*0.33, this.height/2);
					drawContext.drawText(this.tile.getLabel(store.state.displayIteration), this.width/2, this.height/2, "white", textSize);
				
					if (this.tile.terminal) {
						drawContext.beginPath();
						drawContext.strokeStyle = "white";
						drawContext.strokeRect(this.inset, this.inset, this.width - 2 * this.inset, this.height - 2 * this.inset);

					} else if (this.tile.bestAction()) {
						drawContext.fillStyle = "white";
						if (this.tile.getPolicy(store.state.displayIteration)["up"])
							drawContext.fillRect(this.width / 2 - this.diSize/2, this.inset, this.diSize, this.diSize);
						if (this.tile.getPolicy(store.state.displayIteration)["right"])
							drawContext.fillRect(this.width - this.inset - this.diSize, this.height / 2 - this.diSize / 2, this.diSize, this.diSize);
						if (this.tile.getPolicy(store.state.displayIteration)["left"])
							drawContext.fillRect(this.inset, this.height / 2 - this.diSize / 2, this.diSize, this.diSize);
						if (this.tile.getPolicy(store.state.displayIteration)["down"])
							drawContext.fillRect(this.width / 2 - this.diSize / 2, this.height - this.inset - this.diSize, this.diSize, this.diSize);
					}
				}
			}
		},

		colorOf(qValue) {
			let hue = Math.max(0, Math.min(120, (120 * (1 + qValue) / 2)));
			let sat = Math.max(0, Math.min(75, 75 * Math.abs(qValue)));
			let bri = Math.max(0, Math.min(55, 15 + 40 * Math.abs(qValue)));
			return "hsl(" + hue +", " + sat + "%, " + bri + "%)";
		}
	},
	computed: {
		id() {
			return "" + this.tile.x + "-" + this.tile.y;
		},

		color() {
			let qValue = this.tile.getQValue(store.state.displayIteration);
			let hue = Math.max(0, Math.min(120, (120 * (1 + qValue) / 2)));
			let sat = Math.max(0, Math.min(75, 75 * Math.abs(qValue)));
			let bri = Math.max(0, Math.min(55, 15 + 40 * Math.abs(qValue)));
			if (!this.tile.accessible)
				bri = 5;

			return "hsl(" + hue +", " + sat + "%, " + bri + "%)";		
		},
		
		width() {return store.state.settings.tileWidth},
		height() {return store.state.settings.tileHeight},
		inset() {return store.state.settings.tileInsets},
		diSize() {return store.state.settings.directionIndicatorSize},
	},
	mounted() {
		this.redraw();
	}
}
</script>

<style scoped>
	.canvas {
		border: 1px solid hsl(0, 0%, 5%);
	}

	.canvas:hover {
		border: 1px solid goldenrod;
	}

	.edit-true {
		border: 1px solid goldenrod;
	}
</style>