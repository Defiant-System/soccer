
class Viewport {
	constructor(cfg) {
		let { arena, x, y, w, h } = cfg;

		this.arena = arena;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.config = this.arena.stadium.config;

		// screen shake options
		this.shake = {
			offsetX: 0,
			offsetY: 0,
		};

		this._zoom = 100;
		this._scaleMax = 1;
		this._scaleMin = w / ((this.config.width * 22) + this.config.margin.l + this.config.margin.r);
		this.min = { x: 0, y: 0 };
		this.max = {
			x: (this.config.width * 22) + this.config.margin.l + this.config.margin.r - this.w,
			y: (this.config.height * 22) + this.config.margin.t + this.config.margin.b - (this.h * 1.5),
		};
		this.scale = this._scaleMax;

		// mid point of viewport
		this.half = {
			w: (w >> 1) - arena.config.margin.l,
			h: (h >> 1) - arena.config.margin.t,
		};
	}

	set zoom(v) {
		this._zoom = v;
		this.scale = Math.lerp(this._scaleMin, this._scaleMax, this._zoom/100);
	}

	get zoom() {
		return this._zoom;
	}

	addShake(trauma) {
		
	}

	update(delta, time) {
		
	}

	center() {
		let ball = this.arena.stadium.ball,
			oX = ((this.w >> 1) / this.scale) - this.config.margin.l,
			oY = ((this.h >> 1) / this.scale) - this.config.margin.t,
			centerX = ball.position.x - oX + this.shake.offsetX,
			centerY = ball.position.y - oY + this.shake.offsetY;
		if (centerX < this.min.x) centerX = this.min.x;
		if (centerY < this.min.y) centerY = this.min.y;
		if (centerX > this.max.x) centerX = this.max.x;
		if (centerY > this.max.y) centerY = this.max.y;
		this.scroll(centerX, centerY);
	}

	scroll(x, y) {
		// smooth scroll
		this.x += (x - this.x) * .1;
		this.y += (y - this.y) * .1;
		// hard scroll
		// this.x = x;
		// this.y = y;
	}
}
