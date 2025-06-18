
class Ball {
	constructor(cfg) {
		let { parent, asset } = cfg;

		this.parent = parent;
		this.asset = asset;

		// ball animation / rotation
		this.frame = {
			index: 0,
			total: 14,
			last: 35,
			speed: 35,
		};
	}

	update(delta, time) {
		this.frame.last -= delta;
		if (this.frame.last < 0) {
			this.frame.last = (this.frame.last + this.frame.speed) % this.frame.speed;
			this.frame.index++;
			if (this.frame.index > this.frame.total) this.frame.index = 0;
		}
	}

	render(ctx) {
		let w = 32,
			f = this.frame.index * w,
			x = 100,
			y = 100;
		ctx.save();
		ctx.drawImage(this.asset.img, f, 0, w, w, x, y, w, w);
		ctx.restore();
	}
}
