class QuadTree {
  constructor(boundary, depth = 0, capacity = 4){
    this.boundary = boundary;
    this.capacity = capacity;
    this.fishes = [];
    this.divided = false;
    this.max_depth = 32;
    this.depth = depth;
    this.max_sample_size = 4;
  }

  insert(fish) {

    if (!this.boundary.contains(fish)) {
      return false;
    }

    if (this.depth === this.max_depth || this.fishes.length < this.capacity) {
      this.fishes.push(fish);
      return true;
    } else {
      if(!this.divided && this.depth < this.max_depth) {
        this.subdivide();
      }

      if (this.northeast.insert(fish)) return true;
      if (this.northwest.insert(fish)) return true;
      if (this.southeast.insert(fish)) return true;
      if (this.southwest.insert(fish)) return true;
    }
  }

  getFishes() {
    if (this.divided) {
      let sub_fishes = [];
      sub_fishes = sub_fishes.concat(this.northeast.getFishes());
      sub_fishes = sub_fishes.concat(this.northwest.getFishes());
      sub_fishes = sub_fishes.concat(this.southeast.getFishes());
      sub_fishes = sub_fishes.concat(this.southwest.getFishes());
      return sub_fishes;
    } else {
      // If there are a lot of fishes at the max depth then just get the first 10
      return this.fishes.slice(this.max_sample_size);
    }
  }

  query(range) {
    let found = [];
    // if boundary doesn't intersect range at all, just return
    if (!this.boundary.intersects(range)) {
      return found;
    } else if (this.boundary.enclosed(range)) { // If the boundary is completely in the range then ...
      if(!this.divided) found = found.concat(this.fishes); // return all the fishes if undivided otherwise ...
      else { // if divided then return all fishes in sub quadTrees
        found = found.concat(this.getFishes());
      }
    } else {
      if (this.divided) {
        found = found.concat(this.northeast.query(range));
        found = found.concat(this.northwest.query(range));
        found = found.concat(this.southeast.query(range));
        found = found.concat(this.southwest.query(range));
      } else {
        for(let i = 0; i < this.fishes.length; i++) {
          if (range.contains(this.fishes[i])) {
            found = found.concat(this.fishes[i]);
          }
        }
      }
     }
     return found;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w;
    const h = this.boundary.h;

    const nw = new Rectangle(x - w/2, y - h / 2, w/2, h/2);
    this.northwest = new QuadTree(nw, this.depth+1, this.capacity);
    const ne = new Rectangle(x + w/2, y - h / 2, w/2, h/2);
    this.northeast = new QuadTree(ne, this.depth+1, this.capacity);
    const sw = new Rectangle(x - w/2, y + h / 2, w/2, h/2);
    this.southwest = new QuadTree(sw, this.depth+1, this.capacity);
    const se = new Rectangle(x + w/2, y + h / 2, w/2, h/2);
    this.southeast = new QuadTree(se, this.depth+1, this.capacity);

    // move current fishes into sub quad trees
    for(let i = 0; i < this.fishes.length; i++) {
      let inserted = false;
      inserted = this.northeast.insert(this.fishes[i]);
      if(!inserted) inserted = this.northwest.insert(this.fishes[i]);
      if(!inserted) inserted = this.southeast.insert(this.fishes[i]);
      if(!inserted) inserted = this.southwest.insert(this.fishes[i]);
    }
    this.divided = true;
  }
}

class Rectangle{
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(fish) {
    const fish_x = fish.position.x;
    const fish_y = fish.position.y;
    return (
      fish_x >= this.x - this.w &&
      fish_x < this.x + this.w &&
      fish_y >= this.y - this.h &&
      fish_y < this.y + this.h
    );
  }

  // Does the rectangle intersects the range rectangle
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }

  // Is the rectangle completed enclosed in the range rectangle
  enclosed(range) {
    return (range.x - range.w < this.x - this.w &&
      range.x + range.w > this.x + this.w &&
      range.y - range.h < this.y - this.h &&
      range.y + range.h > this.y + this.h);
  }
}