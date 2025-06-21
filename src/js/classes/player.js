
class Player {
	constructor(cfg) {
		let { parent, asset } = cfg;

		this.parent = parent;
		this.asset = asset;
	}

	update(delta, time) {
		
	}

	render(ctx) {
		let w1 = 57,
			w2 = 57,
			mX = 171,
			mY = 0,
			x = 560,
			y = 600;

		// player
		// ctx.drawImage(this.asset.cvs, 0, 0, 684, 456, 140, 140, 684, 456);
		ctx.drawImage(this.asset.cvs, mX, mY, w1, w1, x, y, w2, w2);
	}
}
