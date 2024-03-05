# `Result`

## Basic usage

```javascript
import Result from 'ultres'

const yes = Result.ok('Hello world')
const no = Result.err('Oh no')

yes.isOk  // true
yes.isErr // false

no.isOk   // false
no.isErr  // true

Result.is(yes)  // true
Result.is(no)   // true
Result.is({})   // false
```

## Consume

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

```javascript
const message = 'I was expecting something else'

yes.expect(message)     // nothing changes
yes.expectErr(message)  // Error: Expected err Result (error thrown)

no.expect(message)      // Error: Expected ok Result (error thrown)
no.expectErr(message)   // nothing changes
```

> **TIP**: In TypeScript, those methods will change the `Result` type.

## Map

```javascript
const up = v => v.toUpperCase()

yes.map(up)     // .unwrap() will return 'HELLO WORLD'
yes.mapErr(up)  // nothing changes

no.map(up)      // nothing changes
no.mapErr(up)   // .unwrapErr() will return 'OH NO'
```

## Compose

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

```javascript
const log = v => console.log('My value: ' + v)

yes.tap(log).unwrap()       // logs 'My value: Hello world'
yes.tapErr(log).unwrap()    // nothing happens

no.tap(log).unwrapErr()     // nothing happens
no.tapErr(log).unwrapErr()  // logs 'My value: Oh no'
```
