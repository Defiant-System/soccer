
class Player {
	constructor(cfg) {
		let { parent, asset, name, num, x, y } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.name = name;
		this.num = num;
		this.position = new Point(+x, +y);

		this.sheet = {
			n: [[0, 0], [19, 0], [38, 0]],
			s: [[57, 0], [76, 0], [95, 0]],
			w: [[114, 0], [133, 0], [152, 0]],
			e: [[171, 0], [190, 0], [209, 0]],

			se: [[0, 19], [19, 19], [38, 19]],
			sw: [[57, 19], [76, 19], [95, 19]],
			ne: [[114, 19], [133, 19], [152, 19]],
			nw: [[171, 19], [190, 19], [209, 19]],
		};
	}

	move(force) {
		let target = this.position.add(force),
			dir = this.position.direction(target),
			angle = (dir * 180 / Math.PI) + 90;
		console.log(angle);
		this.position.x += force.x;
		this.position.y += force.y;
	}

	update(delta, time) {
		
	}

	render(ctx) {
		let w1 = 57,
			w2 = 57,
			mX = 171,
			mY = 0,
			x = (this.position.x * 4.5) + 65,
			y = this.position.y * 4.5;

		// player
		// ctx.drawImage(this.asset.cvs, 0, 0, 684, 456, 140, 140, 684, 456);
		ctx.drawImage(this.asset.cvs, mX, mY, w1, w1, x, y, w2, w2);
	}
}
