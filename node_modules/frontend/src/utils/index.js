export const loadText = async (path) => {
  const text = await (await fetch(path)).text();
  return text;
};
