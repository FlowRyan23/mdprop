<template>
	<div id="top-container" class="d-flex flex-column">
		<h2>{{$t('settings.title')}}</h2>
		<!-- Discount Input -->
		<div class="d-flex justify-space-between">
			<div v-if="displayFavDiscount" class="d-flex justify-space-around">
				<v-btn-toggle v-model="discount" background-color="transparent" @change="setDiscount" class="mt-1">
					<v-btn :value="0.2" @click="displayFavDiscount=false" id="fav-selection">0,20</v-btn>
					<v-btn :value="0.5" @click="displayFavDiscount=false" id="fav-selection">0,50</v-btn>
					<v-btn :value="0.8" @click="displayFavDiscount=false" id="fav-selection">0,80</v-btn>
					<v-btn :value="0.9" @click="displayFavDiscount=false" id="fav-selection">0,90</v-btn>
					<v-btn :value="0.95" @click="displayFavDiscount=false" id="fav-selection">0,95</v-btn>
					<v-btn :value="0.99" @click="displayFavDiscount=false" id="fav-selection">0,99</v-btn>
				</v-btn-toggle>
			</div>
			
			<v-slider v-else class="mt-3" v-model="discount" :min="0" :max="1" :step="0.01" :label="$t('settings.discount')" hide-details @change="setDiscount">
				<template v-slot:append>
					<v-text-field
						v-model="discount"
						class="number-field pt-0 no-spins"
						hide-details
						single-line
						type="number"
						@change="setDiscount"
					></v-text-field>
				</template>
			</v-slider>

			<v-btn plain fab @click="displayFavDiscount = !displayFavDiscount">
				<v-icon>mdi-star-outline</v-icon>
			</v-btn>
		</div>

		<!-- Stepcost Input -->
		<div class="d-flex justify-space-between">
			<div v-if="displayFavStepCost" class="d-flex justify-space-around">
				<v-btn-toggle v-model="stepCost" background-color="transparent" @change="setStepCost">
					<v-btn :value="0.01" @click="displayFavStepCost=false" id="fav-selection">0,01</v-btn>
					<v-btn :value="0.05" @click="displayFavStepCost=false" id="fav-selection">0,05</v-btn>
					<v-btn :value="0.1" @click="displayFavStepCost=false" id="fav-selection">0,10</v-btn>
					<v-btn :value="0.2" @click="displayFavStepCost=false" id="fav-selection">0,20</v-btn>
					<v-btn :value="1.0" @click="displayFavStepCost=false" id="fav-selection">1,00</v-btn>
					<v-btn :value="2.0" @click="displayFavStepCost=false" id="fav-selection">2,00</v-btn>
				</v-btn-toggle>
			</div>
			
			<v-slider v-else class="mt-1" v-model="stepCost" :min="0" :max="5" :step="0.01" :label="$t('settings.stepCost')" hide-details @change="setStepCost">
				<template v-slot:append>
					<v-text-field
						v-model="stepCost"
						class="number-field pt-0 no-spins"
						hide-details
						single-line
						type="number"
						@change="setStepCost"
					></v-text-field>
				</template>
			</v-slider>

			<v-btn plain fab @click="displayFavStepCost = !displayFavStepCost" style="margin-top: -8px">
				<v-icon>mdi-star-outline</v-icon>
			</v-btn>
		</div>

		<v-switch :label="$t('settings.useRounded')" v-model="useRounded" @change="store.commit('toggleRounded')" color="blue" class="mt-0"></v-switch>

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
			<div class="d-flex justify-space-between">
				<div v-if="displayFavSCFront" class="d-flex justify-space-around">
					<v-btn-toggle v-model="stepChances.front" background-color="transparent" @change="setStepChances">
						<v-btn :value="0.25" @click="displayFavSCFront=false" id="fav-selection">0,25</v-btn>
						<v-btn :value="0.4" @click="displayFavSCFront=false" id="fav-selection">0,40</v-btn>
						<v-btn :value="0.5" @click="displayFavSCFront=false" id="fav-selection">0,50</v-btn>
						<v-btn :value="0.6" @click="displayFavSCFront=false" id="fav-selection">0,60</v-btn>
						<v-btn :value="0.7" @click="displayFavSCFront=false" id="fav-selection">0,70</v-btn>
						<v-btn :value="0.8" @click="displayFavSCFront=false" id="fav-selection">0,80</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-1" v-model="stepChances.front" :min="0" :max="1" :step="0.01" :label="$t('settings.front')" hide-details @change="setStepChances">
					<template v-slot:append>
						<v-text-field
							v-model="stepChances.front"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setStepChances"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavSCFront = !displayFavSCFront" style="margin-top: -8px">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</div>

			<!-- StepChanceLeft -->
			<div class="d-flex justify-space-between">
				<div v-if="displayFavSCLeft" class="d-flex justify-space-around">
					<v-btn-toggle v-model="stepChances.left" background-color="transparent" @change="setStepChances">
						<v-btn :value="0.1" @click="displayFavSCLeft=false" id="fav-selection">0,10</v-btn>
						<v-btn :value="0.15" @click="displayFavSCLeft=false" id="fav-selection">0,15</v-btn>
						<v-btn :value="0.2" @click="displayFavSCLeft=false" id="fav-selection">0,20</v-btn>
						<v-btn :value="0.25" @click="displayFavSCLeft=false" id="fav-selection">0,25</v-btn>
						<v-btn :value="0.3" @click="displayFavSCLeft=false" id="fav-selection">0,30</v-btn>
						<v-btn :value="0.4" @click="displayFavSCLeft=false" id="fav-selection">0,40</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-1" v-model="stepChances.left" :min="0" :max="1" :step="0.01" :label="$t('settings.left')" hide-details @change="setStepChances">
					<template v-slot:append>
						<v-text-field
							v-model="stepChances.left"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setStepChances"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavSCLeft = !displayFavSCLeft" style="margin-top: -8px">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</div>

			<!-- StepChanceRight -->
			<div class="d-flex justify-space-between">
				<div v-if="displayFavSCRight" class="d-flex justify-space-around">
					<v-btn-toggle v-model="stepChances.right" background-color="transparent" @change="setStepChances">
						<v-btn :value="0.1" @click="displayFavSCRight=false" id="fav-selection">0,10</v-btn>
						<v-btn :value="0.15" @click="displayFavSCRight=false" id="fav-selection">0,15</v-btn>
						<v-btn :value="0.2" @click="displayFavSCRight=false" id="fav-selection">0,20</v-btn>
						<v-btn :value="0.25" @click="displayFavSCRight=false" id="fav-selection">0,25</v-btn>
						<v-btn :value="0.3" @click="displayFavSCRight=false" id="fav-selection">0,30</v-btn>
						<v-btn :value="0.4" @click="displayFavSCRight=false" id="fav-selection">0,40</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-1" v-model="stepChances.right" :min="0" :max="1" :step="0.01" :label="$t('settings.right')" hide-details @change="setStepChances">
					<template v-slot:append>
						<v-text-field
							v-model="stepChances.right"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setStepChances"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavSCRight = !displayFavSCRight" style="margin-top: -8px">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</div>

			<!-- StepChanceBack -->
			<div class="d-flex justify-space-between">
				<div v-if="displayFavSCBack" class="d-flex justify-space-around">
					<v-btn-toggle v-model="stepChances.back" background-color="transparent" @change="setStepChances">
						<v-btn :value="0.05" @click="displayFavSCBack=false" id="fav-selection">0,05</v-btn>
						<v-btn :value="0.1" @click="displayFavSCBack=false" id="fav-selection">0,10</v-btn>
						<v-btn :value="0.15" @click="displayFavSCBack=false" id="fav-selection">0,15</v-btn>
						<v-btn :value="0.2" @click="displayFavSCBack=false" id="fav-selection">0,20</v-btn>
						<v-btn :value="0.25" @click="displayFavSCBack=false" id="fav-selection">0,25</v-btn>
						<v-btn :value="0.3" @click="displayFavSCBack=false" id="fav-selection">0,30</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-1" v-model="stepChances.back" :min="0" :max="1" :step="0.01" :label="$t('settings.back')" hide-details @change="setStepChances">
					<template v-slot:append>
						<v-text-field
							v-model="stepChances.back"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setStepChances"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavSCBack = !displayFavSCBack" style="margin-top: -8px">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</div>
		</div>

		<!-- Noise -->
		<div v-else class="d-flex justify-space-between">
			<div v-if="displayFavNoise" class="d-flex justify-space-around">
				<v-btn-toggle v-model="noise" background-color="transparent" @change="setStepChances">
					<v-btn :value="0.1" @click="displayFavNoise=false" id="fav-selection">0,10</v-btn>
					<v-btn :value="0.2" @click="displayFavNoise=false" id="fav-selection">0,20</v-btn>
					<v-btn :value="0.4" @click="displayFavNoise=false" id="fav-selection">0,40</v-btn>
					<v-btn :value="0.5" @click="displayFavNoise=false" id="fav-selection">0,50</v-btn>
					<v-btn :value="0.6" @click="displayFavNoise=false" id="fav-selection">0,60</v-btn>
					<v-btn :value="0.8" @click="displayFavNoise=false" id="fav-selection">0,80</v-btn>
				</v-btn-toggle>
			</div>
			
			<v-slider v-else class="mt-3" v-model="noise" :min="0" :max="1" :step="0.01" :label="$t('settings.noise')" hide-details @change="setStepChances">
				<template v-slot:append>
					<v-text-field
						v-model="noise"
						class="number-field pt-0 no-spins"
						hide-details
						single-line
						type="number"
						@change="setStepChances"
					></v-text-field>
				</template>
			</v-slider>

			<v-btn plain fab @click="displayFavNoise = !displayFavNoise">
				<v-icon>mdi-star-outline</v-icon>
			</v-btn>
		</div>

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
			<div class="d-flex justify-space-between">
				<div v-if="displayFavTileWidth" class="d-flex justify-space-around">
					<v-btn-toggle v-model="tileWidth" background-color="transparent" @change="setTileSizes">
						<v-btn :value="30" @click="displayFavTileWidth=false" id="fav-selection">30%</v-btn>
						<v-btn :value="50" @click="displayFavTileWidth=false" id="fav-selection">50%</v-btn>
						<v-btn :value="100" @click="displayFavTileWidth=false" id="fav-selection">100%</v-btn>
						<v-btn :value="150" @click="displayFavTileWidth=false" id="fav-selection">150%</v-btn>
						<v-btn :value="200" @click="displayFavTileWidth=false" id="fav-selection">200%</v-btn>
						<v-btn :value="250" @click="displayFavTileWidth=false" id="fav-selection">250%</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-3" v-model="tileWidth" :min="0" :max="500" :step="5" :label="$t('settings.width')" hide-details @change="setTileSizes">
					<template v-slot:append>
						<v-text-field
							v-model="tileWidth"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setTileSizes"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavTileWidth = !displayFavTileWidth">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</div>

			<!-- tile height slider -->
			<div class="d-flex justify-space-between">
				<div v-if="displayFavTileHeight" class="d-flex justify-space-around">
					<v-btn-toggle v-model="tileHeight" background-color="transparent" @change="setTileSizes">
						<v-btn :value="30" @click="displayFavTileHeight=false" id="fav-selection">30%</v-btn>
						<v-btn :value="50" @click="displayFavTileHeight=false" id="fav-selection">50%</v-btn>
						<v-btn :value="100" @click="displayFavTileHeight=false" id="fav-selection">100%</v-btn>
						<v-btn :value="150" @click="displayFavTileHeight=false" id="fav-selection">150%</v-btn>
						<v-btn :value="200" @click="displayFavTileHeight=false" id="fav-selection">200%</v-btn>
						<v-btn :value="250" @click="displayFavTileHeight=false" id="fav-selection">250%</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-3" v-model="tileHeight" :min="0" :max="500" :step="5" :label="$t('settings.height')" hide-details @change="setTileSizes">
					<template v-slot:append>
						<v-text-field
							v-model="tileHeight"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setTileSizes"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavTileHeight = !displayFavTileHeight">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</div>
		</div>

		<div v-else>
			<!-- zoom slider -->
			<div class="d-flex justify-space-between">
				<div v-if="displayFavZoom" class="d-flex justify-space-around">
					<v-btn-toggle v-model="zoom" background-color="transparent" @change="setTileSizes">
						<v-btn :value="30" @click="displayFavZoom=false" id="fav-selection">30%</v-btn>
						<v-btn :value="50" @click="displayFavZoom=false" id="fav-selection">50%</v-btn>
						<v-btn :value="100" @click="displayFavZoom=false" id="fav-selection">100%</v-btn>
						<v-btn :value="150" @click="displayFavZoom=false" id="fav-selection">150%</v-btn>
						<v-btn :value="200" @click="displayFavZoom=false" id="fav-selection">200%</v-btn>
						<v-btn :value="250" @click="displayFavZoom=false" id="fav-selection">250%</v-btn>
					</v-btn-toggle>
				</div>
				
				<v-slider v-else class="mt-3" v-model="zoom" :min="0" :max="500" :step="5" :label="$t('settings.zoom')" hide-details @change="setTileSizes">
					<template v-slot:append>
						<v-text-field
							v-model="zoom"
							class="number-field pt-0 no-spins"
							hide-details
							single-line
							type="number"
							@change="setTileSizes"
						></v-text-field>
					</template>
				</v-slider>

				<v-btn plain fab @click="displayFavZoom = !displayFavZoom">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
				
				<v-btn plain fab @click="fullscreen()">
					<v-icon>mdi-fullscreen</v-icon>
				</v-btn>
			</div>
		</div>

		<v-switch :label="$t('settings.darkMode')" v-model="darkMode" @change="toggleDarkMode()" color="blue"></v-switch>
		<v-switch :label="$t('settings.colorTiles')" v-model="tileColors" @change="toggleTileColors()" color="blue" style="margin-top: -8px"></v-switch>

		<v-btn @click="reset()" class="mr-3">{{$t('settings.reset')}}</v-btn>

		<!-- <v-select
			:items="locales"
			v-model="$i18n.locale"
			:label="$t('settings.lang')"
			style="margin-top: 32px"
		></v-select> -->

		<div class="d-flex" id="langSelector">
			<p class="mt-4">{{$t('settings.lang')}}</p>
			<img :class="{langImg: true, selLang: $i18n.locale==='de'}" src="@/assets/flag-de.svg" width="64" @click="$i18n.locale='de'">
			<img :class="{langImg: true, selLang: $i18n.locale==='en'}" src="@/assets/flag-en.svg" width="64" @click="$i18n.locale='en'">
			<div></div>
		</div>
	</div>
</template>

<script>
import store from '../logic/sharedData';

export default {
	// TODO try re-calculating the entire propagation on changes
	name: "Settings",
	data() {return {
		store: store,

		// mdp settings
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
		darkMode: store.state.darkMode,
		noise: 0.2,
		zoom: Math.max(store.state.tileWidth, store.state.tileHeight),

		// component layout management
		expandStepChances: false,
		expandTileSizes: false,
		displayFavDiscount: false,
		displayFavStepCost: false,
		displayFavNoise: false,
		displayFavSCFront: false,
		displayFavSCBack: false,
		displayFavSCLeft: false,
		displayFavSCRight: false,
		displayFavTileWidth: false,
		displayFavTileHeight: false,
		displayFavZoom: false
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

		fullscreen() {
			this.$parent.$parent.fitCanvas();
			this.tileWidth = this.store.state.tileWidth;
			this.tileHeigt = this.store.state.tileHeigt;
			this.zoom = Math.max(this.tileWidth, this.tileHeight);
			this.$emit('redraw');
		},

		toggleTileColors() {
			store.commit('toggleTileColors');
			this.$emit('redraw');
		},

		toggleDarkMode() {
			store.commit('toggleDarkMode');
			this.$vuetify.theme.dark = store.state.darkMode;
			this.$emit('redraw');
		},

		scrollHandler(event, attribute, min=0, max=1, step=0.01) {
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
		this.$vuetify.theme.dark = this.darkMode;
	}
}
</script>

<style scoped>
	#top-container {
		margin-top: 16px;
		margin-right: 4px;
		margin-left: 16px;
		margin-bottom: 0px;
	}

	#fav-selection {
		width: 53px;
	}

	.number-field {
		width: 35px;
		margin-top: -4px;
	}

	.v-text-field >>> input {
		text-align: right;
	}

	#langSelector {
		margin-top: 32px;
		justify-content: space-between;
	}

	.langImg {
		margin: 8px;
		border: solid rgb(38, 38, 38);
		background-color: rgb(38, 38, 38);
	}

	.selLang {
		border: solid cornflowerblue;
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