window.onload = function() {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var context = canvas.getContext("2d");

    var bg = document.getElementById("bg");
    var overlay = document.getElementById("overlay");

    var scaleX = canvas.width / bg.width;
    var scaleY = canvas.height / bg.height;

    var resolutionY = 40;
    var resolutionX = Math.round(resolutionY * canvas.width / canvas.height);

    var startX = 115 * scaleX;
    var startY = 40 * scaleY;
    var overlayWidth = overlay.width * scaleX;
    var overlayHeight = overlay.height * scaleY;
    var rectWidth = overlayWidth / resolutionX;
    var rectHeight = overlayHeight / resolutionY;

    var clean = [];

    var gameOver = false;

    var startTime = 0;
    var time = 0;

    function reset() {
        gameOver = false;
        startTime = new Date().getTime();
        for (var y = 0; y < resolutionY; ++y) {
            for (var x = 0; x < resolutionX; ++x) {
                clean[y * resolutionX + x] = false;
            }
        }
    }

    canvas.addEventListener("touchstart", function (e) {

        if (gameOver) {
            reset();
        }
        
        e.preventDefault();
    }, false);    

    canvas.addEventListener("touchmove", function (e) {

        if (gameOver)
            return;

        var screenX = e.changedTouches[0].pageX;
        var screenY = e.changedTouches[0].pageY;

        var overlayX = screenX - startX;
        var overlayY = screenY - startY;

        var x = Math.round(overlayX / rectWidth);
        var y = Math.round(overlayY / rectHeight);

        var halfFingerSize = Math.round(scaleY * 40 / rectHeight);

        for (var iy = y - halfFingerSize; iy < y + halfFingerSize; ++iy) {
            for (var ix = x - halfFingerSize; ix < x + halfFingerSize; ++ix) {

                var distanceX = Math.abs(ix - x);
                var distanceY = Math.abs(iy - y);
                var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance < halfFingerSize) {
                    if (ix >= 0 && iy >= 0 && ix < resolutionX && iy <= resolutionY) {
                        // hit overlay
                        clean[iy * resolutionX + ix] = true;
                    }
                }
            }
        }

        var isClean = true;
        for (var i = 0; i < clean.length; ++i) {
            if (!clean[i]) {
                isClean = false;
                break;
            }
        }
        if (isClean) {
            gameOver = true;
            time = new Date().getTime() - startTime;
        }

        e.preventDefault();
    }, false);
    
    function loop() {

        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();

        context.drawImage(bg, 0, 0, canvas.width, canvas.height);

        for (var y = 0; y < resolutionY; ++y) {
            for (var x = 0; x < resolutionX; ++x) {
                if (!clean[y * resolutionX + x]) {
                    context.drawImage(overlay,
                        x * rectWidth, y * rectHeight, rectWidth, rectHeight,
                        startX + x * rectWidth, startY + y * rectHeight, rectWidth, rectHeight);
                }
            }
        }
        
        if (gameOver) {
            context.font = "2em Arial";
            context.fillStyle = "Red";
            context.textAlign = "center";
            context.fillText("Your time is " + Math.round((time / 1000) * 100) / 100 + "s", canvas.width / 2, canvas.height / 2);

            context.font = "1.5em Arial";
            context.fillText("Tap to start", canvas.width / 2, canvas.height / 2 + 50 * scaleY);
        }

        window.requestAnimationFrame(loop);
    }

    reset();
    
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) { window.setTimeout(callback, 16); };
    window.requestAnimationFrame(loop);
};