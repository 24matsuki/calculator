class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.previousOperand = "";
    this.currentOperand = ""; // string
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.slice(0, -1);
  }

  appendNumber(buttonNumber) {
    // buttonNumber は既に string 型。
    // . を続けて打つと getDN で Number() するときに NaN となってしまう。ここで制御する。
    if (this.currentOperand.includes(".") && buttonNumber === ".") return;
    this.currentOperand += buttonNumber;
  }

  compute() {
    const pre = Number(this.previousOperand);
    const cur = Number(this.currentOperand);
    let calResult;
    switch (this.operation) {
      case "+":
        calResult = pre + cur;
        break;
      case "-":
        calResult = pre - cur;
        break;
      case "*":
        calResult = pre * cur;
        break;
      case "÷":
        calResult = pre / cur;
        break;
    }
    // "="のための記述。継続の場合は再代入される。
    this.previousOperand = "";
    this.currentOperand = calResult.toString();
    this.operation = undefined;
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    // 計算継続のための代入。
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    // preHTML の表示のために再度 operation は必要なのでセットする。
    this.operation = operation;
  }

  updateNumber() {
    this.currentOperandTextElement.innerHTML = this.getDisplayNumber(this.currentOperand);
    if (this.operation === undefined) {
      this.previousOperandTextElement.innerHTML = "";
    } else {
      this.previousOperandTextElement.innerHTML = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    }
  }

  getDisplayNumber(numberString) {
    // Number("")が 0 となってしまい、AC や operation 押下時に curHTML に 0 が表示されてしまう。
    // const integerDigits = Number(numberString.split(".")[0]);
    const integerString = numberString.split(".")[0];
    let integerDisplay;
    if (integerString === "") {
      integerDisplay = integerString;
    } else {
      integerDisplay = Number(integerString).toLocaleString("en");
    }
    // "7"や "" のときに[1]は undefined を返してしまうので、返り値のタイミングで分岐する。
    const decimalString = numberString.split(".")[1];
    if (decimalString === undefined) {
      return integerDisplay;
    } else {
      return `${integerDisplay}.${decimalString}`;
    }
    // return Number(numberString).toLocaleString("en");
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // console.log(this); // window
    calculator.appendNumber(button.innerHTML);
    calculator.updateNumber();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerHTML);
    calculator.updateNumber();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateNumber();
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateNumber();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateNumber();
});
