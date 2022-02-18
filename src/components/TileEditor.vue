<template>
	<v-card>
		<div id="card" class="d-flex flex-column" @click="$emit('redraw')">
			<div class="d-flex flex-row" style="justify-content: space-between">
				<h2 id="title">{{$t('tileEditor.title', {id: coords()})}}</h2>
				<v-btn @click="$emit('close')" rounded icon>
					<v-icon>mdi-close-thick</v-icon>
				</v-btn>
			</div>
			<div id="quick-edits">
				<v-btn-toggle>
					<v-btn class="typeButton" @click="setType('free')">{{$t('tileEditor.free')}}</v-btn>
					<v-btn class="typeButton" @click="setType('wall')">{{$t('tileEditor.wall')}}</v-btn>
					<v-btn class="typeButton" @click="setType('goal')">{{$t('tileEditor.goal')}}</v-btn>
					<v-btn class="typeButton" @click="setType('trap')">{{$t('tileEditor.trap')}}</v-btn>
				</v-btn-toggle>
			</div>

			<div class="myRow">
				<v-checkbox v-model="tile.terminal" :label="$t('tileEditor.terminal')" color="blue"></v-checkbox>
				<v-checkbox v-model="tile.initial" :label="$t('tileEditor.initial')" color="blue" @click.passive="setInit()"></v-checkbox>
				<v-checkbox v-model="tile.accessible" :label="$t('tileEditor.accessible')" color="blue"></v-checkbox>
			</div>
			
			<h3>{{$t('tileEditor.reward')}}</h3>
			<div class="myRow">
				<v-btn class="incBtn" rounded @click="incReward(-10)">-10</v-btn>
				<v-btn class="incBtn" rounded @click="incReward(-1)">-1</v-btn>
				<v-text-field
					v-model="reward"
					id="rewardField"
					class="shrink no-spins"
					hide-details
					solo-inverted
					type="number"
					@change="updateTileReward()"
					@wheel.prevent="scrollHandler"
				></v-text-field>
				<v-btn class="incBtn" rounded @click="incReward(+1)">+1</v-btn>
				<v-btn class="incBtn" rounded @click="incReward(+10)">+10</v-btn>
			</div>

			<v-expansion-panels style="margin-top: 16px" v-if="store.state.enableActionEditing">
				<h3>{{$t('tileEditor.actions')}}</h3>
				<v-expansion-panel v-for="action in tile.actions" :key="action.name">
					<v-expansion-panel-header>{{action.name}}</v-expansion-panel-header>
					<v-expansion-panel-content>
							<ActionEditor :action="action"/>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
			
			<div v-else class="d-flex flex-column" style="margin-top: 32px">
				<h3>{{$t('tileEditor.actions')}}</h3>
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
			let r = this.tile.reward.toFixed(2);
			return Math.abs(r) < 0.01? "0.00": r;
		}
	}
}
</script>

<style scoped>
	* {
		max-width: 500px;
	}

	h3 {
		text-align: center;
	}

	.incBtn {
		margin-left: 4px;
		margin-right: 4px;
		margin-top: 6px;
	}

	.typeButton {
		min-width: 70px;
	}

	.v-text-field >>> input {
		text-align: center;
	}

	.no-spins input[type='number'] {
    -moz-appearance:textfield;
	}

	::v-deep input::-webkit-outer-spin-button,
	::v-deep input::-webkit-inner-spin-button {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
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