<template>
	<canvas
		:ref="ID"
		@click="clickHandler"
		></canvas>
</template>

<script>
import store from '../logic/sharedData';
import '../logic/renderUtils';

export default {
	name: "Display",
	props: ["ID", "mdp", "preview", "size"],
	data() {return {
		store: store,
		displayModes: {
			"values": this.renderTileValues,
			"policy": this.renderTilePolicy,
			"detail": this.renderTileDetailed,
			"preview": this.renderTilePreview
		},
		selectedX: null,
		selectedY: null
	}},
	methods: {
		clickHandler(event) {
			if (event.button === 0) {
				if (!this.preview) {
					this.selectedX = Math.floor(event.offsetY / this.tileHeight);
					this.selectedY = Math.floor(event.offsetX / this.tileWidth);
					this.render();
				}
				this.$emit("interaction", {x:this.selectedX, y: this.selectedY});
			}
		},

		render() {
			let drawContext = this.$refs[this.ID].getContext("2d");
			drawContext.canvas.width = this.width;
			drawContext.canvas.height = this.height;
			// clear the entire canvas in case any part fails to render
			// drawContext.fillStyle = "black";
			// drawContext.fillRect(0, 0, this.width, this.height);
			drawContext.clearRect(0, 0, this.width, this.height);

			for(let x=0; x<this.mdp.tiles.length; x++) {
				for(let y=0; y<this.mdp.tiles[x].length; y++) {
					let tile = this.mdp.tiles[x][y];
					let offset = {"y": x*this.tileHeight, "x": y*this.tileWidth};

					// background color for the tile is given by the qValue
					drawContext.fillStyle = this.tileColor(tile);
					drawContext.fillRect(offset.x, offset.y, this.tileWidth, this.tileHeight);

					// individual tile styling depending on the display mode
					if (tile.accessible) {
						this.displayModes[this.displayMode](drawContext, offset, tile);
					}
					
					// all tiles have a black border if the display is large enough
					if (!this.isSmall) {
						drawContext.strokeStyle = "black";
						drawContext.strokeRect(offset.x, offset.y, this.tileWidth, this.tileHeight);
					}
					
					// the selected tile has a gold border to easily identify it
					if (this.isSelected(tile)) {
						drawContext.strokeStyle = "goldenrod";
						drawContext.lineWidth = 2;
						drawContext.strokeRect(offset.x + 1, offset.y + 1, this.tileWidth-2, this.tileHeight-2);
						drawContext.lineWidth = 1;
					}

					// overlay to show which tiles have been reached
					if (this.store.state.reachedPreview || this.displayMode==="preview") {
						if(tile.reachedAt(store.state.displayIteration) && tile.accessible && !tile.terminal) {
							drawContext.fillStyle = "rgba(" + 30 +", " + 144 + ", " + 255 + ", " + 0.3 + ")";
							drawContext.fillRect(offset.x, offset.y, this.tileWidth, this.tileHeight);
						}
					}
				}
			}
		},

		renderTilePolicy(ctx, offset, tile) {
			// TODO with colored tiles off there is no distinction between traps and goals
			if (tile.terminal) {
				ctx.fillStyle = this.textColor;
				ctx.fillRect(offset.x + this.tileWidth/3, offset.y + this.tileHeight/3, this.tileWidth/3, this.tileHeight/3);
			} else {
				// TODO reenable (disabled for use as print)
				// let arrows = this.arrowsOf(tile.getPolicy(store.state.displayIteration));
				// this.drawTileArrows(ctx, offset, arrows, this.textColor);
			}
		},

		renderTileValues(ctx, offset, tile) {
			let textSize = Math.min(this.tileWidth*0.33, this.tileHeight/2) * (tile.getQValue(store.state.displayIteration)<0?0.9:1);
			if (tile.terminal) {
				ctx.drawText(tile.getLabel(store.state.displayIteration), offset.x + this.tileWidth/2, offset.y + this.tileHeight/2, this.textColor, textSize);
			
				ctx.beginPath();
				ctx.strokeStyle = this.textColor;
				ctx.lineWidth = Math.max(1, this.tileWidth * 0.02, this.tileHeight * 0.02);
				ctx.strokeRect(
					offset.x + this.tileWidth * 0.05,
					offset.y + this.tileHeight * 0.05,
					this.tileWidth - 2 * this.tileWidth * 0.05,
					this.tileHeight - 2 * this.tileHeight * 0.05
				);
				ctx.lineWidth = 1;
				
			} else {
				ctx.drawText(tile.getLabel(store.state.displayIteration), offset.x + this.tileWidth/2, offset.y + this.tileHeight/2, this.textColor, textSize);
			
				if (tile.bestAction()) {
					ctx.fillStyle = this.textColor;
					let diSize = Math.max(1, Math.min(this.tileWidth/10, this.tileHeight/10));
					let inset = Math.max(0, diSize/2);
					if (tile.getPolicy(store.state.displayIteration)["up"]) {
						// ctx.fillRect(offset.x + this.tileWidth / 2 - diSize/2, offset.y + inset, diSize, diSize);
						ctx.fillPoly([
							[offset.x + this.tileWidth / 2 - diSize/2, offset.y + inset + diSize],
							[offset.x + this.tileWidth / 2 + diSize/2, offset.y + inset + diSize],
							[offset.x + this.tileWidth / 2, offset.y + inset]],
							this.textColor, this.textColor
						);
					}
					if (tile.getPolicy(store.state.displayIteration)["right"]) {
						// ctx.fillRect(offset.x + this.tileWidth - inset - diSize, offset.y + this.tileHeight / 2 - diSize / 2, diSize, diSize);
						ctx.fillPoly([
							[offset.x + this.tileWidth - diSize - inset, offset.y + this.tileHeight/2 - diSize/2],
							[offset.x + this.tileWidth - diSize - inset, offset.y + this.tileHeight/2 + diSize/2],
							[offset.x + this.tileWidth - inset, offset.y + this.tileHeight/2]],
							this.textColor, this.textColor
						);
					}
					if (tile.getPolicy(store.state.displayIteration)["left"]) {
						// ctx.fillRect(offset.x + inset, offset.y + this.tileHeight / 2 - diSize / 2, diSize, diSize);
						ctx.fillPoly([
							[offset.x + diSize + inset, offset.y + this.tileHeight/2 - diSize/2],
							[offset.x + diSize + inset, offset.y + this.tileHeight/2 + diSize/2],
							[offset.x + inset, offset.y + this.tileHeight/2]],
							this.textColor, this.textColor
						);
					}
					if (tile.getPolicy(store.state.displayIteration)["down"]) {
						// ctx.fillRect(offset.x + this.tileWidth / 2 - diSize / 2, offset.y + this.tileHeight - inset - diSize, diSize, diSize);
						ctx.fillPoly([
							[offset.x + this.tileWidth / 2 - diSize/2, offset.y + this.tileHeight - inset - diSize],
							[offset.x + this.tileWidth / 2 + diSize/2, offset.y + this.tileHeight - inset - diSize],
							[offset.x + this.tileWidth / 2, offset.y + this.tileHeight - inset]],
							this.textColor, this.textColor
						);
					}
				}
			}
		},

		renderTileDetailed(ctx, offset, tile) {
			if (tile.terminal) {
				this.renderTileValues(ctx, offset, tile);
				return;
			}

			let center = [offset.x + this.tileWidth/2, offset.y + this.tileHeight/2];
			ctx.fillPoly([
				[offset.x + 0, offset.y + 0],
				[offset.x + 0, offset.y + this.tileHeight],
				center],
				store.state.tileColors?this.colorOf(tile.actions["left"].getQValue(store.state.displayIteration)):this.backGroundColor, this.textColor);

			ctx.fillPoly([
				[offset.x + 0, offset.y + 0],
				[offset.x + this.tileWidth, offset.y + 0],
				center],
				store.state.tileColors?this.colorOf(tile.actions["up"].getQValue(store.state.displayIteration)):this.backGroundColor, this.textColor);

			ctx.fillPoly([
				[offset.x + this.tileWidth, offset.y + this.tileHeight],
				[offset.x + 0, offset.y + this.tileHeight],
				center],
				store.state.tileColors?this.colorOf(tile.actions["down"].getQValue(store.state.displayIteration)):this.backGroundColor, this.textColor);

			ctx.fillPoly([
				[offset.x + this.tileWidth, offset.y + this.tileHeight],
				[offset.x + this.tileWidth, offset.y + 0],
				center],
				store.state.tileColors?this.colorOf(tile.actions["right"].getQValue(store.state.displayIteration)):this.backGroundColor, this.textColor);
		
			let textSize = Math.min(this.tileWidth/8, this.tileHeight/6);
			ctx.drawText(tile.actions.up.getQValue(store.state.displayIteration).toFixed(2), offset.x + this.tileWidth/2, offset.y + this.tileHeight/5, this.textColor, textSize);
			ctx.drawText(tile.actions.down.getQValue(store.state.displayIteration).toFixed(2), offset.x + this.tileWidth/2, offset.y + 4 * this.tileHeight/5, this.textColor, textSize);
			ctx.drawText(tile.actions.left.getQValue(store.state.displayIteration).toFixed(2), offset.x + this.tileWidth/5, offset.y + this.tileHeight/2, this.textColor, textSize);
			ctx.drawText(tile.actions.right.getQValue(store.state.displayIteration).toFixed(2), offset.x + 4 * this.tileWidth/5, offset.y + this.tileHeight/2, this.textColor, textSize);
		},

		renderTilePreview(ctx, offset, tile) {
			if (tile.terminal || tile.reward !== 0) {
				if (this.isSmall) {
					this.renderTilePolicy(ctx, offset, tile)	
				} else {
					this.renderTileValues(ctx, offset, tile);
				}
			} else {
				ctx.fillStyle = this.backGroundColor;
				ctx.fillRect(offset.x, offset.y, this.tileWidth, this.tileHeight);
			}
		},

		arrowsOf(policy) {
			let arrows = [];
			for (const action in policy) {
				if (policy[action]) {
					arrows.push(action);
				}
			}
			return arrows;
		},

		drawTileArrows(ctx, offset, arrows, fillColor, borderColor=this.isSmall?fillColor:this.textColor) {
			ctx.lineWidth = 3;
			let w = Math.max(0, this.tileWidth/3);
			let h = Math.max(0, this.tileHeight/3);
			if (arrows.length === 0) {
				// No policy has been calculated yet -> a diamond is drawn in the center
				ctx.fillPoly([
					[offset.x + w, offset.y + this.tileHeight/2],
					[offset.x + this.tileWidth/2, offset.y + h],
					[offset.x + 2*w, offset.y + this.tileHeight/2],
					[offset.x + this.tileWidth/2, offset.y + 2*h]],
					fillColor, borderColor);
			} else if (arrows.length === 1) {
				// One action is the best -> an arrow is drawn in the center
				if (arrows[0] === "up") {
					ctx.fillPoly([
						[offset.x + w, offset.y + 2*h],
						[offset.x + this.tileWidth/2, offset.y + h],
						[offset.x + 2*w, offset.y + 2*h]],
						fillColor, borderColor);
				}
				else if (arrows[0] === "right") {
					ctx.fillPoly([
						[offset.x + w, offset.y + h],
						[offset.x + 2*w, offset.y + this.tileHeight/2],
						[offset.x + w, offset.y + 2*h]],
						fillColor, borderColor);
				}
				else if (arrows[0] === "left") {
					ctx.fillPoly([
						[offset.x + 2*w, offset.y + h],
						[offset.x + w, offset.y + this.tileHeight/2],
						[offset.x + 2*w, offset.y + 2*h]],
						fillColor, borderColor);
				}
				else if (arrows[0] === "down") {
					ctx.fillPoly([
						[offset.x + w, offset.y + h],
						[offset.x + this.tileWidth/2, offset.y + 2*h],
						[offset.x + 2*w, offset.y + h]],
						fillColor, borderColor);
				}
			} else {
				// multiple actions are optimal -> arrows are drawn on the edges
				for (const direction of arrows) {
					let tr = [offset.x + 2 * this.tileWidth / 3, offset.y + this.tileHeight / 3]; // top right of the center square
					let tl = [offset.x + this.tileWidth / 3 , offset.y + this.tileHeight / 3]; // top left of the center square
					let br = [offset.x + 2 * this.tileWidth / 3 , offset.y + 2 * this.tileHeight / 3]; // bottom right of the center square
					let bl = [offset.x + this.tileWidth / 3 , offset.y + 2 * this.tileHeight / 3]; // bottom left of the center square
					let insetH = Math.max(1, tr[1] - offset.y - (tr[0] - tl[0]) * Math.sqrt(3)/2); // vertical insets to make equalateral triangles
					let insetW = Math.max(1, tl[0] - offset.x - (br[1] - tr[1]) * Math.sqrt(3)/2); // horizontal insets to make equalateral triangles

					ctx.lineWidth = 1;
					if (direction === "up") {
						ctx.fillPoly([tl, tr, [offset.x + this.tileWidth / 2, offset.y + insetH]], fillColor, borderColor);
					} else if (direction === "right") {
						ctx.fillPoly([tr, br, [offset.x + this.tileWidth - insetW, offset.y + this.tileHeight / 2]], fillColor, borderColor);
					} else if (direction === "left") {
						ctx.fillPoly([tl, bl, [offset.x + insetW, offset.y + this.tileHeight / 2]], fillColor, borderColor);
					} else if (direction === "down") {
						ctx.fillPoly([bl, br, [offset.x + this.tileWidth / 2, offset.y + this.tileHeight -insetH]], fillColor, borderColor);
					}
				}
			}

			ctx.lineWidth = 1;
		},

		tileColor(tile) {
			if(!tile.accessible) return this.$vuetify.theme.dark?"hsl(160, 0%, 5%)":"rgb(112, 112, 122)";
			if(!store.state.tileColors) return this.backGroundColor;
			return this.colorOf(tile.getQValue(store.state.displayIteration));
		},

		colorOf(qValue) {
			if (qValue===0) return this.backGroundColor;

			if (this.$vuetify.theme.dark) {
				let hue = Math.max(0, Math.min(120, (120 * (1 + qValue) / 2)));
				let sat = Math.max(0, Math.min(75, 75 * Math.abs(qValue)));
				let bri = Math.max(0, Math.min(55, 15 + 40 * Math.abs(qValue)));
				return "hsl(" + hue +", " + sat + "%, " + bri + "%)";	
			} else {
				let hue = Math.max(0, Math.min(120, (120 * (1 + qValue) / 2)));
				let sat = Math.max(0, Math.min(75, 35 + 40 * Math.abs(qValue)));
				let bri = Math.max(50, Math.min(100, 100 - 45 * Math.abs(qValue)));
				return "hsl(" + hue +", " + sat + "%, " + bri + "%)";	
			}

		},

		isSelected(tile) {
			return tile.x === this.selectedX && tile.y === this.selectedY;
		},

		clearSelected() {
			this.selectedX = null;
			this.selectedY = null;
		}
	},

	computed: {
		displayMode() {
			if (this.preview) {
				return "preview";
			} else if(this.isSmall) {
				return "policy";
			} else return store.state.renderMode;
		},
		tileWidth() {
			if (!this.size || this.size === "auto") {
				return store.state.tileWidth;
			} else {
				return Math.floor(this.size.width / this.mdp.tiles[0].length);
			}
		},
		tileHeight() {
			if (!this.size || this.size === "auto") {
				return store.state.tileHeight;
			} else {
				return Math.floor(this.size.height / this.mdp.tiles.length);
			}
		},
		height() {
			if (!this.size || this.size === "auto") {
				return store.state.tileHeight * this.mdp.tiles.length
			} else {
				return this.size.height;
			}
		},
		width() {
			if (!this.size || this.size === "auto") {
				return store.state.tileWidth * this.mdp.tiles[0].length
			} else {
				return this.size.width;
			}
		},
		isSmall() {return this.tileWidth <= 30 || this.tileHeight <= 25},
		// backGroundColor()  {return "hsl(" + 160 +", " + 0 + "%, " + 36 + "%)";}
		backGroundColor() {return this.$vuetify.theme.dark?"rgb(" + 38 +", " + 38 + ", " + 38 + ")":"white"},
		textColor() {return this.$vuetify.theme.dark?"white":"rgb(" + 20 +", " + 20 + ", " + 20 + ")"},
		margins() {
			return Math.round((this.height % this.mdp.tiles.length)/2) + "px " + Math.round((this.width % this.mdp.tiles[0].length)/2) + "px";
		}
	},
	mounted() {
		this.render();
	}
}
</script>