function buttonClickAction(querySelector, action) {
    try {
        document.querySelector(querySelector).onclick = action;
    } catch (err) {
        console.error(err);
    }
}

function generatePositiveInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function rollDice(dieSize, diceCount) {
    let result = [];
    for (let i = 0; i < diceCount; i++) {
        result.push(generatePositiveInt(dieSize));
    }

    return result;
}

function disableButtons(parentID) {
    document.querySelectorAll(parentID + ' > button').forEach(node => {
        node.disabled = true
    })
}

function enableButtons(parentID) {
    document.querySelectorAll( parentID + ' > button').forEach(node => {
        node.disabled = false
    })
}

function rollAndDisplay(dieLength, dieCount) {
    let result = rollDice(dieLength, dieCount);
    if(result.length <= 1) {
        setTimeout(() => document.querySelector('#private-die-result').innerHTML = "<b>" + result[0] + "</b>", 1000);
    } else {
        let htmlResult = JSON.stringify(result)
            .replaceAll(',', '+')
            .replaceAll('[', '')
            .replaceAll(']', '');
        let numberResult = 0;
        for(let number of result) {
            numberResult += number;
        }
        setTimeout(() => document.querySelector('#private-die-result').innerHTML = htmlResult + " = <b>" + numberResult + "</b>", 1000);
    }

    document.querySelector('#private-die-id').innerHTML = dieCount + "W" + dieLength;
    document.querySelector('#private-die-id').style.animation = 'fading 1s infinite'

    disableButtons('#private-buttons');

    setTimeout(() => {
        document.querySelector('#private-die-id').style.animation = '';
        enableButtons('#private-buttons');
    }, 1000);
}

buttonClickAction('#private-die-submit', () => {
    let dieLength = document.querySelector('#private-die-sides').value;
    let dieCount = document.querySelector('#private-die-count').value;
    rollAndDisplay(dieLength, dieCount);
});

buttonClickAction('#private-die-3', () =>
    rollAndDisplay(3, 1));

buttonClickAction('#private-die-6', () =>
    rollAndDisplay(6, 1));

buttonClickAction('#private-die-20', () =>
    rollAndDisplay(20, 1));

buttonClickAction('#private-die-100', () =>
    rollAndDisplay(100, 1));
