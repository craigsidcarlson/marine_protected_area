class Environment {
  constructor(qt) {
    this.flock = [];
    this.qt = qt;
    // this.tuna_count = 15;
    // this.sardine_count = 150;
    // this.plankton_count = 650;
    this.tuna_count = 1;
    this.sardine_count = 10;
    this.plankton_count = 50;
    this.tuna_carry_capacity = 30;
    this.sardine_carry_capacity = 250;
    this.plankton_carry_capacity = 650;
    this.fish = [];
    this.port = createVector(width/2, height);
    this.boat_count = 0;
    this.fleet = [];
    this.tuna_caught = 0;
    this.sardines_caught = 0;

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

    for (let i = 0; i < this.boat_count; i++) { 
      const boat = new Boat(this.port);
      this.fleet.push(boat);
    }
  }

  draw() {
    const new_qt = new QuadTree(canvas_boundary);
    const offspring = [];
    for (let i = 0; i < this.fish.length; i++) {
      this.fish[i].edges();
      const child = this.breed(this.fish[i]);
      if (child) {
        offspring.push(child);
        new_qt.insert(child);
      }
      this.live(this.fish[i]);
      this.age(this.fish[i]);
      if (this.fish[i].deleted)  {
        this.decrementCount(this.fish[i]);
        this.fish.splice(i, 1);
      } else {
        const fish = this.fish[i].show();
        new_qt.insert(fish);
      }
    }
    for (let i = 0; i < this.fleet.length; i++) {
      this.fleet[i].boundaries();
      if (this.fleet[i].atCapacity() || this.fleet[i].fuel < 0){
        this.fleet[i].fishing = false;
        const caught = this.fleet[i].dock();
        this.tallyCatch(caught);
      } else {
        this.fleet[i].fishing = true;
        this.fleet[i].fish();
        this.fleet[i].fuel--;
      }
      this.fleet[i].update();
      this.fleet[i].show();
    }

    this.fish = this.fish.concat(offspring);
    this.qt = new_qt;
  }

  live(fish) {
    const hungry = fish.isHungry();
    const food = fish.flock(hungry);
    if (food) {
      fish.eat(food);
    }
  }

  breed(fish) {
    const child = fish.breed();
    if (!child) return;

    const child_type = fish.constructor.name;
    if (child_type === 'Tuna' && this.tuna_count < this.tuna_carry_capacity) {
      this.tuna_count++;
      return child;
    } else if (child_type === 'Sardine' && this.sardine_count < this.sardine_carry_capacity) {
      this.sardine_count++;
      return child;
    } else if (child_type === 'Plankton' && this.plankton_count < this.plankton_carry_capacity) {
      this.plankton_count++;
      return child;
    }
  }

  age(fish) {
    const isAlive = fish.burnCalories();
    if (isAlive) fish.update();
    else fish.deleted = true;
  }

  decrementCount(fish) {
    const fish_type = fish.constructor.name;
    switch(fish_type) {
      case 'Tuna':
        this.tuna_count--;
        break;
      case 'Sardine':
        this.sardine_count--;
        break;
      case 'Plankton':
        this.plankton_count--;
        break;
    }
  }

  tallyCatch(caught) {
    if (!caught || !caught.type || !caught.amount) return;
    switch(caught.type) {
      case 'Tuna':
        this.tuna_caught += caught.amount;
        break
      case 'Sardine':
        this.sardines_caught += caught.amount;
    }
  }
}