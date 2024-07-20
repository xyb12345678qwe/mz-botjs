export class Counter {
  #counter = 1
  #val = 0
  constructor(initialValue) {
    this.#counter = initialValue
    this.#val = initialValue
  }
  getNextID() {
    return ++this.#counter
  }
  get() {
    return this.#counter
  }
  reStart() {
    this.#counter = this.#val
  }
}
