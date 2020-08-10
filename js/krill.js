class Krill extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.05,
      max_speed: 1.5,
      mass: 1,
      fov: PI,
      color: color(0,139,139),
      view_proximity: 15,
      num_offspring: 50
    };
    super(stats, position);

  }
}