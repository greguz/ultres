import test from 'ava'

import Result from './result.mjs'

test('ok basic', t => {
  t.plan(9)

  const result = Result.ok(42)

  t.is(Object.prototype.toString.call(result), '[object Result]')

  t.is(Result.is(result), true)
  t.is(Result.is(null), false)

  t.is(result.isErr, false)
  t.is(result.isOk, true)

  t.is(result.unwrap(), 42)
  t.throws(() => result.unwrapErr())

  t.is(result.ok(), 42)
  t.is(result.err(), undefined)
})

test('ok expect', t => {
  t.plan(4)

  const result = Result.ok(42)
  const expected = result.expect()

  t.false(result === expected)
  t.is(result.unwrap(), 42)
  t.is(expected.unwrap(), 42)
  t.throws(() => result.expectErr())
})

test('ok map', t => {
  t.plan(5)

  const result = Result.ok(21)
  const mapped = result.map(value => {
    t.is(value, 21)
    return value * 2
  })

  t.false(result === mapped)
  t.is(result.unwrap(), 21)
  t.is(mapped.unwrap(), 42)
  t.is(
    result.mapErr(() => t.fail()).unwrap(),
    21
  )
})

test('ok result', t => {
  t.plan(3)

  const result = Result.ok('source')
  const update = result.andThen(() => Result.ok('target'))
  t.is(update.ok(), 'target')
  t.throws(() => result.andThen(() => null))

  const noop = result.orElse(() => t.fail())
  t.is(noop.ok(), 'source')
})

test('ok boolean', t => {
  t.plan(2)

  const result = Result.ok('ok')
  t.is(
    result.and(Result.ok('and')).ok(),
    'and'
  )
  t.is(
    result.or(Result.err('or')).ok(),
    'ok'
  )
})

test('err basic', t => {
  t.plan(9)

  const result = Result.err('nope')

  t.is(Object.prototype.toString.call(result), '[object Result]')

  t.is(Result.is(result), true)
  t.is(Result.is(null), false)

  t.is(result.isErr, true)
  t.is(result.isOk, false)

  t.throws(() => result.unwrap())
  t.is(result.unwrapErr(), 'nope')

  t.is(result.ok(), undefined)
  t.is(result.err(), 'nope')
})

test('err expect', t => {
  t.plan(4)

  const result = Result.err('nope')
  const expected = result.expectErr()

  t.false(result === expected)
  t.is(result.unwrapErr(), 'nope')
  t.is(expected.unwrapErr(), 'nope')
  t.throws(() => result.expect())
})

test('err map', t => {
  t.plan(5)

  const result = Result.err('no')
  const mapped = result.mapErr(value => {
    t.is(value, 'no')
    return 'Oh ' + value
  })

  t.false(result === mapped)
  t.is(result.unwrapErr(), 'no')
  t.is(mapped.unwrapErr(), 'Oh no')
  t.is(
    result.map(() => t.fail()).unwrapErr(),
    'no'
  )
})

test('err result', t => {
  t.plan(3)

  const result = Result.err('source')
  const update = result.orElse(() => Result.ok('target'))
  t.is(update.ok(), 'target')
  t.throws(() => result.orElse(() => null))

  const noop = result.andThen(() => t.fail())
  t.is(noop.err(), 'source')
})

test('err boolean', t => {
  t.plan(2)

  const result = Result.err('err')
  t.is(
    result.and(Result.ok('and')).err(),
    'err'
  )
  t.is(
    result.or(Result.err('or')).err(),
    'or'
  )
})

test('no wrappers', t => {
  t.is(
    Result.err(Result.ok(42)).unwrap(),
    42
  )
  t.is(
    Result.ok(Result.err(24)).unwrapErr(),
    24
  )
})
