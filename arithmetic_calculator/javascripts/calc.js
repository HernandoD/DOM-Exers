let calc = (() => {
  let CalcTable = {
    '+': (n1, n2) => n1 + n2,
    '-': (n1, n2) => n1 - n2,
    '*': (n1, n2) => n1 * n2,
    '/': (n1, n2) => n1 / n2,
  }
  
  return {
    bind() {
      document.addEventListener('submit', this.handleCalculation.bind(this))
    },

    handleCalculation(e) {
      e.preventDefault();
      this.input1 = +document.querySelector("#first-number").value;
      this.input2 = +document.querySelector("#second-number").value;
      this.op = document.querySelector('#operator').value;
      this.result = this.getResult();
      this.postResult()
    },

    getResult() {
      return CalcTable[this.op](this.input1, this.input2);
    },

    postResult() {
      document.querySelector('#result').textContent = this.result;
    },

    init() {
      this.form = document.querySelector('form');
      this.bind()
    }
  }
})()

document.addEventListener('DOMContentLoaded', () => {
  calc.init()
})