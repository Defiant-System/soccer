
class Arena {
	constructor(cfg) {
		let { canvas } = cfg;

		this.cvs = canvas;
		this.ctx = this.cvs[0].getContext("2d");
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		// set dimenstions
		this.cvs.attr({ width: this.width, height: this.height });

		this.setField();

		// create FPS controller
		let Self = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 60,
			callback(time, delta) {
				Self.update(delta, time);
				Self.render();
			}
		});
	}

	setField() {
		this.field = new Field({ parent: this, width: 68, height: 105 });
	}

	update(delta, time) {
		this.field.update(delta, time);
		this.viewport.update(delta, time);
	}

	render(ctx) {
		this.field.render(ctx);
		
		if (this.debug.mode >= 1) {
			this.drawFps(this.ctx);
		}
	}

	drawFps(ctx) {
		let fps = this.fpsControl ? this.fpsControl._log : [];
		ctx.save();
		ctx.translate(this.width - 109, 0);
		// draw box
		ctx.fillStyle = "#0005";
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
