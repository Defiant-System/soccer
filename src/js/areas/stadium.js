
// football.stadium

{
	init() {
		// fast references
		this.els = {
			el: window.find(`div[data-area="stadium"]`),
			canvas: window.find(`div[data-area="stadium"] .canvas`),
		};
		// instantiate arena
		this.arena = new Arena({ canvas: this.els.canvas });
	},
	async dispatch(event) {
		let APP = football,
			Self = APP.stadium,
			top, left,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.keystroke":
				switch (event.char) {
					case "w":
					case "up": Self.dispatch({ type: "pan-arena", step: { x: 0, y: 1 } }); break;
					case "s":
					case "down": Self.dispatch({ type: "pan-arena", step: { x: 0, y: -1 } }); break;
					case "a":
					case "left": Self.dispatch({ type: "pan-arena", step: { x: 1, y: 0 } }); break;
					case "d":
					case "right": Self.dispatch({ type: "pan-arena", step: { x: -1, y: 0 } }); break;
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
	}
}
