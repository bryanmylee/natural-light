export function pipe<T1>(value: T1): T1;
export function pipe<T1, T2>(value: T1, fn1: (v: T1) => T2): T2;
export function pipe<T1, T2, T3>(value: T1, fn1: (v: T1) => T2, fn2: (v: T2) => T3): T3;
export function pipe<T1, T2, T3, T4>(
	value: T1,
	fn1: (v: T1) => T2,
	fn2: (v: T2) => T3,
	fn3: (v: T3) => T4
): T4;
export function pipe<T1, T2, T3, T4, T5>(
	value: T1,
	fn1: (v: T1) => T2,
	fn2: (v: T2) => T3,
	fn3: (v: T3) => T4,
	fn4: (v: T4) => T5
): T5;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
export function pipe(value: any, ...fns: Function[]) {
	return fns.reduce((acc, fn) => fn(acc), value);
}
