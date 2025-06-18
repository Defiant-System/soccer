
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
			y = 100,
			r = 15,
			gx = x+r,
			gy = y+r,
			gradient = ctx.createRadialGradient(gx-3, gy-3, 0, gx, gy, r);
		// 3d roundness
		gradient.addColorStop(0.0, "#fff7");
		gradient.addColorStop(0.7, "#1115");
		gradient.addColorStop(1.0, "#1119");

		ctx.save();
		ctx.drawImage(this.asset.img, f, 0, w, w, x, y, w, w);
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(gx+1, gy+1, r-1, 0, Math.TAU);
		ctx.fill();
		ctx.restore();
	}
}
