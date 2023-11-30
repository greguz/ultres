const ultres = Symbol.for('ultres')

const nothing = () => undefined

const is = value => ultres in Object(value)

const stop = message => { throw new Error(message) }

const ensure = value => is(value) ? value : stop('Expected a Result')

const wasOk = () => stop('Result is ok')

const expectedErr = message => stop(message || 'Expected err Result')

const wasErr = () => stop('Result is err')

const expectedOk = message => stop(message || 'Expected ok Result')

const ok = value => {
  if (is(value)) {
    return value
  }

  const eject = () => value
  const copy = () => ok(value)
  return {
    [Symbol.toStringTag]: 'Result',
    [ultres]: true,
    isErr: false,
    isOk: true,
    unwrap: eject,
    unwrapErr: wasOk,
    ok: eject,
    err: nothing,
    expect: copy,
    expectErr: expectedErr,
    map: fn => ok(fn(value)),
    mapErr: copy,
    andThen: fn => ensure(fn(value)),
    orElse: copy,
    and: ensure,
    or: copy
  }
}

const err = value => {
  if (is(value)) {
    return value
  }

  const eject = () => value
  const copy = () => err(value)
  return {
    [Symbol.toStringTag]: 'Result',
    [ultres]: true,
    isErr: true,
    isOk: false,
    unwrap: wasErr,
    unwrapErr: eject,
    ok: nothing,
    err: eject,
    expect: expectedOk,
    expectErr: copy,
    map: copy,
    mapErr: fn => err(fn(value)),
    andThen: copy,
    orElse: fn => ensure(fn(value)),
    and: copy,
    or: ensure
  }
}

export default { err, is, ok }
