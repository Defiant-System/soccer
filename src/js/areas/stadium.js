
// football.stadium

{
	init() {
		// fast references
		this.els = {
			el: window.find(`div[data-area="arena"]`),
			canvas: window.find(`div[data-area="arena"] .canvas`),
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
			case "pan-arena":
				break;
		}
	}
}
