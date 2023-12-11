class Calculadora {
  constructor(valorPrevioTextElement, valorActualTextElement) {
      this.valorPrevioTextElement = valorPrevioTextElement
      this.valorActualTextElement = valorActualTextElement
      this.borrarTodo()
      this.igual = false
      this.pantalla = ''
      this.segundoValor = ''
  }

  borrarTodo() {
      this.valorActual = ''
      this.valorPrevio = ''
      this.segundoValor = ''
      this.operacion = undefined
      this.igual = false
      this.pantalla = ''
  }

  borrar() {
      this.valorActual = this.valorActual.toString().slice(0, -1)
  }

  agregarNumero(numero) {
      if(this.igual){
          this.borrarTodo()
          this.igual = false
      }
      if (numero === '.' && this.valorActual.includes('.')) return
      if(this.valorActual.length < 11){
          this.valorActual = this.valorActual.toString() + numero.toString()
      }
  }

  elejirOperacion(operacion) {
      if (this.valorActual === '' && this.operacion !== '%') return
      if (this.valorPrevio !== '') { // ->  ! ==
          this.calcular()
      }
      this.operacion = operacion
      this.valorPrevio = this.valorActual
      this.valorActual = ''
  }

  calcular() {
      let resultado
      const valor_1 = parseFloat(this.valorPrevio)
      const valor_2 = parseFloat(this.valorActual)
      if (this.operacion !== "%" && (isNaN(valor_1) || isNaN(valor_2))) return
      switch (this.operacion) {
          case '+':
              resultado = valor_1 + valor_2
              break
          case '-':
              resultado = valor_1 - valor_2
              break
          case 'x':
              resultado = valor_1 * valor_2
              break
          case '÷':
              resultado = valor_1 / valor_2
              break
          case '%':
              resultado = isNaN(valor_2) ? valor_1/100 : (valor_1/100)* valor_2
              break
          default:
              return
      }
      this.valorActual = resultado
      this.operacion = undefined
      this.segundoValor = valor_2
      this.valorPrevio = ''
  }

  obtenerNumero(numero) {
      const cadena = numero.toString()
      const tamanio = cadena.lenght
      const enteros = parseFloat(cadena.split('.')[0])
      const decimales = cadena.split('.')[1]
      let mostrarEnteros
      
      if (isNaN(enteros)) {
          mostrarEnteros = ''
      } else {
          mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
      }
  
      if (decimales != null) {
          return `${mostrarEnteros}.${decimales}`
      } else {
          return mostrarEnteros
      }
      
  }

  actualizarPantalla() {
      this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
      if (this.operacion != null) {
          this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`
          this.pantalla = this.valorPrevioTextElement.innerText;
      }else if(this.igual === true){
          this.valorPrevioTextElement.innerText = ` ${this.pantalla} ${this.obtenerNumero(this.segundoValor)}`
      } else {
          this.valorPrevioTextElement.innerText = ''
      }
  }
}

const numeroButtons = document.querySelectorAll('[data-numero]')
const operacionButtons = document.querySelectorAll('[data-operacion]')
const igualButton = document.querySelector('[data-igual]')
const porcentajeButton = document.querySelector('[data-porcentaje]')
const borrarButton = document.querySelector('[data-borrar]')
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
const valorActualTextElement = document.querySelector('[data-valor-actual]')

const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

numeroButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.agregarNumero(button.innerText)
      calculator.actualizarPantalla()
  })
})

operacionButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.elejirOperacion(button.innerText)
      calculator.actualizarPantalla()
  })
})

igualButton.addEventListener('click', _button => {
  calculator.igual = true
  calculator.calcular()
  calculator.actualizarPantalla()
})

borrarTodoButton.addEventListener('click', _button => {
  calculator.borrarTodo()
  calculator.actualizarPantalla()
})

borrarButton.addEventListener('click', _button => {
  calculator.borrar()
  calculator.actualizarPantalla()
})

porcentajeButton.addEventListener('click', _button => {
  calculator.elejirOperacion("%")
  calculator.actualizarPantalla()
})

/**
* Arreglar bug que limite los numeros en pantalla
*Funcionalidad de boton de porcentaje
*Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
*Muestre la operacion completa en el display superior */
