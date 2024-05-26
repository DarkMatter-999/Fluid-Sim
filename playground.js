class Playground {
	constructor() {
		this.simulation = new Simulation();
		this.mousePos = Vector2.Zero();
	}

	update(dt, mousePos) {
		this.simulation.update(dt, this.mousePos);

	}

	draw() {
		this.simulation.draw();
	}

	onMouseMove(vec) {
		this.mousePos = vec
	}
	onMouseDown(b) {
		console.log("Mouse Pressed:", b);
	}
	onMouseUp(b) {
		console.log("Mouse Released:", b);
	}
}
