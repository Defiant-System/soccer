
class Minimap extends Field {
	constructor(cfg) {
		super(cfg);

		let width = (this.width * 2) + 8;
		let height = (this.height * 2) + 8;
		let { cvs, ctx } = Utils.createCanvas(width, height);

		this.cvs = cvs;
		this.ctx = ctx;
		this.width = width;
		this.height= height;

		// semi-transparent box
		ctx.save();
		ctx.fillStyle = "#0002";
		ctx.beginPath();
		ctx.rect(0, 0, this.width, this.height);
		ctx.fill();
		ctx.restore();

		// render mini version of the field
		ctx.save();
		ctx.translate(4-this.oX, 4-this.oY);
		super.render(ctx);
		ctx.restore();
	}

	update(delta, time) {
		super.update(delta, time);
	}

	render(ctx) {
		// draw base field once and render that here
		ctx.drawImage(this.cvs[0], this.oX, this.oY);

		ctx.save();
		ctx.translate(this.oX+4, this.oY+4);
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
