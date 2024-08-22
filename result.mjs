const symUltres = Symbol.for('ultres')

function isResult (value) {
  return symUltres in Object(value)
}

function ensureResult (value) {
  if (!isResult(value)) {
    throw new TypeError('Expected a Result')
  }
  return value
}

class Ok {
  static from (value) {
    if (isResult(value)) {
      return value
    } else {
      return new Ok(value)
    }
  }

  get isErr () {
    return false
  }

  get isOk () {
    return true
  }

  get [symUltres] () {
    return true
  }

  get [Symbol.toStringTag] () {
    return 'Result'
  }

  constructor (value) {
    // TODO: use private property (#raw)
    this._raw = value
  }

  unwrap () {
    return this._raw
  }

  unwrapErr () {
    throw new Error('Result is ok')
  }

  ok () {
    return this._raw
  }

  err () {
    return undefined
  }

  expect () {
    return this
  }

  expectErr (message = 'Expected err Result') {
    throw new Error(message)
  }

  map (fn) {
    return new Ok(fn(this._raw))
  }

  mapErr () {
    return this
  }

  andThen (fn) {
    return ensureResult(fn(this._raw))
  }

  orElse () {
    return this
  }

  and (obj) {
    return ensureResult(obj)
  }

  or () {
    return this
  }

  tap (fn) {
    fn(this._raw)
    return this
  }

  tapErr () {
    return this
  }
}

class Err {
  static from (value) {
    if (isResult(value)) {
      return value
    } else {
      return new Err(value)
    }
  }

  get isErr () {
    return true
  }

  get isOk () {
    return false
  }

  get [symUltres] () {
    return true
  }

  get [Symbol.toStringTag] () {
    return 'Result'
  }

  constructor (value) {
    // TODO: use private property (#raw)
    this._raw = value
  }

  unwrap () {
    throw new Error('Result is err')
  }

  unwrapErr () {
    return this._raw
  }

  ok () {
    return undefined
  }

  err () {
    return this._raw
  }

  expect (message = 'Expected ok Result') {
    throw new Error(message)
  }

  expectErr () {
    return this
  }

  map () {
    return this
  }

  mapErr (fn) {
    return new Err(fn(this._raw))
  }

  andThen () {
    return this
  }

  orElse (fn) {
    return ensureResult(fn(this._raw))
  }

  and () {
    return this
  }

  or (obj) {
    return ensureResult(obj)
  }

  tap () {
    return this
  }

  tapErr (fn) {
    fn(this._raw)
    return this
  }
}

export default {
  err: Err.from,
  is: isResult,
  ok: Ok.from
}
