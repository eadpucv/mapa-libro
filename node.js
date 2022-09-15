/**
 * a node is a representation of a publication in Casiopea
 * 
 * 
 */

class Node{
    constructor(o){
      this.title = o.fulltext;
      this.url = o.fullurl;
      this.author = [];
      for(let i = 0; i < o.printouts.Autor.length; i++){
        this.author.push(o.printouts.Autor[i].fulltext);
      }
      this.cat = o.printouts.Nota[0];
      textFont(sansBold, 14);
      this.s = 20; // this.title.length - side
      this.over = false;
      let x;
      switch(this.cat){
        case 'Escuela como obra':
          this.col = color(255, 72, 0);
          this.colo = color(201, 62, 8);
          x = width * 5/6 + random(-1, 1);
          break;
        case 'Investigación y creación':
          this.col = color(94, 67, 67);
          this.colo = color(28, 15, 15);
          x = width / 6 + random(-1, 1);
          break;
        case 'Bordes del oficio':
          this.col = color(242, 239, 230);
          this.colo = color(214, 211, 203)
          x = width / 2 + random(-1, 1);
      }
      
      let options = {
        friction: 0.5,
        frictionAir: 0.1,
        frictionStatic: 0.9,
        restitution: 0.9,
        sleepThreshold: 60,
        mass: this.w/10
      };
      this.body = Bodies.rectangle(x, height*.75 + random(-1, 1), this.s, this.s, options);
      World.add(world, this.body);
      this.over = false;
    }
  
    display(){
      this.angle = this.body.angle;
      let pos = this.body.position;
      this.x = pos.x;
      this.y = pos.y;
      if (dist(this.x, this.y, mouseX, mouseY) < this.s/2) {
        this.over = true;
    } else {
        this.over = false;
    }
      push();
      translate(pos.x, pos.y);
      rotate(this.angle);
      if(this.over){
        stroke(204, 37, 8);
        strokeWeight(3);
        fill(this.colo);
      }else{
        noStroke();
        fill(this.col);
      }
      rectMode(CENTER);
      rect(0, 0, this.s, this.s, 2);
      pop();
    }
  }

  function drawNodes(){
    for(c of caps){
      c.display();
      if (mConstraint.body === c.body || c.over) {
        displayDetails(c);
        current = c;
      }
    }
  }