
class Stadium {
	constructor(cfg) {
		let { parent, assets } = cfg;

		this.parent = parent;
		this.assets = assets;

		let scale = 22;  // 22  9.84
		this.config = {
			scale,
			height: 105,
			width: 68,
			margin: {
				t: 320,
				l: 120,
				b: 300,
				r: 120 
			},
		};

		this.entries = [];
		this.patterns = {};
		this.field = new Field({ ...this.config, parent: this });
		this.ball = new Ball({ parent: this, asset: parent.assets.ball });

		this.config.sW = this.field.sW + this.config.margin.l + this.config.margin.r;
		this.config.sH = this.field.sH + this.config.margin.t + this.config.margin.b;
		this.full = Utils.createCanvas(this.config.sW, this.config.sH);

		// paint full hi-res stadium
		this.paint();

		// add ball
		this.entries.push(this.field);
		this.entries.push(this.ball);
	}

	paint() {
		let ctx = this.full.ctx,
			{ scale, margin, width, height } = this.config,
			sW = this.config.sW,
			sH = this.config.sH,
			pattern = ctx.createPattern(this.assets.grass.img, "repeat"),
			stripe = (this.field.sH / 10),
			pW, pH;
		// reset canvas
		this.full.cvs.attr({ width: sW });

		ctx.save();
		ctx.fillStyle = "#35931e";
		ctx.fillRect(0, 0, sW, sH);

		ctx.fillStyle = "#42a12c";
		ctx.translate(0, margin.t);
		ctx.fillRect(0, 0, sW, stripe);
		ctx.fillRect(0, (stripe * 2), sW, stripe);
		ctx.fillRect(0, (stripe * 4), sW, stripe);
		ctx.fillRect(0, (stripe * 6), sW, stripe);
		ctx.fillRect(0, (stripe * 8), sW, stripe);
		ctx.fillRect(0, (stripe * 10), sW, margin.b);
		ctx.restore();

		ctx.save();
		ctx.globalCompositeOperation = "soft-light"; // overlay
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, sH);
		ctx.restore();

		// top bleachers
		pattern = ctx.createPattern(this.assets.bTop.cvs, "repeat-x");
		pH = this.assets.bTop.cvs.height;
		ctx.save();
		ctx.translate(0, 0);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, pH);
		ctx.restore();

		// bottom bleachers
		pattern = ctx.createPattern(this.assets.bBottom.cvs, "repeat-x");
		pH = this.assets.bBottom.cvs.height;
		ctx.save();
		ctx.translate(0, sH-pH);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, pH);
		ctx.restore();
	}

	update(delta, time) {
		// update entries
		this.entries.map(item => item.update(delta, time));
	}

	render(ctx) {
		let home = 0,
			away = window.innerHeight - this.config.sH,
			center = window.innerHeight - (this.config.sH >> 1) - this.config.margin.t;

		ctx.save();
		ctx.translate(0, home);
		ctx.drawImage(this.full.cvs[0], 0, 0);

		// draw entries
		this.entries.map(entry => entry.render(ctx));

		ctx.restore();
	}
}