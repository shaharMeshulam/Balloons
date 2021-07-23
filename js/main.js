'use strict;'

const NUM_OF_BALLOONS = 5;
const POP_SOUND = new Audio('pop.wav');
const BALLOON_HEIGHT = 150;
var gBalloons;
var gElBalloons;
var gIntervalId;
var gNumOfPops;
var gSpeedLevel;

function init() {
    gNumOfPops = 0;
    gSpeedLevel = 10;
    gBalloons = renderBalloons(NUM_OF_BALLOONS);
    gElBalloons = document.querySelectorAll('.balloon');
    document.querySelector('.start').style.display = 'inline';
    renderScoreBoard();
    resetBalloons();
}

function start(elBtn) {
    gIntervalId = setInterval(play, 250);
    elBtn.style.display = 'none';
}

function resetBalloons() {
    for (var i = 0; i < gElBalloons.length; i++) {
        gElBalloons[i].style.bottom = `${gBalloons[i].bottom}px`;
        gElBalloons[i].style.left = `${gBalloons[i].left}%`;
        gElBalloons[i].style.backgroundColor = gBalloons[i].color;
    }
}

function play() {
    moveBalloons();
    if (checkBaloonsOutOfScreen()) {
        clearInterval(gIntervalId);
        gIntervalId = null;
        alert('You Loose!');
        init();
    }
}

function moveBalloons() {
    for (i = 0; i < gElBalloons.length; i++) {
        if (gElBalloons[i].style.opacity !== '0') {
            gBalloons[i].bottom += gBalloons[i].speed;
            gElBalloons[i].style.bottom = `${gBalloons[i].bottom}px`;
        }
    }
}

function checkBaloonsOutOfScreen() {
    var height = document.documentElement.clientHeight;
    for (var i = 0; i < gBalloons.length; i++) {
        var currBottom = window.getComputedStyle(gElBalloons[i]).getPropertyValue('bottom');
        if (currBottom.substring(0, currBottom.length - 2) > height - BALLOON_HEIGHT) return true
    }
    return false;
}

function renderBalloons(num) {
    var balloons = [];
    var strHtml = '';
    for (var i = 0; i < num; i++) {
        balloons.push(createBalloon());
        strHtml += `<div class="balloon" onmouseover="speedUp(${i})" onclick="pop(this, ${i})" data-i="${i}"></div>`;
    }
    document.querySelector('.sky').innerHTML = strHtml;
    return balloons;
}

function speedUp(idx) {
    if (gIntervalId) gBalloons[idx].speed += 10;
}

function createBalloon(
    speed = getRndInteger(gSpeedLevel, gSpeedLevel + 20),
    bottom = 0,
    left = getRndInteger(0, 85),
    color = getRandomColor()
) {
    return {
        speed,
        bottom,
        left,
        color
    }
}

function renderScoreBoard() {
    var strHtml = 'Score: <span class="score">0</span>'
    document.querySelector('.score-board').innerHTML = strHtml;
}

function pop(elBalloon, idx) {
    if (!gIntervalId) return;
    elBalloon.style.opacity = 0;
    elBalloon.style.bottom = window.getComputedStyle(elBalloon).getPropertyValue('bottom'); // stop transition
    gNumOfPops++;
    POP_SOUND.play();
    document.querySelector('.score').innerText = gNumOfPops;
    resetBalloon(idx);
}

function resetBalloon(idx) {
    gSpeedLevel += 10;
    setTimeout(function () {
        gBalloons[idx].bottom = -BALLOON_HEIGHT;
        gBalloons[idx].left = getRndInteger(0, 85);
        gBalloons[idx].color = getRandomColor();
        gBalloons[idx].speed = gSpeedLevel;
        gElBalloons[idx].style.bottom = `${gBalloons[idx].bottom}px`;
        gElBalloons[idx].style.left = `${gBalloons[idx].left}%`;
        gElBalloons[idx].style.backgroundColor = gBalloons[idx].color;
    }, 1050);
    setTimeout(function () {
        gElBalloons[idx].style.opacity = 1;
    }, 2000)
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}