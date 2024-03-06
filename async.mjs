import Result from './result.mjs'

const ultres = Symbol.for('ultres/async')

const is = value => ultres in Object(value)

const from = value => Promise.resolve(value).then(
  obj => is(obj) ? obj.unwrapResult() : obj
)

const passthrough = v => v

const rUnwrap = r => r.unwrap()

const rUnwrapErr = r => r.unwrapErr()

const rOk = r => r.ok()

const rErr = r => r.err()

const wrap = promise => ({
  [Symbol.toStringTag]: 'AsyncResult',
  [ultres]: true,
  unwrap: () => promise.then(rUnwrap),
  unwrapErr: () => promise.then(rUnwrapErr),
  ok: () => promise.then(rOk),
  err: () => promise.then(rErr),
  expect: message => wrap(promise.then(r => r.expect(message))),
  expectErr: message => wrap(promise.then(r => r.expectErr(message))),
  map: fn => wrap(
    promise.then(
      r => r.isOk
        ? Promise.resolve(fn(r.unwrap())).then(Result.ok)
        : r
    )
  ),
  mapErr: fn => wrap(
    promise.then(
      r => r.isErr
        ? Promise.resolve(fn(r.unwrapErr())).then(Result.err)
        : r
    )
  ),
  andThen: fn => wrap(
    promise.then(
      r => r.isOk
        ? from(fn(r.unwrap())).then(r.and)
        : r
    )
  ),
  orElse: fn => wrap(
    promise.then(
      r => r.isErr
        ? from(fn(r.unwrapErr())).then(r.or)
        : r
    )
  ),
  and: target => wrap(
    Promise.all([promise, from(target)]).then(
      ([left, right]) => left.and(right)
    )
  ),
  or: target => wrap(
    Promise.all([promise, from(target)]).then(
      ([left, right]) => left.or(right)
    )
  ),
  tap: fn => wrap(
    promise.then(
      r => r.isOk
        ? Promise.resolve(fn(r.unwrap())).then(() => r)
        : r
    )
  ),
  tapErr: fn => wrap(
    promise.then(
      r => r.isErr
        ? Promise.resolve(fn(r.unwrapErr())).then(() => r)
        : r
    )
  ),
  unwrapResult: () => promise,
  catchRejection: () => wrap(promise.then(passthrough, Result.err))
})

const ok = value => is(value)
  ? value
  : wrap(from(value).then(Result.ok))

const err = value => is(value)
  ? value
  : wrap(from(value).then(Result.err))

export default { err, is, ok }
