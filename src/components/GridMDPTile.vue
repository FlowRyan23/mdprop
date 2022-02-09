<template>
	<canvas
		:class="{'bordered': !isSmall, 'selected': !isSmall && editing}"
		:width="width"
		:height="height"
		:ref="id"
		@click="$emit('edit-tile', id)">
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
			let drawContext = this.$refs[this.id].getContext("2d");
			drawContext.fillStyle = this.color;
			drawContext.fillRect(0, 0, this.width, this.height);

			if (this.isSmall) {
				this.renderTiny(drawContext);
			} else {
				this.renderLegacy(drawContext)
			}
		},

		renderLegacy(ctx) {
			if (store.state.settings.detailedDisplay) {
				if (!this.tile.accessible || this.tile.terminal) {
					ctx.fillStyle = this.color;
					ctx.fillRect(0, 0, this.width, this.height);

					if (this.tile.terminal) {
						let textSize = Math.min(this.width*0.33, this.height/2);
						ctx.drawText(this.tile.getLabel(store.state.displayIteration), this.width/2, this.height/2, "white", textSize);
					
						ctx.beginPath();
						ctx.strokeStyle = "white";
						// ctx.strokeRect(this.inset, this.inset, this.width - 2 * this.inset, this.height - 2 * this.inset);
						ctx.strokeRect(this.width * 0.05, this.height * 0.05, this.width - 2 * this.width * 0.05, this.height - 2 * this.height * 0.05);
					}
				} else {
					let center = [this.width/2, this.height/2];
					ctx.fillPoly([[0, 0], [0, this.height], center], this.colorOf(this.tile.actions["left"].getQValue(store.state.displayIteration)), "white");
					ctx.fillPoly([[0, 0], [this.width, 0], center], this.colorOf(this.tile.actions["up"].getQValue(store.state.displayIteration)), "white");
					ctx.fillPoly([[this.width, this.height], [0, this.height], center], this.colorOf(this.tile.actions["down"].getQValue(store.state.displayIteration)), "white");
					ctx.fillPoly([[this.width, this.height], [this.width, 0], center], this.colorOf(this.tile.actions["right"].getQValue(store.state.displayIteration)), "white");
				
					let textSize = Math.min(this.width/8, this.height/6);
					ctx.drawText(this.tile.actions.up.getQValue(store.state.displayIteration).toFixed(2), this.width/2, this.height/5, "white", textSize);
					ctx.drawText(this.tile.actions.down.getQValue(store.state.displayIteration).toFixed(2), this.width/2, 4 * this.height/5, "white", textSize);
					ctx.drawText(this.tile.actions.left.getQValue(store.state.displayIteration).toFixed(2), this.width/5, this.height/2, "white", textSize);
					ctx.drawText(this.tile.actions.right.getQValue(store.state.displayIteration).toFixed(2), 4 * this.width/5, this.height/2, "white", textSize);
				}
			} else {
				
				if (this.tile.accessible) {
					let textSize = Math.min(this.width*0.33, this.height/2);
					ctx.drawText(this.tile.getLabel(store.state.displayIteration), this.width/2, this.height/2, "white", textSize);
				
					if (this.tile.terminal) {
						ctx.beginPath();
						ctx.strokeStyle = "white";
						ctx.strokeRect(this.inset, this.inset, this.width - 2 * this.inset, this.height - 2 * this.inset);

					} else if (this.tile.bestAction()) {
						ctx.fillStyle = "white";
						if (this.tile.getPolicy(store.state.displayIteration)["up"])
							ctx.fillRect(this.width / 2 - this.diSize/2, this.inset, this.diSize, this.diSize);
						if (this.tile.getPolicy(store.state.displayIteration)["right"])
							ctx.fillRect(this.width - this.inset - this.diSize, this.height / 2 - this.diSize / 2, this.diSize, this.diSize);
						if (this.tile.getPolicy(store.state.displayIteration)["left"])
							ctx.fillRect(this.inset, this.height / 2 - this.diSize / 2, this.diSize, this.diSize);
						if (this.tile.getPolicy(store.state.displayIteration)["down"])
							ctx.fillRect(this.width / 2 - this.diSize / 2, this.height - this.inset - this.diSize, this.diSize, this.diSize);
					}
				}
			}
		},

		renderTiny(ctx) {
			if (this.tile.accessible) {
				ctx.fillStyle = this.color;
				ctx.fillRect(0, 0, this.width, this.height);
				
				ctx.fillStyle = "white";
				let w = Math.max(0, this.width/3);
				let h = Math.max(0, this.height/3);
				if (this.tile.terminal) {
					ctx.fillRect(w, h, w, h);
				} else {
					let policy = this.tile.getPolicy(store.state.displayIteration);
					let count = 0;
					if (policy["up"]) {
						ctx.fillPoly([[w, 2*h], [this.width/2, h], [2*w, 2*h]], "white", "white");
						count++;
					}
					else if (policy["right"]) {
						ctx.fillPoly([[w, h], [2*w, this.height/2], [w, 2*h]], "white", "white");
						count++;
					}
					else if (policy["left"]) {
						ctx.fillPoly([[2*w, h], [w, this.height/2], [2*w, 2*h]], "white", "white");
						count++;
					}
					else if (policy["down"]) {
						ctx.fillPoly([[w, h], [this.width/2, 2*h], [2*w, h]], "white", "white");
						count++;
					}
					
					if (count == 0)
						ctx.fillPoly([[w, this.height/2], [this.width/2, h], [2*w, this.height/2], [this.width/2, 2*h]], "white", "white");
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
		
		isSmall() {return this.width <= 30 || this.height <= 25},
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
	.bordered {
		border: 1px solid hsl(0, 0%, 5%);
	}

	.bordered:hover {
		border: 1px solid goldenrod;
	}

	.edit-true {
		border: 1px solid goldenrod;
	}
</style>