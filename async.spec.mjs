import test from 'ava'

import AsyncResult from './async.mjs'
import Result from './result.mjs'

test('unwrap', async t => {
  t.is(
    await AsyncResult.ok('v').unwrap(),
    'v'
  )
  t.is(
    await AsyncResult.ok(Result.ok('rv')).unwrap(),
    'rv'
  )
  t.is(
    await AsyncResult.ok(AsyncResult.ok('av')).unwrap(),
    'av'
  )
  t.is(
    await AsyncResult.ok(Promise.resolve('pv')).unwrap(),
    'pv'
  )
  t.is(
    await AsyncResult
      .ok(Promise.resolve(Result.ok('prv')))
      .unwrap(),
    'prv'
  )
  t.is(
    await AsyncResult
      .ok(Promise.resolve(AsyncResult.ok('pav')))
      .unwrap(),
    'pav'
  )

  await t.throwsAsync(
    AsyncResult.err().unwrap(),
    { message: 'Result is err' }
  )
})

test('unwrapErr', async t => {
  t.is(
    await AsyncResult.err('v').unwrapErr(),
    'v'
  )
  t.is(
    await AsyncResult.err(Result.err('rv')).unwrapErr(),
    'rv'
  )
  t.is(
    await AsyncResult.err(AsyncResult.err('av')).unwrapErr(),
    'av'
  )
  t.is(
    await AsyncResult.err(Promise.resolve('pv')).unwrapErr(),
    'pv'
  )
  t.is(
    await AsyncResult
      .err(Promise.resolve(Result.err('prv')))
      .unwrapErr(),
    'prv'
  )
  t.is(
    await AsyncResult
      .err(Promise.resolve(AsyncResult.err('pav')))
      .unwrapErr(),
    'pav'
  )

  await t.throwsAsync(
    AsyncResult.ok().unwrapErr(),
    { message: 'Result is ok' }
  )
})

test('ok', async t => {
  t.is(
    await AsyncResult.ok('yes').ok(),
    'yes'
  )
  t.is(
    await AsyncResult.err('no').ok(),
    undefined
  )
})

test('err', async t => {
  t.is(
    await AsyncResult.ok('yes').err(),
    undefined
  )
  t.is(
    await AsyncResult.err('no').err(),
    'no'
  )
})

test('no wrappers', async t => {
  t.is(
    await AsyncResult
      .err(AsyncResult.ok('one'))
      .unwrap(),
    'one'
  )
  t.is(
    await AsyncResult
      .ok(AsyncResult.ok(AsyncResult.err('two')))
      .unwrapErr(),
    'two'
  )
})

test('catchRejection', async t => {
  await t.throwsAsync(
    AsyncResult.ok(Promise.reject(new Error('Oh no'))).unwrap()
  )

  const obj = await AsyncResult.ok(Promise.reject(new Error('Oh no')))
    .catchRejection()
    .unwrapErr()
  t.like(obj, { message: 'Oh no' })

  t.is(
    await AsyncResult.ok('Oh no?').catchRejection().unwrap(),
    'Oh no?'
  )
})

test('expect', async t => {
  t.is(
    await AsyncResult.ok('yes').expect().unwrap(),
    'yes'
  )
  await t.throwsAsync(
    AsyncResult.err('no').expect().unwrapErr(),
    { message: 'Expected ok Result' }
  )
})

test('expectErr', async t => {
  t.throwsAsync(
    AsyncResult.ok('yes').expectErr().unwrap(),
    { message: 'Expected err Result' }
  )
  t.is(
    await AsyncResult.err('no').expectErr().unwrapErr(),
    'no'
  )
})

test('map', async t => {
  const okSync = await AsyncResult.ok(7).map(v => v * 2).unwrap()
  t.is(okSync, 14)

  const okAsync = await AsyncResult.ok(14).map(async v => v * 2).unwrap()
  t.is(okAsync, 28)

  const err = await AsyncResult.err('nope').map(() => t.fail()).unwrapErr()
  t.is(err, 'nope')
})

test('mapErr', async t => {
  const errSync = await AsyncResult.err('nope')
    .mapErr(v => v.toUpperCase())
    .unwrapErr()
  t.is(errSync, 'NOPE')

  const errAsync = await AsyncResult.err('nope')
    .mapErr(async v => v.toUpperCase())
    .unwrapErr()
  t.is(errAsync, 'NOPE')

  const ok = await AsyncResult.ok('yes')
    .mapErr(() => t.fail())
    .unwrap()
  t.is(ok, 'yes')
})

test('andThen', async t => {
  const fromResult = await AsyncResult.ok('VR')
    .andThen(v => Result.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromResult, 'vr')

  const fromPromisedResult = await AsyncResult.ok('PR')
    .andThen(async v => Result.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromPromisedResult, 'pr')

  const fromAsyncResult = await AsyncResult.ok('VA')
    .andThen(v => AsyncResult.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromAsyncResult, 'va')

  const fromPromisedAsyncResult = await AsyncResult.ok('PA')
    .andThen(async v => AsyncResult.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromPromisedAsyncResult, 'pa')

  const err = await AsyncResult.err('noop')
    .andThen(() => t.fail())
    .unwrapErr()
  t.is(err, 'noop')
})

test('orElse', async t => {
  const fromResult = await AsyncResult.err('VR')
    .orElse(v => Result.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromResult, 'vr')

  const fromPromisedResult = await AsyncResult.err('PR')
    .orElse(async v => Result.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromPromisedResult, 'pr')

  const fromAsyncResult = await AsyncResult.err('VA')
    .orElse(v => AsyncResult.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromAsyncResult, 'va')

  const fromPromisedAsyncResult = await AsyncResult.err('PA')
    .orElse(async v => AsyncResult.ok(v.toLowerCase()))
    .unwrap()
  t.is(fromPromisedAsyncResult, 'pa')

  const ok = await AsyncResult.ok('noop')
    .orElse(() => t.fail())
    .unwrap()
  t.is(ok, 'noop')
})

test('and', async t => {
  const fromAsyncResult = await AsyncResult.ok('left')
    .and(AsyncResult.ok('right'))
    .unwrap()
  t.is(fromAsyncResult, 'right')

  const fromResult = await AsyncResult.ok('left')
    .and(Result.ok('right'))
    .unwrap()
  t.is(fromResult, 'right')

  const fromPromisedAsyncResult = await AsyncResult.ok('left')
    .and(Promise.resolve(AsyncResult.ok('right')))
    .unwrap()
  t.is(fromPromisedAsyncResult, 'right')

  const fromPromisedResult = await AsyncResult.ok('left')
    .and(Promise.resolve(Result.ok('right')))
    .unwrap()
  t.is(fromPromisedResult, 'right')

  await t.throwsAsync(AsyncResult.ok().and(null).unwrap())
})

test('or', async t => {
  const fromAsyncResult = await AsyncResult.err('left')
    .or(AsyncResult.ok('right'))
    .unwrap()
  t.is(fromAsyncResult, 'right')

  const fromResult = await AsyncResult.err('left')
    .or(Result.ok('right'))
    .unwrap()
  t.is(fromResult, 'right')

  const fromPromisedAsyncResult = await AsyncResult.err('left')
    .or(Promise.resolve(AsyncResult.ok('right')))
    .unwrap()
  t.is(fromPromisedAsyncResult, 'right')

  const fromPromisedResult = await AsyncResult.err('left')
    .or(Promise.resolve(Result.ok('right')))
    .unwrap()
  t.is(fromPromisedResult, 'right')

  await t.throwsAsync(AsyncResult.err().or(null).unwrap())
})

test('tap', async t => {
  t.plan(3)

  const ok = await AsyncResult.ok('yes')
    .tap(v => t.is(v, 'yes'))
    .unwrap()
  t.is(ok, 'yes')

  const err = await AsyncResult.err('no')
    .tap(() => t.fail())
    .unwrapErr()
  t.is(err, 'no')
})

test('tapErr', async t => {
  t.plan(3)

  const ok = await AsyncResult.ok('yes')
    .tapErr(() => t.fail())
    .unwrap()
  t.is(ok, 'yes')

  const err = await AsyncResult.err('no')
    .tapErr(v => t.is(v, 'no'))
    .unwrapErr()
  t.is(err, 'no')
})
