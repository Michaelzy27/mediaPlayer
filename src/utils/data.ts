export const trimStrings = (obj: any, deleteBlank = false) => {
  // trim all strings in an object
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    for (const k of keys) {
      const val = obj[k];
      if (typeof val === 'string') {
        obj[k] = val.trim();
        if (obj[k] === '' && deleteBlank) {
          delete obj[k];
        }
      }
      if (typeof val === 'object') {
        // recursively update values
        obj[k] = trimStrings(val);
      }
    }
  }

  return obj;
};