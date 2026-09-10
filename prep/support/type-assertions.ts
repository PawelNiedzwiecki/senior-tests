/**
 * Hand-rolled type assertion helpers.
 *
 * `expectTypeOf` from Vitest covers most cases, but interviewers love asking
 * "how would you test a type?" — and this is the answer worth being able to
 * write on a whiteboard. Know why the conditional is *deferred* on a naked
 * type parameter: `<T>() => T extends X ? 1 : 2` is only assignable to
 * `<T>() => T extends Y ? 1 : 2` when X and Y are identical, which is how we
 * get strict (non-mutual-assignability) equality.
 */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;

/** Fails to compile unless `T` is exactly `true`. */
export type Expect<T extends true> = T;

/** Fails to compile unless `T` is exactly `false`. */
export type ExpectFalse<T extends false> = T;

/** `IsAny<any>` is true; everything else false. Useful for catching `any` leaks. */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/** True when `T` is `never`. Wrapped in tuples to stop union distribution. */
export type IsNever<T> = [T] extends [never] ? true : false;
