/**
 * Mimics the Rust `Result`.
 * https://doc.rust-lang.org/std/result/
 */
export interface Result<O = unknown, E = unknown> {
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
  expect(message?: string): Result<O, never>
  /**
   * Ensures this `Result` to contain an error.
   * Returns a new `Result` object.
   */
  expectErr(message?: string): Result<never, E>
  /**
   * Maps the "ok" value (if any) into something else.
   * Returns a new `Result` object.
   */
  map<T>(fn: (val: O) => T): Result<T, E>
  /**
   * Maps the "err" value (if any) into something else.
   * Returns a new `Result` object.
   */
  mapErr<T>(fn: (err: E) => T): Result<O, T>
  /**
   * Maps the "ok" value (if any) into another `Result`.
   * Throws if the function doesn't return a valid `Result` object.
   */
  andThen<A, B>(fn: (val: O) => Result<A, B>): Result<A, B | E>
  /**
   * Maps the "err" value (if any) into another `Result`.
   * Throws if the function doesn't return a valid `Result` object.
   */
  orElse<A, B>(fn: (err: E) => Result<A, B>): Result<A | O, B>
  /**
   * Logical AND operator.
   * Returns the "err" `Result` between this and the argument.
   */
  and<A, B>(result: Result<A, B>): Result<A | O, B | E>
  /**
   * Logical OR operator.
   * Returns the "ok" `Result` between this and the argument.
   */
  or<A, B>(result: Result<A, B>): Result<A | O, B | E>
}

declare function is(value: unknown): value is Result<unknown, unknown>

export type Ok<T> = T extends any
  ? Result<any, never>
  : T extends Result<infer O, infer E>
    ? Result<O, E>
    : Result<T, never>

declare function ok<T = undefined>(value?: T): Ok<T>

export type Err<T> = T extends any
  ? Result<never, any>
  : T extends Result<infer O, infer E>
    ? Result<O, E>
    : Result<never, T>

declare function err<T = undefined>(value?: T): Err<T>

declare const Result: {
  /**
   * Wrap an error into a `Result` object.
   */
  err: typeof err
  /**
   * Detects `Result` objects.
   */
  is: typeof is
  /**
   * Wrap a value into a `Result` object.
   */
  ok: typeof ok
}

export default Result
