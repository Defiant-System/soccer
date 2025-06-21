
// football.manager

{
	init() {
		// fast references
		this.els = {
			el: window.find(`div[data-area="manager"]`),
		};
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
