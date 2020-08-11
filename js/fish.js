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
    this.align_proximity = stats.align_proximity;
    this.cohesion_proximity = stats.cohesion_proximity;
    this.separation_proximity = stats.separation_proximity;
    this.edge_proximity = 15;

    // Fish properties
    this.max_force = stats.max_force;
    this.max_speed = stats.max_speed;
    this.mass = stats.mass;
    this.fov = stats.fov;
    this.trophic_level = stats.trophic_level;
    this.color = stats.color;
    this.view_proximity = stats.view_proximity;
    this.num_offspring = stats.num_offspring;
    this.eat_distance = 5;

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

  flock(hungry) {
    const approximate_range = new Rectangle(this.position.x, this.position.y, this.view_proximity/2, this.view_proximity/2);
    const fish_in_quad = env.qt.query(approximate_range);

    let align_steering = createVector();
    let cohesion_steering = createVector();
    let separation_steering = createVector();
    let predator_steering = createVector();


    let align_total = 0;
    let cohesion_total = 0;
    let separation_total = 0;
    let predator_count = 0;
    let closest_prey;
    let closest_prey_dist = Infinity;
    let eaten = false;
    let food;


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
        if (distance < this.separation_proximity && this.isFriendly(fish_in_quad[i])) {
          const difference = p5.Vector.sub(this.position, fish_in_quad[i].position);
          const dif_mag = difference.mag();
          if (dif_mag === 0) continue;
          difference.div(dif_mag * dif_mag);
          separation_steering.add(difference);
          separation_total++;
        }
        // Move towards prey and away from predators
        if (this.inView(fish_in_quad[i]) && distance < this.view_proximity) {
          // Prey
          if (hungry && !eaten && this.trophic_level - 1 === fish_in_quad[i].trophic_level) {
            const dist = p5.Vector.dist(this.position, fish_in_quad[i].position);
            if (dist < this.eat_distance) {
              fish_in_quad[i].deleted = true;
              food = fish_in_quad[i];
            } else if (dist < closest_prey_dist) {
              closest_prey_dist = dist;
              closest_prey = fish_in_quad[i];
            }
          } else if(this.trophic_level + 1 === fish_in_quad[i].trophic_level) {
            const difference = p5.Vector.sub(this.position, fish_in_quad[i].position);
            const dif_mag = difference.mag();
            if (dif_mag === 0) continue;
            difference.div(dif_mag * dif_mag);
            predator_steering.add(difference);
            predator_count++;
          }
        }
    }


    if (predator_count > 0) {
      const predatorVector = this.getSeparationVector(predator_steering, predator_count, 100);
      this.acceleration.add(predatorVector);
    } else if (predator_count === 0 && closest_prey) {
      if (closest_prey_dist < this.eat_distance) {

      }
      const preyVector = this.seek(closest_prey);
      this.acceleration.add(preyVector);
    } else {
      const alignVector = this.getAlignVector(align_steering, align_total);
      const cohesionVector = this.getCohesionVector(cohesion_steering, cohesion_total);
      const separationVector = this.getSeparationVector(separation_steering, separation_total);
      this.acceleration.add(alignVector);
      this.acceleration.add(cohesionVector);
      this.acceleration.add(separationVector);
    }
    return food;
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

  getSeparationVector(steering, total, urgency = 1.5) {
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub((this.velocity));
      steering.mult(urgency)
      steering.limit(this.max_force);
    }
    return steering;
  }

   seek(target) {
    // Check if target is prey 
    const desired = p5.Vector.sub(target.position, this.position);
    desired.setMag(this.max_speed);

    const steer = p5.Vector.sub(desired, this.velocity);
    steer.mult(25);
    steer.limit(this.max_force);
    return steer;
  }

  inView(target) {
    const sub = p5.Vector.sub(target.position, this.position);
    const angleBetween = abs(this.velocity.angleBetween(sub));
    const inView = angleBetween < (this.fov / 2);
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
    strokeWeight(1);
    stroke(this.color);
    fill(this.color); // It is more performant without filling

		const r = this.mass;
		const angle = this.velocity.heading();
    const anglePlus = 2.5;
    const aX = this.position.x + Math.cos(angle) * r;
    const aY = this.position.y + Math.sin(angle) * r;
    const bX = this.position.x + Math.cos(angle + anglePlus) * r;
    const bY = this.position.y + Math.sin(angle + anglePlus) * r;
    const cX = this.position.x + Math.cos(angle - anglePlus) * r;
    const cY = this.position.y + Math.sin(angle - anglePlus) * r;


    triangle(
			aX, aY,
			bX, bY,
			cX, cY
    );

    return this;
  }
}