
class Minimap extends Field {
	constructor(cfg) {
		super(cfg);
	}

	update(delta, time) {
		super.update(delta, time);
	}

	render(ctx) {
		ctx.save();
		ctx.translate(this.oX, this.oY);
		ctx.fillStyle = "#0002";
		// whole box
		ctx.beginPath();
		ctx.rect(-4, -4, this.width+8, this.height+8);
		ctx.fill();
		ctx.restore();

		super.render(ctx);
	}
}
