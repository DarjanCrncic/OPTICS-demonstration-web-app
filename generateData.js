var numOfClusters = 4;
var clusterWidth = [500, 500, 500, 500];
var clusterSize = [200, 300, 200, 400];
var noiseSize = 400;
var clusters = [];
var points = [];

const displayWidth = 2200;
const displayHeight = 1000;


function createClusters(){
    var index = 0;
    for(let i = 0; i < numOfClusters; i++){
        clusters.push({id: i, centerX: Math.floor(Math.random() * displayWidth), centerY: Math.floor(Math.random() * displayHeight)});
    
        for(let j = 0; j < clusterSize[i]; j++){
            let positionY = Math.round(getRandom()*clusterWidth[i] + Math.round(clusters[i].centerY) - clusterWidth[i]/2);
            let positionX = Math.round(getRandom()*clusterWidth[i] + Math.round(clusters[i].centerX) - clusterWidth[i]/2);

            if(positionX > displayWidth || positionY > displayHeight || positionX < 0 || positionY < 0){
                j--
                continue;
            }

            point = {
                y: positionY,
                x: positionX,
                index: index,
                coreDist: -1,
                reachDist: -1,
                processed: false,
                order: -1,
                cluster: 0,
            }
            points.push(point);
            $('.scatter-plot').append('<div id="' + index + '" class="dot"></div>');
            $('#'+index).css('left',positionX/displayWidth*100+'%');
            $('#'+index).css('bottom',positionY/displayHeight*100+'%');
            index++;
        }
    }

    for(let j = 0; j<noiseSize; j++){
        positionY = Math.floor(Math.random()*displayHeight);
        positionX = Math.floor(Math.random()*displayWidth);

        if(positionX > displayWidth || positionY > displayHeight || positionX < 0 || positionY < 0){
            j--
            continue;
        }

        point = {
            y: positionY,
            x: positionX,
            index: index,
            coreDist: -1,
            reachDist: -1,
            processed: false,
            order: -1,
            cluster: 0,
        }
        points.push(point);
        $('.scatter-plot').append('<div id="' + index + '" class="dot"></div>');
        $('#'+index).css('left',positionX/displayWidth*100+'%');
        $('#'+index).css('bottom',positionY/displayHeight*100+'%');
        index++;

    }
}

function getRandom() {
    var rand = 0;
  
    for (var i = 0; i < 6; i += 1) {
      rand += Math.random();
    }
  
    return rand / 6;
}



