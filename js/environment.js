class Environment {
  constructor(qt) {
    this.flock = [];
    this.qt = qt;
    this.tuna_count = 15;
    this.sardine_count = 150;
    this.krill_count = 600;
    this.fish = [];

    for (let i = 0; i < this.tuna_count; i++) { 
      const tuna = new Tuna();
      this.fish.push(tuna);
      this.qt.insert(tuna);
    }
    
    for (let i = 0; i < this.sardine_count; i++) { 
      const sardine = new Sardine();
      this.fish.push(sardine);
      this.qt.insert(sardine);
    }
    
    for (let i = 0; i < this.krill_count; i++) { 
      const krill = new Krill();
      this.fish.push(krill);
      this.qt.insert(krill);
    }
  }

  draw() {
    const new_qt = new QuadTree(canvas_boundary);
    const offspring = [];
    for(let i = 0; i < this.fish.length; i++) {
      if(this.fish[i].deleted)  {
        this.fish.splice(i, 1);
        continue;
      }
  
      this.fish[i].edges();
      const hungry = this.fish[i].isHungry();
      const food = this.fish[i].flock(hungry);
      if (food) this.fish[i].eat(food);
      const spawn = this.fish[i].breed();
      if (spawn) offspring.push(spawn);
      const alive = this.fish[i].burnCalories();
      this.fish[i].deleted = !alive;
      this.fish[i].update();
      const fish = this.fish[i].show();
      new_qt.insert(fish);
    }
    this.fish = this.fish.concat(offspring);
    this.qt = new_qt;
  }
}