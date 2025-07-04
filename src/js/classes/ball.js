
class Ball {
	constructor(cfg) {
		let { parent, asset } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.oR = 32;
		this.gR = 22;
		this.radius = this.gR >> 1;
		this.angle = 0;

		// follow no player
		this.following = false;

		// ball position
		let x = ((this.parent.config.width * 22) / 2),
			y = ((this.parent.config.height * 22) / 2) * .85;
		// x = 0; y = 0;
		this.position = new Point(x, y);

		// physics body
		this.body = Matter.Bodies.circle(x, y, this.radius-2, { density: .9, frictionAir: .05 });
		this.body.label = "ball";

		// ball animation / rotation
		this.frame = {
			index: 0,
			total: 14,
			last: 35,
			speed: 35,
		};
	}

	follow(player) {
		if (this.following == player) return;
		this.following = player;
		// console.log(player.name);

		let world = this.parent.parent.engine.world,
			bodyA = this.following.body,
			bodyB = this.body,
			constraint = Matter.Constraint.create({
		        bodyA, bodyB,
		        pointA: { x: 0, y: 0 },
		        pointB: { x: 0, y: 0 }
		    });;
		Matter.Composite.add(world, [bodyA, bodyB, constraint]);
	}

	move(force) {
		force.x = force.x * .5;
		force.y = force.y * .5;
		Matter.Body.applyForce(this.body, this.body.position, force);
	}

	update(delta, time) {
		this.frame.last -= delta;
		if (this.frame.last < 0) {
			this.frame.last = (this.frame.last + this.frame.speed) % this.frame.speed;
			this.frame.index += this.body.speed * 1.5;
			if (this.frame.index > this.frame.total) this.frame.index = 0;
		}

		if (this.body.speed > .1) {
			// ball rolling direction
			let vel = this.body.velocity;
			this.angle = Math.atan2(vel.y, vel.x) - (Math.PI * 1.5);
		}

		// copy physical position to "this" internal position
		this.position.x = this.body.position.x;
		this.position.y = this.body.position.y;
	}

	render(ctx) {
		let w1 = this.oR,
			w2 = this.gR,
			f = (this.frame.index | 0) * w1,
			x = this.position.x,
			y = this.position.y,
			r = this.radius,
			gradient;
		// ball
		ctx.save();
		ctx.translate(x, y);

		// shadow
		ctx.fillStyle = "#0005";
		ctx.beginPath();
		ctx.arc(3, 3, r-2, 0, Math.TAU);
		ctx.fill();

		ctx.save();
		ctx.rotate(this.angle);
		// ball
		ctx.drawImage(this.asset.img, f, 0, w1, w1, -r, -r, w2, w2);
		ctx.restore();

		// 3d roundness
		gradient = ctx.createRadialGradient(-5, -5, 0, -5, -5, r+3);
		gradient.addColorStop(0.0, "#fff7");
		gradient.addColorStop(0.65, "#1114");
		gradient.addColorStop(1.0, "#0009");
		// gradient
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(0, 0, r-1, 0, Math.TAU);
		ctx.fill();

		ctx.restore();
	}
}
