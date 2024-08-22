import Result from './result.mjs'

const symUltresAsync = Symbol.for('ultres/async')

function isAsyncResult (value) {
  return symUltresAsync in Object(value)
}

function isPromise (value) {
  return typeof Object(value).then === 'function'
}

function from (value) {
  if (isPromise(value)) {
    return value.then(from)
  }
  if (isAsyncResult(value)) {
    return value.unwrapResult()
  }
  if (Result.is(value)) {
    return Promise.resolve(value)
  }
  return Promise.resolve(value)
}

class AsyncResult {
  get [symUltresAsync] () {
    return true
  }

  get [Symbol.toStringTag] () {
    return 'AsyncResult'
  }

  constructor (promise) {
    // TODO: use private property (#raw)
    this._raw = promise
  }

  unwrap () {
    return this._raw.then(r => r.unwrap())
  }

  unwrapErr () {
    return this._raw.then(r => r.unwrapErr())
  }

  ok () {
    return this._raw.then(r => r.ok())
  }

  err () {
    return this._raw.then(r => r.err())
  }

  expect (message) {
    return new AsyncResult(
      this._raw.then(r => r.expect(message))
    )
  }

  expectErr (message) {
    return new AsyncResult(
      this._raw.then(r => r.expectErr(message))
    )
  }

  map (fn) {
    return new AsyncResult(
      this._raw.then(
        r => r.isOk
          ? from(fn(r.unwrap())).then(Result.ok)
          : r
      )
    )
  }

  mapErr (fn) {
    return new AsyncResult(
      this._raw.then(
        r => r.isErr
          ? from(fn(r.unwrapErr())).then(Result.err)
          : r
      )
    )
  }

  andThen (fn) {
    return new AsyncResult(
      this._raw.then(
        r => r.isOk
          ? from(fn(r.unwrap())).then(r.and)
          : r
      )
    )
  }

  orElse (fn) {
    return new AsyncResult(
      this._raw.then(
        r => r.isErr
          ? from(fn(r.unwrapErr())).then(r.or)
          : r
      )
    )
  }

  and (target) {
    return new AsyncResult(
      Promise.all([this._raw, from(target)]).then(
        ([left, right]) => left.and(right)
      )
    )
  }

  or (target) {
    return new AsyncResult(
      Promise.all([this._raw, from(target)]).then(
        ([left, right]) => left.or(right)
      )
    )
  }

  tap (fn) {
    return new AsyncResult(
      this._raw.then(
        r => r.isOk
          ? Promise.resolve(fn(r.unwrap())).then(() => r)
          : r
      )
    )
  }

  tapErr (fn) {
    return new AsyncResult(
      this._raw.then(
        r => r.isErr
          ? Promise.resolve(fn(r.unwrapErr())).then(() => r)
          : r
      )
    )
  }

  unwrapResult () {
    return this._raw
  }

  catchRejection () {
    return new AsyncResult(
      this._raw.then(Result.ok, Result.err)
    )
  }
}

function asyncOk (value) {
  if (isAsyncResult(value)) {
    return value
  }
  return new AsyncResult(
    from(value).then(Result.ok)
  )
}

function asyncErr (value) {
  if (isAsyncResult(value)) {
    return value
  }
  return new AsyncResult(
    from(value).then(Result.err)
  )
}

export default {
  err: asyncErr,
  is: isAsyncResult,
  ok: asyncOk
}
