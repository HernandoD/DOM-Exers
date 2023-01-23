document.addEventListener('DOMContentLoaded', () => {
  let replayBtn = document.querySelector('#replay');

  let randomWord = function (){
    let words = ['apple', 'banana', 'orange', 'pear'];

    return function() {
      let randomIndex = () => Math.floor(Math.random() * words.length)
      let word = words[randomIndex()];
      words.splice(words.indexOf(word), 1)
      return word;
    }
  }()


  let Model = {

    isUniqueGuess(guess, selector) {
      let els = document.querySelectorAll(selector + '>span');

      if (els.length === 0) { return true };

      return ![...els].map(span => span.textContent).includes(String(guess))  
    },

    addLetter(guess) {
      let spaces = document.querySelectorAll('#spaces>span');

      if (this.isUniqueGuess(guess, '#spaces')) {
        this.word.split('').forEach((letter, ind) => {
          if (letter === guess) {
            spaces[ind].textContent = guess;
          }
        })
      }
    },

    addGuess(guess) {
      let guesses = document.querySelector('#guesses');
      let guessSpans = guesses.querySelectorAll('span');
      this.apples = document.getElementById('apples');

      if (this.isUniqueGuess(guess, '#guesses')) {
        guesses.insertAdjacentHTML('beforeend', `<span>${guess}</span>`);
        if (!this.word.split('').includes(guess)) {
          this.incorrectGuesses += 1;
          this.apples.classList.add('guess_' + this.incorrectGuesses);
        }
      }
    },

    init() {
      this.word = randomWord();
      this.incorrectGuesses = 0;
      this.guesses = [];
      this.wrongAllowed = 6;
      return this;
    }
  }

  let View = {
    emptySpans() {
      this.spaces.querySelectorAll('span').forEach(sp => sp.remove())
    },

    init() {
      this.spaces = document.querySelector('#spaces');

      return this;
    }
  }

  let Controller = {
     createBlanks() {
      console.log(this.model.word)
       this.length = this.model.word.length;
       this.view.emptySpans();
       let spans = Array(this.length).fill('<span></span>').join('');
       this.view.spaces.insertAdjacentHTML('beforeend', spans);
     },

     bindEvents() {
       this.handleKeys = (e) => this.handleKeyPress(e)
       document.addEventListener('keydown', this.handleKeys);
       replayBtn.addEventListener('click', this.resetGame.bind(this))
     },

     checkIfVictorious() {
       let wordGuess = [...document.querySelectorAll('#spaces>span')].map(sp => sp.textContent).join('');

       if (this.model.word === wordGuess.toLowerCase()) {
         this.unBindKeyPress();
         document.querySelector('#message').textContent = 'You win!'
         document.querySelector('#replay').style.display = 'block';
         document.body.className = 'win';
       }

       if (this.model.incorrectGuesses === this.model.wrongAllowed) {
         this.unBindKeyPress();
         document.querySelector('#message').textContent = 'You lose.';
         document.querySelector('#replay').style.display = 'block';
         document.body.className = 'lose';
       }
     },

     unBindKeyPress() {
       document.removeEventListener('keydown', this.handleKeys);
     },

     handleKeyPress(e) {
       let key = e.key;

       if (key.match(/[a-z]/ig)) {
         document.body.className = '';
         this.guess = key;
         this.model.guesses.push(this.guess);
         this.model.addLetter(this.guess);
         this.model.addGuess(this.guess);
         this.checkIfVictorious()
       }
     },

     resetGuessBlanks() {
       this.model.incorrectGuesses = 0;
       this.model.guesses = [];
       document.querySelectorAll('#guesses>span').forEach(sp => sp.remove());
     },

     resetGame(e) {
       e.preventDefault();
       this.model.word = randomWord();

       if (!this.model.word) { 
         document.querySelector('#message').textContent = 'Sorry, out of words';
         this.unBindKeyPress()
         return;
       }; 

       this.resetGuessBlanks();
       this.createBlanks();
       document.querySelector('#message').textContent = '';
       replayBtn.style.display = 'none';
       document.body.className = ''
       document.addEventListener('keydown', this.handleKeys);
       this.model.apples.className = ''
     },

     init(model, view) {
       this.model = model;
       this.view = view;
       this.createBlanks();
       this.bindEvents();
     }
  }

  Controller.init(Model.init(), View.init())

})