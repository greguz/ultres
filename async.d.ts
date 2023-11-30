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
}

declare function is(value: unknown): value is IAsyncResult<unknown, unknown>

export type AsyncOk<T> = T extends PromiseLike<infer P>
  ? AsyncOk<Awaited<P>>
  : T extends IResult<infer O, infer E>
    ? IAsyncResult<O, E>
    : T extends IAsyncResult<infer O, infer E>
      ? IAsyncResult<O, E>
      : IAsyncResult<T, never>

declare function ok<T = undefined>(value?: T): AsyncOk<T>

export type AsyncErr<T> = T extends PromiseLike<infer P>
  ? AsyncErr<Awaited<P>>
  : T extends IResult<infer O, infer E>
    ? IAsyncResult<O, E>
    : T extends IAsyncResult<infer O, infer E>
      ? IAsyncResult<O, E>
      : IAsyncResult<never, T>

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
