<template>
	<div>
		<div v-bind:key="x" v-for="(col, x) in mdp.tiles" class="row">
			<div v-bind:key="y" v-for="(tile, y) in col" class="col">
				<GridMDPTile :ref="'' + x + y" v-bind:initTile="tile" class="tile"/>
			</div>
		</div>
		<p>{{mdp}}</p>
		<button v-on:click="iter()">next</button>
	</div>
</template>

<script>
import GridMDPTile from './GridMDPTile.vue';
import {gmdp} from '../logic/mdp_prop.js';

export default {
	name: "GridMDP",
	components : {GridMDPTile},
	data() {return {
		mdp: gmdp([
			[0, 0, 0, 1],
			[0, null, 0, -1],
			[0, 0, 0, 0]
		])
	}},
	methods: {
		iter() {
			this.mdp.iteration();
			for(let ref in this.$refs)
				this.$refs[ref][0].redraw();
		}
	}
}
</script>

<style scoped>
	.col {
		display: flex;
		flex-direction: column
	}

	.row {
		display: flex;
		flex-direction: row
	}

	.tile {
		display: inline-block;
		margin: 1px;
	}
</style>