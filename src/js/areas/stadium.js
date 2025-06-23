
// soccer.stadium

{
	init() {
		// fast references
		this.els = {
			el: window.find(`div[data-area="stadium"]`),
			canvas: window.find(`div[data-area="stadium"] .canvas`),
		};
		// instantiate arena
		this.arena = new Arena({ canvas: this.els.canvas });
		// temp: bind event handlers
		this.els.el.on("mousedown", this.doPan);
	},
	async dispatch(event) {
		let APP = soccer,
			Self = APP.stadium,
			top, left,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.keystroke":
				switch (event.char) {
					case "w":
					case "up":
						break;
					case "s":
					case "down":
						break;
					case "a":
					case "left":
						break;
					case "d":
					case "right":
						break;
					case "p":
						if (Self.arena.fpsControl._stopped) Self.arena.fpsControl.start();
						else Self.arena.fpsControl.stop();
						break;
				}
				break;
			// custom events
			case "add-teams":
				let teams = {
						home: { name: "Sweden" },
						away: { name: "Turkiye" },
					};
				Object.keys(teams).map(key => {
					// save reference to team node
					teams[key].xTeam = window.bluePrint.selectSingleNode(`//team[@name="${teams[key].name}"]`);
					// team colors
					teams[key].colors = JSON.parse(teams[key].xTeam.getAttribute("colors"));
					// team formation
					teams[key].players = teams[key].xTeam.selectNodes("./form/i").map(xPos => {
						let num = xPos.getAttribute("num"),
							y = xPos.getAttribute("y"),
							x = xPos.getAttribute("x"),
							xPlayer = xPos.selectSingleNode(`../../i[@num = "${num}"]`),
							name = xPlayer.getAttribute("name");
						return { name, num, x, y };
					});
				});
				this.arena.setTeamColors(teams);
				this.arena.setStadium();
				this.arena.setTeam(teams);
				break;
		}
	},
	doPan(event) {
		let APP = soccer,
			Self = APP.stadium,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let doc = $(document),
					arena = Self.arena,
					offset = {
						y: arena.stadium.ball.position.y,
						x: arena.stadium.ball.position.x,
					},
					click = {
						y: event.clientY,
						x: event.clientX,
					};

				// drag info
				Self.drag = { doc, arena, click, offset };
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.doPan);
				break;
			case "mousemove":
				let y = Drag.offset.y - (event.clientY - Drag.click.y),
					x = Drag.offset.x - (event.clientX - Drag.click.x);
				Drag.arena.stadium.ball.position.y = y;
				Drag.arena.stadium.ball.position.x = x;
				break;
			case "mouseup":
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.doPan);
				break;
		}
	}
}
