# ultres

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

## Example

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
