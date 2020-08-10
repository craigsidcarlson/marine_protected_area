class Fish {
  constructor(stats, position = null) {
    let x, y;
    if (position) {
      x = position.x;
      y = position.y;
    } else {
      x = random(width);
      y = random(height);
    }

    // Physics properties
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.align_proximity = 30;
    this.cohesion_proximity = 20;
    this.separation_proximity = 35;
    this.edge_proximity = 15;
    this.largest_proximity = this.align_proximity;
    this.eat_distance = 5;
    if (this.cohesion_proximity > this.largest_proximity) this.largest_proximity = this.cohesion_proximity;
    if (this.separation_proximity > this.largest_proximity) this.largest_proximity = this.separation_proximity;

    // Fish properties
    this.max_force = stats.max_force;
    this.max_speed = stats.max_speed;
    this.mass = stats.mass;
    this.fov = stats.fov;
    this.trophic_level = stats.trophic_level;
    this.color = stats.color;
    this.view_proximity = stats.view_proximity;
    this.num_offspring = stats.num_offspring;
  }

  edges() {
    const incoming_mag = this.velocity.mag();
    const reflection = random(0.1, 0.2);
    if (this.position.x + this.edge_proximity > width) {
      this.velocity.lerp(right_edge_vector, reflection);
    }
    else if (this.position.x - this.edge_proximity < 0) {
      this.velocity.lerp(left_edge_vector, reflection);
    }
    if (this.position.y + this.edge_proximity> height) {
      this.velocity.lerp(bottom_edge_vector, reflection);

    }
    else if (this.position.y - this.edge_proximity < 0) {
      this.velocity.lerp(top_edge_vector, reflection);
    }
    this.velocity.setMag(incoming_mag);
  }

  async flock() {
    const approximate_range = new Rectangle(this.position.x, this.position.y, this.largest_proximity/2, this.largest_proximity/2);
    const fish_in_quad = env.qt.query(approximate_range);

    let align_steering = createVector();
    let cohesion_steering = createVector();
    let separation_steering = createVector();
    let environment_steering = createVector();

    let align_total = 0;
    let cohesion_total = 0;
    let separation_total = 0;
    let enviro_total = 0;

    for (let i = 0; i < fish_in_quad.length; i++) {
        const distance = dist(
          this.position.x, 
          this.position.y, 
          fish_in_quad[i].position.x,
          fish_in_quad[i].position.y
        );
        if (distance === 0) continue;

        // Alignment
        if (distance < this.align_proximity && this.isFriendly(fish_in_quad[i])) {
          align_steering.add(fish_in_quad[i].velocity);
          align_total++;
        }

        // Cohesion
        if (distance < this.cohesion_proximity && this.isFriendly(fish_in_quad[i])) {
          cohesion_steering.add(fish_in_quad[i].position);
          cohesion_total++;
        }
        // Separation
        if (distance < this.separation_proximity) {
          const difference = p5.Vector.sub(this.position, fish_in_quad[i].position);
          const dif_mag = difference.mag();
          if (dif_mag === 0) continue;
          difference.div(dif_mag * dif_mag);
          separation_steering.add(difference);
          separation_total++;
        }
        // Move towards prey and away from predators
        if (this.inView(fish_in_quad[i]) && distance < this.view_proximity) {
          this.interact(fish_in_quad[i]);
        }
    }
    const alignVector = this.getAlignVector(align_steering, align_total);
    const cohesionVector = this.getCohesionVector(cohesion_steering, cohesion_total);
    const separationVector = this.getSeparationVector(separation_steering, separation_total);
    this.acceleration.add(alignVector);
    this.acceleration.add(cohesionVector);
    this.acceleration.add(separationVector);
  }

  getAlignVector(steering, total) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  getCohesionVector(steering, total)  {
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  getSeparationVector(steering, total) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed + 0.5);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

   interact(target) {
    // Check if target is prey 
    if (this.trophic_level > target.trophic_level) {

      const dist = p5.Vector.dist(this.position, target.position)
      // If prey is close enough then eat
      if (dist < this.eat_distance) {
        env.expire_event(this, target);
      } else {

      }
    }
  }

  inView(target) {
    const sub = p5.Vector.sub(target.position, this.position);
    const angleBetween = abs(this.velocity.angleBetween(sub));
    const inView = angleBetween < (this.fov / 2);
    // if(this.special) debugger;
    return inView;
  }

  isFriendly(target) {
    return this.trophic_level === target.trophic_level;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(this.mass);
    stroke(this.color);
    noFill(); // It is more performant without filling

		const r = 3;
		const angle = this.velocity.heading();
		const anglePlus = 2.5;
    triangle(
			this.position.x + Math.cos(angle) * r, this.position.y + Math.sin(angle) * r,
			this.position.x + Math.cos(angle + anglePlus) * r, this.position.y + Math.sin(angle + anglePlus) * r,
			this.position.x + Math.cos(angle - anglePlus) * r, this.position.y + Math.sin(angle - anglePlus) * r
    );
    return this;
  }
}