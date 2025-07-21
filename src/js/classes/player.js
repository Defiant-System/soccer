
class Player {
	constructor(cfg) {
		let { parent, asset, name, num, team, side, position, xPlayer } = cfg;

		this.parent = parent;
		this.asset = asset;

		this.id = `player-${Date.now()}`;
		this.name = name;
		this.lastName = name.slice(name.indexOf(" ")+1);
		this.num = num;
		this.team = team;
		this.side = side;

		let { x, y } = this.translatePosition(position);
		this.position = {
			home: new Point(x, y),
			target: new Point(x, y),
		};

		let pixScale = parent.parent.pixScale,
			w = 19 * pixScale,
			h = 19 * pixScale;
		this.w = w;
		this.h = h;
		this.speed = +xPlayer.getAttribute("vel") / 6;

		// physical body
		this.body = Matter.Bodies.circle(x, y, 12, { density: .95, frictionAir: .05 });
		// this.body = Matter.Bodies.rectangle(x, y, 22, 19, { density: 1.15, frictionAir: .05 });
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

	get active() {
		return this._isPlayer;
	}

	set active(v) {
		this._isPlayer = v;
	}

	translatePosition(pos) {
		// scale down
		let x = ((pos.x / 5) * 22);
		let y = ((pos.y / 5) * 22);
		// mirror
		if (this.side == "home") {
			x = this.parent.field.sW - x;
			y = this.parent.field.sH - y;
		}
		return { x, y };
	}

	setTarget(pos) {
		let { x, y } = this.translatePosition(pos),
			target = new Point(x, y);
		this.position.target = target;
		// console.log( this.position.home, target );
	}

	seek(target, arrival=false) {
		let force = target.subtract(this.position.home);
		let desiredSpeed = this.speed;

		if (arrival) {
			let slowRadius = 100;
			let distance = force.magnitude();
			let v = Math.invLerp(0, slowRadius, distance);
			desiredSpeed = Math.lerp(0, this.speed, v);
		}

		force = force.setMagnitude(desiredSpeed);
		force = force.subtract(this.body.velocity);
		force = force.limit(.00025);
		return force;
	}

	arrive(target) {
		// 2nd argument true enables the arrival behavior
		return this.seek(target, true);
	}

	move(force) {
		force.x = force.x * this.speed;
		force.y = force.y * this.speed;
		Matter.Body.applyForce(this.body, this.body.position, force);
		// player direction
		let target = this.position.home.add(force),
			dir = this.position.home.direction(target),
			angle = Math.round((dir * 180 / Math.PI) + 90);
		if (angle < 0) angle += 360;
		// this.strip = this.sheet[angle];
	}

	update(delta, time, sec) {
		this.frame.last -= delta;
		if (this.frame.last < 0) {
			this.frame.last = (this.frame.last + this.frame.speed) % this.frame.speed;
			this.frame.index += this.body.speed * .1;
			if (this.frame.index > this.frame.total) this.frame.index = 0;
		}
		// once a sec - turn towards to the ball
		if (sec) {
			let target = this.parent.ball.position.home,
				dir = this.position.home.direction(target),
				angle = Math.round((dir * 180 / Math.PI) + 90),
				mod = angle % 45;
			angle += mod < 45 ? -mod : mod;
			if (angle < 0) angle += 360;
			// turn player towards the ball
			this.strip = this.sheet[angle];
		}

		if (this._isPlayer) {
			// todo?
		} else {
			let pos = this.position.home.clone(),
				target = this.position.target,
				distance = target.distance(pos);

			if (distance > 10) {
				// if (this.lastName === "Del Piero") {
				// 	console.log( this.body.velocity );
				// }

				let steering = this.arrive(target);
				this.move(steering);
			}
		}

		// copy physical position to "this" internal position
		let wH = (this.w >> 1) - .5,
			hH = (this.h >> 2) + 5;
		this.position.home.x = this.body.position.x + wH;
		this.position.home.y = this.body.position.y + hH;
	}

	render(ctx) {
		let w = this.w,
			h = this.h,
			f = (this.frame.index | 0),
			sheet = this.strip.sheet[f],
			wH = w >> 1,
			x = this.position.home.x,
			y = this.position.home.y;
		// player
		ctx.save();
		ctx.translate(x-wH, y-wH);
		ctx.drawImage(this.asset.cvs, sheet[0], sheet[1], w, h, -wH, -wH, w, h);
		// player last name
		ctx.fillStyle = "#fff";
		ctx.font = "15px Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.lastName, 0, -25);

		ctx.restore();
	}
}
