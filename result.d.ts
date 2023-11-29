/**
 * Mimics the Rust `Result`.
 * https://doc.rust-lang.org/std/result/
 */
export interface Result<O = unknown, E = unknown> {
  /**
   *
   */
  readonly isOk: boolean
  /**
   *
   */
  readonly isErr: boolean
  /**
   *
   */
  unwrap(): O
  /**
   *
   */
  unwrapErr(): E
  /**
   *
   */
  ok(): O | undefined
  /**
   *
   */
  err(): E | undefined
  /**
   *
   */
  expect(message?: string): Result<O, never>
  /**
   *
   */
  expectErr(message?: string): Result<never, E>
  /**
   *
   */
  map<T>(fn: (val: O) => T): Result<T, E>
  /**
   *
   */
  mapErr<T>(fn: (err: E) => T): Result<O, T>
  /**
   *
   */
  andThen<A, B>(fn: (val: O) => Result<A, B>): Result<A, B | E>
  /**
   *
   */
  orElse<A, B>(fn: (err: E) => Result<A, B>): Result<A | O, B>
  /**
   *
   */
  and<A, B>(result: Result<A, B>): Result<A | O, B | E>
  /**
   *
   */
  or<A, B>(result: Result<A, B>): Result<A | O, B | E>
}

declare function is(value: unknown): value is Result<unknown, unknown>

declare function ok<O = undefined>(value?: O): Result<O, never>

declare function err<E = undefined>(value?: E): Result<never, E>

declare const Result: {
  err: typeof err
  is: typeof is
  ok: typeof ok
}

export default Result
