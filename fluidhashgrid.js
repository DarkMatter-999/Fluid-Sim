class FluidHashGrid{
    constructor(cellSize){
        this.hashMap = new Map();
        this.particles = [];
        this.hashMapSize = 1000000;
        this.prime1 = 6614058611;
        this.prime2 = 7528850467;
        this.cellSize = cellSize;
    }

    initialize(particles){
        this.particles = particles;
    }

    clearGrid(){
        this.hashMap.clear();
    }

    cellIndexToHash(x, y){
        let hash = (x * this.prime1 ^ y * this.prime2) % this.hashMapSize
        return hash;
    }
    
    getGridIdFromPos(pos){
        let x = parseInt(pos.x / this.cellSize);
        let y = parseInt(pos.y / this.cellSize);
        return this.cellIndexToHash(x,y);
    }
    
    mapParticlesToCell(){
        for(let i=0; i<this.particles.length; i++){
            let pos = this.particles[i].position;
            let x = parseInt(pos.x / this.cellSize);
            let y = parseInt(pos.y / this.cellSize);			
            let hash = this.cellIndexToHash(x,y);
            let entries = this.hashMap.get(hash);
            if(entries == null){
                let newArray = [i];
                this.hashMap.set(hash, newArray);
            }else{
                entries.push(i);
            }
        }
    }

    getContentOfCell(id){
        let content = this.hashMap.get(id);
        
        if(content == null) return [];
        else return content 
    }

    getNeighbourOfParticleIdx(i){
        let neighbours = [];
        let pos = this.particles[i].position;

        let particleGridX = parseInt(pos.x / this.cellSize);
        let particleGridY = parseInt(pos.y / this.cellSize);


        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                let gridX = particleGridX + x;
                let gridY = particleGridY + y;

                let hashId = this.cellIndexToHash(gridX, gridY);
                let content = this.getContentOfCell(hashId);

                neighbours.push(...content);
            }
        }

        return neighbours;
    }

}
