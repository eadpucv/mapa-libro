class Edge{
    constructor(nodeA, nodeB){
        this.connected = false;
        this.selected = false;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.e = null;
        edges.push(this);
    }

    createLink(){
        let options = {
            label: "spring",
            length: 100,
            bodyA: this.nodeA.body,
            bodyB: this.nodeB.body,
            stiffness: 0.99
          }
          // create new spring
          this.e = Constraint.create(options);
          World.add(world, e);
          
          //print("connecting "+this.nodeA.title+" - "+history.nodeB.title);
          this.connected = true;
    }

    display(){
        if(this.selected){
            strokeWeight(22);
            stroke(0, 25);
        }else{
            stroke(0, 5);
            strokeWeight(17);
        }
        line(this.nodeA.body.position.x, this.nodeA.body.position.y, this.nodeB.body.position.x, this.nodeB.body.position.y);
    }
}

function createAllEdges(objectArray){
    for(let i = 0; i < objectArray.length; i++){
        for(let j = 0; j < i; j++){
        // create Edge object
        let e = new Edge(objectArray[i], objectArray[j]);
        edges.push(e);
        }
    }
}

function drawEdges(){
    for(e of edges){
        if(e.connected){
            e.display();
        }
    }
}