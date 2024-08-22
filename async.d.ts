import type { IResult } from "./result.js";

/**
 * Promised value or raw value.
 */
export type MaybeAsync<T> = PromiseLike<T> | T;

/**
 * Can be sync `Result` or `AsyncResult`.
 */
export type AnyResult<O, E> = IAsyncResult<O, E> | IResult<O, E>;

/**
 * Promised version of the `Result` object.
 * Mapping and composing methods are directly availble.
 * Call the `unwrap()` method to retrieve the raw internal `Result` object.
 */
export interface IAsyncResult<O = unknown, E = unknown> {
  /**
   * Returns a Promise that resolves into the "ok" value.
   * A rejection will happen if the `AsyncResult` is _not ok_.
   */
  unwrap(): Promise<O>;
  /**
   * Returns a Promise that resolves into the "err" value.
   * A rejection will happen if the `AsyncResult` is _ok_.
   */
  unwrapErr(): Promise<E>;
  /**
   * Unwrap into a (sync) `Result` object.
   */
  unwrapResult(): Promise<IResult<O, E>>;
  /**
   * Returns a Promise that resolves into the "ok" value or `undefined`.
   */
  ok(): Promise<O | undefined>;
  /**
   * Returns a Promise that resolves into the "err" value or `undefined`.
   */
  err(): Promise<E | undefined>;
  /**
   * Force the `AsyncResult` to be "ok", if not, a rejection will happen during
   * the `AsyncResult` consuming.
   */
  expect(message?: string): IAsyncResult<O, never>;
  /**
   * Force the `AsyncResult` to be "err", if not, a rejection will happen during
   * the `AsyncResult` consuming.
   */
  expectErr(message?: string): IAsyncResult<never, E>;
  /**
   * Map the current "ok" value into something else. Promises are supported.
   * Returns a new `AsyncResult` object.
   */
  map<T>(fn: (val: O) => MaybeAsync<T>): IAsyncResult<T, E>;
  /**
   * Map the current "err" value into something else. Promises are supported.
   * Returns a new `AsyncResult` object.
   */
  mapErr<T>(fn: (err: E) => MaybeAsync<T>): IAsyncResult<O, T>;
  /**
   * Map the current "ok" value into a new value.
   * The map function must return a `Result` or an `AsyncResult`.
   * Promises are also supported.
   * Returns a new `AsyncResult` object.
   */
  andThen<A, B>(
    fn: (val: O) => MaybeAsync<AnyResult<A, B>>
  ): IAsyncResult<A, B | E>;
  /**
   * Map the current "err" value into a new value.
   * The map function must return a `Result` or an `AsyncResult`.
   * Promises are also supported.
   * Returns a new `AsyncResult` object.
   */
  orElse<A, B>(
    fn: (err: E) => MaybeAsync<AnyResult<A, B>>
  ): IAsyncResult<A | O, B>;
  /**
   * Logical AND operator.
   * Returns the first "err" `Result` between this and the argument.
   */
  and<A, B>(result: MaybeAsync<AnyResult<A, B>>): IAsyncResult<A, E | B>;
  /**
   * Logical OR operator.
   * Returns the first "ok" `Result` between this and the argument.
   */
  or<A, B>(result: MaybeAsync<AnyResult<A, B>>): IAsyncResult<A | O, B>;
  /**
   * Perform a side-effect with the "ok" value.
   * The `AsyncResult` status will left untouched.
   */
  tap(fn: (val: O) => any): IAsyncResult<O, E>;
  /**
   * Perform a side-effect with the "err" value.
   * The `AsyncResult` status will left untouched.
   */
  tapErr(fn: (err: E) => any): IAsyncResult<O, E>;
  /**
   * Catch Promise rejection up to this point of the chain.
   * This will change the (possible) error type to `unknown`.
   */
  catchRejection(): IAsyncResult<O, unknown>;
}

/**
 * Detects `AsyncResult` objects.
 */
declare function is(value: unknown): value is IAsyncResult<unknown, unknown>;

/**
 * Wraps a value into a positive (ok) `AsyncResult` object.
 */
declare function ok(): IAsyncResult<undefined, never>;
declare function ok<O, E>(
  result: MaybeAsync<AnyResult<O, E>>
): IAsyncResult<O, E>;
declare function ok<T>(value: T): IAsyncResult<Awaited<T>, never>;

/**
 * Wraps a value into a negative (err) `AsyncResult` object.
 */
declare function err(): IAsyncResult<never, undefined>;
declare function err<O, E>(
  result: MaybeAsync<AnyResult<O, E>>
): IAsyncResult<O, E>;
declare function err<T>(value: T): IAsyncResult<never, Awaited<T>>;

/**
 * Default exported object.
 */
declare const AsyncResult: {
  err: typeof err;
  is: typeof is;
  ok: typeof ok;
};

export default AsyncResult;
