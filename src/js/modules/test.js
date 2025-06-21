
let Test = {
	init(APP) {
		setTimeout(() => APP.stadium.arena.fpsControl.start(), 400);
		setTimeout(() => APP.stadium.arena.fpsControl.stop(), 1000);
	}
};
