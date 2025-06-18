
class Arena {
	constructor(cfg) {
		let { canvas } = cfg;

		this.cvs = canvas;
		this.ctx = this.cvs[0].getContext("2d");
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		// set dimenstions
		this.cvs.attr({ width: this.width, height: this.height });
	}

	update(delta, time) {
		
	}

	draw(ctx) {
		
	}
}
