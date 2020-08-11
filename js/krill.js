class Krill extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.06,
      max_speed: 1,
      mass: 0.5,
      fov: 2 * PI,
      trophic_level: 2,
      color: color(254, 127, 156),
      view_proximity: 15,
      align_proximity: 15,
      cohesion_proximity: 10,
      separation_proximity: 25,
      calories: 1
    };   
    super(stats, position);
    this.health = 1;
    this.breed_rate = 0.001;
    this.num_offspring = 1;

  }
  isHungry() {
    return this.health <= 0.7;
  }
  
  eat(food) {
    this.health += 0.25;
  }

  breed() {
    if (random(0, 1) < this.breed_rate) {
      return new Krill(this.position);
    }
  }

  burnCalories() {
    // No calorie loss for krill
    // Lose 1 percent health per second at 30 fps
    // this.health -= (0.01 / 30);
    return this.health > 0;
  }
}