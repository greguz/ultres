import type { Result } from "./result.js"

/**
 * Promised value or raw value.
 */
export type MaybeAsync<T> = Promise<T> | T

/**
 * Can be sync `Result` or `AsyncResult`.
 */
export type AnyResult<O, E> = AsyncResult<O, E> | Result<O, E>

/**
 * Promised version of the `Result` object.
 * Mapping and composing methods are directly availble.
 * Call the `unwrap()` method to retrieve the raw internal `Result` object.
 */
export interface AsyncResult<O = unknown, E = unknown> {
  /**
   * Resolves with a raw `Result`.
   */
  unwrap(): Promise<Result<O, E>>
  /**
   * Map the current "ok" value into something else. Promises are supported.
   * Returns a new `AsyncResult` object.
   */
  map<T>(fn: (val: O) => MaybeAsync<T>): AsyncResult<T, E>
  /**
   * Map the current "err" value into something else. Promises are supported.
   * Returns a new `AsyncResult` object.
   */
  mapErr<T>(fn: (err: E) => MaybeAsync<T>): AsyncResult<O, T>
  /**
   * Map the current "ok" value into a new value.
   * The map function must return a `Result` or an `AsyncResult`.
   * Promises are also supported.
   * Returns a new `AsyncResult` object.
   */
  andThen<A, B>(
    fn: (val: O) => MaybeAsync<AnyResult<A, B>>
  ): AsyncResult<A, B | E>
  /**
   * Map the current "err" value into a new value.
   * The map function must return a `Result` or an `AsyncResult`.
   * Promises are also supported.
   * Returns a new `AsyncResult` object.
   */
  orElse<A, B>(
    fn: (err: E) => MaybeAsync<AnyResult<A, B>>
  ): AsyncResult<A | O, B>
  /**
   * Logical AND operator.
   * Returns the first "err" `Result` between this and the argument.
   */
  and<A, B>(result: MaybeAsync<AnyResult<A, B>>): AsyncResult<A | O, B | E>
  /**
   * Logical OR operator.
   * Returns the first "ok" `Result` between this and the argument.
   */
  or<A, B>(result: MaybeAsync<AnyResult<A, B>>): AsyncResult<A | O, B | E>
  /**
   * Handle `Promise` rejection.
   * This will make the error `unknown`.
   */
  catchErr(): AsyncResult<O, unknown>
}

declare function is(value: unknown): value is AsyncResult<unknown, unknown>

export type AsyncOk<T> = T extends any
  ? AsyncResult<any, never>
  : T extends MaybeAsync<AnyResult<infer O, infer E>>
    ? AsyncResult<O, E>
    : AsyncResult<T, never>

declare function ok<T = undefined>(value?: T): AsyncOk<T>

export type AsyncErr<T> = T extends any
  ? AsyncResult<never, any>
  : T extends MaybeAsync<AnyResult<infer O, infer E>>
    ? AsyncResult<O, E>
    : AsyncResult<never, T>

declare function err<T = undefined>(value?: T): AsyncErr<T>

declare const AsyncResult: {
  /**
   *
   */
  err: typeof err
  /**
   * Detects `AsyncResult` objects.
   */
  is: typeof is
  /**
   *
   */
  ok: typeof ok
}

export default AsyncResult
