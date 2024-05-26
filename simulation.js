class Simulation {
	constructor() {
		this.particles = [];
		this.AMOUNT_PARTICLES = 1000;
		this.VELOCITY_DAMPING = 1;
		this.fluidHashGrid = new FluidHashGrid(50);

		this.instantiateParticles();
		this.fluidHashGrid.initialize(this.particles);
	}

	update(dt, mousePos) {
		this.predictPositions(dt);
		this.neighbourSearch(mousePos);

		this.computeNextVelocity(dt);
		this.worldBoundary();
	}

	instantiateParticles() {
		let offsetBetweenParticles = 5;
		let offsetAllParticles = new Vector2(100,100);
		
		let xparticles = Math.sqrt(this.AMOUNT_PARTICLES);
		let yparticles = xparticles;

		for(let x=0; x<xparticles; x++) {
			for(let y=0; y<yparticles; y++) {
				let position = new Vector2(x*offsetBetweenParticles + offsetAllParticles.x, y*offsetBetweenParticles + offsetAllParticles.y);
				this.particles.push(new Particle(position));
				
				this.particles[this.particles.length-1].velocity = Scale(new Vector2(-0.5 + Math.random(), -0.5 + Math.random()), 200);
			}
		}		
	}

	neighbourSearch(mousePos){
		this.fluidHashGrid.clearGrid();
		this.fluidHashGrid.mapParticlesToCell();
		
		let gridHashId = this.fluidHashGrid.getGridIdFromPos(mousePos);
		let contentOfCell = this.fluidHashGrid.getContentOfCell(gridHashId);
		for(let i = 0; i < this.particles.length;i++){

			this.particles[i].color = "#28b0ff";
		}			
		for(let i=0;i<contentOfCell.length;i++){
			let particle = contentOfCell[i];
			particle.color = "#DF00A8";
		}
	}


	predictPositions(dt) {
		for(let i=0; i<this.particles.length; i++) {
			this.particles[i].prevPos = this.particles[i].position.Cpy();
			this.particles[i].position = Add(this.particles[i].position, Scale(this.particles[i].velocity, dt * this.VELOCITY_DAMPING));
		}
	}

	computeNextVelocity(dt) {
		for(let i = 0; i < this.particles.length;i++){
			this.particles[i].velocity = Scale(Sub(this.particles[i].position, this.particles[i].prevPos), 1/dt);
		}

	}

	worldBoundary(){
		for(let i = 0; i < this.particles.length;i++){
			let pos 	= this.particles[i].position;
			let prevPos = this.particles[i].prevPos;

			if(pos.x < 0){
				this.particles[i].velocity.x *=-1;
			}
			
			if(pos.y < 0){
				this.particles[i].velocity.y *=-1;
			}
			
			if(pos.x > canvas.width-1){
				this.particles[i].velocity.x *=-1;
			}
			
			if(pos.y > canvas.height-1){
				this.particles[i].velocity.y *=-1;
			}
		}		
	}


	draw() {
		for(let i = 0; i < this.particles.length;i++){
			let pos = this.particles[i].position;
			let velocityMagnitude = this.particles[i].velocity.Length();

			let factor = velocityMagnitude / 200;
			factor = Math.min(Math.max(factor, 0), 1);
			let color = this.particles[i].color;
			//this.interpolateColor("#DF00A8", "#28B0FF", factor);
			DrawUtils.drawPoint(pos, 5, color);
		}

	}

	interpolateColor(color1, color2, factor) {
	    // Parse colors
	    const r1 = parseInt(color1.substring(1, 3), 16);
	    const g1 = parseInt(color1.substring(3, 5), 16);
	    const b1 = parseInt(color1.substring(5, 7), 16);

	    const r2 = parseInt(color2.substring(1, 3), 16);
	    const g2 = parseInt(color2.substring(3, 5), 16);
	    const b2 = parseInt(color2.substring(5, 7), 16);

	    // Interpolate colors
	    const r = Math.round(r1 + (r2 - r1) * factor);
	    const g = Math.round(g1 + (g2 - g1) * factor);
	    const b = Math.round(b1 + (b2 - b1) * factor);

	    return `#${(r < 16 ? '0' : '') + r.toString(16)}${(g < 16 ? '0' : '') + g.toString(16)}${(b < 16 ? '0' : '') + b.toString(16)}`;
	}
}
