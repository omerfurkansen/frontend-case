export const getProperString = (str: string) => {
  return str.replace(/&amp;/g, '&');
}

export const getUniqueArray = (arr: string[]) => {
  return Array.from(new Set(arr));
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
