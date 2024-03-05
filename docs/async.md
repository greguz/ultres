# `AsyncResult`

```javascript
import AsyncResult from 'ultres/async'


```

## Consume

```javascript
import AsyncResult from 'ultres/async'

// Wrap a
const asyncResult = AsyncResult.ok(42)

// Returns a Promise which resolve into a Result
const result = await asyncResult.unwrap()

// You can now manipulate the raw Result object
const value = result.unwrap()

// Logs '42'
console.log(value)
```
