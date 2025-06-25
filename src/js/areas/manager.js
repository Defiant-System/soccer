
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
			data,
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
				let margin = { t: 20, l: 35, b: 0, r: 0 },
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
			case "set-formation":
				event.el.parent().find(".active").removeClass("active");
				event.el.addClass("active");

				Self.els.form.cssSequence("rearrange", "transitionend", el => {
					el.removeClass("rearrange");
				});

				window.bluePrint
					.selectNodes(`//Formations/form[@id="${event.el.data("arg")}"]/i`)
					.map(x => {
						Self.els.form
							.find(`.player[data-num="${x.getAttribute("num")}"]`)
							.css({
								"--y": x.getAttribute("y") +"px",
								"--x": x.getAttribute("x") +"px",
							});
					});
				break;
			case "output-formation-positions":
				data = [];
				Self.els.form.find(".player").map(elem => {
					let el = $(elem),
						num = el.data("num"),
						y = parseInt(el.cssProp("--y"), 10),
						x = parseInt(el.cssProp("--x"), 10);
					data.push(`<i num="${num}" y="${y}" x="${x}" />`);
				});
				console.log(data.join("\n\t\t"));
				break;
		}
	},
	movePlayer(event) {
		let APP = soccer,
			Self = APP.manager,
			Drag = Self.drag;
		switch (event.type) {
			// pan stadium
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = $(event.target).parents(".player");
				if (!el.length) return;

				let doc = $(document),
					offset = el.offset(),
					click = {
						y: event.clientY,
						x: event.clientX,
					};

				// drag info
				Self.drag = { doc, el, click, offset };
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.movePlayer);
				break;
			case "mousemove":
				let y = (event.clientY - Drag.click.y) + Drag.offset.top,
					x = (event.clientX - Drag.click.x) + Drag.offset.left;
				Drag.el.css({ "--y": y +"px", "--x": x +"px" });
				break;
			case "mouseup":
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.movePlayer);
				break;
		}
	}
}

