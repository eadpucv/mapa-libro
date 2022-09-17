class Edge {
    constructor(nodeA, nodeB) {
        this.connected = false;
        this.selected = false;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        //this.e = null;
        edges.push(this);
    }

    createLink(options) {
        // create new spring
        this.e = Constraint.create(options);
        World.add(world, this.e);
        //print("connecting "+this.nodeA.title+" - "+history.nodeB.title);
        this.connected = true;
    }

    display() {
        if (this.selected) {
            strokeWeight(22);
            stroke(0, 25);
        } else {
            stroke(0, 15);
            strokeWeight(2);
        }
        strokeCap(SQUARE);
        line(this.nodeA.body.position.x, this.nodeA.body.position.y, this.nodeB.body.position.x, this.nodeB.body.position.y);
    }
}

function createAllEdges(objectArray) {

      // create links of primary edges
  if (edgesCount < edges.length && frameCount > 100) {
    let options = {
        label: "edge",
        length: random(80, 120),
        bodyA: edges[edgesCount].nodeA.body,
        bodyB: edges[edgesCount].nodeB.body,
        stiffness: 0.01
    }
    edges[edgesCount].createLink(options);
    edgesCount++;
  }

    for (let i = 0; i < objectArray.length; i++) {
        for (let j = 0; j < i; j++) {
            // create Edge object
            let e = new Edge(objectArray[i], objectArray[j]);
            edges.push(e);
        }
    }
}

function creatEdgeBetween(a, b) {
    let e = new Edge(a, b);
    edges.push(e);
}

function drawEdges() {
    for (e of edges) {
        if (e.connected) {
            e.display();
        }
    }
}