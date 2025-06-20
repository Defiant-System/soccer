
class Stadium {
	constructor(cfg) {
		let { parent, assets } = cfg;

		this.parent = parent;
		this.assets = assets;

		let scale = 5;
		this.config = {
			scale,
			height: 105,
			width: 68,
			margin: {
				t: 130,
				l: 30,
				b: 130,
				r: 30 
			},
		};
		this.config.sW = (this.config.width * scale) + this.config.margin.l + this.config.margin.r;
		this.config.sH = (this.config.height * scale) + this.config.margin.t + this.config.margin.b;
		this.full = Utils.createCanvas(this.config.sW, this.config.sH);

		this.entries = [];
		this.patterns = {};
		this.field = new Field({ ...this.config, parent: this });
		this.ball = new Ball({ parent: this, asset: parent.assets.ball });
		// paint full hi-res stadium
		this.paint();

		// add ball
		this.entries.push(this.field);
		// this.entries.push(this.ball);
	}

	paint() {
		let ctx = this.full.ctx,
			{ scale, width, height } = this.config,
			sW = this.config.sW,
			sH = this.config.sH,
			pattern = ctx.createPattern(this.assets.grass.img, "repeat");
		// reset canvas
		this.full.cvs.attr({ width: sW });

		ctx.fillStyle = "#35931e";
		ctx.fillRect(0, 0, sW, sH);

		ctx.save();
		ctx.globalCompositeOperation = "soft-light"; // overlay
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, sH);
		ctx.restore();

		// top bleachers
		pattern = ctx.createPattern(this.assets.bTop.img, "repeat-x");
		ctx.save();
		ctx.translate(0, 0);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, this.assets.bTop.item.height);
		ctx.restore();

		// bottom bleachers
		pattern = ctx.createPattern(this.assets.bBottom.img, "repeat-x");
		ctx.save();
		ctx.translate(0, sH-180);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, this.assets.bBottom.item.height);
		ctx.restore();
	}

	paint2() {
		let ctx = this.full.ctx,
			gX = 0,
			gY = 0,
			gW = 200,
			gH = 500,
			vX = 0,
			vY = 0,
			vW = 0,
			vH = 0;
		// create reusable patterns
		// if (!this.patterns.topBleachers) this.patterns.topBleachers = ctx.createPattern(this.assets.bTop.img, "repeat-x");
		// if (!this.patterns.bottomBleachers) this.patterns.bottomBleachers = ctx.createPattern(this.assets.bBottom.img, "repeat-x");

		/*
		// top bleachers
		ctx.save();
		ctx.translate(0, 0);
		ctx.fillStyle = this.patterns.topBleachers;
		ctx.fillRect(0, 0, 910, 110);
		ctx.restore();

		// bottom bleachers
		ctx.save();
		ctx.translate(0, 602);
		ctx.fillStyle = this.patterns.bottomBleachers;
		ctx.fillRect(0, 0, 910, 88);
		ctx.restore();
		*/
	}

	update(delta, time) {
		// update entries
		this.entries.map(item => item.update(delta, time));
	}

	render(ctx) {
		ctx.drawImage(this.full.cvs[0], 0, 0);

		// draw entries
		this.entries.map(entry => entry.render(ctx));
	}
}