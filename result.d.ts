/**
 * Mimics the Rust `Result`.
 * https://doc.rust-lang.org/std/result/
 */
export interface IResult<O = unknown, E = unknown> {
  /**
   * Will be `true` when this `Result` contains a value.
   */
  readonly isOk: boolean
  /**
   * Will be `true` when this `Result` contains an error.
   */
  readonly isErr: boolean
  /**
   * Returns the "ok" value.
   * Throws an error if this `Result` contains an error.
   */
  unwrap(): O
  /**
   * Returns the "err" value.
   * Throws an error if this `Result` doesn't contain an error.
   */
  unwrapErr(): E
  /**
   * Returns the "ok" value or `undefined`.
   */
  ok(): O | undefined
  /**
   * Returns the "err" value or `undefined`.
   */
  err(): E | undefined
  /**
   * Ensures this `Result` to contain a valid (ok) value.
   * Returns a new `Result` object.
   */
  expect(message?: string): IResult<O, never>
  /**
   * Ensures this `Result` to contain an error.
   * Returns a new `Result` object.
   */
  expectErr(message?: string): IResult<never, E>
  /**
   * Maps the "ok" value (if any) into something else.
   * Returns a new `Result` object.
   */
  map<T>(fn: (val: O) => T): IResult<T, E>
  /**
   * Maps the "err" value (if any) into something else.
   * Returns a new `Result` object.
   */
  mapErr<T>(fn: (err: E) => T): IResult<O, T>
  /**
   * Maps the "ok" value (if any) into another `Result`.
   * Throws if the function doesn't return a valid `Result` object.
   */
  andThen<A, B>(fn: (val: O) => IResult<A, B>): IResult<A, B | E>
  /**
   * Maps the "err" value (if any) into another `Result`.
   * Throws if the function doesn't return a valid `Result` object.
   */
  orElse<A, B>(fn: (err: E) => IResult<A, B>): IResult<A | O, B>
  /**
   * Logical AND operator.
   * Returns the "err" `Result` between this and the argument.
   */
  and<A, B>(result: IResult<A, B>): IResult<A, E | B>
  /**
   * Logical OR operator.
   * Returns the "ok" `Result` between this and the argument.
   */
  or<A, B>(result: IResult<A, B>): IResult<A | O, B>
  /**
   * Perform a side-effect with the "ok" value.
   * The `Result` status will left untouched.
   */
  tap(fn: (val: O) => any): IResult<O, E>
  /**
   * Perform a side-effect with the "err" value.
   * The `Result` status will left untouched.
   */
  tapErr(fn: (err: E) => any): IResult<O, E>
}

/**
 * Detects `Result` objects.
 */
declare function is(value: unknown): value is IResult<unknown, unknown>

/**
 * Wrap a value into a `Result` object.
 */
declare function ok(): IResult<undefined, never>
declare function ok<O, E>(result: IResult<O, E>): IResult<O, E>
declare function ok<T>(value: T): IResult<T, never>

/**
 * Wrap an error into a `Result` object.
 */
declare function err(): IResult<never, undefined>
declare function err<O, E>(result: IResult<O, E>): IResult<O, E>
declare function err<T>(value: T): IResult<never, T>

/**
 * Default exported object.
 */
declare const Result: {
  err: typeof err
  is: typeof is
  ok: typeof ok
}

export default Result
