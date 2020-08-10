class Environment {
  constructor(qt) {
    this.flock = [];
    this.qt = qt;
    this.tuna_count = 5;
    this.sardine_count = 50;
    this.krill_count = 500;
    this.fish = [];

    for (let i = 0; i < this.tuna_count; i++) { 
      const tuna = new Tuna();
      this.fish.push(tuna);
      this.qt.insert(tuna);
    }
    
    for (let i = 0; i < this.sardine_count; i++) { 
      const sardine = new Sardine();
      this.fish.push(sardine);
      this.qt.insert(sardine);
    }
    
    for (let i = 0; i < this.krill_count; i++) { 
      const krill = new Krill();
      this.fish.push(krill);
      this.qt.insert(krill);
    }
  }

  breed_event(source) {
    const will_breed = floor(random(source.breed_chance));
    if (will_breed !== 0) return;
    for (let i = 0; i < this.num_offspring; i++) {
      const stats = { max_force, mass, max_speed, team: source.team };
      const position = source.position;
      this.add_fish(position, stats);
    }
  }

  expire_event(source, target) {
    if(target.special) {
      target.mass = this.breed_mass_min;
      source.mass += this.expire_mass_reward; 
      return;
    }
    const will_expire = floor(random(this.expire_chance));
    if (will_expire !== 0) return;
    target.deleted = true;
    source.mass += this.expire_mass_reward;
    if(target.team) this.blue_team_count--;
    else this.red_team_count--;
  }

  add_fish(p = null, _class) {
    const index = this.flock.length;
    const position = p || { x: random(width), y: random(height) };
    const new_fish = new _class(position);
    this.fish.push(new_boid);

    return new_fish;
  }

  draw() {
    const new_qt = new QuadTree(canvas_boundary);
    for(let i = 0; i < this.fish.length; i++) {
      if(this.fish[i].deleted)  {
        this.fish.splice(i, 1);
        continue;
      }
  
      this.fish[i].edges();
      this.fish[i].flock();
      this.fish[i].update();
      const fish = this.fish[i].show();
      new_qt.insert(fish);
    }
    this.qt = new_qt;
  }
}