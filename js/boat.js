class Boat {
  constructor(port) {
    this.position = createVector(port.x, port.y);
    this.velocity = createVector(0, -1);
    this.acceleration = createVector();
    this.target_fish = 'Tuna';
    this.target = null;
    this.target_color = null;
    this.legal_limit = 7;
    this.capacity = 10;
    this.caught = 0;
    this.fishing = true; // true: FISHING    false: DOCKING
    this.limit = true; // Fishing limits are imposed
    // Physics properties
    this.view_distance = 150;
    this.give_up_dist = 150;
    this.max_speed = 1;
    this.catch_distance = 10;
    this.fuel = 1000;
    this.boundary_distance = 5;
    this.color = color(255, 0, 0);
  }

  fish() {
    if (this.target) {
      const dist_to_target = this.position.dist(this.target.position);
      if (dist_to_target < this.catch_distance) {
        this.target.deleted = true;
        this.caught += this.target.calories;
        console.log(`Caught ${this.caught}`);
        this.target_color = this.target.color;
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
    const approximate_range = new Rectangle(this.position.x, this.position.y, this.view_distance/2, this.view_distance/2);
    const fish_in_quad = env.qt.query(approximate_range);
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
      const response = this.target ? { type: this.target.constructor.name, amount: this.caught } : null;
      console.log(this.fuel);
      this.fuel = 1000;
      this.caught = 0;
      this.target = null;
      this.target_color = null;
      return response;
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


  applyForce(force) {
    force.limit(this.max_speed);
    this.acceleration.add(force);
  }

  boundaries() {
    let desired = null;
    if (!this.fishing) return;

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

  show() {
		const angle = this.velocity.heading() + PI / 2;;
    push();
    strokeWeight(2);
    stroke(this.color);
    // fill(this.color); // It is more performant without filling
    if (this.fishing){
      noFill();
    } else if (this.target_color) {
       this.target_color.setAlpha(100);
      fill(this.target_color);
    } 
    translate(this.position.x, this.position.y);
    rotate(angle);
    ellipse(0, 0, 10, 16.18);
    pop();
   

    return this;
  }
}