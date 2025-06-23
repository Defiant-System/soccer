
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

		this.scale = 1; // window.innerWidth / sW;

		// mid point of viewport
		this.half = { w: w >> 1, h: h >> 1 };
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
