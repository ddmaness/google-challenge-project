var gridArr = [];
var nonogram = false;
var tilesToEliminate = 0;
var tilesFound = 0;

function makeGrid() {
    var grid = $('#grid');
    var height = Number($('#grid-height').val());
    gridArr = [];
    tilesFound = 0;
    nonogram = false;
    if (height > 30) {
        height = 30;
    }
    if (height < 1) {
        height = 1;
    }
    var width = Number($('#grid-width').val());
    if (width > 30) {
        width = 30;
    }
    if (width < 1) {
        width = 1;
    }
    grid.html('');
    grid.prepend('<div id=\'y-numbers\'</div>')
    for (var x = 0; x < width + 1; x++){
        x == 0 ? $('#y-numbers').append('<div id=\'corner\'></div>') : 
        $('#y-numbers').append('<div id=\'column-'+ (x - 1) +'\'><ul></ul></div>')
      }
    for (var y = 0; y < height; y++){
      grid.append('<div id='+ y +'-row></div>');
      gridArr.push([]);
      for (var x = 0; x < width + 1; x++){
        if (x === 0){
            $('#'+ y +'-row').append('<div id=\'row-'+ y +'\'><ul></ul></div>')
        }
        else{
            $('#'+ y +'-row').append('<div class=\'pixel '+ (x - 1) +'\' data-isPixel = \'false\' data-y='+ y +' data-x='+ (x - 1) +' onclick=\'handlePixel(this)\'></div>')
            gridArr[y].push(0);
        }
      }
    }
    $('body').append('<button id="nonogramify"  onclick="nonogramify()">Create Nonogram</button>')
}

function handlePixel(e){
    var pixel = $(e);
    var yCoord = pixel.attr('data-y');
    var xCoord = pixel.attr('data-x');
    if (!nonogram){
        if(pixel.attr('data-isPixel') == 'true') {
            pixel.attr('data-isPixel', 'false');
            pixel.css('background-color', 'transparent')
            gridArr[yCoord][xCoord] = 0;
        }
        else{
            pixel.attr('data-isPixel', 'true');
            var color = $('#grid-color').val();
            console.log(color)
            pixel.css('background-color', color);
            gridArr[yCoord][xCoord] = 1;
        }
    }
    else {
        if(pixel.attr('data-isPixel') == 'true') {
            pixel.addClass('incorrect');
        }
        else {
        	tilesFound++;
            pixel.removeClass('tile');
         	if(tilesToEliminate === tilesFound) {
        		$('.pixel').removeClass('tile');
        	}
        }
    }
}

function nonogramify() {
    nonogram = true;
    var tile = $('.pixel')
    var colVal = 0;
    var rowVal = 0;
    tile.addClass('tile')
    for (var y = 0; y < gridArr.length; y++) {
        for (var x = 0; x < gridArr[0].length; x++){
            if(gridArr[y][x] === 0) {
                rowVal++;
            }
            if (gridArr[y][x] !== 0 || x === (gridArr[0].length - 1)) {
                if (rowVal !== 0){
                    $('#row-'+y).children('ul').append('<li>'+rowVal+'</li>');
                }
                rowVal = 0;
            }
        }
    }
    for (var y = 0; y < gridArr[0].length; y++) {
        for (var x = 0; x < gridArr.length; x++){
            if(gridArr[x][y] === 0) {
                colVal++;
            }
            if (gridArr[x][y] !== 0 || x === (gridArr.length - 1)) {
                if (colVal !== 0){
                    $('#column-'+y).children('ul').append('<li>'+colVal+'</li>');
                }
                colVal = 0;
            }
        }
    }
    tilesToEliminate = countPixels(gridArr);
    $('#nonogramify').remove();
}


function countPixels(grid) {
	var total = 0;
	grid.forEach(function(arrElem) {
		arrElem.forEach(function(elem){
			if (!elem) {
				total++
			}
		});
	});
	return total;
}