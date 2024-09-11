export const trimObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    // Allow true, false and of course 0
    if (obj[key] !== true && obj[key] !== false && obj[key] !== 0) {
      if (
        obj[key] == null ||
        obj[key] == undefined ||
        obj[key] == "" ||
        obj[key] == {} ||
        obj[key] == []
      ) {
        delete obj[key];
      }
    }
  });
  for (const key in obj) {
    obj[key] = typeof obj[key] == "string" ? obj?.[key]?.trim() : obj?.[key];
  }
  return obj;
};

export function getRandomOrderNumber(min = 100000, max = 10000000) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const getAverageReview = (reviews) => {
  const sum = reviews.reduce((total, current) => total + current, 0);
  const num = reviews.length;
  return sum / num;
};
