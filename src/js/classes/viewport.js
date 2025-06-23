
class Viewport {
	constructor(cfg) {
		let { arena, x, y, w, h } = cfg;
		
		this.arena = arena;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		// screen shake options
		this.shake = {
			offsetX: 0,
			offsetY: 0,
		};

		this._zoom = 100;
		this._scaleMax = 1;
		this._scaleMin = w / this.arena.stadium.config.sW;
		this.scale = this._scaleMax;

		// mid point of viewport
		this.half = { w: w >> 1, h: h >> 1 };
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
			centerX = this.half.w - arena.stadium.ball.position.x + this.shake.offsetX,
			centerY = this.half.h - arena.stadium.ball.position.y + this.shake.offsetY;
		this.scroll(centerX, centerY);
	}

	scroll(x, y) {
		this.x = x;
		this.y = y;
	}
}
