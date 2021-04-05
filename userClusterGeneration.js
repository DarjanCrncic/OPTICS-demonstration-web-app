function addCluster(){
    maxId = 0;
    $('.clusterHolderInner').each(function(i, element){
        const id = parseInt(element.id.split('_')[1]);
        if(id > maxId){
            maxId = id;
        }
    });
    maxId++;
    $('.clusterHolder').append(
        '<div class="clusterHolderInner row" id="clusterHolderInner_'+ maxId +'"><div class="col-sm-2 buttonDivAddNewClusters"> <button id="removeButton_'+ maxId +'" onclick="removeCluster(this.id)">Remove</button></div>\
        <div class="col-sm-5"><label for="sizeSlider_'+ maxId +'">Cluster Size:</label><span id="spanSize_'+ maxId +'">0</span><div class="slidecontainer"><input type="range" min="10" max="1000" value="500" class="slider" id="sizeSlider_'+ maxId +'"></div></div>\
        <div class="col-sm-5"><label for="widthSlider_'+ maxId +'">Cluster Width:</label><span id="spanWidth_'+ maxId +'">0</span><div class="slidecontainer"><input type="range" min="10" max="1000" value="500" class="slider" id="widthSlider_'+ maxId +'"></div></div>\
        </div>'
    );
    
    initListeners(maxId);
}

function removeCluster(identifier){
    const id = identifier.split('_')[1];
    $('#clusterHolderInner_'+id).remove();
}

function initListeners(id){
    $('#spanSize_'+id).text($('#sizeSlider_'+id).val());
    $('#spanWidth_'+id).text($('#widthSlider_'+id).val());

    $('#sizeSlider_'+id).change(function(){
        $('#spanSize_'+id).text($(this)[0].value);
    });

    $('#widthSlider_'+id).change(function(){
        $('#spanWidth_'+id).text($(this)[0].value);
    });
}

function confirmClusterSelection(){
    clusters = [];
    points = [];
    clusterSize = [];
    clusterWidth = [];

    numOfClusters = 0;
    
    $('.clusterHolderInner').each(function(i, element){
        const id = element.id.split('_')[1];
        numOfClusters++;
        clusterSize.push($('#sizeSlider_'+id).val());
        clusterWidth.push($('#widthSlider_'+id).val());
    });

    noiseSize = $('#sizeSlider_0').val();

    $('.scatter-plot').empty();
    createClusters();

}