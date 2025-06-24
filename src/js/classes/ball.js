
class Ball {
	constructor(cfg) {
		let { parent, asset } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.oR = 32;
		this.gR = 28;
		this.radius = this.gR >> 1;
		this.angle = Math.PI / 2;

		// ball position
		let x = (this.parent.config.sW / 2),
			y = (this.parent.config.sH / 2) + 10; // TODO: calculate "10"
		this.position = new Point(x, y);

		// physics body
		this.body = Matter.Bodies.circle(x, y, this.radius-2, { density: .15, frictionAir: .05 });

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
			this.frame.index += this.body.speed | 0;
			if (this.frame.index > this.frame.total) this.frame.index = 0;
		}
		
		// copy physical position to "this" internal position
		this.position.x = this.body.position.x;
		this.position.y = this.body.position.y;

		this.angle = this.body.angle;
		// this.frame.speed = this.body.speed;
		// this.angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
		// console.log(this.body.speed);
		// console.log(this.body.velocity);
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

		// ball
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(this.angle);
		ctx.drawImage(this.asset.img, f, 0, w1, w1, -r, -r, w2, w2);
		ctx.restore();
	}
}
