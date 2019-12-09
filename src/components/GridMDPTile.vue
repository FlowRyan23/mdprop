<template>
	<canvas class="canvas" width="100" height="75" :ref="id" @click="$emit('edit-tile', id)"></canvas>
</template>

<script>

export default {
	name: "GridMDPTile",
	props: ["initTile"],
	data() {return {
		tile: this.initTile,
		displayingIteration: 0
	}},
	methods: {
		test() {
			return "test";
		},
		redraw() {
			let drawContext = this.$refs[this.id].getContext("2d");

			drawContext.rect(0, 0, 100, 75);
			drawContext.fillStyle = this.color;
			drawContext.fill();

			if (this.tile.accessible) {
				drawContext.fillStyle = "white";
				drawContext.font = "30px Arial";
				drawContext.fillText(this.tile, 10, 50);
			}
		}
	},
	computed: {
		id() {
			return "" + this.tile.x + "-" + this.tile.y;
		},

		color() {
			let hue = (120 * (1 + this.tile.getQValue()) / 2);
			let sat = 75 * Math.abs(this.tile.getQValue());
			let bri = 10 + 40 * Math.abs(this.tile.getQValue());
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
</style>