
class Stadium {
	constructor(cfg) {
		let { parent, assets } = cfg;

		this.parent = parent;
		this.assets = assets;
		this.entries = [];

		this.field = new Field({ parent: this });
		this.ball = new Ball({ parent: this, asset: parent.assets.ball });

		this.patterns = {};

		// add ball
		// this.entries.push(this.field);
		// this.entries.push(this.ball);
	}

	update(delta, time) {
		// update entries
		this.entries.map(item => item.update(delta, time));
	}

	render(ctx) {
		let gX = 0,
			gY = 0,
			gW = 200,
			gH = 500,
			vX = 0,
			vY = 0,
			vW = 0,
			vH = 0;
		// create reusable patterns
		if (!this.patterns.topBleachers) this.patterns.topBleachers = ctx.createPattern(this.assets.bTop.img, "repeat-x");
		if (!this.patterns.bottomBleachers) this.patterns.bottomBleachers = ctx.createPattern(this.assets.bBottom.img, "repeat-x");
		
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

		// draw entries
		this.entries.map(entry => entry.render(ctx));
	}
}