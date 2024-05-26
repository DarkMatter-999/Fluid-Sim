class Playground {
	constructor() {
		this.simulation = new Simulation();
	}

	update(dt) {
		this.simulation.update(dt);

	}

	draw() {
		this.simulation.draw();
	}

	onMouseMove(vec) {
		vec.Log();
	}
	onMouseDown(b) {
		console.log("Mouse Pressed:", b);
	}
	onMouseUp(b) {
		console.log("Mouse Released:", b);
	}
}
