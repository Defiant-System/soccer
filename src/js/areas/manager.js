
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

		this.dispatch({ type: "draw-field" });
		this.dispatch({ type: "render-team-list", home: "Sweden", away: "Turkiye" });
	},
	async dispatch(event) {
		let APP = soccer,
			Self = APP.manager,
			top, left,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "render-team-list":
				window.render({
					template: "team-list",
					match: `//data/team[@name="${event.home}"]`,
					target: Self.els.list,
				});

				window.render({
					template: "team-formation",
					match: `//data/team/form[@name="${event.home}"]`,
					target: Self.els.form,
				});
				break;
			case "draw-field":
				let margin = { t: 30, l: 50, b: 0, r: 50 },
					width = +Self.els.cvs.prop("offsetWidth"),
					height = +Self.els.cvs.prop("offsetHeight"),
					scale = 5;
				// canvas dim
				Self.els.cvs.attr({ width, height });
				Self.els.ctx = Self.els.cvs[0].getContext("2d");
				// init field
				height = 105;
				width = 68;
				Self.ovField = new Field({ width, height, margin, scale, corner: 1.75, line: 1.5, skew: .85 });
				Self.ovField.render(Self.els.ctx);
				break;
		}
	}
}
