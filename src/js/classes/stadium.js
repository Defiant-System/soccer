
class Stadium {
	constructor(cfg) {
		let { parent, assets, scale, config } = cfg;

		this.parent = parent;
		this.assets = assets;
		this.config = config;

		this.entries = [];
		this.patterns = {};
		this.field = new Field({ ...config, scale, parent });
		this.ball = new Ball({ parent: this, asset: parent.assets.ball });

		this.config.sW = this.field.sW + this.config.margin.l + this.config.margin.r;
		this.config.sH = this.field.sH + this.config.margin.t + this.config.margin.b;
		this.full = Utils.createCanvas(this.config.sW, this.config.sH);

		// paint full hi-res stadium
		this.paint();

		// add ball
		// this.entries.push(this.field);
		this.entries.push(this.ball);
	}

	paint() {
		let ctx = this.full.ctx,
			{ scale, margin, width, height } = this.config,
			sW = this.config.sW,
			sH = this.config.sH,
			pattern = ctx.createPattern(this.assets.grass.img, "repeat"),
			stripe = (this.field.sH / 10),
			pS = this.parent.pixScale,
			fixture;

		// 
		this.zoom = {
			in: 1,
			out: window.innerWidth / sW,
		};

		// reset canvas
		this.full.cvs.attr({ width: sW });
		// no smoothing
		ctx.imageSmoothingEnabled = false;

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

		// grass pattern
		ctx.save();
		ctx.globalCompositeOperation = "soft-light"; // overlay
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, sH);
		ctx.restore();

		// top bleachers
		fixture = this.parent.fixtures.find(e => e.name == "home bleachers");
		pattern = ctx.createPattern(fixture.cvs, "repeat-x");
		ctx.save();
		ctx.translate(0, 0);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, fixture.cvs.height);
		ctx.restore();

		// bottom bleachers
		fixture = this.parent.fixtures.find(e => e.name == "away bleachers");
		pattern = ctx.createPattern(fixture.cvs, "repeat-x");
		ctx.save();
		ctx.translate(0, sH-fixture.cvs.height);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, fixture.cvs.height);
		ctx.restore();

		// field lines
		this.field.render(ctx);

		// draw stadium fixtures
		this.parent.fixtures.map(f =>
			ctx.drawImage(f.cvs, f.mapX, f.mapY, f.mapW, f.mapH, f.sX, f.sY, f.mapW*pS, f.mapH*pS));
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
		ctx.scale(this.zoom.out, this.zoom.out);
		ctx.translate(-0, home);
		ctx.drawImage(this.full.cvs[0], 0, 0);

		// draw entries
		this.entries.map(entry => entry.render(ctx));

		ctx.restore();
	}
}