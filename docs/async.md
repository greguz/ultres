# `AsyncResult`

## Differences with `Result`

All [`Result`](/docs/result.md) methods are present.

- Sync status check flags (`isOk` and `isErr`) are **not** present.
- Consume methods (`unwrap`, `unwrapErr`, `ok`, and `err`) return a `Promise`.
- Map methods (`map` and `mapErr`) accept a `Promise` returned by the callback.
- Compose methods (`andThen` and `orElse`) accept a `Promise` and/or a `Result` value returned by the callback.
- Boolean-logic methods (`and` and `or`) accept both a `Result` or an `AsyncResult` optionally wrapped into a `Promise`.
- Side-effects methods (`tap` and `tapErr`) accept a `Promise` returned by the callback function.
- Added `unwrapResult` that returns a `Promise` that resolves with a (sync) `Result` object.
- Added `catchRejection` method that handle the `Promise` rejection as an "err" `Result`.

## Consume

```javascript
import AsyncResult from 'ultres/async'

const v = await AsyncResult.ok('Hello world').unwrap()
console.log(v) // Logs 'Hello world'

const p = await AsyncResult.ok(Promise.resolve('Promise')).ok()
console.log(p) // Logs 'Promise'

const r = await AsyncResult.err('Oh no').unwrapResult()
console.log(r.unwrapErr()) // Logs 'Oh no'
```

## `Promise` rejection

Any `Promise` rejection is left unhandled by default. This is done by design to preserve the handled errors' types.

```javascript
await AsyncResult
  .ok(Promise.reject('Oh no'))
  .unwrapErr() // Unhandled rejection here
```

However, there are some cases that handling the rejection is desired.

```javascript
const v = await AsyncResult
  .ok(Promise.reject('Oh no'))
  .catchRejection()
  .unwrapErr()

console.log(v) // Logs 'Oh no'
```

Because of the nature of JavaScript, after the `catchRejection` call, the error type will be `unknown`.

## API

### `AsyncResult.ok([value])`

Wrap a value into a positive `AsyncResult`.
The `value` con also be a `Result`, another `AsyncResult`, or a `Promise` that resolves to a `Result` or an `AsyncResult`.

- `[value]` `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult.err([value])`

Wrap a value into a negative `AsyncResult`.
The `value` con also be a `Result`, another `AsyncResult`, or a `Promise` that resolves to a `Result` or an `AsyncResult`.

- `[value]` `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult.is(value)`

Detects `AsyncResult` objects.

- `value` `<*>`
- Returns: `<Boolean>`

### `AsyncResult::unwrap()`

Returns a `Promise` that resolves with the "ok" value.
A rejection will happen if the `AsyncResult` is _not ok_.

- Returns: `<Promise>`

### `AsyncResult::unwrapErr()`

Returns a `Promise` that resolves with the "err" value.
A rejection will happen if the `AsyncResult` is _ok_.

- Returns: `<Promise>`

### `AsyncResult::unwrapResult()`

Returns a `Promise` that resolves with a `Result` object that represents the
latest status of the `Promise` chain.

- Returns: `<Promise>`

### `AsyncResult::ok()`

Returns a `Promise` that resolves with the "ok" value or `undefined`.

- Returns: `<Promise>`

### `AsyncResult::err()`

Returns a `Promise` that resolves with the "err" value or `undefined`.

- Returns: `<Promise>`

### `AsyncResult::expect()`

Force the `AsyncResult` to be "err", if not, a rejection will happen during the `AsyncResult` consuming.

- Returns: `<AsyncResult>`

### `AsyncResult::expectErr()`

Force the `AsyncResult` to be "err", if not, a rejection will happen during the `AsyncResult` consuming.

- Returns: `<AsyncResult>`

### `AsyncResult::map(fn)`

Map the current "ok" value into something else. Promises are supported.
Returns a new `AsyncResult` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult::mapErr(fn)`

Map the current "err" value into something else. Promises are supported.
Returns a new `AsyncResult` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult::andThen(fn)`

Map the current "ok" value into a new value.
The map function must return a `Result` or an `AsyncResult`.
Promises are also supported.
Returns a new `AsyncResult` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::orElse(fn)`

Map the current "err" value into a new value.
The map function must return a `Result` or an `AsyncResult`.
Promises are also supported.
Returns a new `AsyncResult` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::and(target)`

Logical AND operator.
Returns the first "err" `Result` between this and the argument.
The `target` can be a `Result`, an `AsyncResult`, or a `Promise` that resolves with `Result` or `AsyncResult.`

- `target` `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::or(target)`

Logical OR operator.
Returns the first "ok" `Result` between this and the argument.
The `target` can be a `Result`, an `AsyncResult`, or a `Promise` that resolves with `Result` or `AsyncResult.`

- `target` `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::tap(fn)`

Perform a side-effect with the "ok" value.
The `AsyncResult` status will left untouched.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult::tapErr(fn)`

Perform a side-effect with the "err" value.
The `AsyncResult` status will left untouched.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult::catchRejection()`

Catch `Promise` rejection up to this point of the chain.

- Returns: `<AsyncResult>`
