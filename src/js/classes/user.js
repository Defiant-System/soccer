
class User {
	constructor(cfg) {
		let { parent } = cfg;

		this.parent = parent;

		this.input = {
			up:    { pressed: false, force: { x: 0, y: -1 } },
			left:  { pressed: false, force: { x: -1, y: 0 } },
			down:  { pressed: false, force: { x: 0, y: 1 } },
			right: { pressed: false, force: { x: 1, y: 0 } },
		};
	}

	update(delta, time) {
		// USER input
		let force = { x: 0, y: 0 };
		for (let key in this.input) {
			if (this.input[key].pressed) {
				let f = this.input[key].force;
				if (!f) return;
				if (f.x != 0) force.x = f.x;
				if (f.y != 0) force.y = f.y;
			}
		}

		if (!this.player) {
			this.player = this.parent.player;
		}

		if (force.x !== 0 || force.y !== 0) {
			this.player.move(force);
		}
	}

	render(ctx) {
		
	}
}
