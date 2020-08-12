class Environment {
  constructor(qt) {
    this.flock = [];
    this.qt = qt;
    this.tuna_count = 15;
    this.sardine_count = 150;
    this.plankton_count = 650;
    this.tuna_carry_capacity = 30;
    this.sardine_carry_capacity = 250;
    this.plankton_carry_capacity = 650;
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
    
    for (let i = 0; i < this.plankton_count; i++) { 
      const plankton = new Plankton();
      this.fish.push(plankton);
      this.qt.insert(plankton);
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
      this.eat(this.fish[i]);
      this.breed(this.fish[i], offspring);
      this.age(this.fish[i]);
      const fish = this.fish[i].show();
      new_qt.insert(fish);
    }
    this.fish = this.fish.concat(offspring);
    this.qt = new_qt;
  }

  eat(fish) {
    const hungry = fish.isHungry();
    const food = fish.flock(hungry);
    if (food) { fish.eat(food);
      const food_type = food.constructor.name;
      switch(food_type){
        case 'Sardine':
          this.sardine_count--;
          break;
        case 'Plankton':
          this.plankton_count--;
          break;
      }
  }
  }

  breed(fish, offspring) {
    const spawn = fish.breed();
    if (spawn) {
      const spawn_type = fish.constructor.name;
      switch(spawn_type){
        case 'Tuna':
          if (this.tuna_count > this.tuna_carry_capacity) break;
          this.tuna_count++;
        case 'Sardine':
          if (this.sardine_count > this.sardine_carry_capacity) break;
          this.sardine_count++;
        case 'Plankton':
          if (this.plankton_count > this.plankton_carry_capacity) break;
          this.plankton_count++;
        default:
          offspring.push(spawn);

      }

    }
  }

  age(fish) {
    const alive = fish.burnCalories();
    fish.deleted = !alive;
    fish.update();
  } 
}