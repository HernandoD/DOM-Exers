class Model {
  constructor() {
    this.randomWord = this.getRandomWordGenerator();
    this.setGuessStats()
  }

  getRandomWordGenerator() {
    let words = ['pear', 'apple', 'orange', 'banana'];
    return function() {
      let index = Math.floor(Math.random() * words.length);
      let word = words.splice(index, 1)[0];
      return word;
    }
  }

  setGuessStats() {
    this.wrongGuesses = 0;
    this.lettersGuessed = [];
    this.wrongAllowed = 6;
  }

  getRandomWord() {
    return this.randomWord()
  }

  addGuess(guess) {
    this.lettersGuessed.push(guess)
  }

}

class View {
  constructor() {
    this.spaces = document.querySelector('#spaces');
    this.message = document.querySelector('#message');
    this.guesses = document.querySelector('#guesses');
    this.apples = document.querySelector('#apples');
    this.replayBtn = document.querySelector('#replay');
  }

  createBlanks(word) {
    let length = word.length;

    if (this.spaces.querySelector('span')) {
      this.removeSpans(this.spaces)
    }

    for (let span = 0; span < length; span += 1) {
      this.spaces.insertAdjacentHTML('beforeend', '<span></span>')
    }
  }

  removeSpans(element) {
    [...element.querySelectorAll('span')].forEach(span => span.remove());
  }

  refreshGuesses(guesses) {
    if (this.guesses.querySelector('span')) {
      this.removeSpans(this.guesses)
    }

    guesses.forEach(guess => this.guesses.insertAdjacentHTML('beforeend', `<span>${guess}</span`))
  }

  outOfWordsMessage() {
    this.message.textContent = "Sorry, I've run out of words."
  }

  displayGameOver() {
    this.message.textContent = 'Game over. No more guesses.'
  }

  removeMessage() {
    this.message.textContent = '';
  }

  displayLoseEffect() {
    document.querySelector('body').classList.add('lose')
  }

  removeLoseEffect() {
    document.querySelector('body').classList.remove('lose')
  }

  renderCorrectGuess(indexes, letter) {
    [...this.spaces.querySelectorAll('span')].forEach((span, index) => {
      if (indexes.indexOf(index) !== -1) {
        span.textContent = letter;
      }
    })
  }

  dropApple(id) {
    this.apples.classList.add('guess_' + id)
  }

  hideReplay() {
    this.replayBtn.style.display = 'none';
  }

  displayReplay() {
    this.replayBtn.style.display = 'block';
  }

  resetApples() {
    this.apples.className = '';
  }

  displayWinMessage() {
    this.message.textContent = 'You win!'
  }

  displayWinEffect() {
    document.querySelector('body').classList.add('win')
  }

  removeWinEffect() {
    document.querySelector('body').classList.remove('win')
  }

  removeBodyEffects() {
    this.removeWinEffect();
    this.removeLoseEffect()
  }

  bindKeyDown(handler) {
    document.addEventListener('keydown', handler);
  }

  bindClick(handler) {
    document.addEventListener('click', handler);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.startNewGame();
    this.bindEvents();
  }

  startNewGame() {
    this.randomWord = this.model.getRandomWord();

    if (!this.randomWord) { return }
    
    this.view.createBlanks(this.randomWord);
    this.view.hideReplay() 
  }

  handleKeys(e) {
    let code = e.keyCode;
    let key = e.key

    if (code >= 65 && code <= 90) {
      this.processGuess(key);
    }
  }

  processGuess(key) {
    if (this.isDuplicate(key)) { return this }
    this.model.addGuess(key);
    this.checkCorrect(key)
    this.handleGuess();
    this.checkForVictory();
  }

  checkForVictory() {
    if (this.model.wrongGuesses === this.model.wrongAllowed) {
      this.view.displayGameOver();
      this.view.displayLoseEffect();
      this.unbindKeydown();
      this.view.displayReplay()
    }

    if (this.randomWord === this.correctSlots()) {
      this.view.displayWinMessage();
      this.view.displayWinEffect();
      this.view.displayReplay()
      this.unbindKeydown()
    }
  }

  correctSlots() {
    return [...this.view.spaces.querySelectorAll('span')].map(span => span.textContent.trim()).join('')
  }

  isDuplicate(key) {
    return this.model.lettersGuessed.indexOf(key) !== -1
  }

  checkCorrect(key) {
    let word = this.randomWord;
    let wordArr = word.toLowerCase().split('');

    if (wordArr.indexOf(key) !== -1) {
      this.addCorrectGuess(wordArr, key)
    } else {
      this.model.wrongGuesses += 1;
      this.view.dropApple(this.model.wrongGuesses)
    }
  }

  handleGuess() {
    this.view.refreshGuesses(this.model.lettersGuessed)
  }

  addCorrectGuess(wordArr, letter) {
    let indexes = [];

    wordArr.forEach((l, ind) => {
      if (l === letter) { indexes.push(ind) }
    })

    this.view.renderCorrectGuess(indexes, letter)
  }

  unbindKeydown() {
    document.removeEventListener('keydown', this.guessHandler)
  }

  handleClick(e) {
    e.preventDefault();
    let target = e.target;

    if (target.id === 'replay') {
      this.startNewGame(); 

      if (!this.randomWord) {
        this.view.outOfWordsMessage();
        return this;
      }
      
      this.view.removeSpans(this.view.guesses);
      this.view.removeBodyEffects();
      this.view.hideReplay();
      this.view.bindKeyDown(this.guessHandler);
      this.model.setGuessStats();
      this.view.removeMessage();
      this.view.resetApples();
    }
  }

  bindEvents() {
    this.guessHandler = (e) => this.handleKeys.bind(this)(e);
    this.view.bindKeyDown(this.guessHandler)
    this.view.bindClick(this.handleClick.bind(this))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Controller(new Model(), new View())
})