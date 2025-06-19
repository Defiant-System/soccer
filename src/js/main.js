
@import "./classes/arena.js"
@import "./classes/viewport.js"
@import "./classes/stadium.js"
@import "./classes/field.js"
@import "./classes/ball.js"

@import "./modules/utils.js"
@import "./modules/test.js"


const football = {
	init() {
		// fast references
		this.content = window.find("content");

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = football,
			el;
		switch (event.type) {
			// system events
			case "window.init":
				break;
			case "window.keystroke":
				switch (event.char) {
					case "w":
					case "s":
					case "a":
					case "d":
					case "up":
					case "down":
					case "left":
					case "right":
						Self.game.dispatch(event);
						break;
				}
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			// proxy events
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	game: @import "./areas/game.js",
};

window.exports = football;
