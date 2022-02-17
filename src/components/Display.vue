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
	props: ["ID", "tiles"],
	data() {return {
		store: store,
		displayModes: {
			"values": this.renderTileValues,
			"policy": this.renderTilePolicy,
			"detail": this.renderTileDetailed
		},
		selectedX: null,
		selectedY: null,
		clickEvent: null,
		lightBlue: "cornflowerblue",//"rgb(" + 33 +", " + 150 + ", " + 243 + ")",
		test: null
	}},
	methods: {
		clickHandler(event) {
			this.clickEvent = event.button;
			if (event.button === 0) {
				this.selectedX = Math.floor(event.offsetY / this.tileHeight);
				this.selectedY = Math.floor(event.offsetX / this.tileWidth);
				this.render();
				this.$emit("interaction", this.selectedX+"-"+this.selectedY);
			}
		},

		render() {
			let drawContext = this.$refs[this.ID].getContext("2d");
			drawContext.canvas.width = this.width;
			drawContext.canvas.height = this.height;
			// clear the entire canvas in case any part fails to render
			drawContext.fillStyle = this.backGroundColor;
			drawContext.fillRect(0, 0, this.width, this.height);

			for(let x=0; x<this.tiles.length; x++) {
				for(let y=0; y<this.tiles[x].length; y++) {
					let tile = this.tiles[x][y];
					let offset = {"y": x*this.tileHeight, "x": y*this.tileWidth};

					// background color for the tile is given by the qValue
					drawContext.fillStyle = this.tileColor(tile);
					drawContext.fillRect(offset.x, offset.y, this.tileWidth, this.tileHeight);

					// non-accessible tiles are always just black
					if (tile.accessible) {

						// individual tile styling depending on the display mode
						this.displayModes[this.displayMode](drawContext, offset, tile);
				
						// all tiles have a black border if the display is large enough
						if (!this.isSmall) {
							drawContext.strokeStyle = "black";
							drawContext.strokeRect(offset.x, offset.y, this.tileWidth, this.tileHeight);
						}
	
					}
					
					// the selected tile has a gold border to easily identify it
					if (this.isSelected(tile)) {
						drawContext.strokeStyle = "goldenrod";
						drawContext.lineWidth = 2;
						drawContext.strokeRect(offset.x + 1, offset.y + 1, this.tileWidth-2, this.tileHeight-2);
						drawContext.lineWidth = 1;
					}

					// overlay to show which tiles have been reached
					if(this.store.state.reachedPreview && tile.reachedAt(store.state.displayIteration) && tile.accessible && !tile.terminal) {
						drawContext.fillStyle = "rgba(" + 30 +", " + 144 + ", " + 255 + ", " + 0.3 + ")";
						drawContext.fillRect(offset.x, offset.y, this.tileWidth, this.tileHeight);
					}
				}
			}
		},

		renderTilePolicy(ctx, offset, tile) {
			if (tile.terminal) {
				ctx.fillStyle = "white";
				ctx.fillRect(offset.x + this.tileWidth/3, offset.y + this.tileHeight/3, this.tileWidth/3, this.tileHeight/3);
			} else {
				let arrows = this.arrowsOf(tile.getPolicy(store.state.displayIteration));
				this.drawTileArrows(ctx, offset, arrows, "white");
			}
		},

		renderTileValues(ctx, offset, tile) {
			if (tile.terminal) {
				let textSize = Math.min(this.tileWidth*0.33, this.tileHeight/2);
				ctx.drawText(tile.getLabel(store.state.displayIteration), offset.x + this.tileWidth/2, offset.y + this.tileHeight/2, "white", textSize);
			
				ctx.beginPath();
				ctx.strokeStyle = "white";
				ctx.lineWidth = Math.max(1, this.tileWidth * 0.02, this.tileHeight * 0.02);
				ctx.strokeRect(
					offset.x + this.tileWidth * 0.05,
					offset.y + this.tileHeight * 0.05,
					this.tileWidth - 2 * this.tileWidth * 0.05,
					this.tileHeight - 2 * this.tileHeight * 0.05
				);
				ctx.lineWidth = 1;
				
			} else {
				let textSize = Math.min(this.tileWidth*0.33, this.tileHeight/2);
				ctx.drawText(tile.getLabel(store.state.displayIteration), offset.x + this.tileWidth/2, offset.y + this.tileHeight/2, "white", textSize);
			
				// TODO does not draw anything
				if (tile.bestAction()) {
					ctx.fillStyle = "white";
					let diSize = Math.max(1, Math.min(this.tileWidth/10, this.tileHeight/10));
					let inset = Math.max(0, diSize/2);
					if (tile.getPolicy(store.state.displayIteration)["up"]) {
						// ctx.fillRect(offset.x + this.tileWidth / 2 - diSize/2, offset.y + inset, diSize, diSize);
						ctx.fillPoly([
							[offset.x + this.tileWidth / 2 - diSize/2, offset.y + inset + diSize],
							[offset.x + this.tileWidth / 2 + diSize/2, offset.y + inset + diSize],
							[offset.x + this.tileWidth / 2, offset.y + inset]],
							"white", "white"
						);
					}
					if (tile.getPolicy(store.state.displayIteration)["right"]) {
						// ctx.fillRect(offset.x + this.tileWidth - inset - diSize, offset.y + this.tileHeight / 2 - diSize / 2, diSize, diSize);
						ctx.fillPoly([
							[offset.x + this.tileWidth - diSize - inset, offset.y + this.tileHeight/2 - diSize/2],
							[offset.x + this.tileWidth - diSize - inset, offset.y + this.tileHeight/2 + diSize/2],
							[offset.x + this.tileWidth - inset, offset.y + this.tileHeight/2]],
							"white", "white"
						);
					}
					if (tile.getPolicy(store.state.displayIteration)["left"]) {
						// ctx.fillRect(offset.x + inset, offset.y + this.tileHeight / 2 - diSize / 2, diSize, diSize);
						ctx.fillPoly([
							[offset.x + diSize + inset, offset.y + this.tileHeight/2 - diSize/2],
							[offset.x + diSize + inset, offset.y + this.tileHeight/2 + diSize/2],
							[offset.x + inset, offset.y + this.tileHeight/2]],
							"white", "white"
						);
					}
					if (tile.getPolicy(store.state.displayIteration)["down"]) {
						// ctx.fillRect(offset.x + this.tileWidth / 2 - diSize / 2, offset.y + this.tileHeight - inset - diSize, diSize, diSize);
						ctx.fillPoly([
							[offset.x + this.tileWidth / 2 - diSize/2, offset.y + this.tileHeight - inset - diSize],
							[offset.x + this.tileWidth / 2 + diSize/2, offset.y + this.tileHeight - inset - diSize],
							[offset.x + this.tileWidth / 2, offset.y + this.tileHeight - inset]],
							"white", "white"
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
				this.colorOf(tile.actions["left"].getQValue(store.state.displayIteration)), "white");

			ctx.fillPoly([
				[offset.x + 0, offset.y + 0],
				[offset.x + this.tileWidth, offset.y + 0],
				center],
				this.colorOf(tile.actions["up"].getQValue(store.state.displayIteration)), "white");

			ctx.fillPoly([
				[offset.x + this.tileWidth, offset.y + this.tileHeight],
				[offset.x + 0, offset.y + this.tileHeight],
				center],
				this.colorOf(tile.actions["down"].getQValue(store.state.displayIteration)), "white");

			ctx.fillPoly([
				[offset.x + this.tileWidth, offset.y + this.tileHeight],
				[offset.x + this.tileWidth, offset.y + 0],
				center],
				this.colorOf(tile.actions["right"].getQValue(store.state.displayIteration)), "white");
		
			let textSize = Math.min(this.tileWidth/8, this.tileHeight/6);
			ctx.drawText(tile.actions.up.getQValue(store.state.displayIteration).toFixed(2), offset.x + this.tileWidth/2, offset.y + this.tileHeight/5, "white", textSize);
			ctx.drawText(tile.actions.down.getQValue(store.state.displayIteration).toFixed(2), offset.x + this.tileWidth/2, offset.y + 4 * this.tileHeight/5, "white", textSize);
			ctx.drawText(tile.actions.left.getQValue(store.state.displayIteration).toFixed(2), offset.x + this.tileWidth/5, offset.y + this.tileHeight/2, "white", textSize);
			ctx.drawText(tile.actions.right.getQValue(store.state.displayIteration).toFixed(2), offset.x + 4 * this.tileWidth/5, offset.y + this.tileHeight/2, "white", textSize);
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

		drawTileArrows(ctx, offset, arrows, fillColor, borderColor=this.isSmall?fillColor:"white") {
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
			let qValue = tile.getQValue(store.state.displayIteration);
			let hue = Math.max(0, Math.min(120, (120 * (1 + qValue) / 2)));
			let sat = Math.max(0, Math.min(75, 75 * Math.abs(qValue)));
			let bri = Math.max(0, Math.min(55, 15 + 40 * Math.abs(qValue)));
			if (!tile.accessible)
				bri = 5;

			return "hsl(" + hue +", " + sat + "%, " + bri + "%)";	
		},

		colorOf(qValue) {
			let hue = Math.max(0, Math.min(120, (120 * (1 + qValue) / 2)));
			let sat = Math.max(0, Math.min(75, 75 * Math.abs(qValue)));
			let bri = Math.max(0, Math.min(55, 15 + 40 * Math.abs(qValue)));

			return "hsl(" + hue +", " + sat + "%, " + bri + "%)";	
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
			if (this.isSmall) {
				return "policy";
			} else return store.state.renderMode;
		},
		tileWidth() {return store.state.tileWidth},
		tileHeight() {return store.state.tileHeight},
		height() {return store.state.tileHeight * this.tiles.length},
		width() {return store.state.tileWidth * this.tiles[0].length},
		isSmall() {return store.state.tileWidth <= 30 || store.state.tileHeight <= 25},
		// backGroundColor()  {return "hsl(" + 160 +", " + 0 + "%, " + 36 + "%)";}
		backGroundColor()  {return "rgb(" + 38 +", " + 38 + ", " + 38 + ")"}
	},
	mounted() {
		this.render();
	}
}
</script>