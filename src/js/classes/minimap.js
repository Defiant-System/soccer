
class Minimap extends Field {
	constructor(cfg) {
		super(cfg);
	}

	update(delta, time) {
		super.update(delta, time);
	}

	render(ctx) {
		// semi-transparent box
		ctx.save();
		ctx.translate(this.oX, this.oY);
		ctx.fillStyle = "#0002";
		ctx.beginPath();
		ctx.rect(-4, -4, this.width+8, this.height+8);
		ctx.fill();
		ctx.restore();

		// render mini version of the field
		super.render(ctx);

		ctx.save();
		ctx.translate(this.oX, this.oY);
		// render player positions
		this.parent.entries
			.filter(item => item.id?.startsWith("player-"))
			.map(player => {
				let r = 2.5,
					x = ((player.position.x / 22) * 2) - r,
					y = ((player.position.y / 22) * 2) - r,
					c = player.team.colors[0];
				ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, .75)`;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.TAU);
				ctx.fill();
			});
		ctx.restore();
	}
}
