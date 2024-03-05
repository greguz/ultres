# ultres

[![npm](https://img.shields.io/npm/v/ultres)](https://www.npmjs.com/package/ultres)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![ci](https://github.com/greguz/ultres/actions/workflows/ci.yaml/badge.svg)](https://github.com/greguz/ultres/actions/workflows/ci.yaml)
[![Coverage Status](https://coveralls.io/repos/github/greguz/ultres/badge.svg?branch=master)](https://coveralls.io/github/greguz/ultres?branch=master)

Flexible and functional `Result` type for handling success and error cases.

## Naming Things Is Hard™

Result > Res ult > ult Res > **Ultres**.

Yup.

## Why

- **Zero dependencies**: banana only, no gorilla or jungle whatsoever
- **FP**: source is just a set of dead-simple closures
- **ESM**: native ESM package
- **CommonJS**: support for older runtimes
- **TypeScript**: first-class support

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

## Donate

Thank you!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/greguz)
