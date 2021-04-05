
const w = 0.5;
const t = Math.cos(165*Math.PI/180);
const noiseValue = 32000;
const mergePerc = 0.7;

var orderedReachListGC;
var startEndPoints = [];
var setOfClusters = [];

function gradientClustering(){
    
    orderedReachListGC = Array.from(orderedReachList);

    orderedReachListGC.forEach(function(point, i){
        if(orderedReachListGC[i] == 0)
            orderedReachListGC[i] = noiseValue;
    });

    var startPoints = [0];
    var length = orderedReachListGC.length-1;
    var currCluster = [];
    var tempCluster = [];
    var lastEnd = length;

    setOfClusters = [];

    for(let i=1; i<length; i++){
        if(inflectionIndex(i) > t){
            if(gradientDeterminant(i) > 0){

                if(currCluster.length >= Nmin-1){
                    setOfClusters.push(currCluster);
                }
                
                currCluster = [];

                if(startPoints.length != 0){                    
                    if(orderedReachListGC[startPoints[startPoints.length-1]] <= orderedReachListGC[i]){
                        startPoints.pop();
                    }
                }

                if(startPoints.length != 0){                    
                    while(orderedReachListGC[startPoints[startPoints.length-1]] < orderedReachListGC[i]){
                        tempCluster = generateSeq(startPoints.pop(), lastEnd);
                        if(tempCluster.length >= Nmin-1){
                            setOfClusters.push(tempCluster);
                        }
                    }

                    

                    tempCluster = generateSeq(startPoints[startPoints.length-1], lastEnd);
                    if(tempCluster.length >= Nmin-1){
                        setOfClusters.push(tempCluster);
                    }
                }
                
                
                if(orderedReachListGC[i+1] < orderedReachListGC[i]){
                    startPoints.push(i);
                }

            }else{
                if(orderedReachListGC[i+1] > orderedReachListGC[i]){
                    lastEnd = i + 1;
                    if(startPoints.length == 0)
                        currentCluster = generateSeq(0,lastEnd);
                    else
                        currentCluster = generateSeq(startPoints[startPoints.length-1], lastEnd);
                }
            }
        }
    }

    while(startPoints.length > 0){

        currCluster = generateSeq(startPoints[startPoints.length-1], length);

        if(orderedReachListGC[startPoints[startPoints.length-1]] > orderedReachListGC[length-1] && currCluster.length >= Nmin-1)
            setOfClusters.push(currCluster);

        startPoints.pop();
    }

    startEndPoints = [];
    for( var i = 0; i < setOfClusters.length; i++){ 
        startEndPoints.push([setOfClusters[i][0], setOfClusters[i][setOfClusters[i].length-1]]);   
    }
    removeNoiseFromStartEnd();
    removeClustersOverNoise();

    //console.log(setOfClusters);
    Graphics.addClustersLines(startEndPoints);
}


////// helper functions ///////////////

function generateSeq(start, end){
    var out = [];
    for(let i=start; i<=end; i++){
        out.push(i);
    }
    return out;
}

function inflectionIndex(pointIndex){

    var x_r = orderedReachListGC[pointIndex-1];
    var y_r = orderedReachListGC[pointIndex];
    var z_r = orderedReachListGC[pointIndex+1];

    var prev_vector = reachabilityVector(x_r, y_r);
    var next_vector = reachabilityVector(y_r, z_r);

    return (-w*w + (x_r-y_r)*(z_r-y_r))/(prev_vector*next_vector);
}

function reachabilityVector(rx, ry){
    return Math.sqrt((ry-rx)*(ry-rx) + w*w);
}

function gradientDeterminant(pointIndex){
    var x_r = orderedReachListGC[pointIndex-1];
    var y_r = orderedReachListGC[pointIndex];
    var z_r = orderedReachListGC[pointIndex+1];

    return w*(y_r-x_r) - w*(z_r-y_r);
}

function removeClustersOverNoise(){
    var i = 0;
    var hasNoise
    while(i < setOfClusters.length){
        hasNoise = false;
        
        for(var j=startEndPoints[i][0]; j<startEndPoints[i][1]; j++){
            if(orderedReachList[j] == 0){
                hasNoise = true;
                break;
            }
        }

        if(hasNoise){
            startEndPoints.splice(i,1);
            setOfClusters.splice(i,1);
        }else{
            i++;
        }
        
    }
}

function removeNoiseFromStartEnd(){
    var i = 0;
    while(i < startEndPoints.length){
        if(orderedReachList[startEndPoints[i][0]] == 0){
            setOfClusters[i].shift();
            startEndPoints[i][0]++;
            continue;
        }
        if(orderedReachList[startEndPoints[i][1]] == 0){
            startEndPoints[i][1]--;
            setOfClusters[i].pop();
            continue;
        }  
        i++;
    }
}

function mergeSimilarClusters(){
    var i = 0;
    var j;
    var largerClusterSize, smallerClusterSize;

    startEndPoints.sort(function(a,b){
        return (a[1]-a[0])-(b[1]-b[0]);
    });

    while(i<startEndPoints.length-1){
        j = i + 1;
        while(j < startEndPoints.length){
            if(startEndPoints[i][0] >= startEndPoints[j][0] && startEndPoints[i][1] <= startEndPoints[j][1]){
                largerClusterSize = startEndPoints[j][1] - startEndPoints[j][0];
                smallerClusterSize = startEndPoints[i][1] - startEndPoints[i][0]
            
                if(smallerClusterSize >= largerClusterSize*mergePerc){
                    startEndPoints.splice(i, 1);
                    setOfClusters.splice(i,1);
                    j = i + 1;
                    continue;
                }           
            }
            j++;
        }
        i++;
    }
}

function colorPointsByGCClusters(){
    for(let i=0; i<points.length; i++){
        $('#'+points[i].index).css("background", colors[0]);
    }

    for(let i=startEndPoints.length-1; i>=0; i--){
        for(let j=0; j<points.length; j++){
            if(points[j].order >= startEndPoints[i][0] && points[j].order <= startEndPoints[i][1]){
                $('#'+points[j].index).css("background", myLineChart.data.datasets[i+2].borderColor);
            }
        }
    }
}
