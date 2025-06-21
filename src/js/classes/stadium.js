
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
			pW, pH;
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

		// field lines
		this.field.render(ctx);

		// statium fixtures
		this.fixtures = [
			{ name: "home goal",  cvs: this.assets.home.cvs, mapW: 92, mapH: 31, mapX: 22, mapY: 101, sX: 759, sY: 249 },
			{ name: "home pitch", cvs: this.assets.home.cvs, mapW: 21, mapH: 68, mapX: 251, mapY: 101, sX: 0, sY: 1030 },
			{ name: "home pitch p1", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1060 },
			{ name: "home pitch p2", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1084 },
			{ name: "home pitch p3", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1108 },
			{ name: "home pitch p4", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1132 },
			{ name: "home trainer", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 0, mapY: 116, sX: 72, sY: 1171 },
			{ name: "home police 1", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 321, sY: 147 },
			{ name: "home police 2", cvs: this.assets.home.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 348, sY: 147 },
			{ name: "home police 3", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 1391, sY: 147 },
			{ name: "home police 4", cvs: this.assets.home.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 1418, sY: 147 },
			// away side
			{ name: "away goal",  cvs: this.assets.away.cvs, mapW: 90, mapH: 34, mapX: 114, mapY: 101, sX: 759, sY: 2230 },
			{ name: "away pitch", cvs: this.assets.away.cvs, mapW: 21, mapH: 68, mapX: 251, mapY: 101, sX: 0, sY: 1385 },
			{ name: "away trainer", cvs: this.assets.away.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 116, sX: 51, sY: 1403 },
			{ name: "away pitch p1", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1445 },
			{ name: "away pitch p2", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1469 },
			{ name: "away pitch p3", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1493 },
			{ name: "away pitch p4", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1517 },
			{ name: "home police 1", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 321, sY: 2397 },
			{ name: "home police 2", cvs: this.assets.home.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 348, sY: 2397 },
			{ name: "home police 3", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 1391, sY: 2397 },
			{ name: "home police 4", cvs: this.assets.home.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 1418, sY: 2397 },
		];
		// draw stadium fixtures
		this.fixtures.map(item => {
			ctx.drawImage(item.cvs, item.mapX, item.mapY, item.mapW, item.mapH, item.sX, item.sY, item.mapW*pS, item.mapH*pS);
		});
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
		ctx.scale(.525, .525);
		ctx.translate(-0, home);
		ctx.drawImage(this.full.cvs[0], 0, 0);

		// draw entries
		this.entries.map(entry => entry.render(ctx));

		ctx.restore();
	}
}