
class Player {
	constructor(cfg) {
		let { parent, asset, body, name, num, x, y } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.id = `player-${Date.now()}`;
		this.name = name;
		this.num = num;


		let pixScale = parent.parent.pixScale,
			w = 19 * pixScale,
			h = 19 * pixScale;
		x = (+x * 4.5) + 85;
		y = +y * 4.5;
		this.position = new Point(+x, +y);
		this.w = w;
		this.h = h;
		this.speed = 1;

		// physical body
		this.body = Matter.Bodies.circle(x, y, 20, { density: .5, frictionAir: .05 });
		// this.body = Matter.Bodies.rectangle(x, y, w, h, { density: .15, frictionAir: .05 });
		this.body.label = this.id;
		// prevents rotation
		Matter.Body.setInertia(this.body, Infinity);

		this.sheet = {
			"0":   { dir: "n",  sheet: [[0,0],[19,0],[38,0]] },
			"45":  { dir: "nw", sheet: [[171,19],[190,19],[209,19]] },
			"90":  { dir: "w",  sheet: [[114,0],[133,0],[152,0]] },
			"135": { dir: "sw", sheet: [[57,19],[76,19],[95,19]] },
			"180": { dir: "s",  sheet: [[57,0],[76,0],[95,0]] },
			"225": { dir: "se", sheet: [[0,19],[19,19],[38,19]] },
			"270": { dir: "e",  sheet: [[171,0],[190,0],[209,0]] },
			"315": { dir: "ne", sheet: [[114,19],[133,19],[152,19]] },
		};
		// auto scale up with "pixel scale"
		Object.keys(this.sheet).map(key =>
			this.sheet[key].sheet = this.sheet[key].sheet.map(frame =>
				[frame[0] * pixScale, frame[1] * pixScale]));
		// default sheet
		this.strip = this.sheet["0"];
	}

	move(force) {
		force.x = force.x * this.speed;
		force.y = force.y * this.speed;
		Matter.Body.applyForce(this.body, this.body.position, force);
	}

	move2(force) {
		let target = this.position.add(force),
			dir = this.position.direction(target),
			angle = (dir * 180 / Math.PI) + 90;
		if (angle < 0) angle += 360;
		this.strip = this.sheet[angle];
		this.position.x += force.x;
		this.position.y += force.y;
	}

	update(delta, time) {
		// copy physical position to "this" internal position
		this.position.x = this.body.position.x;
		this.position.y = this.body.position.y;
	}

	render(ctx) {
		let sheet = this.strip.sheet[0],
			w = this.w,
			h = this.h,
			mX = sheet[0],
			mY = sheet[1],
			x = this.position.x,
			y = this.position.y;
		// player
		ctx.save();
		ctx.translate(-w*.5, -h*.5);
		ctx.drawImage(this.asset.cvs, mX, mY, w, h, x, y, w, h);
		ctx.restore();
	}
}
