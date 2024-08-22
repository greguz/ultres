# `Result`

An object representation of a successfull or errored status.

## Basic usage

The whole package `ultres` package exports just three functions: `ok`, `err`, and `is`. The first two declares a new `Result` instance, the other detects a `Result` instance.

```javascript
import Result from 'ultres'

// Declare two different results
const yes = Result.ok('Hello world')
const no = Result.err('Oh no')

yes.isOk  // true
yes.isErr // false

no.isOk   // false
no.isErr  // true

// Detect results
Result.is(yes)  // true
Result.is(no)   // true
Result.is({})   // false
```

## Consume

Those methods will let you access the internal value.

The `.unwrap()` and `.unwrapErr()` methods will throw an error if the `Result` status is "err" or "ok" respectively. The `.ok()` and `.err()` will let you access the internal value without any active check.

```javascript
yes.unwrap()    // 'Hello world'
yes.unwrapErr() // Error: Result is ok (error thrown)
yes.ok()        // 'Hello world'
yes.err()       // undefined

no.unwrap()     // Error: Result is err (error thrown)
no.unwrapErr()  // 'Oh no'
no.ok()         // undefined
no.err()        // 'Oh no'
```

## Expectations

Those methods are similar to `.unwrap()` and `.unwrapErr()`. They let you access the interval value with an active check, but also let you to customize the error message.

All methods return a new (immutable) `Result` instance.

```javascript
const message = 'I was expecting something else'

yes.expect(message)     // nothing changes
yes.expectErr(message)  // Error: I was expecting something else (error thrown)

no.expect(message)      // Error: I was expecting something else (error thrown)
no.expectErr(message)   // nothing changes
```

> **TIP**: In TypeScript, those methods will change the `Result` type.

## Map

Transform the `Result` value into something else. The `.map()` method will only map "ok" values, and the `.mapErr()` will only map "err" values.

All methods return a new (immutable) `Result` instance.

```javascript
const up = v => v.toUpperCase()

yes.map(up)     // .unwrap() will return 'HELLO WORLD'
yes.mapErr(up)  // nothing changes

no.map(up)      // nothing changes
no.mapErr(up)   // .unwrapErr() will return 'OH NO'
```

## Compose

Compose other `Result` functions. Those methods will let you apply map functions that return other `Result` instances.

All methods return a new (immutable) `Result` instance.

```javascript
const goon = v => Result.ok(v.toUpperCase())
const stop = v => Result.err('Not valid: ' + v)

yes.andThen(goon) // .unwrap() will return 'HELLO WORLD'
yes.andThen(stop) // .unwrapErr() will return 'Not valid: Hello world'
yes.orElse(stop)  // nothing changes

no.orElse(goon)   // .unwrap() will return 'OH NO'
no.orElse(stop)   // .unwrapErr() will return 'Not valid: Oh no'
no.andThen(stop)  // nothing changes
```

## Boolean logic

Reduce two different `Result` instances by their current status.

All methods return a new (immutable) `Result` instance.

```javascript
yes.and(no).isOk  // false (keep right result)
no.and(yes).isOk  // false (keep left result)

yes.and(yes).isOk // true (keep right result)
no.and(no).isOk   // false (keep left result)

yes.or(no).isOk   // true (keep left result)
no.or(yes).isOk   // true (keep right result)

yes.or(yes).isOk  // true (keep left result)
no.or(no).isOk    // false (keep right result)
```

## Side effects

Perform a side effect (run a function with the `Result` value as argument) when the `Result` is consumed.

All methods return a new (immutable) `Result` instance.

```javascript
const log = v => console.log('My value: ' + v)

yes.tap(log).unwrap()       // logs 'My value: Hello world'
yes.tapErr(log).unwrap()    // nothing happens

no.tap(log).unwrapErr()     // nothing happens
no.tapErr(log).unwrapErr()  // logs 'My value: Oh no'
```

> **WARNING**: The side effect will run instantly.

## API

### `Result.ok([value])`

Creates an "ok" `Result` instance.

- `[value]` `<*>`
- Returns: `<Result>`

### `Result.err([value])`

Creates an "err" `Result` instance.

- `[value]` `<*>`
- Returns: `<Result>`

### `Result.is(value)`

Returns `true` when `value` is a `Result` instance.

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
