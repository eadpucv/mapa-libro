/**
 * un Nodo del Mapa
 * 
 */

class Chapter {
  constructor(o) {
    this.title = o.fulltext;
    this.url = o.fullurl;
    this.author = [];
    for (let i = 0; i < o.printouts.Autor.length; i++) {
      this.author.push(o.printouts.Autor[i].fulltext);
    }
    this.note = o.printouts.Nota[0];
    textFont(sansBold, 14);
    this.side = 20; 
    this.over = false;
    this.col = "gray";
    this.colo = "darkgray";
  }

  createBody(x, y, options){
    this.body = Bodies.rectangle(x, y, this.side, this.side, options);
    World.add(world, this.body);
  }

  display() {
    this.angle = this.body.angle;
    let pos = this.body.position;
    this.x = pos.x;
    this.y = pos.y;
    if (dist(this.x, this.y, mouseX, mouseY) < this.side / 2) {
      this.over = true;
    } else {
      this.over = false;
    }
    push();
    translate(pos.x, pos.y);
    rotate(this.angle);
    if (this.over) {
      stroke(204, 37, 8);
      strokeWeight(3);
      fill(this.colo);
    } else {
      stroke(0, 30);
      strokeWeight(0.5);
      fill(this.col);
    }
    rectMode(CENTER);
    rect(0, 0, this.side, this.side, 1);
    pop();
  }
}

function drawChapters() {
  for (c of caps) {
    c.display();
    if (mConstraint.body === c.body || c.over) {
      displayCapDetails(c);
      current = c;
    }
  }
}