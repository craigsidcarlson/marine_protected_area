class Boat {
  constructor(port) {
    this.position = createVector(port.x, port.y);
    this.velocity = createVector(0, -1);
    this.acceleration = createVector();
    this.target_fish = 'Tuna';
    this.target = null;
    this.legal_limit = 7;
    this.capacity = 10;
    this.caught = 0;
    this.fishing = true; // true: FISHING    false: DOCKING
    this.limit = true; // Fishing limits are imposed
    // Physics properties
    this.view_distance = 100;
    this.give_up_dist = 250;
    this.max_speed = 2;
    this.catch_distance = 15;
    this.boundary_distance = 5;
    this.color = color(255, 0, 0);
  }

  fish() {
    const approximate_range = new Rectangle(this.position.x, this.position.y, this.view_distance/2, this.view_distance/2);
    const fish_in_quad = env.qt.query(approximate_range);
    if (this.target) {
      const dist_to_target = this.position.dist(this.target.position);
      if (dist_to_target < this.catch_distance) {
        this.target.deleted = true;
        this.caught += this.target.health;
        this.target = null;
        return;
      } else {
        if (dist_to_target >= this.give_up_dist) {
          this.target = null;
        } else {
          this.applyForce(this.seek(this.target.position));
          return;
        }
      }     
    }

    let closest_dist = Infinity;
    for (let i = 0; i < fish_in_quad.length; i++) {
      const fish_type = fish_in_quad[i].constructor.name;
      if (fish_type !== this.target_fish) continue;
      const distance = this.position.dist(fish_in_quad[i].position)
      if (distance < closest_dist && distance < this.view_distance) {
          closest_dist = distance;
          this.target = fish_in_quad[i];
      }
    }    
  }

  atCapacity() {
    if (this.limit) return this.caught > this.legal_limit;
    else return this.caught > this.capacity;
  }

  dock() {
    const dist_to_port = this.position.dist(env.port);
    if (dist_to_port < 5) {
      const caught = this.caught;
      this.caught = 0;
      return caught;
    }
    else {
     const portVector = this.seek(env.port);
     this.applyForce(portVector);
    }
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.max_speed);

    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.max_force);

    return steer;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  show() {
    strokeWeight(1);
    stroke(this.color);
    // fill(this.color); // It is more performant without filling
    noFill();
		const r = 10;
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

  applyForce(force) {
    this.acceleration.add(force);
  }

  boundaries() {
    let desired = null;

    if (this.position.x < this.boundary_distance) {
      desired = createVector(this.max_speed, this.velocity.y);
    } else if (this.position.x > width - this.boundary_distance) {
      desired = createVector(-this.max_speed, this.velocity.y);
    }

    if (this.position.y < this.boundary_distance) {
      desired = createVector(this.velocity.x, this.max_speed);
    } else if (this.position.y > height - this.boundary_distance) {
      desired = createVector(this.velocity.x, -this.max_speed);
    }

    if (desired) {
      desired.normalize();
      desired.mult(this.max_speed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.max_force);
      this.applyForce(steer);
    }
  }
}