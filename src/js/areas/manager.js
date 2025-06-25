
// soccer.manager

{
	init() {
		// fast references
		this.els = {
			el: window.find(`div[data-area="manager"]`),
			list: window.find(`div[data-area="manager"] .list`),
			form: window.find(`div[data-area="manager"] .field .players`),
			cvs: window.find(`div[data-area="manager"] .field canvas.overview`),
		};
		// default pain
		this.dispatch({ type: "draw-field" });
		this.dispatch({ type: "render-team-list", home: "Sweden", away: "Turkiye" });
		// temp event handler
		this.els.form.on("mousedown", this.movePlayer);
	},
	async dispatch(event) {
		let APP = soccer,
			Self = APP.manager,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "render-team-list":
				// team troop list
				window.render({
					template: "team-list",
					match: `//data/team[@name="${event.home}"]`,
					target: Self.els.list,
				});
				// team formation
				window.render({
					template: "team-formation",
					// match: `//data/Formations/form[@id="4-4-2"]`,
					match: `//data/team[@name="${event.home}"]`,
					target: Self.els.form,
				});
				break;
			case "draw-field":
				let margin = { t: 30, l: 50, b: 0, r: 0 },
					width = +Self.els.cvs.prop("offsetWidth"),
					height = +Self.els.cvs.prop("offsetHeight"),
					scale = 5;
				// canvas dim
				Self.els.cvs.attr({ width, height });
				Self.els.ctx = Self.els.cvs[0].getContext("2d");
				// init field
				Self.ovField = new Field({ width: 68, height: 105, margin, scale, mini: true, line: 2, skew: .85 });
				Self.ovField.render(Self.els.ctx);

				// player formation wrapper
				let top = Self.ovField.top,
					left = Self.ovField.left;
				width = Self.ovField.sW;
				height = Self.ovField.sH;
				Self.els.form.css({ top, left, width, height });
				break;
		}
	},
	movePlayer(event) {
		let APP = soccer,
			Self = APP.stadium,
			Drag = Self.drag;
		switch (event.type) {
			// pan stadium
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let doc = $(document),
					el = $(event.target).parents("div.player"),
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
				Self.drag.doc.on("mousemove mouseup", Self.doPanZoom);
				break;
			case "mousemove":
				let y = Drag.offset.y - (event.clientY - Drag.click.y),
					x = Drag.offset.x - (event.clientX - Drag.click.x);
				Drag.arena.stadium.ball.position.y = y;
				Drag.arena.stadium.ball.position.x = x;
				break;
			case "mouseup":
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.doPanZoom);
				break;
		}
	}
}

