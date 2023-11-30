# ultres

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![ci](https://github.com/greguz/ultres/actions/workflows/ci.yaml/badge.svg)](https://github.com/greguz/ultres/actions/workflows/ci.yaml)

Yet Another Rust Result lib for Node.js.

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

## Usage

### Ok basics

```javascript
import Result from 'ultres'

const res = Result.ok(42)

console.log('isOk', res.isOk) // true
console.log('isErr', res.isErr) // false

console.log('ok', res.ok()) // 42
console.log('err', res.err()) // undefined

const copy = res.expect()
console.log('orig', Result.is(res)) // true
console.log('copy', Result.is(copy)) // true
console.log('null', Result.is(null)) // false

res.expectErr() // Error: Expected err Result (throw)
```

### Err basics

```javascript
import Result from 'ultres'

const res = Result.err('Oh no')

console.log('isOk', res.isOk) // false
console.log('isErr', res.isErr) // true

console.log('ok', res.ok()) // undefined
console.log('err', res.err()) // 'Oh no'

const copy = res.expectErr()
console.log('orig', Result.is(res)) // true
console.log('copy', Result.is(copy)) // true
console.log('null', Result.is(null)) // false

res.expect() // Error: Expected ok Result (throw)
```

### Mapping

```javascript
import Result from 'ultres'

const int = value => Number.isInteger(value)
  ? Result.ok(value)
  : Result.err(`Value ${value} is not an integer`)

const double = value => value * 2

const up = value => value.toUpperCase()

console.log(
  int(21).map(double).mapErr(up).unwrap()
) // 42

console.log(
  int(null).map(double).mapErr(up).unwrapErr()
) // VALUE NULL IS NOT AN INTEGER
```

### Composing

```javascript
import Result from 'ultres'

const even = value => value % 2 === 0
  ? Result.ok(value)
  : Result.err(`Value ${value} is not even`)

const half = value => value / 2

const yes = Result.ok(84).andThen(even).map(half)
console.log(yes.unwrap()) // 42

const nope = Result.ok(4.2).andThen(even).map(half)
console.log(nope.unwrapErr()) // Value 4.2 is not even
```

### Logic

```javascript
import Result from 'ultres'

const values = [
  Result.ok(33),
  Result.ok(9),
  Result.err('party pooper')
]

const nope = values.reduce((left, right) => left.and(right))
console.log(nope.unwrapErr()) // party pooper

const first = values.reduce((left, right) => left.or(right))
console.log(first.unwrap()) // 33
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
Returns the "err" `Result` between this and the argument.

- `target` `<Result>`
- Returns: `<Result>`

### `Result::or(target)`

Logical OR operator.
Returns the "ok" `Result` between this and the argument.

- `target` `<Result>`
- Returns: `<Result>`

## `AsyncResult` API

```javascript
import AsyncResult from 'ultres/async'
```

### `AsyncResult.ok([value])`

- `[value]` `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult.err([value])`

- `[value]` `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult.is(value)`

- `value` `<*>`
- Returns: `<Boolean>`

### `AsyncResult::unwrap()`

- Returns: `<Promise>`

### `AsyncResult::map(fn)`

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult::mapErr(fn)`

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<*>`
- Returns: `<AsyncResult>`

### `AsyncResult::andThen(fn)`

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::orElse(fn)`

- `fn` `<Function>`
  - `value` `<*>`
  - Returns: `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::and(target)`

- `target` `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`

### `AsyncResult::or(target)`

- `target` `<AsyncResult>` | `<Result>` | `<Promise>`
- Returns: `<AsyncResult>`
