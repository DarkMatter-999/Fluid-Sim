class Simulation {
	constructor() {
		this.particles = [];

		this.AMOUNT_PARTICLES = 2000;
		this.VELOCITY_DAMPING = 1;
		this.GRAVITY = new Vector2(0,1);
		this.REST_DENSITY = 10;
		this.K_NEAR = 3;
	        this.K = 0.5;
		this.INTERACTION_RADIUS = 25;

		this.SIGMA = 0.5;
	        this.BETA = 0.125;

		this.fluidHashGrid = new FluidHashGrid(this.INTERACTION_RADIUS);

		this.instantiateParticles();
		this.fluidHashGrid.initialize(this.particles);
	}

	update(dt) {
		this.applyGravity(dt);

		this.viscosity(dt);

		this.predictPositions(dt);

		this.neighbourSearch();

		this.doubleDensityRelaxation(dt);

		this.worldBoundary();
		this.computeNextVelocity(dt);
	}

	instantiateParticles() {
		let offsetBetweenParticles = 10;
		let offsetAllParticles = new Vector2(100,100);
		
		let xparticles = Math.sqrt(this.AMOUNT_PARTICLES);
		let yparticles = xparticles;

		for(let x=0; x<xparticles; x++) {
			for(let y=0; y<yparticles; y++) {
				let position = new Vector2(x*offsetBetweenParticles + offsetAllParticles.x, y*offsetBetweenParticles + offsetAllParticles.y);
				this.particles.push(new Particle(position));
				
				// this.particles[this.particles.length-1].velocity = Scale(new Vector2(-0.5 + Math.random(), -0.5 + Math.random()), 200);
			}
		}		
	}

	viscosity(dt) {
		for(let i=0; i< this.particles.length; i++){
			let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
			let particleA = this.particles[i];

			for(let j = 0; j < neighbours.length;j++){
				let particleB = neighbours[j];
				if(particleA == particleB) continue;

				let rij = Sub(particleB.position,particleA.position);
				let velocityA = particleA.velocity;
				let velocityB = particleB.velocity;
				let q = rij.Length() / this.INTERACTION_RADIUS;
				
				if(q < 1){
					rij.Normalize();
					let u = Sub(velocityA, velocityB).Dot(rij);
					if(u > 0){
						let ITerm = dt * (1-q) * (this.SIGMA * u + this.BETA * u * u);
						let I = Scale(rij, ITerm);

						particleA.velocity = Sub(particleA.velocity, Scale(I, 0.5));
						particleB.velocity = Add(particleB.velocity, Scale(I, 0.5));
					    }
				}
			}
		}

	}

	neighbourSearch(){
		this.fluidHashGrid.clearGrid();
		this.fluidHashGrid.mapParticlesToCell();
		
		// this.particles[0].position = mousePos.Cpy();
		// let contentOfCell = this.fluidHashGrid.getNeighbourOfParticleIdx(0);
		//
		// for(let i = 0; i < this.particles.length;i++){
		//
		// 	this.particles[i].color = "#28b0ff";
		// }			
		// for(let i=0;i<contentOfCell.length;i++){
		// 	let particle = contentOfCell[i];
		//
		// 	let direction = Sub(particle.position, mousePos);
		// 	let distanceSquared = direction.Length2();
		// 	    
		// 	if(distanceSquared <= this.cellSize * this.cellSize){
		// 		particle.color = "#DF00A8";
		// 	}
		// }
	}

	doubleDensityRelaxation(dt) {
		for(let i=0; i< this.particles.length; i++){
			let density = 0;
			let densityNear = 0;
			let neighbours = this.fluidHashGrid.getNeighbourOfParticleIdx(i);
			let particleA = this.particles[i];

			for(let j = 0; j < neighbours.length;j++){
				let particleB = neighbours[j];
				if(particleA == particleB) continue;
				
				
				let rij = Sub(particleB.position,particleA.position);
				let q = rij.Length() / this.INTERACTION_RADIUS;
				
				if(q < 1){
					let oneMinusQ = (1-q);
					density += oneMinusQ*oneMinusQ;
					densityNear += oneMinusQ*oneMinusQ*oneMinusQ;					
				}
			}
			
			let pressure = this.K * (density - this.REST_DENSITY);
			let pressureNear = this.K_NEAR * densityNear;
			let particleADisplacement = Vector2.Zero();

		    
			for(let j=0; j< neighbours.length; j++){
				let particleB = neighbours[j];
				if(particleA == particleB){
					continue;
				}

				let rij = Sub(particleB.position, particleA.position);
				let q = rij.Length() / this.INTERACTION_RADIUS;

				if(q < 1.0){
					rij.Normalize();
					let displacementTerm = Math.pow(dt, 2) * (pressure * (1-q) + pressureNear * Math.pow(1-q, 2));
					let D = Scale(rij, displacementTerm);

					particleB.position = Add(particleB.position, Scale(D,0.5));
					particleADisplacement = Sub(particleADisplacement, Scale(D,0.5));
				}
			}
			particleA.position = Add(particleA.position, particleADisplacement);
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

	applyGravity(dt) {
		for(let i=0; i< this.particles.length; i++){
			this.particles[i].velocity = Add(this.particles[i].velocity, Scale(this.GRAVITY, dt));
	        }

	}

	worldBoundary(){
		for(let i = 0; i < this.particles.length;i++){
			let pos = this.particles[i].position;

			if(pos.x < 0){
				this.particles[i].position.x = 0;
				this.particles[i].prevPos.x = 0;
			}
			
			if(pos.y < 0){
				this.particles[i].position.y = 0;
				this.particles[i].prevPos.y = 0;
			}
			
			if(pos.x > canvas.width-1){
				this.particles[i].position.x = canvas.width-1;
				this.particles[i].prevPos.x = canvas.width-1;
			}
			
			if(pos.y > canvas.height-1){
				this.particles[i].position.y = canvas.height-1;
				this.particles[i].prevPos.y = canvas.height-1;
			}
		}		
	}


	draw() {
		for(let i = 0; i < this.particles.length;i++){
			let pos = this.particles[i].position;
			let velocityMagnitude = this.particles[i].velocity.Length();

			let factor = velocityMagnitude / 25;
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
