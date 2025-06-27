
class Player {
	constructor(cfg) {
		let { parent, asset, name, num, team, side, positions, xPlayer } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.id = `player-${Date.now()}`;
		this.name = name;
		this.num = num;
		this.team = team;
		this.side = side;
		this.positions = positions;

		Object.keys(this.positions).map(key => {
			let { x, y } = this.positions[key];
			// scale down
			this.positions[key].x /= 5;
			// adjust for skew value
			this.positions[key].y = ((y/5));
			// mirror
			if (side == "home") {
				this.positions[key].x = parent.parent.config.width - this.positions[key].x;
				this.positions[key].y = parent.parent.config.height - this.positions[key].y;
			}
			// scaler
			this.positions[key].x *= 22;
			this.positions[key].y *= 22;

			// this.positions[key].y -= 172; // TODO: calculate "172"
		});

		let pixScale = parent.parent.pixScale,
			w = 19 * pixScale,
			h = 19 * pixScale,
			{ x, y } = this.positions[side == "home" ? "begin1" : "begin2"];
		this.position = new Point(x, y);
		this.w = w;
		this.h = h;
		this.speed = +xPlayer.getAttribute("vel");

		// physical body
		// this.body = Matter.Bodies.circle(x, y, 17, { density: .95, frictionAir: .05 });
		this.body = Matter.Bodies.rectangle(x, y, 38, 19, { density: 1.15, frictionAir: .05 });
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
		// player animation
		this.frame = {
			index: 0,
			total: 3,
			last: 60,
			speed: 60,
		};

		// auto scale up with "pixel scale"
		Object.keys(this.sheet).map(key =>
			this.sheet[key].sheet = this.sheet[key].sheet.map(frame =>
				[frame[0] * pixScale, frame[1] * pixScale]));
		// default sheet
		this.strip = this.sheet[side == "home" ? "180" : "0"];
	}

	move(force) {
		force.x = force.x * this.speed;
		force.y = force.y * this.speed;
		Matter.Body.applyForce(this.body, this.body.position, force);
		// player direction
		let target = this.position.add(force),
			dir = this.position.direction(target),
			angle = Math.round((dir * 180 / Math.PI) + 90);
		if (angle < 0) angle += 360;
		this.strip = this.sheet[angle];
	}

	update(delta, time) {
		this.frame.last -= delta;
		if (this.frame.last < 0) {
			this.frame.last = (this.frame.last + this.frame.speed) % this.frame.speed;
			this.frame.index += this.body.speed * .1;
			if (this.frame.index > this.frame.total) this.frame.index = 0;
		}
		// copy physical position to "this" internal position
		let wH = this.w >> 1,
			hH = this.h >> 2;
		this.position.x = this.body.position.x + wH;
		this.position.y = this.body.position.y + hH;
	}

	render(ctx) {
		let w = this.w,
			h = this.h,
			f = (this.frame.index | 0),
			sheet = this.strip.sheet[f],
			wH = w >> 1,
			x = this.position.x,
			y = this.position.y;
		// player
		ctx.save();
		ctx.translate(x-wH, y-wH);
		ctx.drawImage(this.asset.cvs, sheet[0], sheet[1], w, h, -wH, -wH, w, h);
		// ctx.fillStyle = "#33e";
		// ctx.beginPath();
		// ctx.arc(0, 0, 4, 0, Math.TAU);
		// ctx.fill();
		ctx.restore();
	}
}
