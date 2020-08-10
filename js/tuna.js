class Tuna extends Fish {
  constructor(position = null) {
    const stats = {
      max_force: 0.07,
      max_speed: 2.8,
      mass: 5,
      fov: PI / 4,
      trophic_level: 4,
      color: color(246, 193, 1),
      view_proximity: 30,
      num_offspring: 1
    }
    super(stats, position);
  }
}