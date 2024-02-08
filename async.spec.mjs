import test from 'ava'

import AsyncResult from './async.mjs'
import Result from './result.mjs'

const unwrap = result => result.unwrap().then(r => r.unwrap())
const unwrapErr = result => result.unwrap().then(r => r.unwrapErr())

test('ok', async t => {
  const fromValue = await unwrap(
    AsyncResult.ok('v')
  )
  t.is(fromValue, 'v')

  const fromResult = await unwrap(
    AsyncResult.ok(Result.ok('rv'))
  )
  t.is(fromResult, 'rv')

  const fromAsyncResult = await unwrap(
    AsyncResult.ok(AsyncResult.ok('av'))
  )
  t.is(fromAsyncResult, 'av')

  const fromPromise = await unwrap(
    AsyncResult.ok(Promise.resolve('pv'))
  )
  t.is(fromPromise, 'pv')

  const fromPromisedResult = await unwrap(
    AsyncResult.ok(Promise.resolve(Result.ok('prv')))
  )
  t.is(fromPromisedResult, 'prv')

  const fromPromisedAsyncResult = await unwrap(
    AsyncResult.ok(Promise.resolve(AsyncResult.ok('pav')))
  )
  t.is(fromPromisedAsyncResult, 'pav')
})

test('no wrappers', async t => {
  t.is(
    await unwrap(AsyncResult.err(AsyncResult.ok('one'))),
    'one'
  )
  t.is(
    await unwrapErr(AsyncResult.ok(AsyncResult.ok(AsyncResult.err('two')))),
    'two'
  )
})

test('catchErr', async t => {
  await t.throwsAsync(
    AsyncResult.ok(Promise.reject(new Error('Oh no'))).unwrap()
  )

  const result = await AsyncResult.ok(Promise.reject(new Error('Oh no')))
    .catchErr()
    .unwrap()

  t.true(Result.is(result))
  t.true(result.isErr)
  t.like(result.unwrapErr(), { message: 'Oh no' })
})

test('map', async t => {
  const okSync = await unwrap(AsyncResult.ok(7).map(v => v * 2))
  t.is(okSync, 14)

  const okAsync = await unwrap(AsyncResult.ok(14).map(async v => v * 2))
  t.is(okAsync, 28)

  const err = await unwrapErr(AsyncResult.err('nope').map(() => t.fail()))
  t.is(err, 'nope')
})

test('mapErr', async t => {
  const errSync = await unwrapErr(
    AsyncResult.err('nope').mapErr(v => v.toUpperCase())
  )
  t.is(errSync, 'NOPE')

  const errAsync = await unwrapErr(
    AsyncResult.err('nope').mapErr(async v => v.toUpperCase())
  )
  t.is(errAsync, 'NOPE')

  const ok = await unwrap(AsyncResult.ok('yes').mapErr(() => t.fail()))
  t.is(ok, 'yes')
})

test('andThen', async t => {
  const fromResult = await unwrap(
    AsyncResult.ok('VR').andThen(v => Result.ok(v.toLowerCase()))
  )
  t.is(fromResult, 'vr')

  const fromPromisedResult = await unwrap(
    AsyncResult.ok('PR').andThen(async v => Result.ok(v.toLowerCase()))
  )
  t.is(fromPromisedResult, 'pr')

  const fromAsyncResult = await unwrap(
    AsyncResult.ok('VA').andThen(v => AsyncResult.ok(v.toLowerCase()))
  )
  t.is(fromAsyncResult, 'va')

  const fromPromisedAsyncResult = await unwrap(
    AsyncResult.ok('PA').andThen(async v => AsyncResult.ok(v.toLowerCase()))
  )
  t.is(fromPromisedAsyncResult, 'pa')

  const err = await unwrapErr(AsyncResult.err('noop').andThen(() => t.fail()))
  t.is(err, 'noop')
})

test('orElse', async t => {
  const fromResult = await unwrap(
    AsyncResult.err('VR').orElse(v => Result.ok(v.toLowerCase()))
  )
  t.is(fromResult, 'vr')

  const fromPromisedResult = await unwrap(
    AsyncResult.err('PR').orElse(async v => Result.ok(v.toLowerCase()))
  )
  t.is(fromPromisedResult, 'pr')

  const fromAsyncResult = await unwrap(
    AsyncResult.err('VA').orElse(v => AsyncResult.ok(v.toLowerCase()))
  )
  t.is(fromAsyncResult, 'va')

  const fromPromisedAsyncResult = await unwrap(
    AsyncResult.err('PA').orElse(async v => AsyncResult.ok(v.toLowerCase()))
  )
  t.is(fromPromisedAsyncResult, 'pa')

  const ok = await unwrap(AsyncResult.ok('noop').orElse(() => t.fail()))
  t.is(ok, 'noop')
})

test('and', async t => {
  const fromAsyncResult = await unwrap(
    AsyncResult.ok('left').and(AsyncResult.ok('right'))
  )
  t.is(fromAsyncResult, 'right')

  const fromResult = await unwrap(
    AsyncResult.ok('left').and(Result.ok('right'))
  )
  t.is(fromResult, 'right')

  const fromPromisedAsyncResult = await unwrap(
    AsyncResult.ok('left').and(Promise.resolve(AsyncResult.ok('right')))
  )
  t.is(fromPromisedAsyncResult, 'right')

  const fromPromisedResult = await unwrap(
    AsyncResult.ok('left').and(Promise.resolve(Result.ok('right')))
  )
  t.is(fromPromisedResult, 'right')

  await t.throwsAsync(unwrap(AsyncResult.ok().and(null)))
})

test('or', async t => {
  const fromAsyncResult = await unwrap(
    AsyncResult.err('left').or(AsyncResult.ok('right'))
  )
  t.is(fromAsyncResult, 'right')

  const fromResult = await unwrap(
    AsyncResult.err('left').or(Result.ok('right'))
  )
  t.is(fromResult, 'right')

  const fromPromisedAsyncResult = await unwrap(
    AsyncResult.err('left').or(Promise.resolve(AsyncResult.ok('right')))
  )
  t.is(fromPromisedAsyncResult, 'right')

  const fromPromisedResult = await unwrap(
    AsyncResult.err('left').or(Promise.resolve(Result.ok('right')))
  )
  t.is(fromPromisedResult, 'right')

  await t.throwsAsync(unwrap(AsyncResult.err().or(null)))
})

test('tap', async t => {
  t.plan(3)

  const ok = await unwrap(
    AsyncResult.ok('yes').tap(v => t.is(v, 'yes'))
  )
  t.is(ok, 'yes')

  const err = await unwrapErr(
    AsyncResult.err('no').tap(() => t.fail())
  )
  t.is(err, 'no')
})

test('tapErr', async t => {
  t.plan(3)

  const ok = await unwrap(
    AsyncResult.ok('yes').tapErr(() => t.fail())
  )
  t.is(ok, 'yes')

  const err = await unwrapErr(
    AsyncResult.err('no').tapErr(v => t.is(v, 'no'))
  )
  t.is(err, 'no')
})
