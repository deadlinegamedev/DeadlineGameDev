var remainingYearsYou = 5;
var remainingYearsMarv = 4;
var servedYears = 0;
var marvsDecisionBias = 0.5;

function showScreen(id) {
    for (var i = 0; i < 6; ++i) {
        document.getElementById("screen" + i).style.display = "none";
    }
    document.getElementById("screen" + id).style.display = "block";
}

function startGame() {
    remainingYearsYou = 5;
    remainingYearsMarv = 4;
    servedYears = 1;

    showScreen(1);
}

function continueGame() {
    servedYears += 1;
    remainingYearsMarv -= 1;
    remainingYearsYou -= 1;

    if (remainingYearsYou < remainingYearsMarv) {
        showScreen(3);
    }
    else if (servedYears >= 50) {
        showScreen(4);
    }
    else if (remainingYearsMarv <= 0) {
        showScreen(5);
    } else {
        showScreen(1);
    }
}

function staySilent() {
    evaluateResults("cooperates", thinkMarv());
    marvsDecisionBias *= 0.9;
}

function betray() {
    evaluateResults("defects", thinkMarv());
    marvsDecisionBias = (1 - (1 - marvsDecisionBias) * 0.9);
}

function evaluateResults(yourAction, marvsAction) {
    
    if (yourAction == "cooperates" && marvsAction == "cooperates") {

        document.getElementById("you-cooperate").style.display = "block";
        document.getElementById("you-defect").style.display = "none";

        document.getElementById("marv-cooperate").style.display = "block";
        document.getElementById("marv-defect").style.display = "none";
        
        remainingYearsYou += 1;
        remainingYearsMarv += 1;

        document.getElementById("you-extended-val").innerText = 1;
        document.getElementById("marv-extended-val").innerText = 1;

        document.getElementById("you-extended").style.display = "block";
        document.getElementById("you-free").style.display = "none";
        document.getElementById("marv-extended").style.display = "block";
        document.getElementById("marv-free").style.display = "none";
    }
    else if (yourAction == "cooperates" && marvsAction == "defects") {

        document.getElementById("you-cooperate").style.display = "block";
        document.getElementById("you-defect").style.display = "none";

        document.getElementById("marv-defect").style.display = "block";
        document.getElementById("marv-cooperate").style.display = "none";

        remainingYearsYou += 3;

        document.getElementById("you-extended-val").innerText = 3;
        document.getElementById("marv-extended-val").innerText = 0;

        document.getElementById("you-extended").style.display = "block";
        document.getElementById("you-free").style.display = "none";
        document.getElementById("marv-extended").style.display = "none";
        document.getElementById("marv-free").style.display = "block";
    }
    else if (yourAction == "defects" && marvsAction == "cooperates") {

        document.getElementById("you-defect").style.display = "block";
        document.getElementById("you-cooperate").style.display = "none";

        document.getElementById("marv-cooperate").style.display = "block";
        document.getElementById("marv-defect").style.display = "none";

        remainingYearsMarv += 3;

        document.getElementById("you-extended-val").innerText = 0;
        document.getElementById("marv-extended-val").innerText = 3;

        document.getElementById("you-extended").style.display = "none";
        document.getElementById("you-free").style.display = "block";
        document.getElementById("marv-extended").style.display = "block";
        document.getElementById("marv-free").style.display = "none";
    }
    else if (yourAction == "defects" && marvsAction == "defects") {

        document.getElementById("you-defect").style.display = "block";
        document.getElementById("you-cooperate").style.display = "none";

        document.getElementById("marv-defect").style.display = "block";
        document.getElementById("marv-cooperate").style.display = "none";

        remainingYearsYou += 2;
        remainingYearsMarv += 2;

        document.getElementById("you-extended-val").innerText = 2;
        document.getElementById("marv-extended-val").innerText = 2;

        document.getElementById("you-extended").style.display = "block";
        document.getElementById("you-free").style.display = "none";
        document.getElementById("marv-extended").style.display = "block";
        document.getElementById("marv-free").style.display = "none";
    }

    document.getElementById("you-remaining").innerText = remainingYearsYou;
    document.getElementById("marv-remaining").innerText = remainingYearsMarv;
    
    document.getElementById("you-age").innerText = servedYears + 30;
        
    showScreen(2);
}

function thinkMarv() {
    var r = Math.random();
    if (r < marvsDecisionBias) {
        return "defects";
    } else {
        return "cooperates";
    }
}