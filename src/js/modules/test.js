
let Test = {
	init(APP) {

		APP.dispatch({ type: "show-view", arg: "stadium" });

		setTimeout(() => {
			APP.stadium.dispatch({ type: "add-teams" });
			APP.stadium.arena.fpsControl.start();
		}, 400);

		setTimeout(() => {
			// let vec = Matter.Vector.create(320, 450);
			// Matter.Body.setPosition(APP.stadium.arena.stadium.ball.body, vec);

			APP.stadium.arena.viewport.zoom = 20;
			APP.stadium.arena.viewport.center();
		}, 500);

		// setTimeout(() => APP.stadium.dispatch({ type: "set-formation", arg: "4-2-2-2" }), 1000);

		setTimeout(() => APP.stadium.arena.fpsControl.stop(), 10000);
	}
};
