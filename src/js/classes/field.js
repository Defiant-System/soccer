
class Field {
	constructor(cfg) {
		let { parent, width, height } = cfg;

		this.height = height;
		this.width = width;

		this.entries = [];
		this.ball = new Ball({ parent: this, asset: parent.assets.ball });

		// add ball
		this.entries.push(this.ball);
	}

	update(delta, time) {
		this.entries.map(item => item.update(delta, time));
	}

	render(ctx) {
		// draw entries - exclude droids
		this.entries.map(entry => entry.render(ctx));
	}
}