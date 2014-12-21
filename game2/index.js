window.onload = function () {

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    var left = ((window.innerWidth - window.innerHeight) / 2);
    canvas.style.left = "" + left + "px";

    var context = canvas.getContext("2d");

    var maxSprays = 100;

    var maxSpiderDuration = 500;
    var minSpiderDuration = 200;
    var spiderDuration = maxSpiderDuration;

    var score = 0;
    var remainingSprays = maxSprays;
    var spiderTime = 0;

    var bg1 = document.getElementById("bg1");
    var bg2 = document.getElementById("bg2");
    var bg3 = document.getElementById("bg3");
    var spider = document.getElementById("spider");
    var spray = document.getElementById("spray");
    var spraycan = document.getElementById("spraycan");

    var gameOver = document.getElementById("gameover");
    var scoreDiv = document.getElementById("score");
    var remainingSpraysDiv = document.getElementById("remainingSprays");

    var bg = bg1;
    var can = spraycan;

    var spiderSize = 0.2 * canvas.height;
    var showSpider = false;

    var isGameOver = false;

    var loop = function() {

        context.fillStyle = "white";
        context.beginPath();
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();
        
        context.drawImage(bg, 0, 0, canvas.width, canvas.height);

        if (showSpider) {

            var currentTime = new Date().getTime();
            var timeSinceSpider = currentTime - spiderTime;
            var spiderState = 1 - timeSinceSpider / spiderDuration;

            var size = Math.max(1, spiderState * spiderSize);
            
            var x = 0.4 + spiderState * 0.1;
            var y = 0.6 + spiderState * 0.2;
            
            context.drawImage(spider, canvas.width * x - size / 2, canvas.height * y - size / 2, size, size);
        }

        context.drawImage(can, 0, 0, canvas.width, canvas.height);

        window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) { setTimeout(callback, 16); };
    window.requestAnimationFrame(loop);

    canvas.addEventListener("touchstart", function (e) {
        
        if (isGameOver) {
            gameOver.style.display = "none";
            isGameOver = false;
            score = 0;
            remainingSprays = maxSprays;
            spiderDuration = maxSpiderDuration;
            setScreenTexts();
            return;
        }

        if (can == spraycan && remainingSprays > 0 && !isGameOver) {
            
            // spray
            can = spray;
            window.setTimeout(function() {
                can = spraycan;
            }, 200);
            
            // check for the spider
            if (showSpider) {
                // hit
                score++;
            }

            remainingSprays--;

            spiderDuration = minSpiderDuration + (remainingSprays / maxSprays) * (maxSpiderDuration - minSpiderDuration);

            if (remainingSprays == 0) {
                gameOver.style.display = "block";
                isGameOver = true;
            }

            setScreenTexts();
        }

        e.preventDefault();
    }, false);
    
    function setScreenTexts() {
        scoreDiv.innerText = "Spiders: " + score;
        remainingSpraysDiv.innerText = "Spray Can: " + Math.round(remainingSprays / maxSprays * 100) + "%";
    }

    window.goLeft = function () {
        if (isGameOver)
            return;
        if (bg == bg1) {
            bg = bg3;
        }
        else if (bg == bg2) {
            bg = bg1;
        }
        else if (bg == bg3) {
            bg = bg2;
        }
        onWalked();
    };

    window.goRight = function () {
        if (isGameOver)
            return;
        if (bg == bg1) {
            bg = bg2;
        }
        else if (bg == bg2) {
            bg = bg3;
        }
        else if (bg == bg3) {
            bg = bg1;
        }
        onWalked();
    };
    
    function onWalked() {

        if (Math.random() < 0.33) {
            showSpider = true;
            spiderTime = new Date().getTime();
            setTimeout(function() {
                showSpider = false;
            }, spiderDuration);
        }
    }
};