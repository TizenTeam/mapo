
// cf: https://davidwalsh.name/demo/camera.php

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
	// Grab elements, create settings, etc.
	var canvas = document.getElementById('canvas');
	var snap_filename = document.getElementById('snap_filename');
	var context = canvas.getContext('2d');
	var video = document.getElementById('video');
	var mediaConfig = {
		video : true
	};
	var errBack = function(e) {
		console.log('An error has occurred!', e)
	};

	// Put video listeners into place
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		});
	}

	/* Legacy code below! */
	else if (navigator.getUserMedia) { // Standard
		navigator.getUserMedia(mediaConfig, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(mediaConfig, function(stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	} else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
		navigator.mozGetUserMedia(mediaConfig, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}

	// recupere une string qui represente la position
	function getLocationStr() {
		var tag = fromLatLonToTag($("#lat").val(), $("#lon").val());
		return tag;
	}
	
	function save_canvas(filename) {
		// https://developer.tizen.org/ko/community/code-snippet/web-code-snippet/save-canvas-image-file-system-and-copy-file-other-place-and-update-content-system.?langredirect=1
		var duri = canvas.toDataURL();
		var data = duri.substr(duri.indexOf(',')+1);

		var onerror = function(err) {
			console.log(err.name + " : " + err.message)
		}
		var onsuccess = function(dir) {
			var f = dir.createFile(filename);
			f.openStream("w", function (stream) {
				stream.writeBase64(data);
				stream.close();
				tizen.content.scanFile(f.toURI());
			}, onerror, "UTF-8");
		}
		
		tizen.filesystem.resolve("images", onsuccess, onerror, "rw");
	}
	
	function getSnapFilename() {
		var today = new Date();
		var yyyymmdd = today.toISOString().substring(0, 10);
		var hhmmss = today.toISOString().substring(11, 19);
		var locationstr = getLocationStr();
		var filename = "snap_" + yyyymmdd +"_"+ hhmmss +"_"+ locationstr +".png";
		return filename;
	}
	
	// Trigger photo take
	document.getElementById('snap').addEventListener('click', function() {
		context.drawImage(video, 0, 0, 320, 240);
		var filename = getSnapFilename();
		snap_filename.innerHTML = "File: "+ filename;
			
		save_canvas(filename);
	});

	
}, false);
