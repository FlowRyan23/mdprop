<template>
	<v-card>
		<div id="card" class="myCol" @click="$emit('redraw')">
			<h2 id="title">Editing Tile {{coords()}}</h2>

			<div id="quick-edits">
				<v-btn-toggle>
					<v-btn @click="setType('free')">Free</v-btn>
					<v-btn @click="setType('wall')">Wall</v-btn>
					<v-btn @click="setType('goal')">Goal</v-btn>
					<v-btn @click="setType('death')">Death</v-btn>
				</v-btn-toggle>
			</div>

			<div class="myRow">
				<v-checkbox v-model="tile.terminal" :label="'Terminal'" color="blue"></v-checkbox>
				<v-checkbox v-model="tile.accessible" :label="'Accesible'" color="blue"></v-checkbox>
				<v-checkbox v-model="tile.initial" :label="'Initial'" color="blue" @click.passive="setInit()"></v-checkbox>
			</div>

			<!-- Reward slider-->
			<v-slider v-model="tile.reward" :step="0.01" :max="1.0" :min="-1.0" :label="'Reward'" hide-details>
				<template v-slot:append>
					<v-text-field
						v-model="tile.reward"
						class="mt-0 pt-0"
						hide-details
						single-line
						type="number"
						style="width: 60px"
					></v-text-field>
				</template>
			</v-slider>

			<v-expansion-panels>
				<h3>Actions</h3>
				<v-expansion-panel v-for="action in tile.actions" :key="action.name">
					<v-expansion-panel-header>{{action.name}}</v-expansion-panel-header>
					<v-expansion-panel-content>
						<ActionEditor :action="action" />
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</v-card>
</template>

<script>
import ActionEditor from "./ActionEditor";
import store from '../logic/sharedData';

export default {
	name: "TileEditor",
	components: {ActionEditor},
	props: ["tile"],
	data() {return {
	}},

	methods: {
		setType(type="custom") {
			switch (type) {
				case "free":
					this.tile.accessible = true;
					this.tile.reward = 0;
					this.tile.terminal = false;
					break;
				case "wall":
					this.tile.accessible = false;
					this.tile.reward = 0;
					this.tile.terminal = false;
					break;
				case "goal":
					this.tile.accessible = true;
					this.tile.reward = 1;
					this.tile.terminal = true;
					break;
				case "death":
					this.tile.accessible = true;
					this.tile.reward = -1;
					this.tile.terminal = true;
					break;
			}
		},
		
		coords() {
			return '' + (this.tile.y+1) + '-' + (this.tile.x+1);
		},

		setInit() {
			this.tile.reached = this.tile.initial;
		}
	},

	computed: {
		displayIteration() {
			return store.state.displayIteration;
		}
	}
}
</script>

<style scoped>
	#title {
		margin-bottom: 16px
	}

	#card {
		margin: 16px;
	}

	#quick-edits {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>