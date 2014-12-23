window.onload = function() {

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var context = canvas.getContext("2d");

    var bg = document.getElementById("bg");
    var customer = document.getElementById("customer");
    var fruitNames = [
        "banana",
        "apple",
        "pineapple",
        "orange"
    ];
    
    var fruits = {
        "banana": document.getElementById("banana"),
        "apple": document.getElementById("apple"),
        "pineapple": document.getElementById("pineapple"),
        "orange": document.getElementById("orange")
    };

    var order;

    var blenderContent = [];

    var scaleX = canvas.width / bg.width;
    var scaleY = canvas.height / bg.height;

    context.font = "1em Arial";

    var money = 0;

    var orderStart;
    var orderTimeout;
    var newOrderTimeout;

    var maxWaitTime = 5;

    var randomFruitPositions = [
        {
            x: Math.floor((Math.random() - 0.5) * 10 * scaleX),
            y: 0
        },
        {
            x: Math.floor((Math.random() - 0.5) * 10 * scaleX),
            y: -15 * scaleY
        },
        {
            x: Math.floor((Math.random() - 0.5) * 10 * scaleX),
            y: -30 * scaleY
        },
        {
            x: Math.floor((Math.random() - 0.5) * 10 * scaleX),
            y: -45 * scaleY
        }
    ];

    canvas.addEventListener("touchstart", function (e) {

        var y = 65 * scaleY;

        var bananaX = 460 * scaleX;
        var appleX = 545 * scaleX;
        var pineappleX = 645 * scaleX;
        var orangeX = 735 * scaleX;

        var touchX = e.changedTouches[0].pageX;
        var touchY = e.changedTouches[0].pageY;

        var offset = 30 * scaleY;
        
        if (Math.abs(touchY - y) < offset) {
            if (Math.abs(touchX - bananaX) < offset) {
                addFruit("banana");
            }
            if (Math.abs(touchX - appleX) < offset) {
                addFruit("apple");
            }
            if (Math.abs(touchX - pineappleX) < offset) {
                addFruit("pineapple");
            }
            if (Math.abs(touchX - orangeX) < offset) {
                addFruit("orange");
            }
        }
        
        if (Math.abs(touchX - 473 * scaleX) < offset && Math.abs(touchY - 305 * scaleY) < offset) {
            blend();
        }

        e.preventDefault();
    }, false);
    
    function newOrder() {

        order = [];

        var availableFruits = fruitNames.slice(0);

        var count = Math.floor(Math.random() * availableFruits.length) + 1;
        
        for (var i = 0; i < count; ++i) {
            var fi = Math.floor(Math.random() * availableFruits.length);
            var fruit = availableFruits[fi];
            order.push(fruit);
            availableFruits.splice(fi, 1);
        }

        orderStart = new Date().getTime();
        orderTimeout = window.setTimeout(queueNewOrder, maxWaitTime * 1000);
    }
    
    function queueNewOrder() {
        order = undefined;

        window.clearTimeout(newOrderTimeout);
        newOrderTimeout = 0;
        
        window.clearTimeout(orderTimeout);
        orderTimeout = 0;

        newOrderTimeout = window.setTimeout(newOrder, 1000);
    }
    
    function blend() {

        var fail = false;

        if (typeof(order) === 'undefined') {
            fail = true;
        } else {
            for (var i = 0; i < order.length; ++i) {
                var contains = false;
                for (var k = 0; k < blenderContent.length; ++k) {
                    if (blenderContent[k] == order[i]) {
                        contains = true;
                        break;
                    }
                }
                if (!contains) {
                    fail = true;
                }
            }

            for (var i = 0; i < blenderContent.length; ++i) {
                var contains = false;
                for (var k = 0; k < order.length; ++k) {
                    if (blenderContent[i] == order[k]) {
                        contains = true;
                        break;
                    }
                }
                if (!contains) {
                    fail = true;
                }
            }
        }

        if (fail) {
            // player gets no money
        } else {
            // player gets money
            money += 5;

            // tip depending on time spent
            var time = new Date().getTime();
            var duration = (time - orderStart) / 1000.0;
            var tip = (maxWaitTime - duration) / maxWaitTime;
            money += 5 * tip;
        }

        blenderContent = [];
        queueNewOrder();
    }
    
    function addFruit(fruit) {
        if (blenderContent.length < 4) {
            blenderContent.push(fruit);
        }
    }

    var render = function() {

        // clear screen
        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();

        context.drawImage(bg, 0, 0, canvas.width, canvas.height);
        if (typeof (order) !== 'undefined') {
            context.drawImage(customer, 0, 0, canvas.width, canvas.height);
        }

        context.fillStyle = "black";
        
        // draw the customers order
        context.textAlign = "start";
        context.font = "1em Arial";
        if (typeof(order) !== 'undefined') {
            for (var i = 0; i < order.length; ++i) {
                var x = 100 * scaleX;
                var y = 40 * scaleY;
                context.fillText(order[i], x, y + i * 30 * scaleY);
            }
        }

        // fruits in the blender
        for (var i = 0; i < blenderContent.length; ++i) {
            var x = 460 * scaleX;
            var y = 250 * scaleY;
            var w = scaleX * 60;
            var h = scaleY * 60;
            context.drawImage(fruits[blenderContent[i]], x - w / 2 + randomFruitPositions[i].x, y - h / 2 + randomFruitPositions[i].y, w, h);
        }

        context.textAlign = "end";
        context.font = "2.5em Arial";
        context.fillText("$ " + Math.round(money * 100) / 100, 730 * scaleX, 430 * scaleY);

        // render loop
        window.requestAnimationFrame(render);

    };

    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) { window.setTimeout(callback, 16); };
    window.requestAnimationFrame(render);

    queueNewOrder();
};