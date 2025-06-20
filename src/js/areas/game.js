
// football.game

{
	init() {
		// fast references
		this.els = {
			arena: window.find(".arena"),
		};

		this.data = {
			height: +this.els.arena.prop("offsetHeight"),
			width: +this.els.arena.prop("offsetWidth"),
			top: +this.els.arena.prop("offsetTop"),
			left: +this.els.arena.prop("offsetLeft"),
		};
	},
	async dispatch(event) {
		let APP = football,
			Self = APP.game,
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
				this.data.top += event.step.y * 12;
				this.data.left += event.step.x * 12;
				// constraints
				this.data.top = Math.max(Math.min(this.data.top, 0), window.innerHeight - this.data.height);
				this.data.left = Math.max(Math.min(this.data.left, 0), window.innerWidth - this.data.width);
				// update arena position
				Self.els.arena.css(this.data);
				break;
		}
	}
}
