$('#loader').css('display', 'none');

initListeners(0);

for(let i=1; i<5; i++){
    addCluster();
}

fillColors();

createClusters();

Graphics.drawResults([0, 0, 0, 0], 0);

$('#chosenEpsInput').val(chosenEps);
$('#epsForOptics').val(55);
$('#NminForOptics').val(50);
$('#NminForOptics').change(function(){
    Nmin = $('#NminForOptics').val();
})


$('#generateClustersBtn').click(function(){

    $('#loader').show();
    setTimeout(function(){
        confirmClusterSelection();
        $('#loader').hide();
    }, 10);
      
    $('#runGradientClustering').prop('disabled', true);
    $('#mergeSimilarClusters').prop('disabled', true);
    $('#displayGCClusters').prop('disabled', true);
    //Graphics.drawResults([0, 1, 2, 3], chosenEps);
});

$('#runOpticsBtn').click(function(){
    $('#loader').show();
    $('#chosenEpsInput').val(chosenEps);
    
    setTimeout(function(){
        optics();
        $('#loader').hide();
    }, 10);

    $('#runGradientClustering').prop('disabled', false);
    
});

$('#runGradientClustering').click(function(){
    if(orderedReachList.length > 0){
        gradientClustering();
        $('#mergeSimilarClusters').prop('disabled', false);
    }
        
});

$('#mergeSimilarClusters').click(function(){
    if(orderedReachList.length > 0){
        gradientClustering();
        mergeSimilarClusters();
        $('#displayGCClusters').prop('disabled', false);
        console.log(startEndPoints);
        Graphics.addMergedClusters(startEndPoints);
    }
});

$('#displayGCClusters').click(function(){
    colorPointsByGCClusters();
});

$('#chosenEpsInput').change(function(){
    chosenEps = $('#chosenEpsInput').val();
    Graphics.updateEpsLine(chosenEps);
    findClusters();
    colorClusters();
});


    
