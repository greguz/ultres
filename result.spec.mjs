import test from 'ava'

import Result from './result.mjs'

test('ok', t => {
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

test('err', t => {
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

test('no wrappers', t => {
  t.plan(2)

  t.is(
    Result.err(Result.ok('one')).unwrap(),
    'one'
  )
  t.is(
    Result.ok(Result.ok(Result.err('two'))).unwrapErr(),
    'two'
  )
})

test('expect', t => {
  t.plan(2)

  t.is(Result.ok('ok').expect().unwrap(), 'ok')
  t.throws(() => Result.err().expect())
})

test('expectErr', t => {
  t.plan(2)

  t.is(Result.err('err').expectErr().unwrapErr(), 'err')
  t.throws(() => Result.ok().expectErr())
})

test('map', t => {
  t.plan(2)

  t.is(Result.ok('YES').map(v => v.toLowerCase()).unwrap(), 'yes')
  t.is(Result.err('noop').map(() => t.fail()).unwrapErr(), 'noop')
})

test('mapErr', t => {
  t.plan(2)

  t.is(Result.err('nope').mapErr(v => v.toUpperCase()).unwrapErr(), 'NOPE')
  t.is(Result.ok('noop').mapErr(() => t.fail()).unwrap(), 'noop')
})

test('andThen', t => {
  t.plan(3)

  t.is(
    Result.ok('YES').andThen(v => Result.ok(v.toLowerCase())).unwrap(),
    'yes'
  )
  t.throws(
    () => Result.ok('YES').andThen(v => v.toLowerCase())
  )
  t.is(
    Result.err('noop').andThen(() => t.fail()).unwrapErr(),
    'noop'
  )
})

test('orElse', t => {
  t.plan(3)

  t.is(
    Result.err('nope').orElse(v => Result.ok(v.toUpperCase())).unwrap(),
    'NOPE'
  )
  t.throws(
    () => Result.err('nope').orElse(v => v.toUpperCase())
  )
  t.is(
    Result.ok('noop').orElse(() => t.fail()).unwrap(),
    'noop'
  )
})

test('and', t => {
  t.plan(4)

  t.is(Result.ok('left').and(Result.ok('right')).unwrap(), 'right')
  t.is(Result.err('left').and(Result.ok('right')).unwrapErr(), 'left')
  t.is(Result.ok('left').and(Result.err('right')).unwrapErr(), 'right')
  t.is(Result.err('left').and(Result.err('right')).unwrapErr(), 'left')
})

test('or', t => {
  t.plan(4)

  t.is(Result.ok('left').or(Result.ok('right')).unwrap(), 'left')
  t.is(Result.err('left').or(Result.ok('right')).unwrap(), 'right')
  t.is(Result.ok('left').or(Result.err('right')).unwrap(), 'left')
  t.is(Result.err('left').or(Result.err('right')).unwrapErr(), 'right')
})

test('tap', t => {
  t.plan(3)
  t.is(
    Result.ok('ok')
      .tap(v => t.is(v, 'ok'))
      .unwrap(),
    'ok'
  )
  t.is(
    Result.err('nope')
      .tap(() => t.fail())
      .unwrapErr(),
    'nope'
  )
})

test('tapErr', t => {
  t.plan(3)
  t.is(
    Result.ok('ok')
      .tapErr(() => t.fail())
      .unwrap(),
    'ok'
  )
  t.is(
    Result.err('nope')
      .tapErr(v => t.is(v, 'nope'))
      .unwrapErr(),
    'nope'
  )
})
