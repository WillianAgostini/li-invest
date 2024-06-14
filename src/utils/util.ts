export function clone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function isNullOrUndefined(value: any) {
  return value == null || value == undefined;
}
