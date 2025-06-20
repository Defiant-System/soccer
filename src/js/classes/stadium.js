
class Stadium {
	constructor(cfg) {
		let { parent, assets } = cfg;

		this.parent = parent;
		this.assets = assets;

		let scale = 12;
		this.config = {
			scale,
			height: 105,
			width: 68,
			margin: {
				t: 130,
				l: 47,
				b: 130,
				r: 47 
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

		[...Array(6)].map((e, i) => {
			ctx.fillStyle = "#45a32e";
			ctx.fillRect(0, (i * 214) - 84, sW, 107);
		});

		ctx.save();
		ctx.globalCompositeOperation = "soft-light"; // overlay
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, sH);
		ctx.restore();

		// top bleachers
		// pattern = ctx.createPattern(this.assets.bTop.img, "repeat-x");
		// ctx.save();
		// ctx.translate(0, 0);
		// ctx.fillStyle = pattern;
		// ctx.fillRect(0, 0, sW, this.assets.bTop.item.height);
		// ctx.restore();

		// // bottom bleachers
		// pattern = ctx.createPattern(this.assets.bBottom.img, "repeat-x");
		// ctx.save();
		// ctx.translate(0, sH-180);
		// ctx.fillStyle = pattern;
		// ctx.fillRect(0, 0, sW, this.assets.bBottom.item.height);
		// ctx.restore();
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