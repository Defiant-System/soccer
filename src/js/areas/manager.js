
// football.manager

{
	init() {
		// fast references
		this.els = {
			el: window.find(`div[data-area="manager"]`),
			cvs: window.find(`div[data-area="manager"] .field canvas.overview`),
		};

		let margin = { t: 60, l: 50, b: 60, r: 50 },
			width = +this.els.cvs.prop("offsetWidth"),
			height = +this.els.cvs.prop("offsetHeight"),
			scale = 1;
		// canvas dim
		this.els.cvs.attr({ width, height });
		this.els.ctx = this.els.cvs[0].getContext("2d");
		// init field
		width -= (margin.l + margin.r);
		height -= (margin.t + margin.b);
		this.ovField = new Field({ width, height, margin, scale, line: 1, skew: 1 });
		this.ovField.render(this.els.ctx);
	},
	async dispatch(event) {
		let APP = football,
			Self = APP.manager,
			top, left,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "pan-arena":
				break;
		}
	}
}
