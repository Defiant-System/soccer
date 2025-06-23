
let Test = {
	init(APP) {
		setTimeout(() => {
			APP.stadium.dispatch({ type: "add-teams" });
			APP.stadium.arena.fpsControl.start();
		}, 400);
		setTimeout(() => APP.stadium.arena.fpsControl.stop(), 10000);
	}
};
