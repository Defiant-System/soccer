
class Stadium {
	constructor(cfg) {
		let { parent, assets, scale, config } = cfg;

		this.parent = parent;
		this.assets = assets;
		this.config = config;

		this.players = [];
		this.team = {
			home: { players: [] },
			away: { players: [] },
		};
		this.field = new Field({ ...config, scale, parent });
		this.minimap = new Minimap({ config, parent: this });

		// field dimensions
		this.config.sW = this.field.sW + this.config.margin.l + this.config.margin.r;
		this.config.sH = this.field.sH + this.config.margin.t + this.config.margin.b;
		this.full = Utils.createCanvas(this.config.sW, this.config.sH);

		// field borders + goal
		this.bodies = [];

		let gW = 210,
			thick = 25,
			bW = this.field.sW,
			bH = this.field.sH;
		// top left
		this.bodies.push(Matter.Bodies.rectangle((bW-gW-25)*.25, -thick, (bW-gW+25)*.5, thick, { isSensor: true }));
		// top goal
		this.bodies.push(Matter.Bodies.rectangle(bW*.5, -thick, gW, thick*2, { isSensor: true }));
		// top right
		this.bodies.push(Matter.Bodies.rectangle(bW-((bW-gW-25)*.25), -thick, (bW-gW+25)*.5, thick, { isSensor: true }));

		// bottom left
		this.bodies.push(Matter.Bodies.rectangle((bW-gW-25)*.25, bH+thick, (bW-gW+25)*.5, thick, { isSensor: true }));
		// bottom goal
		this.bodies.push(Matter.Bodies.rectangle(bW*.5, bH+thick, gW, thick*2, { isSensor: true }));
		// bottom right
		this.bodies.push(Matter.Bodies.rectangle(bW-((bW-gW-25)*.25), bH+thick, (bW-gW+25)*.5, thick, { isSensor: true }));

		// right side
		this.bodies.push(Matter.Bodies.rectangle(bW+thick, bH*.5, thick, bH+25, { isSensor: true }));
		// left side
		this.bodies.push(Matter.Bodies.rectangle(-thick, bH*.5, thick, bH+25, { isSensor: true }));

		// event handler
		Matter.Events.on(this.parent.engine, "collisionStart", this.handleCollision.bind(this));

		// add ball to stadium
		this.user = new User({ parent: this });
		this.ball = new Ball({ parent: this, asset: parent.assets.ball });

		// paint full hi-res stadium
		this.paint();
	}

	handleCollision(event) {
		event.pairs.map(pair => {
			let [a1, b1] = pair.bodyA.label.split("-"),
				[a2, b2] = pair.bodyB.label.split("-"),
				bBody = a1 === "ball" ? pair.bodyA : (a2 === "ball" ? pair.bodyB : null),
				pBody = a1 === "player" ? pair.bodyA : (a2 === "player" ? pair.bodyB : null);
			// console.log( pair.bodyA, pair.bodyB );
			if (bBody && pBody) {
				let player = this.players.find(p => p.body == pBody);
				this.ball.follow(player);
			}
		});
	}

	setTeam(teams) {
		Object.keys(teams).map(side => {
			teams[side].players.map((opt, i) => {
				// if (side === "away") return;
				let assetId = `${side} ${opt.num == "1" ? "goalie" : "player"}`;
				let asset = this.parent.fixtures.find(e => e.name == assetId);
				let player = new Player({ ...opt, side, team: teams[side], parent: this, asset });
				this.players.push(player);
				// populate team players array
				this.team[side].players.push(player);
			});
		});
		// build physical world
		this.parent.setPhysicalWorld();
	}

	paint() {
		let ctx = this.full.ctx,
			{ scale, margin, width, height } = this.config,
			sW = this.config.sW,
			sH = this.config.sH,
			pattern = ctx.createPattern(this.assets.grass.img, "repeat"),
			stripe = (this.field.sH / 10),
			pS = this.parent.pixScale,
			fixture;

		// reset canvas
		this.full.cvs.attr({ width: sW });
		// no smoothing
		ctx.imageSmoothingEnabled = false;

		ctx.save();
		ctx.fillStyle = "#35931e";
		ctx.fillRect(0, 0, sW, sH);

		ctx.fillStyle = "#42a12c";
		ctx.translate(0, margin.t);
		ctx.fillRect(0, 0, sW, stripe);
		ctx.fillRect(0, (stripe * 2), sW, stripe);
		ctx.fillRect(0, (stripe * 4), sW, stripe);
		ctx.fillRect(0, (stripe * 6), sW, stripe);
		ctx.fillRect(0, (stripe * 8), sW, stripe);
		ctx.fillRect(0, (stripe * 10), sW, margin.b);
		ctx.restore();

		// grass pattern
		ctx.save();
		ctx.globalCompositeOperation = "soft-light"; // overlay
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, sH);
		ctx.restore();

		// top bleachers
		fixture = this.parent.fixtures.find(e => e.name == "home bleachers");
		pattern = ctx.createPattern(fixture.cvs, "repeat-x");
		ctx.save();
		ctx.translate(0, 0);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, fixture.cvs.height);
		ctx.restore();

		// bottom bleachers
		fixture = this.parent.fixtures.find(e => e.name == "away bleachers");
		pattern = ctx.createPattern(fixture.cvs, "repeat-x");
		ctx.save();
		ctx.translate(0, sH-fixture.cvs.height);
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, sW, fixture.cvs.height);
		ctx.restore();

		// field lines
		this.field.render(ctx);

		// draw stadium fixtures
		this.parent.fixtures.map(f =>
			ctx.drawImage(f.cvs, f.mapX, f.mapY, f.mapW, f.mapH, f.sX, f.sY, f.mapW*pS, f.mapH*pS));
	}

	update(delta, time) {
		// update user
		this.user.update(delta, time);
		// update players
		this.players.map(player => player.update(delta, time));

		// makes closest player automatically active
		let closest = { distance: Infinity, player: null };
		this.team.home.players.map(player => {
			let distance = player.position.distance(this.ball.position);
			if (distance < closest.distance) {
				closest.distance = distance;
				closest.player = player;
			}
		});
		// unselect previous selected, if any
		if (this.team.home.selected) this.team.home.selected.active = false;
		// select player
		closest.player.active = true;
		this.team.home.selected = closest.player;

		// update ball
		this.ball.update(delta, time);
	}

	render(ctx) {
		this.user.render(ctx);
		this.players.map(player => player.render(ctx));
		this.ball.render(ctx);
	}
}