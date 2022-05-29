<template>
	<v-container>
		<v-row class="no-pad" no-gutters>
			<v-col class="no-pad" cols="7" align-self="center">
				<v-tooltip right color="black">
					<template v-slot:activator="{on, attrs}">
						<span v-on="on" v-bind="attrs">{{$t('creator.constraints.' + name)}}</span>
					</template>
					<span>{{$t('creator.constraints.' + name + "Hint")}}</span>
				</v-tooltip>
			</v-col>
			<v-col class="no-pad" cols="5">
				<v-btn-toggle v-model="value" mandatory aria-disabled @change="$emit('set')">
					<v-tooltip right nudge-right="96">
						<template v-slot:activator="{on, attrs}">
							<v-btn :value="'required'" :color="value==='required'?'green':null" v-on="on" v-bind="attrs">
								<v-icon>mdi-check</v-icon>
							</v-btn>
						</template>
						<span>{{$t('creator.constraints.required')}}</span>
					</v-tooltip>

					<v-tooltip right nudge-right="49">
						<template v-slot:activator="{on, attrs}">
							<v-btn :value="'optional'" v-on="on" v-bind="attrs"></v-btn>
						</template>
						<span>{{$t('creator.constraints.optional')}}</span>
					</v-tooltip>

					<v-tooltip right>
						<template v-slot:activator="{on, attrs}">
							<v-btn :value="'forbidden'" :color="value==='forbidden'?'red':null" v-on="on" v-bind="attrs">
								<v-icon>mdi-cancel</v-icon>
							</v-btn>
						</template>
						<span>{{$t('creator.constraints.forbidden')}}</span>
					</v-tooltip>

				</v-btn-toggle>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	props: ["name", "initialValue"],
	data() {return {
		value: this.initialValue
	}}
}
</script>