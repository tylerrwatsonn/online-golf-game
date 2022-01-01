import {Card, Deck, Hand} from "./deck.js"

const newCardDiv = document.querySelector(".new-card-slot")
const deckDiv = document.querySelector(".deck")
const discardDiv = document.querySelector(".discard-pile")

let deck, turn
let hands = []
const PLAYER_INDEX = 0

deckDiv.addEventListener("click", () => {
    newCardDiv.innerHTML = ""
    getTopCard()
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
    deck = new Deck()
    deck.shuffle()

    turn = 0

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

    let playerHand = hands[PLAYER_INDEX]

    const playerRow1 = document.getElementById('player-row-1')
    const playerRow2 = document.getElementById('player-row-2')

    for(let i=0; i < 4; i++) {
        let card = playerHand.cards[i].getHTML()
        card.classList = ["hidden-card"]
        card.id = `player-card-${i}`
        playerRow1.appendChild(card)
        card.addEventListener("click", () => {
            if (newCardDiv.children.length == 1 && newCardDiv.children[0].clicked) {
                swapCards(newCardDiv, card, playerHand, i)
            } else if (discardDiv.children.length > 0 && discardDiv.children[0].clicked) {
                swapCards(discardDiv, card, playerHand, i)
            } else if ((turn == PLAYER_INDEX || startFlipAllowed(playerHand)) && playerHand.cards[i].revealed == false) {
                let flippedCard = playerHand.cards[i].getHTML()
                playerHand.cards[i].revealed = true
                flippedCard = addEventListenersToPlayerCard(flippedCard, playerHand, i)
                playerRow1.replaceChild(flippedCard, card)
                if (turn == PLAYER_INDEX && startFlipAllowed(playerHand) == false) {
                    nextTurn()
                }
            }
        })
    }

    for(let i=4; i < 8; i++) {
        let card = playerHand.cards[i].getHTML()
        card.classList = ["hidden-card"]
        card.id = `player-card-${i}`
        playerRow2.appendChild(card)
        card.addEventListener("click", () => {
            if (newCardDiv.children.length == 1 && newCardDiv.children[0].clicked) {
                swapCards(newCardDiv, card, playerHand, i)
            } else if (discardDiv.children.length > 0 && discardDiv.children[0].clicked) {
                swapCards(discardDiv, card, playerHand, i)
            } else if ((turn == PLAYER_INDEX || startFlipAllowed(playerHand)) && playerHand.cards[i].revealed == false) {
                let flippedCard = playerHand.cards[i].getHTML()
                playerHand.cards[i].revealed = true
                flippedCard = addEventListenersToPlayerCard(flippedCard, playerHand, i)
                playerRow2.replaceChild(flippedCard, card)
                if (turn == PLAYER_INDEX && startFlipAllowed(playerHand) == false) {
                    nextTurn()
                }
            }
        })
    }

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

function nextTurn() {
    turn = (turn + 1) % 4
    console.log(`NEXT TURN - ${turn}`)
}

function startFlipAllowed(playerHand) {
    let revealedCount = playerHand.cards.filter(card => card.revealed).length
    return revealedCount < 2
}

function swapCards(parentDiv, card, playerHand, i) {
    let newCard = parentDiv.children[0]
    newCard.style.border = ""
    newCardDiv.innerHTML = ""
    discardDiv.innerHTML = ""
    discardDiv.appendChild(playerHand.cards[i].getHTML())
    let parentNode = card.parentNode
    newCard = addEventListenersToPlayerCard(newCard, playerHand, i)
    parentNode.replaceChild(newCard, parentNode.children[i%4])
    playerHand.cards[i] = new Card(newCard.dataset.value, true)
    nextTurn()
}

function getTopCard() {
    let newCard = deck.pop()
    newCardDiv.appendChild(newCard.getHTML())
    newCard = newCardDiv.children[0]
    newCard.addEventListener("click", () => {
        if(newCard == newCardDiv.children[0]) {
            newCard.style.border = ".1em solid orange"
            newCardDiv.children[0].clicked = true
        }
    })
}

function addEventListenersToPlayerCard(card, playerHand, i) {
    card.addEventListener("click", () => {
        if (newCardDiv.children.length == 1 && newCardDiv.children[0].clicked) {
            swapCards(newCardDiv, card, playerHand, i)
        } else if (discardDiv.children.length > 0 && discardDiv.children[0].clicked) {
            swapCards(discardDiv, card, playerHand, i)
        }
    })
    return card
}

