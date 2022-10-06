/**
 * 
 * un nodo del mapa (cuadrado)
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

  createBody(x, y, options) {
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
      stroke(lerpColor(this.col, color(0, 90), 0.5));
      strokeWeight(1);
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

function displayCapDetails(c) {
  textFont(serif);
  textSize(48);
  textLeading(42);
  noStroke();
  textAlign(LEFT, TOP);
  textWrap(WORD);
  fill(173);
  rectMode(CORNER);
  text(c.title, 0, 20, width, height);

  textAlign(CENTER);
  textSize(12);
  text("doble click para ver", width / 2, height - 18);

  textAlign(LEFT);
  let authorOffset = 0;
  let authorLink = " & ";
  for (let i = 0; i < c.author.length; i++) {
    fill(200, 72, 0, 230);
    textFont(sansBold);
    textSize(16);
    text(c.author[i].toUpperCase(), authorOffset, 5);
    authorOffset += textWidth(c.author[i].toUpperCase());
    if(c.author.length > 1 && i < c.author.length - 1){
      fill(173);
      text(authorLink, authorOffset, 5);
      authorOffset += textWidth(authorLink);
    }
  }
}