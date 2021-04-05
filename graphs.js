
var ctx = null;
var myLineChart = null;
var labels;
var epsLine;
var data;

const Graphics = {
    drawResults: function(drawData, drawEps){ 
        
        try{
            myLineChart.destroy()
            ctx = undefined;
          }catch(e){}

        labels = [];
        epsLine = [];
        data = [];
        
        const step = Math.round(drawData.length/10);
        
        for(let i=0; i<drawData.length; i++){
            labels.push(i);
            epsLine.push(drawEps);
        }
        

        data = {
            labels: labels,
            datasets: [{
                label: 'Reachability Curve',
                borderColor: '#204051',
                borderWidth: 2,
                fill: false,
                data: drawData
            },
            {
                label: 'Epsilon',
                borderColor: '#a31d18',
                borderWidth: 2,
                fill: false,
                data: epsLine
            }]
        }
        ctx = document.getElementById('myChart').getContext('2d');
        myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                elements: {
                    point:{
                        radius: 0
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0,
                            max: drawData.length,
                            stepSize: step
                        }
                    }]
                },
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: 'left'
                },
                animation: {
                    duration: 0
                }
            }
        });
    },

    updateEpsLine: function(drawEps) {
        myLineChart.data.datasets[1].data = [];

        for(let i=0; i<points.length; i++){
            myLineChart.data.datasets[1].data.push(drawEps);
        }
        myLineChart.update();
    },

    addClustersLines: function(setOfClusters){

        for(let i=0; i<setOfClusters.length; i++){
            myLineChart.data.datasets.push({
                label: false,
                borderColor: getRandomColor(),
                borderWidth: 2,
                fill: false,
            })
            myLineChart.data.datasets[i+2].data = [{
                x: setOfClusters[i][0],
                y: orderedReachList[setOfClusters[i][0]]
            }, {
                x: setOfClusters[i][setOfClusters[i].length-1],
                y: orderedReachList[setOfClusters[i][setOfClusters[i].length-1]]
            }];
        }


        myLineChart.update();
    },

    addMergedClusters: function(startEndPoints){
        while(myLineChart.data.datasets.length > 2){
            myLineChart.data.datasets.pop();
        }
        for(let i=0; i<startEndPoints.length; i++){
            myLineChart.data.datasets.push({
                label: false,
                borderColor: getRandomColor(),
                borderWidth: 2,
                fill: false,
            })
            myLineChart.data.datasets[i+2].data = [{
                x: startEndPoints[i][0],
                y: orderedReachList[startEndPoints[i][0]]
            }, {
                x: startEndPoints[i][1],
                y: orderedReachList[startEndPoints[i][1]]
            }];
        }
        myLineChart.update();
    }
}




