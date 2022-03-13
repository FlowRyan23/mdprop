<template>
	<v-overlay :dark="$vuetify.theme.dark">
		<v-card id="card">
			<v-card-title class="d-flex justify-space-between">
				{{$t('selector.title')}}

				<!-- <v-btn @click="log()">log</v-btn> -->

				<v-spacer></v-spacer>

				<v-text-field
					v-model="search"
					append-icon="mdi-magnify"
					:label="$t('selector.search')"
					single-line
					hide-details
					class="pt-0"
				></v-text-field>

				<v-spacer></v-spacer>

				<v-btn @click="store.commit('displayMDP')" rounded icon>
					<v-icon size="32">mdi-close-thick</v-icon>
				</v-btn>
			</v-card-title>

			<!-- <div v-if="worlds.length > 0" id="wrapper">
				<div :key="x" v-for="(mdp, x) of worlds">
					<Display class="display" :ID="'w-' + x" :mdp="mdp" :preview="true" :size="{width: 280, height: 210}" @interaction="set(mdp)"/>
					<div class="d-flex justify-space-between ml-4 mr-4">
						<p>{{mdp.name}}</p>
						<p>discount: {{mdp.discount}}</p>
						<p>stepCost: {{mdp.stepCost}}</p>
					</div>
				</div>
			</div> -->

			<div class="d-flex justify-space-between">
				<v-data-table
					v-model="selected"
					:headers="headers"
					:items="tableData"
					item-key="name"
					:search="search"
					single-select
					:dense="worlds.length > 5"
					class="ml-4"
					@click:row="clickHandler"
				>

					<template v-slot:[`item.mdp`]="{ item }"> <!-- braces and backtics only needed to silence eslint -->
						<v-icon small color="green" class="mr-8" @click="set(item)">
							mdi-check
						</v-icon>
						<v-icon small	color="red" @click="remove(item)">
							mdi-delete-outline
						</v-icon>
					</template>
				</v-data-table>

				<div class="d-flex flex-column justify-space-around">
					<div id="preview-container">
						<Display
							v-if="preview"
							class="display"
							ref="previewDisplay"
							ID="preview"
							:mdp="preview"
							:preview="true"
							:size="previewSize"
							:style="'margin:' + previewMargin"
							@interaction="set(preview)"
						/>

						<p v-else style="text-align: center; margin-top: 85px">{{$t('selector.preview')}}</p>
					</div>
				</div>
			</div>
			
			<v-btn color="blue" class="ml-4 mb-4" @click="set(selected[0])">{{$t('selector.confirm')}}</v-btn>
		</v-card>
	</v-overlay>
</template>

<script>
import Display from './Display.vue'
import data from "../assets/worlds.json"
import GridMDP from '../logic/mdp_prop'
import store from "../logic/sharedData"
import { log, sleep } from '../logic/util'

export default {
  components: { Display },
	name: "LevelSelector",
	data()  {return {
		store: store,
		data: data,
		worlds: [],
		selected: [],
		preview: null,
		search: null,

		headers: [
			{text: this.$t('selector.name'), value: 'name', align: 'start'},
			{text: this.$t('selector.discount'), value: 'discount', filterable: false, align: 'center'},
			{text: this.$t('selector.stepCost'), value: 'stepCost', filterable: false, align: 'center'},
			{text: this.$t('selector.width'), value: 'width', filterable: false, align: 'center'},
			{text: this.$t('selector.height'), value: 'height', filterable: false, align: 'center'},
			{text: this.$t('selector.actions'), value: 'mdp', filterable: false, align: 'center'},
		]
	}},

	methods: {
		set(mdp) {
			if (!mdp) {
				// TODO display error message
				return;
			}
			store.commit('setDiscount', mdp.discount);
			store.commit('setStepCost', mdp.stepCost);
			store.commit('displayMDP');
			this.$emit('selected', this.worlds.find(w => w.name === mdp.name));
		},

		remove(item) {
			// TODO only removes it from the current dialogue (will be loaded again)
			if (this.preview.name === item.name) {
				// TODO does not clear the display
				this.preview = null;
			}
			this.worlds = this.worlds.filter(w => w.name !== item.name);
		},

		clickHandler(value) {
			this.selected = [value];
			this.preview = value.mdp;
			sleep(0).then(()=>this.$refs.previewDisplay.render());
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

	computed: {
		tableData() {
			let td = [];
			for (const mdp of this.worlds) {
				td.push({
					name: mdp.name,
					discount: mdp.discount,
					stepCost: mdp.stepCost,
					width: mdp.tiles[0].length,
					height: mdp.tiles.length,
					mdp: mdp
				})
			}
			return td;
		},

		previewSize() {
			if (!this.preview) {
				return {width: 280, height: 210}
			}

			let prefTileWidth = Math.floor(280 / this.preview.tiles[0].length);
			let prefTileHeight = Math.floor(210 / this.preview.tiles.length);
			if (prefTileWidth > prefTileHeight) {
				return {width: prefTileHeight * this.preview.tiles[0].length, height: prefTileHeight * this.preview.tiles.length}
			} else {
				return {width: prefTileWidth * this.preview.tiles[0].length, height: prefTileWidth * this.preview.tiles.length}
			}
		},

		previewMargin() {
			return (210 - this.previewSize.height)/2 + "px " + (280 - this.previewSize.width)/2 + "px";
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
		padding: 0px;
		/* min-width: 80vw;
		max-height: 90vh; */
	}
	
	#headline {
		margin-bottom: 16px;
	}

	#preview-container {
		width: 280px;
		height: 210px;
		margin: 12px;
	}
</style>