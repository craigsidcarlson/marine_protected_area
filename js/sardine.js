class Sardine extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.06,
      max_speed: 2,
      mass: 2,
      fov: PI / 2,
      trophic_level: 2,
      color: color(0,139,15),
      view_proximity: 25,
      num_offspring: 10
    };
    super(stats, position);
  }
}