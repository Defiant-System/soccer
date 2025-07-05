
class Input {
	constructor(cfg) {
		let { parent } = cfg;

		this.parent = parent;
		this.speed = .5;

		this.keys = {
			up:    { pressed: false, force: { x: 0, y: -1 } },
			left:  { pressed: false, force: { x: -1, y: 0 } },
			down:  { pressed: false, force: { x: 0, y: 1 } },
			right: { pressed: false, force: { x: 1, y: 0 } },
		};
	}

	update(delta, time) {
		// USER input
		let force = new Point(0, 0);
		for (let k in this.keys) {
			if (this.keys[k].pressed) {
				let f = this.keys[k].force;
				if (!f) return;
				if (f.x != 0) force.x = f.x;
				if (f.y != 0) force.y = f.y;
			}
		}

		if (!this.player) {
			this.player = this.parent.team.home.selected;
		}

		if (force.x !== 0 || force.y !== 0) {
			// let item = this.parent.ball.linked ? this.parent.ball : this.player;
			// item.move(force.scale(this.speed));
			this.player.move(force.scale(this.speed));
		}
	}

	render(ctx) {
		if (this.player) {
			let wH = this.player.w >> 1,
				x = this.player.position.x-wH,
				y = this.player.position.y-wH;
			// player
			ctx.save();
			ctx.translate(x, y);
			ctx.fillStyle = "#fff2";
			ctx.beginPath();
			ctx.ellipse(0, 5, 60, 51, 0, 0, Math.TAU);
			ctx.fill();
			ctx.restore();
		}
	}
}
