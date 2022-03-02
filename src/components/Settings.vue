<template>
	<div class="d-flex flex-column" style="margin: 16px;">
		<h2>{{$t('settings.title')}}</h2>
		<!-- Discount slider -->
		<v-slider v-model="discount" :step="0.01" :max="1" :min="0" :label="$t('settings.discount')" hide-details @change="setDiscount">
			<template v-slot:append>
				<v-text-field
					v-model="discount"
					class="mt-0 pt-0 no-spins"
					hide-details
					single-line
					type="number"
					style="width: 60px"
					@change="setDiscount"
				></v-text-field>
			</template>
		</v-slider>

		<!-- step cost slider -->
		<v-slider v-model="stepCost" :step="0.01" :max="5" :min="0" :label="$t('settings.stepCost')" hide-details @change="setStepCost">
			<template v-slot:append>
				<v-text-field
					v-model="stepCost"
					class="mt-0 pt-0 no-spins"
					hide-details
					single-line
					type="number"
					style="width: 60px"
					@change="setStepCost"
				></v-text-field>
			</template>
		</v-slider>

		<v-switch :label="$t('settings.useRounded')" v-model="useRounded" @change="store.commit('toggleRounded')" color="blue"></v-switch>

		<v-divider></v-divider>
		<!-- Step Chances -->
		<div class="d-flex" style="justify-content: space-between; margin-top: 16px">
			<p style="margin-top:16px">{{$t('settings.stepChances')}}</p>
			<v-btn plain fab @click="expandStepChances = !expandStepChances">
				<v-icon v-if="expandStepChances">mdi-chevron-up</v-icon>
				<v-icon v-else>mdi-chevron-down</v-icon>
			</v-btn>
		</div>

		<div v-if="expandStepChances">
			<!-- StepChanceFront -->
			<v-slider v-model="stepChances.front" :step="0.01" :max="1" :min="0" :label="$t('settings.front')" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.front"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceLeft -->
			<v-slider v-model="stepChances.left" :step="0.01" :max="1" :min="0" :label="$t('settings.left')" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.left"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceRight -->
			<v-slider v-model="stepChances.right" :step="0.01" :max="1" :min="0" :label="$t('settings.right')" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.right"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<!-- StepChanceBack -->
			<v-slider v-model="stepChances.back" :step="0.01" :max="1" :min="0" :label="$t('settings.back')" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="stepChances.back"
						class="mt-0 pt-0 no-spins"
						hide-details
						single-line
						type="number"
						style="width: 60px"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<v-slider v-else v-model="noise" :step="0.01" :max="1" :min="0" :label="$t('settings.noise')" hide-details @change="setStepChances">
			<template v-slot:append>
				<v-text-field
					v-model="noise"
					class="mt-0 pt-0 no-spins"
					hide-details
					single-line
					type="number"
					style="width: 60px"
					@change="setStepChances"
				></v-text-field>
			</template>
		</v-slider>

		<p v-if="stepChanceSum !== 1" style="color: red">{{$t('settings.scWarning')}}</p>

		<v-divider style="margin-top: 16px;"></v-divider>

		<div class="d-flex" style="justify-content: space-between; margin-top: 16px">
			<p style="margin-top:16px">UI</p>
			<v-btn plain fab @click="expandTileSizes = !expandTileSizes">
				<v-icon v-if="expandTileSizes">mdi-chevron-up</v-icon>
				<v-icon v-else>mdi-chevron-down</v-icon>
			</v-btn>
		</div>

		<div v-if="expandTileSizes">
			<!-- tile width slider -->
			<v-slider v-model="tileWidth" :step="1" :max="512" :min="1" :label="$t('settings.width')" hide-details @change="setTileSizes">
				<template v-slot:append>
					<v-text-field
						v-model="tileWidth"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
						@change="setTileSizes"
					></v-text-field>
				</template>
			</v-slider>

			<!-- tile height slider -->
			<v-slider v-model="tileHeight" :step="1" :max="512" :min="1" :label="$t('settings.height')" hide-details @change="setTileSizes">
				<template v-slot:append>
					<v-text-field
						v-model="tileHeight"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
						@change="setTileSizes"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<div v-else>
			<!-- zoom slider -->
			<v-slider v-model="zoom" :step="5" :max="500" :min="5" :label="$t('settings.zoom')" hide-details @change="setTileSizes">
				<template v-slot:append>
					<v-text-field
						v-model="zoom"
						class="mt-0 pt-0" hide-details
						single-line	type="number" style="width: 60px"
						@change="setTileSizes"
					></v-text-field>
				</template>
			</v-slider>
		</div>

		<v-switch :label="$t('settings.darkMode')" v-model="$vuetify.theme.dark" color="blue"></v-switch>
		<v-switch :label="$t('settings.colorTiles')" v-model="tileColors" @change="toggleTileColors()" color="blue"></v-switch>

		<v-btn @click="reset()">{{$t('settings.reset')}}</v-btn>

		<!-- <v-select
			:items="locales"
			v-model="$i18n.locale"
			:label="$t('settings.lang')"
			style="margin-top: 32px"
		></v-select> -->

		<div class="d-flex" id="langSelector">
			<p style="margin-top: 16px">{{$t('settings.lang')}}</p>
			<img :class="{langImg: true, selLang: $i18n.locale==='de'}" src="../assets/flag-de.svg" width="64" @click="$i18n.locale='de'">
			<img :class="{langImg: true, selLang: $i18n.locale==='en'}" src="../assets/flag-en.svg" width="64" @click="$i18n.locale='en'">
			<div></div>
		</div>
	</div>
</template>

<script>
import store from '../logic/sharedData';

export default {
	name: "Settings",
	data() {return {
		store: store,
		discount: store.state.discount,
		stepCost: store.state.stepCost,
		stepChances: {
			front: store.state.scFront,
			back: store.state.scBack,
			left: store.state.scLeft,
			right: store.state.scRight
		},
		tileWidth: store.state.tileWidth,
		tileHeight: store.state.tileHeight,
		useRounded: store.state.useRounded,
		tileColors: store.state.tileColors,
		noise: 0.2,
		zoom: 100,
		expandStepChances: false,
		expandTileSizes: false,
		test: null
	}},

	methods: {
		setDiscount() {
			store.commit('setDiscount', this.discount);
			this.$emit('apply-settings');
		},

		setStepCost() {
			store.commit('setStepCost', this.stepCost);
			this.$emit('apply-settings');
		},

		setStepChances() {
			if (!this.expandStepChances) {
				this.stepChances.front = 1 - this.noise;
				this.stepChances.back = 0;
				this.stepChances.left = this.noise / 2;
				this.stepChances.right = this.noise / 2;
			}
			store.commit('setStepChances', {...this.stepChances});
			this.$emit('apply-settings');
		},

		setTileSizes() {
			if (!this.expandTileSizes) {
				if (this.tileWidth > this.tileHeight) {
					this.tileHeight = this.zoom * this.tileHeight/this.tileWidth;
					this.tileWidth = this.zoom;
				} else {
					this.tileWidth = this.zoom * this.tileWidth/this.tileHeight;
					this.tileHeight = this.zoom;
				}	
			}
			store.commit('setTileSizes', {width: this.tileWidth, height: this.tileHeight});
			this.$emit('redraw');
		},

		toggleTileColors() {
			store.commit('toggleTileColors');
			this.$emit('redraw');
		},

		scrollHandler(event, attribute, min=0, max=200, step) {
			if(event.deltaY > 0) {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] - step));
			} else {
				this[attribute] = Math.min(max, Math.max(min, this[attribute] + step));
			}
		},

		reset() {
			this.discount = 0.9;
			this.setDiscount();
			this.stepCost = 0;
			this.setStepCost();

			this.stepChances.front = 0.8;
			this.stepChances.left = 0.1;
			this.stepChances.right = 0.1;
			this.stepChances.back = 0.0;
			this.noise = 0.2;
			this.setStepChances();

			this.tileWidth = 100;
			this.tileHeight = 100;
			this.zoom = 100;
			this.setTileSizes();

			this.useRounded = true;
			if (!store.state.useRounded) {
				store.commit('toggleRounded');
			}

		}
	},

	computed: {
		stepChanceSum() {
			if(this.expandStepChances) {
				return this.stepChances.front + this.stepChances.back + this.stepChances.left + this.stepChances.right;
			} else return 1;
		},

		locales() {return Object.keys(this.$i18n.messages)}
	},

	created () {
		this.$vuetify.theme.dark = true;
	}
}
</script>

<style scoped>
	.langImg {
		margin: 8px;
		border: solid rgb(38, 38, 38);
		background-color: rgb(38, 38, 38);
	}

	.selLang {
		border: solid cornflowerblue;
	}

	#langSelector {
		margin-top: 64px;
		justify-content: space-between;
	}
</style>