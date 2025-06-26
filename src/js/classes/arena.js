
class Arena {
	constructor(cfg) {
		let { canvas } = cfg;

		this.cvs = canvas;
		this.ctx = this.cvs[0].getContext("2d");
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		// set dimenstions
		this.cvs.attr({ width: this.width, height: this.height });

		// physics engine
		this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 1 } });
		// create runner
		this.runner = Matter.Runner.create();

		// dev / debug purpose
		this.debug = {
			mode: 1,
		};

		// create FPS controller
		let Self = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 60,
			callback(time, delta) {
				Matter.Runner.tick(Self.runner, Self.engine);
				Self.update(delta, time);
				Self.render();
			}
		});

		// assets list
		let assets = [
				{ id: "ball", width: 480, height: 32, src: "~/icons/sprite-ball.png" },
				{ id: "grass", width: 600, height: 300, src: "~/gfx/grass.jpg" },
				{ id: "sprite", width: 272, height: 320, src: "~/gfx/sprite.png" },
			],
			loadAssets = () => {
				let item = assets.pop(),
					img = new Image();
				img.src = item.src;
				img.onload = () => {
					// save reference to asset
					this.assets[item.id] = { item, img };
					// are we done yet?
					assets.length ? loadAssets() : this.ready();
				};
			};
		// asset lib
		this.assets = {};
		this.scale = 22;
		this.pixScale = 3;
		this.config = {
			height: 105,
			width: 68,
			margin: {
				t: 320,
				l: 120,
				b: 300,
				r: 120 
			},
		};

		// load assets
		loadAssets();
	}

	ready() {
		// stadium & field
		// this.setStadium();
		// play FPS control
		// this.fpsControl.start();
	}

	setDebug(mode) {
		this.debug.mode = mode;
	}

	setTeam(teams) {
		this.stadium.setTeam(teams);
	}

	// apply team colors on sprite
	setTeamColors(teams) {
		let palette = [[252,0,0],[252,252,252]];
		let { width, height } = this.assets.sprite.item;
		// team colors
		Object.keys(teams).map(side => {
			let { cvs, ctx } = Utils.createCanvas(width, height),
				colors = teams[side].colors;
			// repaints sprite for fighter
			ctx.drawImage(this.assets.sprite.img, 0, 0);
			let pixels = ctx.getImageData(0, 0, width, height),
				data = pixels.data;
			for (let i=0; i<data.length; i+=4) {
				let r = data[i+0],
					g = data[i+1],
					b = data[i+2],
					len = 2;
				while (len--) {
					if (palette[len][0] === r && palette[len][1] === g && palette[len][2] === b) {
						[r,g,b] = colors[len];
					}
				}
				data[i+0] = r;
				data[i+1] = g;
				data[i+2] = b;
			}
			ctx.putImageData(pixels, 0, 0);
			// save reference
			this.assets[side] = { cvs: cvs[0], ctx };
		});
		// statium fixtures
		this.fixtures = [
			{ name: "home bleachers", mapW: 272, mapH: 56, mapX: 0, mapY: 0 }, // repeatable pattern
			{ name: "home goal", cvs: this.assets.home.cvs, mapW: 92, mapH: 31, mapX: 22, mapY: 101, sX: 759, sY: 249 },
			{ name: "home trainer", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 0, mapY: 116, sX: 72, sY: 1171 },
			{ name: "home player", cvs: this.assets.home.cvs, mapW: 228, mapH: 152, mapX: 0, mapY: 135 },
			{ name: "home pitch", cvs: this.assets.home.cvs, mapW: 21, mapH: 68, mapX: 251, mapY: 101, sX: 0, sY: 1030 },
			{ name: "home pitch p1", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1060 },
			{ name: "home pitch p2", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1084 },
			{ name: "home pitch p3", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1108 },
			{ name: "home pitch p4", cvs: this.assets.home.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1132 },
			{ name: "home police 1", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 321, sY: 147 },
			{ name: "home police 2", cvs: this.assets.home.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 348, sY: 147 },
			{ name: "home police 3", cvs: this.assets.home.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 1391, sY: 147 },
			{ name: "home police 4", cvs: this.assets.home.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 1418, sY: 147 },
			// away side
			{ name: "away bleachers", mapW: 272, mapH: 45, mapX: 0, mapY: 56 }, // repeatable pattern
			{ name: "away goal", cvs: this.assets.away.cvs, mapW: 90, mapH: 34, mapX: 114, mapY: 101, sX: 759, sY: 2230 },
			{ name: "away trainer", cvs: this.assets.away.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 116, sX: 51, sY: 1403 },
			{ name: "away player", cvs: this.assets.away.cvs, mapW: 228, mapH: 152, mapX: 0, mapY: 135 },
			{ name: "away pitch", cvs: this.assets.away.cvs, mapW: 21, mapH: 68, mapX: 251, mapY: 101, sX: 0, sY: 1385 },
			{ name: "away pitch p1", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1445 },
			{ name: "away pitch p2", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1469 },
			{ name: "away pitch p3", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1493 },
			{ name: "away pitch p4", cvs: this.assets.away.cvs, mapW: 9, mapH: 18, mapX: 232, mapY: 101, sX: 48, sY: 1517 },
			{ name: "away police 1", cvs: this.assets.away.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 321, sY: 2397 },
			{ name: "away police 2", cvs: this.assets.away.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 348, sY: 2397 },
			{ name: "away police 3", cvs: this.assets.away.cvs, mapW: 9, mapH: 15, mapX: 11, mapY: 101, sX: 1391, sY: 2397 },
			{ name: "away police 4", cvs: this.assets.away.cvs, mapW: 11, mapH: 15, mapX: 11, mapY: 101, sX: 1418, sY: 2397 },
		];
		// slice up sprite
		let pS = this.pixScale,
			item,
			fixture;
		// top bleachers
		fixture = this.fixtures.find(e => e.name == "home bleachers");
		item = Utils.createCanvas(fixture.mapW*pS, fixture.mapH*pS);
		fixture.cvs = item.cvs[0];
		fixture.ctx = item.ctx;
		fixture.ctx.imageSmoothingEnabled = false;
		fixture.ctx.drawImage(this.assets.home.cvs, fixture.mapX, fixture.mapY, fixture.mapW, fixture.mapH, 0, 0, fixture.mapW*pS, fixture.mapH*pS);
		// bottom bleachers
		fixture = this.fixtures.find(e => e.name == "away bleachers");
		item = Utils.createCanvas(fixture.mapW*pS, fixture.mapH*pS);
		fixture.cvs = item.cvs[0];
		fixture.ctx = item.ctx;
		fixture.ctx.imageSmoothingEnabled = false;
		fixture.ctx.drawImage(this.assets.away.cvs, fixture.mapX, fixture.mapY, fixture.mapW, fixture.mapH, 0, 0, fixture.mapW*pS, fixture.mapH*pS);

		// home player
		fixture = this.fixtures.find(e => e.name == "home player");
		item = Utils.createCanvas(fixture.mapW*pS, fixture.mapH*pS);
		fixture.cvs = item.cvs[0];
		fixture.ctx = item.ctx;
		fixture.ctx.imageSmoothingEnabled = false;
		fixture.ctx.drawImage(this.assets.home.cvs, fixture.mapX, fixture.mapY, fixture.mapW, fixture.mapH, 0, 0, fixture.mapW*pS, fixture.mapH*pS);
		// away player
		fixture = this.fixtures.find(e => e.name == "away player");
		item = Utils.createCanvas(fixture.mapW*pS, fixture.mapH*pS);
		fixture.cvs = item.cvs[0];
		fixture.ctx = item.ctx;
		fixture.ctx.imageSmoothingEnabled = false;
		fixture.ctx.drawImage(this.assets.away.cvs, fixture.mapX, fixture.mapY, fixture.mapW, fixture.mapH, 0, 0, fixture.mapW*pS, fixture.mapH*pS);
	}

	setStadium() {
		let parent = this,
			scale = this.scale,
			config = this.config,
			assets = this.assets;
		this.stadium = new Stadium({ parent, scale, config, assets });
		this.viewport = new Viewport({ arena: this, x: 0, y: 0, w: this.width, h: this.height });
	}

	setPhysicalWorld() {
		// add items to the physical world
		let bodies = this.stadium.entries.map(item => item.body).filter(e => !!e);
		// physics setup
		Matter.Composite.add(this.engine.world, bodies);
	}

	update(delta, time) {
		this.stadium.update(delta, time);
		this.viewport.update(delta, time);
		this.stadium.minimap.update(delta, time);
	}

	render() {
		// clear canvas
		this.cvs.attr({ width: this.width });
		// center viewport + render map, etc
		this.viewport.center();

		// render stadium
		this.ctx.save();
		this.ctx.scale(this.viewport.scale, this.viewport.scale);
		let tX = -this.viewport.x,
			tY = 2-this.viewport.y;
		this.ctx.translate(tX, tY);
		// this.ctx.translate(0, 0);

		// draw clean stadium
		this.ctx.drawImage(this.stadium.full.cvs[0], 0, 0);
		this.ctx.restore();

		// draw entries
		this.ctx.save();
		this.ctx.translate(this.config.margin.l - tX, this.config.margin.t - tY);
		this.stadium.entries.map(entry => entry.render(this.ctx));
		this.ctx.restore();

		
		if (this.debug.mode >= 2) {
			let bodies = Matter.Composite.allBodies(this.engine.world);

			this.ctx.save();
			this.ctx.translate(this.viewport.x, this.viewport.y);
			this.ctx.lineWidth = 1;
			this.ctx.fillStyle = "#33669977";
			this.ctx.strokeStyle = "#113355cc";
			this.ctx.beginPath();
			bodies.map(body => {
				this.ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
				body.vertices.slice(1).map(v => this.ctx.lineTo(v.x, v.y));
				this.ctx.lineTo(body.vertices[0].x, body.vertices[0].y);
			});
			this.ctx.fill();
			this.ctx.stroke();
			this.ctx.restore();

			// draws ball direction
			let ball = this.stadium.ball,
				x = this.viewport.x + ball.position.x,
				y = this.viewport.y + ball.position.y,
				r = ball.radius;
			this.ctx.save();
			this.ctx.translate(x, y);
			this.ctx.rotate(ball.angle + Math.PI);
			this.ctx.lineWidth = 3;
			this.ctx.strokeStyle = "#f00";
			this.ctx.beginPath();
			this.ctx.moveTo(0, 0);
			this.ctx.lineTo(0, 15);
			this.ctx.stroke();
			this.ctx.restore();
		}
		if (this.debug.mode >= 1) {
			this.drawFps(this.ctx);
		}

		// render overlay minimap
		this.stadium.minimap.render(this.ctx);
	}

	drawFps(ctx) {
		let fps = this.fpsControl ? this.fpsControl._log : [];
		ctx.save();
		ctx.translate(this.width - 109, 0);
		// draw box
		ctx.fillStyle = "#000a";
		ctx.fillRect(5, 5, 100, 40);
		ctx.fillStyle = "#fff4";
		ctx.fillRect(7, 7, 96, 11);
		ctx.fillStyle = "#fff6";
		// loop log
		for (let i=0; i<96; i++) {
			let bar = fps[i];
			if (!bar) break;
			let p = bar/90;
			if (p > 1) p = 1;
			ctx.fillRect(102 - i, 43, 1, -24 * p);
		}
		// write fps
		ctx.fillStyle = "#fff";
		ctx.font = "9px Arial";
		ctx.textAlign = "left";
		ctx.fillText('FPS: '+ fps[0], 8, 16);
		// restore state
		ctx.restore();
	}
}
