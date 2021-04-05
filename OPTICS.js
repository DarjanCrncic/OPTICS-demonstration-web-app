
var chosenEps = 40;

var eps = 55;
var Nmin = 50;
var colors = ['#e4e3e3'];

var neighbors = [];
var seeds = [];
var order = [];
var orderedReachList = [];
var data = [];
var orderIndex = 0;

function optics(){
    data = [];
    neighbors = [];
    seeds = [];
    order = [];    
    orderIndex = 0;
    eps = $('#epsForOptics').val();
    Nmin = $('#NminForOptics').val();
    points.forEach(function(point, i){
        point.reachDist = -1;
        point.coreDist = -1;
        point.order = 0;
        point.processed = false;
    });

    while(getUnprocessed() != -1){
        var currentPoint = getUnprocessed();
        points[currentPoint].processed = true;
        points[currentPoint].order = orderIndex;
        orderIndex++;
        order.push(points[currentPoint].index);

        getNeighbors(currentPoint);
        points[currentPoint].coreDist = calcCoreDist(currentPoint);

        if(points[currentPoint].coreDist != -1){
            seeds = [];
            update(currentPoint);   

            while(seeds.length > 0){
                updateSeeds();
                seeds.sort(function(a,b){ return sortFunction(a, b); });
                let neighbor = seeds[0].index;
                points[neighbor].processed = true;
                points[neighbor].order = orderIndex;
                orderIndex++;
                order.push(points[neighbor].index);
                seeds.shift();
                
                getNeighbors(neighbor);
                points[neighbor].coreDist = calcCoreDist(neighbor);

                if(points[neighbor].coreDist != -1)
                    update(neighbor);
            }
        }
    }
    if(order.length > 0){
        orderedReachList = [];
        for(let i=0; i<points.length; i++){
            orderedReachList[i] = (points[order[i]].reachDist == -1) ? 0 : points[order[i]].reachDist;
            data[i] = {'x': i, 'y': points[order[i]].reachDist};
        }

        findClusters();
        colorClusters();
    }

    Graphics.drawResults(orderedReachList, chosenEps);
    
}

function findClusters(){
    var currentCluster = [];
    clusters = [];
    for(let i=0; i<points.length; i++){

        if(orderedReachList[i] >= chosenEps || orderedReachList[i] == 0){
            if(currentCluster.length >= Nmin-1){
                clusters.push(currentCluster);
            }
            currentCluster = [];
        }
        if(orderedReachList[i] > 0 && orderedReachList[i] <= chosenEps){
            currentCluster.push(order[i]);
        }
        
    }

    for(let i=0; i<points.length; i++){
        points[i].cluster = 0;
    }

    for(let j=0; j<clusters.length; j++){
        for(let i=0; i<clusters[j].length; i++){
            points[clusters[j][i]].cluster = j+1; 
        }
    };

}

function colorClusters(){
    for(let i=0; i<points.length; i++){
        $('#'+points[i].index).css("background", colors[points[i].cluster]);
    }
}

function fillColors(){
    for(let i=0; i<100; i++){
        colors.push(getRandomColor());
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

///////////////// optics functions ///////////////////////////////////////////
function euclidianDist(pointA, pointB){
    return Math.sqrt((pointB.x-pointA.x)*(pointB.x-pointA.x) + (pointB.y-pointA.y)*(pointB.y-pointA.y));
}

function getNeighbors(currentPoint){
    neighbors = [];
    points.forEach(function(point, index){
        const dist = euclidianDist(points[currentPoint], point);
        if(dist <= eps && index != points[currentPoint].index)
            neighbors.push({index: point.index, dist: dist});
    });
}

function calcCoreDist(currentPoint){
    if(points[currentPoint].coreDist != -1)
        return points[currentPoint].coreDist;
    else
        if(neighbors.length >= Nmin-1){
            neighbors.sort(function(a,b){
                return sortFunction(a, b);
            });
            return neighbors[Nmin-2].dist;
        }else{
            return -1;
        }
}

function update(currentPoint){
    neighbors.forEach(function(neighbor){
        if(!points[neighbor.index].processed){
            const new_reach = Math.max(points[currentPoint].coreDist, euclidianDist(points[currentPoint], points[neighbor.index]));
            if(points[neighbor.index].reachDist == -1){
                points[neighbor.index].reachDist = new_reach;
                seeds.push({index: neighbor.index, dist: new_reach});
            }else{
                if(new_reach < points[neighbor.index].reachDist){
                    points[neighbor.index].reachDist = new_reach;
                }       
            }
        }
    });
}

function getUnprocessed(){
    let output = -1;
    for(let i=0; i<points.length; i++){
        if(!points[i].processed){
            output = points[i].index;
            break;
        }
    }
    return output;
}

function sortFunction(a, b){
    if(a.dist > b.dist)
        return 1;
    else if (a.dist < b.dist)
        return -1;

    if(a.index < b.index){
        return -1;
    }else{
        return 1;
    }
}

function updateSeeds(){
    if(seeds.length > 0){
        for(let i=0; i<seeds.length; i++){
            seeds[i].dist = points[seeds[i].index].reachDist;
        }
    }
}


