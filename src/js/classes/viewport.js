
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
		this._scaleMin = w / (this.config.width * 22);
		this.min = { x: 0, y: 0 };
		this.max = {
			x: (this.config.width * 22) + this.config.margin.l + this.config.margin.r - this.w,
			y: (this.config.height * 22) + this.config.margin.t + this.config.margin.b - this.h,
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
		this.scale = Math.lerp(this._scaleMin, this._scaleMax, this._zoom/100)
	}

	get zoom() {
		return this._zoom;
	}

	addShake(trauma) {
		
	}

	update(delta, time) {
		
	}

	center() {
		let arena = this.arena,
			centerX = arena.stadium.ball.position.x - this.half.w + this.shake.offsetX,
			centerY = arena.stadium.ball.position.y - this.half.h + this.shake.offsetY;
		this.scroll(centerX, centerY);
	}

	scroll(x, y) {
		if (x < this.min.x) x = this.min.x;
		if (y < this.min.y) y = this.min.y;
		if (x > this.max.x) x = this.max.x;
		if (y > this.max.y) y = this.max.y;
		this.x = x;
		this.y = y;
	}
}
