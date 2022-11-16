var canvasId = 'bitmap';

var constants = {
	MAX_HEIGHT : 250
}

var settings = {
	numFrames : 6,
	label : 'TURN DOWN FOR WHAT',
	delay : 33
}

window.onload = function() {

	var canvas = document.getElementById(canvasId);
	var ctx = canvas.getContext('2d');
	var gif, image, generateInt;
	var frames = settings.numFrames;
	var width = -1;
	var height = -1;

	//ctx.fillStyle = 'white';
	//ctx.fillRect(0,0,canvas.width, canvas.height);

	var createImage = function(url) {

		gif = new GIFEncoder();
		gif.setRepeat(0);
		gif.setDelay(settings.delay);

		image = new Image();

		image.onload = function() {
		
			$('#upload').show();

			width = image.width;
			height = image.height;
			
			canvas.width = width + (width * 0.1);
			canvas.height = height + (height * 0.1);

			createFrames();
		}
		image.src = url;
	}

	var createFrames = function() {

		gif.start();
		gif.setSize(canvas.width, canvas.height);
		gif.setTransparent(0x0);

		for(var i = 0; i < settings.numFrames; i++) {
				
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var shift = {
				x : (width * 0.3) + (Math.random() * (width * 0.2) - (width * 0.4)),
				y : (height * 0.3) + (Math.random() * (height * 0.2) - (height * 0.4))
			}
			var pos = {
				x : width + 40,
				y : height + 40
			}
			
			//ctx.fillStyle = 'black';
			//ctx.fillRect(0,0,canvas.width, canvas.height);

			ctx.drawImage(image, 0, 0, width, height, shift.x, shift.y, width, height);
			// ctx.font = "bold 22px Arial";
			// ctx.strokeStyle = 'black';
			// ctx.lineWidth = 8;
			// ctx.lineJoin = "round";
			// ctx.strokeText(settings.label, 20, canvas.height - 20);
			// ctx.fillStyle = 'white';
			// ctx.fillText(settings.label, 20, canvas.height - 20);

			gif.addFrame(ctx, false);
		}

			gif.finish();

			var binary_gif = gif.stream().getData(); //notice this is different from the as3gif package!
	  		var data_url = 'data:image/gif;base64,' + encode64(binary_gif);

	  		document.getElementById('image').src = data_url;
	}

	// Hard coded image for now
	//createImage('images/sloth.jpg');

	function handleDragOver(e) {
		e.stopPropagation();
    	e.preventDefault();
    	e.dataTransfer.dropEffect = 'copy';    	
	}

	function handleFileSelect(e) {
		
		e.stopPropagation();
    	e.preventDefault();

    	var files = e.dataTransfer.files;

		var output = [];
		for (var i = 0, f; f = files[i]; i++) {

			var reader = new FileReader();

			reader.onload = (function(theFile) {
				return function(e) {
					createImage(e.target.result);
				}
			})(f);
			reader.readAsDataURL(f);
		}
	}

	var dropZone = document.getElementById('dropbox');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
}

$(function() {

    var $post = $('#upload');
    var $img = $('#image');

    $post.click(function(e) {
    	
    	e.preventDefault();
		e.stopPropagation();

    	$.ajax({
			url: 'https://api.imgur.com/3/image',
			type: 'POST',
			headers: {
				Authorization: 'CLIENT-ID e781a07d0760a0a'
			},
			data: {
				type: 'base64',
				image: $img.attr('src').split(',')[1]
			},
			dataType: 'json'
		}).success(function(result) {
			window.location = 'https://imgur.com/gallery/' + result.data.id;
		}).error(function() {
			alert('Could not reach api.imgur.com. Sorry :(');
		});
    });
});