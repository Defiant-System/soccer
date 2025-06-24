
class Minimap {
	constructor(cfg) {
		let { parent } = cfg;

		this.parent = parent;
	}

	update(delta, time) {
		
	}

	render(ctx) {
		ctx.save();
		ctx.translate(20, 20);

		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 2;
		// whole box
		ctx.beginPath();
		ctx.rect(0, 0, 100, 200);
		ctx.stroke();

		ctx.restore();
	}
}
