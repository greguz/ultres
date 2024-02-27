import type { IResult } from "./result.js"

/**
 * Promised value or raw value.
 */
export type MaybeAsync<T> = Promise<T> | T

/**
 * Can be sync `Result` or `AsyncResult`.
 */
export type AnyResult<O, E> = IAsyncResult<O, E> | IResult<O, E>

/**
 * Promised version of the `Result` object.
 * Mapping and composing methods are directly availble.
 * Call the `unwrap()` method to retrieve the raw internal `Result` object.
 */
export interface IAsyncResult<O = unknown, E = unknown> {
  /**
   * Resolves with a raw `Result`.
   */
  unwrap(): Promise<IResult<O, E>>
  /**
   * Map the current "ok" value into something else. Promises are supported.
   * Returns a new `AsyncResult` object.
   */
  map<T>(fn: (val: O) => MaybeAsync<T>): IAsyncResult<T, E>
  /**
   * Map the current "err" value into something else. Promises are supported.
   * Returns a new `AsyncResult` object.
   */
  mapErr<T>(fn: (err: E) => MaybeAsync<T>): IAsyncResult<O, T>
  /**
   * Map the current "ok" value into a new value.
   * The map function must return a `Result` or an `AsyncResult`.
   * Promises are also supported.
   * Returns a new `AsyncResult` object.
   */
  andThen<A, B>(
    fn: (val: O) => MaybeAsync<AnyResult<A, B>>
  ): IAsyncResult<A, B | E>
  /**
   * Map the current "err" value into a new value.
   * The map function must return a `Result` or an `AsyncResult`.
   * Promises are also supported.
   * Returns a new `AsyncResult` object.
   */
  orElse<A, B>(
    fn: (err: E) => MaybeAsync<AnyResult<A, B>>
  ): IAsyncResult<A | O, B>
  /**
   * Logical AND operator.
   * Returns the first "err" `Result` between this and the argument.
   */
  and<A, B>(result: MaybeAsync<AnyResult<A, B>>): IAsyncResult<A, E | B>
  /**
   * Logical OR operator.
   * Returns the first "ok" `Result` between this and the argument.
   */
  or<A, B>(result: MaybeAsync<AnyResult<A, B>>): IAsyncResult<A | O, B>
  /**
   * Handle `Promise` rejection.
   * This will make the error `unknown`.
   */
  catchErr(): IAsyncResult<O, unknown>
  /**
   * Perform a side-effect with the "ok" value.
   * The `AsyncResult` status will left untouched.
   */
  tap(fn: (val: O) => any): IAsyncResult<O, E>
  /**
   * Perform a side-effect with the "err" value.
   * The `AsyncResult` status will left untouched.
   */
  tapErr(fn: (err: E) => any): IAsyncResult<O, E>
}

/**
 * Detects `AsyncResult` objects.
 */
declare function is(value: unknown): value is IAsyncResult<unknown, unknown>

/**
 * Wraps a value into a positive (ok) `AsyncResult` object.
 */
declare function ok(): IAsyncResult<undefined, never>
declare function ok<O, E>(result: MaybeAsync<AnyResult<O, E>>): IAsyncResult<O, E>
declare function ok<T>(value: Promise<T>): IAsyncResult<T, never>
declare function ok<T>(value: T): IAsyncResult<T, never>

/**
 * Wraps a value into a negative (err) `AsyncResult` object.
 */
declare function err(): IAsyncResult<never, undefined>
declare function err<O, E>(result: MaybeAsync<AnyResult<O, E>>): IAsyncResult<O, E>
declare function err<T>(value: Promise<T>): IAsyncResult<never, T>
declare function err<T>(value: T): IAsyncResult<never, T>

/**
 * Default exported object.
 */
declare const AsyncResult: {
  err: typeof err
  is: typeof is
  ok: typeof ok
}

export default AsyncResult
