
class Ball {
	constructor(cfg) {
		let { parent, asset } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.oR = 32;
		this.gR = 28;
		this.radius = this.gR >> 1;

		// ball position
		let x = (this.parent.config.sW / 2),
			y = (this.parent.config.sH / 2) + 10; // TODO: calculate "10"
		this.position = new Point(x, y);

		// physics body
		this.body = Matter.Bodies.circle(x, y, this.radius);

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
		let w1 = this.oR,
			w2 = this.gR,
			f = this.frame.index * w1,
			x = this.position.x,
			y = this.position.y,
			r = this.radius,
			gx = x+r,
			gy = y+r,
			gradient;

		ctx.save();
		// ctx.globalAlpha = .5;
		ctx.translate(-r, -r);
		// 3d roundness
		gradient = ctx.createRadialGradient(gx-2.8, gy-2.8, 0, gx, gy, r);
		gradient.addColorStop(0.0, "#fff7");
		gradient.addColorStop(0.65, "#1114");
		gradient.addColorStop(1.0, "#0009");

		// shadow
		ctx.fillStyle = "#0005";
		ctx.beginPath();
		ctx.arc(gx+3.5, gy+3.5, r-2, 0, Math.TAU);
		ctx.fill();
		// ball
		ctx.drawImage(this.asset.img, f, 0, w1, w1, x, y, w2, w2);
		// gradient
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(gx, gy, r-1.5, 0, Math.TAU);
		ctx.fill();
		ctx.restore();

		/* indicates ball pos
		ctx.fillStyle = "#f00";
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, Math.TAU);
		ctx.fill();
		*/
	}
}
