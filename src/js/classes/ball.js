
class Ball {
	constructor(cfg) {
		let { parent, asset } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.top = parent.config.margin.t + (parent.config.height / 2);
		this.left = parent.config.margin.l + (parent.config.width / 2);
		console.log( this.top, this.left );

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
		let w1 = 32,
			w2 = 32,
			f = this.frame.index * w1,
			x = 454, // this.left,
			y = 664, // this.top,
			r = (w2-2) >> 1,
			gx = x+r,
			gy = y+r,
			gradient;

		ctx.save();
		// ctx.globalAlpha = .5;
		ctx.translate(-r, -r);
		// 3d roundness
		gradient = ctx.createRadialGradient(gx-3, gy-3, 0, gx, gy, r);
		gradient.addColorStop(0.0, "#fff7");
		gradient.addColorStop(0.65, "#1113");
		gradient.addColorStop(1.0, "#0009");

		// shadow
		ctx.fillStyle = "#0003";
		ctx.beginPath();
		ctx.arc(gx+7, gy+7, r-3, 0, Math.TAU);
		ctx.fill();
		// ball
		ctx.drawImage(this.asset.img, f, 0, w1, w1, x, y, w2, w2);
		// gradient
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(gx+1, gy+1, r-1, 0, Math.TAU);
		ctx.fill();
		ctx.restore();
	}
}
