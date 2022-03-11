<template>
	<v-overlay>
		<v-card id="card">
			<div class="d-flex justify-space-between">
				<h2 id="headline">{{$t('selector.title')}}</h2>
				<v-btn @click="log()">log</v-btn>
				<v-btn @click="store.commit('displayMDP')" rounded icon>
					<v-icon>mdi-close-thick</v-icon>
				</v-btn>
			</div>

			<div v-if="worlds.length > 0" id="wrapper">
				<div :key="x" v-for="(mdp, x) of worlds">
					<Display class="display" :ID="'w-' + x" :mdp="mdp" :preview="true" :size="{width: 300, height: 250}" @interaction="set(mdp)"/>
				</div>
			</div>

		</v-card>
	</v-overlay>
</template>

<script>
import Display from './Display.vue'
import data from "../assets/worlds.json"
import GridMDP from '../logic/mdp_prop'
import store from "../logic/sharedData"
import { log } from '../logic/util'

export default {
  components: { Display },
	name: "LevelSelector",
	data()  {return {
		store: store,
		data: data,
		worlds: []
	}},

	methods: {
		set(mdp) {
			store.commit('displayMDP');
			this.$emit('selected', mdp);
		},

		log() {
			let worldsCompact = this.worlds.map(w => {
				let comp = w.compact();
				comp.name = w.name;
				return comp;
			});
			log(JSON.stringify(worldsCompact));
		}
	},

	created() {
		for (const name in this.data) {
			let world = new GridMDP(this.data[name].level, this.data[name].discount, this.data[name].stepCost);
			world.name = name;
			this.worlds.push(world);
		}
	}
}
</script>

<style scoped>
	.display {
		margin: 8px;
	}

	#wrapper {
		display: flex;
		flex-wrap: wrap;
		overflow-y: scroll;
		max-height: 80vh;
		max-width: 90vw;
	}

	#card {
		padding: 16px;
		min-width: 80vw;
		max-height: 90vh;
	}
	
	#headline {
		margin-bottom: 16px;
	}
</style>