<template>
	<v-card>
		<div id="card" class="d-flex flex-column" @click="$emit('redraw')">
			<div class="d-flex flex-row" style="justify-content: space-between">
				<h2 id="title">Editing Tile {{coords()}}</h2>
				<v-btn @click="$emit('close')" rounded icon>
					<v-icon>mdi-close-thick</v-icon>
				</v-btn>
			</div>
			<div id="quick-edits">
				<v-btn-toggle>
					<v-btn @click="setType('free')">Free</v-btn>
					<v-btn @click="setType('wall')">Wall</v-btn>
					<v-btn @click="setType('goal')">Goal</v-btn>
					<v-btn @click="setType('trap')">Trap</v-btn>
				</v-btn-toggle>
			</div>

			<div class="myRow">
				<v-checkbox v-if="store.state.settings.enableAdvancedSettings" v-model="tile.terminal" :label="'Terminal'" color="blue"></v-checkbox>
				<v-checkbox v-model="tile.initial" :label="'Initial'" color="blue" @click.passive="setInit()"></v-checkbox>
				<v-checkbox v-if="store.state.settings.enableAdvancedSettings" v-model="tile.accessible" :label="'Accesible'" color="blue"></v-checkbox>
			</div>

			<!-- Reward slider
			<v-slider  v-if="store.state.settings.enableAdvancedSettings" v-model="tile.reward" :step="0.01" :max="1.0" :min="-1.0" :label="'Reward'" hide-details>
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
			</v-slider>-->

			
			<h3 v-if="store.state.settings.enableAdvancedSettings" style="text-align: center">Reward</h3>
			<div class="myRow" v-if="store.state.settings.enableAdvancedSettings">
				<v-btn class="incBtn" rounded @click="incReward(-10)">-10</v-btn>
				<v-btn class="incBtn" rounded @click="incReward(-1)">-1</v-btn>
				<v-text-field
					v-model="reward"
					id="rewardField"
					class="mt-0 pt-0"
					hide-details
					single-line
					solo-inverted
					type="number"
					hide-spin-buttons
					style="width: 60px"
					@change="updateTileReward()"
					@wheel.prevent="scrollHandler"
				></v-text-field>
				<v-btn class="incBtn" rounded @click="incReward(+1)">+1</v-btn>
				<v-btn class="incBtn" rounded @click="incReward(+10)">+10</v-btn>
			</div>

			<v-expansion-panels style="margin-top: 16px" v-if="store.state.settings.enableAdvancedSettings">
				<h3>Actions</h3>
				<v-expansion-panel v-for="action in tile.actions" :key="action.name">
					<v-expansion-panel-header>{{action.name}}</v-expansion-panel-header>
					<v-expansion-panel-content>
						<ActionEditor :action="action" />
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
			
			<div v-else class="d-flex flex-column">
				<ActionEditor v-for="action in tile.actions" :key="action.name" :action="action" />
			</div>
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
		store: store
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
				case "trap":
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
		},

		incReward(inc) {
			this.tile.reward += inc;
		},

		updateTileReward() {
			this.tile.reward = parseFloat(this.reward);
		},

		scrollHandler(event) {
			if(event.deltaY > 0) {
				this.tile.reward -= 0.01;
			} else {
				this.tile.reward += 0.01;
			}
			this.$emit('redraw');
		}
	},

	computed: {
		displayIteration() {
			return store.state.displayIteration;
		},

		reward() {
			return this.tile.reward.toFixed(2);
		}
	}
}
</script>

<style scoped>
	.incBtn {
		margin-left: 4px;
		margin-right: 4px;
		margin-top: 6px;
	}

	.v-text-field >>> input {
		text-align: center;
	}

	#title {
		margin-bottom: 16px
	}

	#card {
		margin: 16px;
	}

	#rewardField  {
		margin-left: 4px;
		margin-right: 4px;
		margin-bottom: 8px;
	}

	#quick-edits {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>