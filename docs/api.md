# API

## `Result` (sync)

```javascript
import Result from 'ultres'
```

All APIs are the exact replica of Rust's [`Result`](https://doc.rust-lang.org/std/result/) object. Only the case was changed to adapt better to JS standards.

### `Result.ok([value])`

- `[value]` `<*>`
- Returns: `<Result>`

### `Result.err([value])`

- `[value]` `<*>`
- Returns: `<Result>`

### `Result.is(value)`

- `value` `<*>`
- Returns: `<Boolean>`

### `Result::isOk` (property getter)

Will be `true` when this `Result` contains a value.

- Returns: `<Boolean>`

### `Result::isErr` (property getter)

Will be `true` when this `Result` contains an error.

- Returns: `<Boolean>`

### `Result::unwrap()`

Returns the "ok" value.
Throws an error if this `Result` contains an error.

- Returns: `<*>`

### `Result::unwrapErr()`

Returns the "err" value.
Throws an error if this `Result` doesn't contain an error.

- Returns: `<*>`

### `Result::ok()`

Returns the "ok" value or `undefined`.

- Returns: `<*>`

### `Result::err()`

Returns the "err" value or `undefined`.

- Returns: `<*>`

### `Result::expect([message])`

Ensures this `Result` to contain a valid (ok) value.
Returns a new `Result` object.

- `[message]` `<String>`
- Returns: `<Result>`

### `Result::expectErr([message])`

Ensures this `Result` to contain an error.
Returns a new `Result` object.

- `[message]` `<String>`
- Returns: `<Result>`

### `Result::map(fn)`

Maps the "ok" value (if any) into something else.
Returns a new `Result` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<Result>`

### `Result::mapErr(fn)`

Maps the "err" value (if any) into something else.
Returns a new `Result` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<Result>`

### `Result::andThen(fn)`

Maps the "ok" value (if any) into another `Result`.
Throws if the function doesn't return a valid `Result` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<Result>`
- Returns: `<Result>`

### `Result::orElse(fn)`

Maps the "err" value (if any) into another `Result`.
Throws if the function doesn't return a valid `Result` object.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<Result>`
- Returns: `<Result>`

### `Result::and(target)`

Logical AND operator.
Returns the first "err" `Result` between this and the argument.

- `target` `<Result>`
- Returns: `<Result>`

### `Result::or(target)`

Logical OR operator.
Returns the first "ok" `Result` between this and the argument.

- `target` `<Result>`
- Returns: `<Result>`

### `Result::tap(fn)`

Perform a side-effect with the "ok" value.
The `Result` status will left untouched.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<Result>`

### `Result::tapErr(fn)`

Perform a side-effect with the "err" value.
The `Result` status will left untouched.

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<Result>`

## `AsyncResult` API

```javascript
import AsyncResult from 'ultres/async'
```

This is technically an `async` wrapper of a `Result` object.

The `unwrap` method returns a `Promise` that resolves with its internal [`Result`](#result-api) object.

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

Returns a `Promise` that resolves to a `Result` object.

- Returns: `<Promise>`

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
