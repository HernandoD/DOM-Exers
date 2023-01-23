document.addEventListener('DOMContentLoaded', () => {
  let spaces = document.querySelector('#spaces');
  let message = document.querySelector('#message');
  let allGuesses = document.querySelector('#guesses');
  let apples = document.querySelector('#apples');
  let replayBtn = document.querySelector('#replay');

  let randomWord = function() {
    let words = ['pear', 'orange'];
    let randomInd = () => Math.floor(Math.random() * words.length);

    return function() {
      let ind = randomInd();
      let word = words.splice(ind, 1)[0];
      return word;
    }
  }()

  function Game() {
    this.word = randomWord();
    alert(this.word)
    if (!this.word) {
      this.displayMessage('Sorry, no more words in this short game.');
      this.createBlanks()
      return this;
    }
    this.wrongGuesses = 0;
    this.lettersGuessed = [];
    this.wrongTotal = 6;
    this.init()
  }

  Game.prototype = {
    createBlanks: function() {
      let allSpans = spaces.querySelectorAll('span');
      if (this.word) {
        let length = this.word.length;
        
        allSpans.forEach(span => span.remove())

        let spanHTMLs = Array(length).fill('<span></span');
    
        spanHTMLs.forEach(span => {
          spaces.insertAdjacentHTML('beforeend', span)
        })      
      } else {
        allSpans.forEach(span => span.remove())
      }
    },

    spaces() {
      return spaces.querySelectorAll('span')
    },

    spanLetters() {
      return [...this.spaces()].map(span => span.textContent);
    },

    wordArray() {
      return this.word.toUpperCase().split('');
    },

    getIndexes(letter) {
      let inds = [];

      this.wordArray().forEach((l, index) => {
        if (l.toUpperCase() === letter) {
          inds.push(index);
        }
      })

      return inds;
    },

    correctGuess(positions, letter) {
      this.spaces().forEach((span, ind) => {
        if (positions.includes(ind)) {
          span.textContent = letter;
        }
      })
    },

    resetBoard() {
      this.resetGuessBlanks()
    },

    victorious() {
      if (this.wrongGuesses === this.wrongTotal) {
         this.displayMessage('No more guesses! You lose');
         document.removeEventListener('keyup', this.guessHandler);
      };

      if (this.spanLetters().join('') === this.word.toUpperCase()) {
        this.displayMessage(`Correct. ${this.word.toUpperCase()} is the word baby! You win!`);
        document.removeEventListener('keyup', this.guessHandler);
      }
    },

    resetGuessBlanks() {
      let spans = allGuesses.querySelectorAll('span');

      if (spans) {
        spans.forEach(sp => sp.remove());
      }
    },

    addGuess(letter) {
      let guesses = this.lettersGuessed.filter((l, ind, arr) => arr.indexOf(l) === ind);
      this.resetGuessBlanks();

      guesses.forEach(letter => {
        allGuesses.insertAdjacentHTML('beforeend', `<span>${letter}</span>`)
      });
    },

    cutApple(guess) {
      let className = `guess_${guess}`;
      apples.classList.add(className);
    },

    matches(letter) {
      if (this.wordArray().includes(letter) && !this.spanLetters().includes(letter)) {
        let indexes = this.getIndexes(letter);
        this.correctGuess(indexes, letter);
      } else {
        this.wrongGuesses += 1;
        this.cutApple(this.wrongGuesses)
      }

      this.addGuess(letter);
      this.victorious();
    },

    addLetter(e) {
      let code = e.which;

      if (code >= 65 && code <= 90) {
        let letter = String.fromCharCode(code);
        this.lettersGuessed.push(letter);
        this.matches(letter)
      }
    },

    displayMessage(msg) {
      message.textContent = msg;
    },

    bindEvents() {
      this.guessHandler = (e) => this.addLetter(e);
      document.addEventListener('keyup', this.guessHandler);
    },

    init() {
      this.createBlanks();
      this.bindEvents();
    }
  }
  
  replayBtn.addEventListener('click', e => {
    e.preventDefault();
    
    let game = new Game();
    game.resetBoard()
  })

  new Game();
})