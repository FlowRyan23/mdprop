<template>
	<v-overlay :value="true" :dark="$vuetify.theme.dark">
		<v-card id="card">
			<v-card-title primary-title>
				{{$t('solution.title')}}

				<v-spacer></v-spacer>

				<!-- Number of included iterations -->
				<v-text-field
					:label="$t('solution.iteration')"
					v-model="iteration"
					min="1"
					type="number"
					outlined
					hide-details
					dense
					autofocus
					style="width: 80px"
					class="no-spins"
					@wheel.prevent="scrollHandler"
				></v-text-field>

				<v-spacer></v-spacer>

				<!-- Download as .txt-file -->
				<v-tooltip bottom>
					<template v-slot:activator="{on, attrs}">
						<v-btn plain fab @click="save" v-on="on" v-bind="attrs">
							<v-icon medium>mdi-download</v-icon>
						</v-btn>
					</template>
					<span>{{$t('solution.tip.download')}}</span>
				</v-tooltip>

				<!-- Save to clipboard -->
				<v-tooltip bottom>
					<template v-slot:activator="{on, attrs}">
						<v-btn plain fab @click="copy" v-on="on" v-bind="attrs">
							<v-icon medium>mdi-clipboard-multiple-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('solution.tip.copy')}}</span>
				</v-tooltip>

				<v-spacer></v-spacer>

				<v-btn @click="store.commit('displayMDP')" rounded icon>
					<v-icon size="32">mdi-close-thick</v-icon>
				</v-btn>
			</v-card-title>
			
			<div>
				<p id="text">{{this.getSolutionTxt(25)}}</p>
			</div>
		</v-card>
	</v-overlay>
</template>

<script>
import store from '../logic/sharedData';
import {copyTextToClipboard, downloadText} from '../logic/util';

export default {
	props: ["mdp"],

	data() {return {
		store: store,
		iteration: Math.max(1, store.state.displayIteration),
		filename: "solution"
	}},

	methods: {
		save()  {
			downloadText(this.filename + ".txt", this.getSolutionTxt());
		},

		copy() {
			copyTextToClipboard(this.getSolutionTxt());
		},

		getSolutionTxt(max=this.iteration) {
			let solText = this.mdp.getSolution(Math.min(max, this.iteration), true);
			if (max < this.iteration) {
				solText += "\n" + this.$t('solution.previewLimit');
			}
			return solText;
		},

		scrollHandler(event, attribute="iteration", min=1, max=10000, step=1) {
			if(event.deltaY > 0) {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] - step));
			} else {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] + step));
			}
		}
	}
}
</script>

<style scoped>
	#card  {
		padding: 16px;
		height: 80vh;
	}

	#text {
		white-space: pre-wrap;
		height: 650px;
		width: 550px;
		overflow-y: scroll;
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
</style>