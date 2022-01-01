const VALUES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

export class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get size() {
        return this.cards.length
    }

    pop() {
        return this.cards.shift()
    }

    shuffle() {
        for (let i = this.size - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
          }
    }
}

export class Hand {
    constructor(cards) {
        this.cards = cards
    }

    get score() {
        return 10;
    }

    replace(i, card) {
        this.cards[i] = card
    }
}

class Player {
    constructor(name) {
        this.name = name
        this.score = 0
        this.hand = null
    }

    addScore() {
        this.score = this.score + this.hand.score
    }

    newHand(hand) {
        this.hand = hand
    } 
}

export class Card {
    constructor(value, revealed = false) {
        this.value = value
        this.revealed = revealed
    }

    get color() {
        if(parseInt(this.value) > 6) {
            return "red"
        } else {
            return "blue"
        }
    }

    reveal() {
        this.revealed = true
    }

    getHTML() {
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value}`
        return cardDiv
    }
}

function freshDeck() {
    let neg_card = new Card("-5")
    let deck = [neg_card, neg_card, neg_card, neg_card]
    for (let i = 0; i < 8; i++) {
        deck.push(VALUES.map(val => new Card(val)))
    }
    return deck.flat()
}