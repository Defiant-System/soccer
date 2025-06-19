
class Stadium {
	constructor(cfg) {
		let { parent, assets } = cfg;

		this.parent = parent;
		this.assets = assets;

		this.field = new Field({ parent: this });
	}

	update(delta, time) {
		this.field.update(delta, time);
	}

	render(ctx) {
		this.field.render(ctx);
	}
}