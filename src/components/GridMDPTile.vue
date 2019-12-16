<template>
	<canvas :class="{'canvas': true, 'selected': editing}" width="100" height="75" :ref="id" @click="$emit('edit-tile', id)"></canvas>
</template>

<script>
import store from '../logic/sharedData';
export default {
	name: "GridMDPTile",
	props: ["initTile"],
	data() {return {
		tile: this.initTile,
		displayingIteration: 0,
		editing: false
	}},
	methods: {
		test() {
			return "test";
		},
		redraw() {
			let drawContext = this.$refs[this.id].getContext("2d");
			drawContext.fillStyle = this.color;
			drawContext.fillRect(0, 0, 100, 75);

			if (this.tile.accessible) {
				drawContext.fillStyle = "white";
				drawContext.font = "30px Arial";
				drawContext.textAlign = "center";
				drawContext.fillText(this.tile.getQValue(store.state.displayIteration).toFixed(2), 100/2, (75 + 20)/2);
			
				if (this.tile.terminal) {
					drawContext.beginPath();
					let padding = 5;
					drawContext.strokeStyle = "white";
					drawContext.strokeRect(padding, padding, 100 - 2 * padding, 75 - 2 * padding);

				} else if (this.tile.bestAction()) {
					let action = this.tile.bestAction().name;					
					drawContext.fillStyle = "white";
					if (action === "up") {
						drawContext.fillRect(100 / 2 - 3, 5, 6, 6);
					} else if (action === "right") {
						drawContext.fillRect(100 - 5 - 6, 75 / 2 - 3, 6, 6);
					} else if (action === "left") {
						drawContext.fillRect(5, 75 / 2 - 6, 6, 6);
					} else if (action === "down") {
						drawContext.fillRect(100 / 2 - 3, 75 - 5 - 6, 6, 6);
					}
				}
			}
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
		}
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