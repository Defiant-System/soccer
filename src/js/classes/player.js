
class Player {
	constructor(cfg) {
		let { parent, asset, name, num, x, y } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.name = name;
		this.num = num;
		this.position = new Point(+x, +y);

		let pixScale = parent.parent.pixScale;
		this.w = 19 * pixScale;
		this.h = 19 * pixScale;

		this.sheet = {
			"0":   { dir: "n",  sheet: [[0, 0], [19, 0], [38, 0]] },
			"45":  { dir: "nw", sheet: [[171, 19], [190, 19], [209, 19]] },
			"90":  { dir: "w",  sheet: [[114, 0], [133, 0], [152, 0]] },
			"135": { dir: "sw", sheet: [[57, 19], [76, 19], [95, 19]] },
			"180": { dir: "s",  sheet: [[57, 0], [76, 0], [95, 0]] },
			"225": { dir: "se", sheet: [[0, 19], [19, 19], [38, 19]] },
			"270": { dir: "e",  sheet: [[171, 0], [190, 0], [209, 0]] },
			"315": { dir: "ne", sheet: [[114, 19], [133, 19], [152, 19]] },
		};
		// auto scale up with "pixel scale"
		Object.keys(this.sheet).map(key =>
			this.sheet[key].sheet = this.sheet[key].sheet.map(frame =>
				[frame[0] * pixScale, frame[1] * pixScale]));
		// default sheet
		this.strip = this.sheet["0"];
	}

	move(force) {
		let target = this.position.add(force),
			dir = this.position.direction(target),
			angle = (dir * 180 / Math.PI) + 90;
		this.strip = this.sheet[angle];
		this.position.x += force.x;
		this.position.y += force.y;
	}

	update(delta, time) {
		
	}

	render(ctx) {
		let sheet = this.strip.sheet[0],
			w1 = this.w,
			w2 = this.h,
			mX = sheet[0],
			mY = sheet[1],
			x = (this.position.x * 4.5) + 65,
			y = this.position.y * 4.5;

		// player
		ctx.drawImage(this.asset.cvs, mX, mY, w1, w1, x, y, w2, w2);
	}
}
