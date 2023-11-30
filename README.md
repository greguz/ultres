# ultres

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![ci](https://github.com/greguz/ultres/actions/workflows/ci.yaml/badge.svg)](https://github.com/greguz/ultres/actions/workflows/ci.yaml)

Rust Result and AsyncResult for Node.js

## Naming Things Is Hard

Result > Res ult > ult Res > **Ultres**.

Yup.

## Why

- **Zero dependencies**: banana only, no gorilla or jungle whatsoever
- **FP**: just dead-simple closures
- **ESM**: native ESM package
- **CommonJS**: support for older runtimes
- **TypeScript**: also dead-simple typings without complex conditional inferences

## Install

```
npm i ultres
```

## Example

```javascript
import Result from 'ultres'
import AsyncResult from 'ultres/async'

const integer = value => {
  if (typeof value === 'bigint' || Number.isInteger(value)) {
    return Result.ok(value)
  } else if (typeof value === 'string' && /^[+-]\d+$/.test(value)) {
    return Result.ok(parseInt(value))
  } else {
    return Result.err(`Value ${value} is not an integer`)
  }
}

const double = value => value * 2

console.log(
  integer(5).map(double).unwrap() // 10
)

console.log(
  integer('-2').map(double).unwrap() // -4
)

console.log(
  integer(null).map(double).unwrapErr() // Value null is not an integer
)

const process = async value => {
  console.log(`process ${value} items`)
  return Result.ok(new Date())
}

const result = await AsyncResult.ok(integer(2))
  .andThen(process)
  .unwrap() // process 2 items

console.log(result.isOk) // true
console.log(result.unwrap()) // 2023-11-30T13:25:59.196Z

const errResult = await AsyncResult.ok(Promise.reject(new Error('Oh no')))
  .catchErr()
  .unwrap()

console.log(errResult.isErr) // true
console.log(errResult.unwrapErr().message) // Oh no
```

## `Result` API

```javascript
import Result from 'ultres'
```

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

## `AsyncResult` API

```javascript
import AsyncResult from 'ultres/async'
```

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
