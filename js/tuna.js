class Tuna extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.1,
      max_speed: 3,
      mass: 6,
      fov: 2 * PI,
      trophic_level: 4,
      color: color(0,239,239),
      view_proximity: 60,
      align_proximity: 35,
      cohesion_proximity: 30,
      separation_proximity: 40,
      calories: 100
    }  
    super(stats, position);
    this.health = 0.5;
    this.breed_rate = 0.0001;
    this.num_offspring = 1;
  }

  isHungry() {
    return this.health <= 1;
  }

  eat(food) {
    this.health += 0.1;
  }

  age() {
    this.breed();
    this.burnCalories();
  }

  breed() {
    if (random(0, 1) < this.breed_rate) {
      return new Tuna(this.position);
    }
  }

  burnCalories() {
    // Lose 1 percent health per second at 30 fps
    this.health -= (0.02 / 30);
    return this.health > 0;
  }
}