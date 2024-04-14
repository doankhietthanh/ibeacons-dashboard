export const convertUndefinedToNull = (obj: any) => {
  if (obj === undefined) {
    return null;
  }

  if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = convertUndefinedToNull(obj[key]);
    }
  }

  return obj;
};
