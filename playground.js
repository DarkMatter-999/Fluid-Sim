class Playground {
	constructor() {
		this.simulation = new Simulation();
		this.mousePos = Vector2.Zero();
	}

	update(dt) {
		this.simulation.update(0.25);

	}

	draw() {
		this.simulation.draw();
	}

	onMouseMove(vec) {
		this.mousePos = vec
	}
	onMouseDown(b) {
		console.log("Mouse Pressed:", b);
		if(b == 0) {
			this.simulation.emitter.position = this.mousePos;
		}
	}
	onMouseUp(b) {
		console.log("Mouse Released:", b);
	}

	onKeyPress(e) {
		// console.log(e);
		switch(e.key) {
			case "e":
				this.simulation.emit = !this.simulation.emit;
				break;
			case "r":
				this.simulation.rotate = !this.simulation.rotate;
				break;
		}
	}
}
