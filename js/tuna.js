class Tuna extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.1,
      max_speed: 2.8,
      mass: 6,
      fov:  2 * PI,
      trophic_level: 4,
      color: color(0,239,239),
      view_proximity: 50,
      num_offspring: 1,
      align_proximity: 35,
      cohesion_proximity: 30,
      separation_proximity: 40
    }
    super(stats, position);
  }
}