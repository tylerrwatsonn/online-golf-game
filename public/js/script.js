import {Card, Deck, Hand} from "./deck.js"

const newCardDiv = document.querySelector(".new-card-slot")
const deckDiv = document.querySelector(".deck")
const discardDiv = document.querySelector(".discard-pile")

let deck, turn, startFlips, roundOver, roundScores, totalScores
let hands = []
const PLAYER_INDEX = 0
let offset = 0 // TODO: THIS MUST BE CHANGED
let numPlayers

let testHand = new Hand([new Card("5"), new Card("5"), new Card("4"), new Card("5"),
                         new Card("5"), new Card("5"), new Card("5"), new Card("5")])
console.log(testHand.score)

deckDiv.addEventListener("click", () => {
    getTopCard()
})

newCardDiv.addEventListener("click", () => {
    if(newCardDiv.children.length == 1) {
        newCardDiv.children[0].style.border = ".1em solid orange"
        newCardDiv.children[0].clicked = true
    }
})

document.addEventListener("click", (evt) => {
    if(newCardDiv.children.length == 1 && evt.target != newCardDiv.children[0] ) {
        newCardDiv.children[0].style.border = ""
        newCardDiv.children[0].clicked = false
    } 
    if(discardDiv.children.length > 0 && evt.target != discardDiv.children[0]) {
        discardDiv.children[0].style.border = ""
        discardDiv.children[0].clicked = false
    }
})

// if(newCardDiv.children.length == 1) {
//     const newCard = newCardDiv.children[0]
//     newCard.addEventListener("click", () => {
//         newCard.setAttribute("box-shadow", "0 0 20px yellow")
//         console.log()
//     })
// }

startGame()

function startGame(numPlayers = 4) {

    roundScores = []
    roundScores = new Array(9).fill(new Array(numPlayers).fill(0))
    totalScores = new Array(numPlayers).fill(0)

    for (let i=0; i<9; i++) {
        roundOver = false
        startRound(numPlayers, i%numPlayers)
        roundScores[i] = getScores()
        totalScores = totalScores.map((totalScore, player) => {
            totalScore + scores[i][player]
        })
    }
    
}

function startRound(numPlayers, firstPlayer) {
    deck = new Deck()
    deck.shuffle()

    turn = firstPlayer
    numPlayers = numPlayers
    hands = []

    initializeHands(numPlayers)

    startFlips = new Array(numPlayers).fill(0)

    const discardCard = deck.pop().getHTML()
    discardDiv.appendChild(discardCard)

    discardDiv.addEventListener("click", () => {
        if (newCardDiv.children.length == 1 && newCardDiv.children[0].clicked) {
            let confirmationMessage = "Are you sure you want to discard the new card?"
            if (confirm(confirmationMessage)) {
                discardDiv.innerHTML = ""
                discardDiv.appendChild(newCardDiv.children[0])
                newCardDiv.innerHTML = ""
            }
        } else {
            discardDiv.children[0].style.border = ".1em solid orange"
            discardDiv.children[0].clicked = true
        }
        
    })

}

function initializeHands(numPlayers) {

    let hand_cards = []
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < numPlayers; j++) {
            if(hand_cards.length < numPlayers) {
                hand_cards.push([])
            }

            hand_cards[j].push(deck.pop())
        }
    }

    hand_cards.forEach(hand => hands.push(new Hand(hand)))

    hands.forEach((hand, player) => {
        for (let row = 1; row < 3; row++) {
            let rowDiv = document.getElementById(`player-${(player + offset)%numPlayers}-row-${row}`)
            for(let j=0; j < 4; j++) {
                let i = j + (4 * (row - 1))
                let card = hand.cards[i].getHTML()
                card.classList = ["hidden-card"]
                card.id = `player-${(player + offset)%numPlayers}-card-${i}`
                rowDiv.appendChild(card)
                card.addEventListener("click", () => {
                    if (turn == player && newCardDiv.children.length == 1 && newCardDiv.children[0].clicked) {
                        swapCards(newCardDiv, card, player, i)
                    } else if (turn == player && discardDiv.children.length > 0 && discardDiv.children[0].clicked) {
                        swapCards(discardDiv, card, player, i)
                    } else if (turn == player && hand.cards[i].revealed == false && startFlipAllowed(player) == false) {
                        let flippedCard = hand.cards[i].getHTML()
                        hand.cards[i].revealed = true
                        flippedCard = addEventListenersToPlayerCard(flippedCard, player, i)
                        rowDiv.replaceChild(flippedCard, card)
                        if (newCardDiv.children.length == 1) {
                            discardDiv.innerHTML = ""
                            discardDiv.appendChild(newCardDiv.children[0])
                        }
                        newCardDiv.innerHTML = ""
                        nextTurn()
                    } else if (startFlipAllowed(player) && hand.cards[i].revealed == false) {
                        let flippedCard = hand.cards[i].getHTML()
                        hand.cards[i].revealed = true
                        flippedCard = addEventListenersToPlayerCard(flippedCard, player, i)
                        rowDiv.replaceChild(flippedCard, card)
                        startFlips[player] = startFlips[player] + 1
                    }
                })
            }
        }
    })
    
}

function startFlipAllowed(player_index) {
    return startFlips[player_index] < 2
}

function nextTurn() {
    turn = (turn + 1) % 4
    roundOver = isRoundOver()
}

function swapCards(parentDiv, card, player, i) {
    let playerHand = hands[player]
    let newCard = parentDiv.children[0]
    newCard.style.border = ""
    newCardDiv.innerHTML = ""
    discardDiv.innerHTML = ""
    discardDiv.appendChild(playerHand.cards[i].getHTML())
    let parentNode = card.parentNode
    newCard = addEventListenersToPlayerCard(newCard, player, i)
    parentNode.replaceChild(newCard, parentNode.children[i%4])
    playerHand.cards[i] = new Card(newCard.dataset.value, true)
    nextTurn()
}

function getTopCard() {
    if (newCardDiv.children.length == 0) {
        let newCard = deck.pop()
        newCardDiv.innerHTML = ""
        newCardDiv.appendChild(newCard.getHTML())
    }
}

function addEventListenersToPlayerCard(card, player, i) {
    card.addEventListener("click", () => {
        if (turn == player && newCardDiv.children.length == 1 && newCardDiv.children[0].clicked) {
            swapCards(newCardDiv, card, player, i)
        } else if (turn == player && discardDiv.children.length > 0 && discardDiv.children[0].clicked) {
            swapCards(discardDiv, card, player, i)
        }
    })
    return card
}

function isRoundOver() {
    return hands.every(hand => {
        return hand.cards.every(card => {
            return card.revealed
        })
    })
}

function getScores() {
    return hands.map(hand => hand.score)
}
