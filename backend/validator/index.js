export const validator = {
  name: (value) => /^[A-Za-z]/.test(value),
  score: (value) => /^[0-9]*$/.test(value),
};
