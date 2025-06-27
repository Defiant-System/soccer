
let Test = {
	init(APP) {

		APP.dispatch({ type: "show-view", arg: "stadium" });

		setTimeout(() => {
			APP.stadium.dispatch({ type: "add-teams" });
			APP.stadium.arena.fpsControl.start();
		}, 400);
		setTimeout(() => {
			let vec = Matter.Vector.create(320, 963);
			// let vec = Matter.Vector.create(220, 1963);
			// let vec = Matter.Vector.create(310, 1290);
			Matter.Body.setPosition(APP.stadium.arena.stadium.ball.body, vec);

			APP.stadium.arena.viewport.zoom = 0;
			APP.stadium.arena.viewport.center();
		}, 500);
		setTimeout(() => APP.stadium.arena.fpsControl.stop(), 10000);
	}
};
