class Sardine extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.08,
      max_speed: 2.2,
      mass: 3,
      fov: 2 * PI,
      trophic_level: 3,
      color: color(246, 193, 1),
      view_proximity: 45,
      align_proximity: 35,
      cohesion_proximity: 30,
      separation_proximity: 30,
      calories: 1
    };   
    super(stats, position);
    this.health = position == null ? 1 : 0.5;
    this.breed_rate = 0.002;
    this.num_offspring = 3;
  }
  isHungry() {
    return this.health <= 1;
  }
  
  eat(food) {
    this.health += 0.1;
  }

  breed() {
    if (this.health > 0.5 && random(0, 1) < this.breed_rate) {
      return new Sardine(this.position);
    }
  }

  burnCalories() {
    // Lose 1 percent health per second at 30 fps
    this.health -= (0.01 / 30);
    return this.health > 0
  }
}