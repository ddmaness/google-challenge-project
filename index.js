// Array of pixels
var gridArr = [];

// Has this been turned into a nonogram
var nonogram = false;

// How many tiles to eliminate before winning?
var tilesToEliminate = 0;

// How many tiles have been found?
var tilesFound = 0;


// Makes grid based on user settings
function makeGrid() {
	var grid = $('#grid');
	// Capture grid height and width and limit it to 1 to 30
	var height = Number($('#grid-height').val());
	$('#win').removeClass('win-is-visible');
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
	// Reset game variables
	grid.html('');
	gridArr = [];
	tilesFound = 0;
	nonogram = false;
	// Construct grid in dom and gridArr variable
	grid.prepend('<div id=\'y-numbers\'</div>');
	for (var x = 0; x < width + 1; x++){
		x == 0 ? $('#y-numbers').append('<div id=\'corner\'></div>') : 
			$('#y-numbers').append('<div id=\'column-'+ (x - 1) +'\'><ul></ul></div>');
	}
	for (var y = 0; y < height; y++){
		grid.append('<div id='+ y +'-row></div>');
		gridArr.push([]);
		for (var x = 0; x < width + 1; x++){
			if (x === 0){
				$('#'+ y +'-row').append('<div id=\'row-'+ y +'\'><ul></ul></div>');
			}
			else{
				$('#'+ y +'-row').append('<div class=\'pixel '+ (x - 1) +'\' data-isPixel = \'false\' data-y='+ y +' data-x='+ (x - 1) +' onclick=\'handlePixel(this)\'></div>');
				gridArr[y].push(0);
			}
		}
	}
	// Append color picker and nonogramify buttons
	$('#grid').append('<div id="color-picker"><p>Color Picker</p><input id="grid-color" type="color"></div><button id="nonogramify"  onclick="nonogramify()">Create Nonogram</button>');
}

// Handle pixel clicks
function handlePixel(e){
	// Capture x and y coordinates of the selected pixel
	var pixel = $(e);
	var yCoord = pixel.attr('data-y');
	var xCoord = pixel.attr('data-x');
	// If still making pixel art set background to selected color
	if (!nonogram){
		if(pixel.attr('data-isPixel') == 'true') {
			pixel.attr('data-isPixel', 'false');
			pixel.css('background-color', 'transparent');
			gridArr[yCoord][xCoord] = 0;
		}
		else{
			pixel.attr('data-isPixel', 'true');
			var color = $('#grid-color').val();
			pixel.css('background-color', color);
			gridArr[yCoord][xCoord] = 1;
		}
	}
	// If the nonogram game is active check to see if the selected tile is a pixel or not
	// If it not a pixel remove the tile cover. If it is, mark as incorrect
	else {
		if(pixel.attr('data-isPixel') == 'true') {
			pixel.addClass('incorrect');
		}
		else if (pixel.hasClass('tile')) {
        	tilesFound++;
			pixel.removeClass('tile');
         	if(tilesToEliminate === tilesFound) {
                $('.pixel').removeClass('tile');
                $('.pixel').removeClass('incorrect');   
				$('#win').addClass('win-is-visible');
			}
		}
	}
}

// Cover pixel art with tiles and add logic for nonogram game
function nonogramify() {
	$('#nonogramify').remove();
	$('#color-picker').remove();
	nonogram = true;
	tilesToEliminate = countPixels(gridArr);
	var tile = $('.pixel');
	var colVal = 0;
	var rowVal = 0;
	tile.addClass('tile');
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
}

// Count the number of missing pixels that the user has to find to win
function countPixels(grid) {
	var total = 0;
	grid.forEach(function(arrElem) {
		arrElem.forEach(function(elem){
			if (!elem) {
				total++;
			}
		});
	});
	return total;
}