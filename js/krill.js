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
      num_offspring: 50,
      align_proximity: 15,
      cohesion_proximity: 10,
      separation_proximity: 25
    };
    super(stats, position);

  }
}