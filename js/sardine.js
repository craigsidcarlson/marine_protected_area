class Sardine extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.08,
      max_speed: 2,
      mass: 3,
      fov: (3 * PI) / 2,
      trophic_level: 3,
      color: color(246, 193, 1),
      view_proximity: 25,
      num_offspring: 10,
      align_proximity: 35,
      cohesion_proximity: 30,
      separation_proximity: 30
    };
    super(stats, position);
  }
}