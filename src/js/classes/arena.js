
class Arena {
	constructor(cfg) {
		let { canvas } = cfg;

		this.cvs = canvas;
		this.ctx = this.cvs[0].getContext("2d");
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		// set dimenstions
		this.cvs.attr({ width: this.width, height: this.height });
		// dev / debug purpose
		this.debug = {
			mode: 1,
		};

		// create FPS controller
		let Self = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 50,
			callback(time, delta) {
				Self.update(delta, time);
				Self.render();
			}
		});

		// assets list
		let assets = [
				{ id: "ball", width: 480, height: 32, src: "~/icons/sprite-ball.png" },
				{ id: "grass", width: 600, height: 300, src: "~/gfx/grass.jpg" },
				{ id: "sprite", width: 272, height: 320, src: "~/gfx/sprite.png" },
			],
			loadAssets = () => {
				let item = assets.pop(),
					img = new Image();
				img.src = item.src;
				img.onload = () => {
					// save reference to asset
					this.assets[item.id] = { item, img };
					// are we done yet?
					assets.length ? loadAssets() : this.ready();
				};
			};
		// asset lib
		this.assets = {};
		
		// load assets
		loadAssets();
	}

	ready() {
		// apply team colors on sprite
		this.setTeamColors({
			home: [[0,0,255],[0,0,109]],
			away: [[218,0,0],[109,0,0]],
		});
		// stadium & field
		this.setStadium();
		// play FPS control
		this.fpsControl.start();
	}

	setTeamColors(colors) {
		let palette = [[252,0,0],[252,252,252]];
		let { width, height } = this.assets.sprite.item;
		// team colors
		Object.keys(colors).map(team => {
			let { cvs, ctx } = Utils.createCanvas(width, height);
			// repaints sprite for fighter
			ctx.drawImage(this.assets.sprite.img, 0, 0);
			let pixels = ctx.getImageData(0, 0, width, height),
				data = pixels.data;
			for (let i=0; i<data.length; i+=4) {
				let r = data[i+0],
					g = data[i+1],
					b = data[i+2],
					len = 2;
				while (len--) {
					if (palette[len][0] === r && palette[len][1] === g && palette[len][2] === b) {
						[r,g,b] = colors[team][len];
					}
				}
				data[i+0] = r;
				data[i+1] = g;
				data[i+2] = b;
			}
			ctx.putImageData(pixels, 0, 0);
			// save reference
			this.assets[team] = { cvs: cvs[0], ctx };
		});
	}

	setStadium() {
		this.stadium = new Stadium({ parent: this, assets: this.assets });
		this.viewport = new Viewport({ parent: this });
	}

	update(delta, time) {
		this.stadium.update(delta, time);
		this.viewport.update(delta, time);
	}

	render(ctx) {
		// clear canvas
		this.cvs.attr({ width: this.width });
		// render stadium
		this.stadium.render(this.ctx);
		
		if (this.debug.mode >= 1) {
			this.drawFps(this.ctx);
		}
	}

	drawFps(ctx) {
		let fps = this.fpsControl ? this.fpsControl._log : [];
		ctx.save();
		ctx.translate(this.width - 109, 0);
		// draw box
		ctx.fillStyle = "#000a";
		ctx.fillRect(5, 5, 100, 40);
		ctx.fillStyle = "#fff4";
		ctx.fillRect(7, 7, 96, 11);
		ctx.fillStyle = "#fff6";
		// loop log
		for (let i=0; i<96; i++) {
			let bar = fps[i];
			if (!bar) break;
			let p = bar/90;
			if (p > 1) p = 1;
			ctx.fillRect(102 - i, 43, 1, -24 * p);
		}
		// write fps
		ctx.fillStyle = "#fff";
		ctx.font = "9px Arial";
		ctx.textAlign = "left";
		ctx.fillText('FPS: '+ fps[0], 8, 16);
		// restore state
		ctx.restore();
	}
}
