export const customStringify = (obj) => {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

export const customParse = (str) => {
  return JSON.parse(str, (_, value) =>
    typeof value === 'string' && /^\d+n$/.test(value)
      ? BigInt(value.slice(0, -1))
      : value
  );
};
