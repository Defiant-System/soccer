
@import "./classes/simplexnoise.js"
@import "./classes/point.js"
@import "./classes/input.js"
@import "./classes/arena.js"
@import "./classes/viewport.js"
@import "./classes/stadium.js"
@import "./classes/field.js"
@import "./classes/minimap.js"
@import "./classes/player.js"
@import "./classes/ball.js"

@import "./ext/matter.min.js"

@import "./modules/utils.js"
@import "./modules/test.js"


const Matter = window.Matter;


// default settings
const defaultSettings = {
	"music": "on",
	"sound-fx": "on",
	"minimap": "on",
	"teams": {
		home: { name: "Sweden" },
		away: { name: "Italy" },
	},
};


const soccer = {
	init() {
		// fast references
		this.content = window.find("content");

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// init settings
		this.dispatch({ type: "init-settings" });

		// temp active area
		this.active = "stadium";

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = soccer,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.init":
				break;
			case "window.close":
				// save settings
				// window.settings.setItem("settings", Self.settings);
				break;
			// custom events
			case "show-view":
				Self.content.data({ show: event.arg });
				Self[event.arg].dispatch({ type: "init-view" });
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			case "init-settings":
				// get settings, if any
				Self.settings = window.settings.getItem("settings") || defaultSettings;
				// settings
				["music", "sound-fx", "minimap"].map(e => {
					let value = Self.settings[e] === "on";
					Self.dispatch({ type: `toggle-${e}`, value });
				});
				break;
			case "toggle-music":
			case "toggle-sound-fx":
				// TODO
				break;
			// proxy event
			case "toggle-minimap":
			case "set-debug-mode":
				return Self.stadium.dispatch(event);
			// proxy events
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (!pEl.length) pEl = Self.content;
					if (pEl.length) {
						let name = pEl.data("area");
						if (!name) name = pEl.data("show");
						return Self[name].dispatch(event);
					}
				} else if (Self.active) {
					Self[Self.active].dispatch(event);
				}
		}
	},
	start: @import "./areas/start.js",
	stadium: @import "./areas/stadium.js",
	manager: @import "./areas/manager.js",
};

window.exports = soccer;