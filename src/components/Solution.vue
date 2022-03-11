<template>
	<v-overlay :value="true">
		<v-card id="card">
			<v-container grid-list-lg>
				<v-row>
					<v-col cols="6">
						<!-- Number of included iterations -->
						<v-text-field
							:label="$t('solution.iteration')"
							v-model="iteration"
							min="1"
							class="mt-0 pt-0"
							type="number"
							outlined
							@wheel.prevent="scrollHandler"
						></v-text-field>
					</v-col>

					<v-spacer></v-spacer>

					<!-- Download as .txt-file -->
					<v-tooltip bottom>
						<template v-slot:activator="{on, attrs}">
							<v-btn plain fab @click="save" v-on="on" v-bind="attrs" style="margin-top: 10px">
								<v-icon size="32">mdi-download</v-icon>
							</v-btn>
						</template>
						<span>{{$t('solution.tip.download')}}</span>
					</v-tooltip>

					<!-- Save to clipboard -->
					<v-tooltip bottom>
						<template v-slot:activator="{on, attrs}">
							<v-btn plain fab @click="copy" v-on="on" v-bind="attrs" style="margin-top: 8px">
								<v-icon size="30">mdi-clipboard-multiple-outline</v-icon>
							</v-btn>
						</template>
						<span>{{$t('solution.tip.copy')}}</span>
					</v-tooltip>

					<v-spacer></v-spacer>

					<!-- Close -->
					<v-btn @click="store.commit('displayMDP')" rounded icon>
						<v-icon size="30">mdi-close-thick</v-icon>
					</v-btn>

				</v-row>
			</v-container>
			
			<div>
				<p id="text">{{this.getSolutionTxt()}}</p>
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

		getSolutionTxt() {
			return this.mdp.getSolution(this.iteration);
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
	#text {
		white-space: pre-wrap;
	}

	#card  {
		padding: 16px;
		max-height: 800px;
	}

	#text {
		max-height: 650px;
		width: 500px;
		overflow-y: scroll;
	}

	.spaced {
		margin-left: 16px;
	}
</style>