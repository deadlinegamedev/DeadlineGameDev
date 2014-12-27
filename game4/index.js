window.onload = function() {

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var context = canvas.getContext("2d");

    var birdUp = document.getElementById("bird_up");
    var birdDown = document.getElementById("bird_down");
    var ground = document.getElementById("ground");
    var insect = document.getElementById("insect");

    var scale = canvas.height / 480;

    var speed = canvas.height;
    var distance = 0;

    var birdX = canvas.width * 0.1;
    var birdY = canvas.height * 0.1;
    var minBirdY = 0;
    var maxBirdY = canvas.height;
    
    var birdVelocity = 0;
    var minBirdVelocity = -800 * scale;
    var maxBirdVelocity = 500 * scale;

    var birdAcceleration = 150 * 9.81 * scale;

    var lastTime = new Date().getTime();

    var liveInsects = [];

    var gameOver = true;

    var additionalScore = 0;

    canvas.addEventListener("touchstart", function (e) {

        if (!gameOver) {
            birdVelocity = minBirdVelocity;
        } else {
            gameOver = false;
            lastTime = new Date().getTime();
            birdVelocity = 0;
            birdY = canvas.height * 0.1;
            liveInsects = [];
            additionalScore = 0;
            distance = 0;
        }

        e.preventDefault();
    }, false);

    var loop = function () {

        context.beginPath();
        context.fillStyle = "skyblue";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();
        
        // draw

        var groundHeight = ground.height * scale;
        var groundWidth = ground.width * scale;
        for (var i = 0; i < canvas.width / groundWidth + 2; ++i) {
            var x = distance % groundWidth;
            context.drawImage(ground, i * groundWidth - x, canvas.height - groundHeight, groundWidth, groundHeight);
        }

        var insectWidth = insect.width * scale;
        var insectHeight = insect.height * scale;
        for (var i = 0; i < liveInsects.length; ++i) {
            var item = liveInsects[i];
            context.drawImage(insect, item.x, item.y, insectWidth, insectHeight);
        }

        var birdImage = birdDown;
        var birdWidth = birdUp.width * scale;
        var birdHeight = birdUp.height * scale;
        context.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

        context.fillStyle = "black";
        
        if (gameOver) {
            context.font = "3em Arial";
            context.textAlign = "center";
            context.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
        }

        var score = distance / scale / 30 + additionalScore;
        context.font = "2em Arial";
        context.textAlign = "right";
        context.fillText("" + Math.round(score), canvas.width - 10 * scale, canvas.height - 10 * scale);

        // update positions etc.
        
        var now = new Date().getTime();
        var elapsedTime = now - lastTime;
        var elapsedSeconds = elapsedTime / 1000;
        lastTime = now;

        if (!gameOver) {
            distance += speed * elapsedSeconds;

            birdVelocity += birdAcceleration * elapsedSeconds;
            birdVelocity = Math.min(birdVelocity, maxBirdVelocity);
            birdVelocity = Math.max(birdVelocity, minBirdVelocity);

            birdY += birdVelocity * elapsedSeconds;
            birdY = Math.min(birdY, maxBirdY);
            birdY = Math.max(birdY, minBirdY);

            for (var i = 0; i < liveInsects.length; ++i) {
                var item = liveInsects[i];
                item.x -= speed * elapsedSeconds;
                var isLeft = item.x < -insectWidth;

                var isEaten = Math.abs(birdY + birdHeight * 0.4 - (item.y + insectHeight / 2)) < insectHeight && Math.abs(birdX + birdWidth * 0.8 - item.x) < insectWidth;
                
                if (isEaten) {
                    additionalScore += 100;
                }

                var deleteInsect = isLeft || isEaten;

                if (deleteInsect) {
                    liveInsects.splice(i, 1);
                    --i;
                }
            }

            if (birdY > canvas.height - groundHeight) {
                gameOver = true;
            }
        }

        window.requestAnimationFrame(loop);
    };

    function addInsect() {
        if (gameOver)
            return;
        
        var insectHeight = insect.height * scale;
        var groundHeight = ground.height * scale;
        liveInsects.push({
            x: canvas.width,
            y: (canvas.height - insectHeight - groundHeight) * Math.random()
        });
    }
    
    window.setInterval(addInsect, 1000);

    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) { window.setTimeout(callback, 16); };
    window.requestAnimationFrame(loop);
};