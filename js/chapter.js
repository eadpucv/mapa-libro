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
    let x;
    switch (this.note) {
      case 'Escuela como obra':
        this.colOriginal = color(200, 72, 0, 230);
        this.col = color(200, 72, 0, 230);
        this.colo = color(201, 62, 8);
        x = width * 5 / 6 + random(-1, 1);
        break;
      case 'Investigación y creación':
        this.colOriginal = color(94, 87, 87, 230);
        this.col = color(94, 87, 87, 230);
        this.colo = color(28, 15, 15);
        x = width / 6 + random(-1, 1);
        break;
      case 'Bordes del oficio':
        this.colOriginal = color(242, 239, 230);
        this.col = color(242, 239, 230);
        this.colo = color(214, 211, 203)
        x = width / 2 + random(-1, 1);
    }

    let options = {
      friction: 0.5,
      frictionAir: 0.9,
      frictionStatic: 0.9,
      restitution: 0.9,
      sleepThreshold: 60,
      mass: 10
    };

    this.body = Bodies.rectangle(x, height * .70 + random(-1, 1), this.side, this.side, options);
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