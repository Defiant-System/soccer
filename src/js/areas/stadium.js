
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
			case "add-team":
				let team = window.bluePrint.selectSingleNode(`//team/form`),
					data = team.selectNodes("./i").map(xPos => {
						let num = xPos.getAttribute("num"),
							y = xPos.getAttribute("y"),
							x = xPos.getAttribute("x"),
							xPlayer = xPos.selectSingleNode(`../../i[@num = "${num}"]`),
							name = xPlayer.getAttribute("name");
						return { name, num, x, y };
					});
				// render team on arena
				this.arena.stadium.setTeam(data);
				break;
		}
	}
}
