class CalcController {
  constructor() {
    this._audio = new Audio('click.mp3')
    this._audioOnOff = false
    this._lastOperator = ''
    this._lastNumber = ''
    this._operation = []
    this._locale = 'pt-BR'
    this._displayCalcEl = document.querySelector('#display')
    this._dateEl = document.querySelector('#data')
    this._timeEl = document.querySelector('#hora')
    this._currentDate
    this.initialize()
    this.initButtonsEvents()
    this.initKeyboard()
  }
  initialize() {
    this.setDisplayDateTime()
    setInterval(() => {
      this.setDisplayDateTime()
    }, 1000)
    this.setLastNumberToDisplay()
    this.pasteFromClipboard()
    document.querySelectorAll('.btn-ac').forEach(btn => {
      btn.addEventListener('dblclick', e => {
        this.toogleAudio()
      })
    })
  }
  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0
      this._audio.play()
    }
  }
  toogleAudio() {
    this._audioOnOff = !this._audioOnOff
  }
  pasteFromClipboard() {
    document.addEventListener('paste', e => {
      let text = e.clipboardData.getData('Text')
      this.displayCalc = parseFloat(text)
    })
  }
  copyToClipboard() {
    let input = documento.createElement('input')
    input.value = this.displayCalc
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    input.remove()
  }
  initKeyboard() {
    document.addEventListener('keyup', e => {
      this.playAudio()
      switch (e.key) {
        case 'Escape':
          this.clearAll()
          break
        case 'Backspace':
          this.cancelEntry()
          break
        case '+':
        case '-':
        case '/':
        case '*':
        case '%':
          this.addOperation(e.key)
          break
        case 'Enter':
        case '=':
          this.calc()
          break
        case '.':
        case ',':
          this.addDot()
          break
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key))
          break
        case 'c':
          if (e.ctrlKey) this.copyToClipboard()
          break
      }
    })
  }
  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false)
    })
  }
  initButtonsEvents() {
    let buttons = document.querySelectorAll('#buttons > g, #parts > g')
    buttons.forEach(btn => {
      this.addEventListenerAll(btn, 'click drag', e => {
        let btnText = btn.className.baseVal.replace('btn-', '')
        this.execBtn(btnText)
      })
      this.addEventListenerAll(btn, 'mouseover mousedown mouseup', e => {
        btn.style.cursor = 'pointer'
      })
    })
    //"#buttons > g" => seleciona todas as tags "g" filhas de buttons.
  }
  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
  }
  clearAll() {
    this._operation = []
    this._lastNumber = ''
    this._lastOperator = ''
    this.setLastNumberToDisplay()
  }
  cancelEntry() {
    this._operation.pop()
    this.setLastNumberToDisplay()
  }
  setError() {
    this.displayCalc = 'Error'
  }
  isOperator(value) {
    return ['+', '-', '*', '%', '/'].indexOf(value) > -1
  }
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value
  }
  getResult() {
    try {
      return eval(this._operation.join(''))
    } catch {
      setTimeout(() => {
        this.setError()
      }, 1)
    }
  }
  calc() {
    let last = ''
    this._lastOperator = this.getLastItem()
    if (this._operation.length < 3) {
      let firstItem = this._operation[0]
      this._operation = [firstItem, this._lastOperator, this._lastNumber]
    }
    if (this._operation.length > 3) {
      last = this._operation.pop()
      this._lastNumber = this.getResult()
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false)
    }
    /**Serve para retirar e salvar o último valor de um array dentro de uma variável*/
    let result = this.getResult()
    //Join junta os valores do array em uma string
    //Eval calcula dos valores numericos dentro de uma string
    if (last == '%') {
      result /= 100
      this._operation = [result]
    } else {
      this._operation = [result]
      if (last) {
        this._operation.push(last)
      }
      //Aqui armazena o último operador + o resultado do eval dentro do array
    }
    this.setLastNumberToDisplay()
  }
  pushOperation(value) {
    this._operation.push(value)
    if (this._operation.length > 3) {
      /**Quando o index for maior que 3 vai executar esse bloco de código*/
      this.calc()
    }
  }
  getLastItem(isOperator = true) {
    let lastItem
    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i]
        break
      }
    }
    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber
    }
    return lastItem
  }
  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false)
    if (!lastNumber) {
      lastNumber = 0
    }
    this.displayCalc = lastNumber
  }
  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      /* Busca pela última operação digitada na calculadora e faz a verificação
       *  se não é um número, caso não seja, a resposta será true e o bloco de
       *  código será executado. */
      if (this.isOperator(value)) {
        /* Verifica se a última operação digitada é um operador matemático,
         * se a resposta da função for true, o código será executado. */
        this.setLastOperation(value)
        //Último index do array é substituido pelo valor da operação recebida.
      } else {
        this.pushOperation(value)
        this.setLastNumberToDisplay()
      }
    } else {
      /**Caso o valor identificado seja um número, o resultado da comparação
       * foi false, então vai executar esse bloco de código.
       */
      if (this.isOperator(value)) {
        this.pushOperation(value)
        /**Pode ser que o primeiro if identifique como se o operador fosse um número,
         * retornando o valor "false", sendo assim necessário verificar novamente
         * aqui se é um operador.
         */
      } else {
        let newValue = this.getLastOperation().toString() + value.toString()
        //Transforma o útimo valor e o valor atual em string e realiza a concatenação.
        this.setLastOperation(newValue)
        //Atualizar Display
        this.setLastNumberToDisplay()
      }
    }
  }
  getLastOperation() {
    return this._operation[this._operation.length - 1]
  }
  addDot() {
    let lastOperation = this.getLastOperation()
    if (
      typeof lastOperation === 'string' &&
      lastOperation.split('').indexOf('.') > -1
    )
      return
    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.')
    } else {
      this.setLastOperation(lastOperation.toString() + '.')
    }
    this.setLastNumberToDisplay()
  }
  execBtn(value) {
    this.playAudio()
    switch (value) {
      case 'ac':
        this.clearAll()
        break
      case 'ce':
        this.cancelEntry()
        break
      case 'soma':
        this.addOperation('+')
        break
      case 'subtracao':
        this.addOperation('-')
        break
      case 'multiplicacao':
        this.addOperation('*')
        break
      case 'divisao':
        this.addOperation('/')
        break
      case 'igual':
        this.calc()
        break
      case 'porcento':
        this.addOperation('%')
        break
      case 'ponto':
        this.addDot()
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(value)
        break
      default:
        break
    }
  }
  get displayTime() {
    return this._timeEl.innerHTML
  }
  set displayTime(value) {
    this._timeEl.innerHTML = value
  }
  get displayDate() {
    return this._dateEl.innerHTML
  }
  set displayDate(value) {
    this._dateEl.innerHTML = value
  }
  get displayCalc() {
    return this._displayCalcEl.innerHTML
  }
  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError()
      return false
    }
    this._displayCalcEl.innerHTML = value
  }
  get currentDate() {
    return new Date()
  }
  set currentDate(value) {
    this._currentDate = value
  }
}
