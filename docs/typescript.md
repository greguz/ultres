# TypeScript

There are some special consideration while using `ultres` with TypeScript.

## Complex inferred types

Because of the nature of the `IResult` interface, TypeScript won't be able to infer the expected type.

Let's look to this function:

```typescript
import Result from 'ultres'

function parseNumber (value: unknown) {
  if (typeof value === 'number') {
    return Result.ok(value)
  } else {
    return Result.err('Not a numeric value')
  }
}
```

The inferred return type is `IResult<number, never> | IResult<never, string>`. This is not optimal, because of the union type.

To simplify the output type and prevent the inclusion of unwanted complex types in the function chain, explicitly specify the return type.

```typescript
import Result, { type IResult } from 'ultres'

function parseNumber (value: unknown): IResult<number, string> {
  if (typeof value === 'number') {
    return Result.ok(value)
  } else {
    return Result.err('Not a numeric value')
  }
}
```
