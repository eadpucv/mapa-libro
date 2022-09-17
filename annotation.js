/**
 * a annotation is a representation of a observation 
 * that connects 2 or more pages in Casiopea
 * 
 */

class Annotation {
    constructor(o) {
        this.title = o.fulltext;
        this.url = o.fullurl;
        this.author = [];
        for (let i = 0; i < o.printouts.Autor.length; i++) {
            this.author.push(o.printouts.Autor[i].fulltext);
        }
        this.text = o.printouts.Nota[0];
        this.diam = 10;
        this.connections = o.printouts["Páginas Relacionadas"];

        // crea el cuerpo físico de la observación
        let options = {
            friction: 0.5,
            frictionAir: 0.9,
            frictionStatic: 0.9,
            restitution: 0.9,
            sleepThreshold: 60,
            mass: this.w / 10
        };

        this.body = Bodies.circle(width / 2 + random(-2, 2), height / 2 + random(-2, 2), this.diam, options);
        World.add(world, this.body);
        this.over = false;
        
        this.connect = [];
        
        for (let i = 0; i < this.connections.length; i++) {
            let t = this.connections[i].fulltext;
            this.connect.push(t);
        }

        print(this.connect);
        
        for(let i = 0; i < this.connect.length; i++){
            for (c of caps) {
                if(c.title === this.connect[i]){
                    print("* -- * "+c.title+"--- es igual a ---"+this.connect[i]);
                }
                let spring = new Edge(this, c);
              }
        }
    }

    display() {
        let pos = this.body.position;
        this.x = pos.x;
        this.y = pos.y;
        if (dist(this.x, this.y, mouseX, mouseY) < this.s / 2) {
            this.over = true;
        } else {
            this.over = false;
        }
        push();
        translate(pos.x, pos.y);
        if (this.over) {
            stroke(204, 37, 8);
            strokeWeight(3);
            fill(100);
        } else {
            noStroke();
            fill(200, 100, 100);
        }
        circle(0, 0, this.diam);
        pop();
    }
}

function drawAnnotations() {
    for (n of annotations) {
        n.display();
        if (mConstraint.body === c.body || c.over) {
            displayDetails(c);
            current = c;
        }
    }
}