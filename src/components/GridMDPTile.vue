<template>
	<canvas width="100" height="75" :ref="id"></canvas>
</template>

<script>
import colorConvert from 'color-convert';

export default {
	name: "GridMDPTile",
	props: ["initTile"],
	data() {return {
		tile: this.initTile,
		drawn: false
	}},
	methods: {
		test() {
			return "test";
		},
		redraw() {
			this.drawn = true;
			let drawContext = this.$refs[this.id].getContext("2d");

			drawContext.rect(0, 0, 100, 75);
			//drawContext.fillStyle = "green";
			drawContext.fillStyle = colorConvert.rgb.hsl(360 * this.tile.getQValue(), 100, 50);
			drawContext.fill();

			drawContext.fillStyle = "white";
			drawContext.font = "30px Arial";
			drawContext.fillText(this.tile, 10, 50);
		}
	},
	computed: {
		id() {
			return "" + this.tile.x + this.tile.y;
		}
	}
}
</script>

<style scoped>

</style>