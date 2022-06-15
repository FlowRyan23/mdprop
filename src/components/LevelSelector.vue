<template>
	<v-overlay :dark="$vuetify.theme.dark">
		<v-card id="card">
			<v-card-title class="d-flex justify-space-between">
				{{$t('selector.title')}}

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

			<div class="d-flex justify-space-between">
				<v-data-table
					v-model="selected"
					:headers="headers"
					:items="tableData"
					item-key="name"
					:search="search"
					single-select
					multi-sort
					:dense="worlds.length > 5"
					class="ml-4"
					@click:row="clickHandler"
				>

					<template v-slot:[`item.mdp`]="{ item }"> <!-- braces and backtics only needed to silence eslint -->
						<v-icon small color="green" @click="set(item)" class="mr-4">
							mdi-check
						</v-icon>
						<v-icon small color="blue" @click="downloadSingle(item)">
							mdi-download
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
							@interaction="()=>null"
						/>

						<p v-else style="text-align: center; margin-top: 85px">{{$t('selector.preview')}}</p>
					</div>
				</div>
			</div>
			
			<div class="d-flex justify-space-between mt-4">
				<v-btn color="blue" class="ml-4 mb-4 mt-2" @click="set(selected[0])">{{$t('selector.confirm')}}</v-btn>
	
				<v-spacer></v-spacer>

				<v-file-input
					class="ms-4 mt-2"
					chips
					:full-width="false"
					v-model="uploadFiles"
					multiple
					dense
					outlined
					truncate-length="15"
					:label="$t('selector.upload')"
					:placeholder="$t('selector.upload')"
				></v-file-input>

				<v-btn fab icon color="blue" @click="upload">
					<v-icon>mdi-upload</v-icon>
				</v-btn>

				<v-spacer></v-spacer>
			</div>
		</v-card>

		<v-snackbar
			v-model="message"
			:timeout="msgTimeout"
			:color="msgColor">
			{{msgText}}
			<template v-slot:action="{attrs}">
				<v-btn v-bind="attrs" text @click.native="message = false">
					{{$t('toolbar.message.close')}}
				</v-btn>
			</template>
		</v-snackbar>

	</v-overlay>
</template>

<script>
import Display from './Display.vue'
import data from "../assets/worlds.json"
import GridMDP from '../logic/mdp_prop'
import store from "../logic/sharedData"
import { downloadText, log, sleep } from '../logic/util'

export default {
  components: { Display },
	name: "LevelSelector",
	data()  {return {
		store: store,
		data: data,
		tableData: [],
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
			{text: this.$t('selector.actions'), value: 'mdp', filterable: false, sortable: false, align: 'center'},
		],

		uploadFiles: [],
		test: null,

		message: false,
		msgText: "",
		msgColor: "",
		msgTimeout: 4000
	}},

	methods: {
		set(mdp) {
			if (!mdp) {
				this.showMessage(this.$t('selector.message.noneSelected'), "warning")
				return;
			}
			store.commit('setDiscount', mdp.discount);
			store.commit('setStepCost', mdp.stepCost);
			store.commit('displayMDP');
			this.$emit('selected', this.worlds.find(w => w.name === mdp.name));
		},

		downloadSingle(item) {
			// TODO prettify the content
			downloadText(item.name + ".txt", JSON.stringify(this.worlds.find(w => w.name === item.name).compact()));
		},

		remove(item) {
			// TODO only removes it from the current dialogue (will be loaded again)
			if (this.preview.name === item.name) {
				// TODO does not clear the display
				this.preview = null;
			}
			this.worlds = this.worlds.filter(w => w.name !== item.name);
		},

		upload() {
			for (const file of this.uploadFiles) {
				file.text().then(text => {
					try {
						var world = JSON.parse(text);
					} catch (error) {
						this.showMessage(this.$t("selector.message.invalidFileContent", {fileName: file.name}), "error");
						this.uploadFiles = [];
						return;
					}

					if(!world || !world.discount || !world.stepChances || !world.level[0]) {
						this.showMessage(this.$t("selector.message.missingAttribute", {fileName: file.name}), "error");
						this.uploadFiles = [];
						return;
					}

					this.test = world;
					world.name = file.name.slice(0, -4);
					store.commit('saveLevel', world);

					this.tableData.push({
						name: world.name,
						discount: world.discount,
						stepCost: world.stepCost,
						width: world.level[0].length,
						height: world.level.length,
						mdp: world
					});

					this.uploadFiles = [];
				});
			}
		},

		loadData() {
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

		clickHandler(value) {
			this.selected = [value];
			this.preview = value.mdp;
			sleep(0).then(()=>this.$refs.previewDisplay.render());
		},

		showMessage(text, color, timeout=4000) {
			this.msgText = text;
			this.msgColor = color;
			this.msgTimeout = timeout;
			this.message = true;
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
		this.tableData = this.loadData();
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