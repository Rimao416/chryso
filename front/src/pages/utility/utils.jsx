import dayjs from "dayjs";
export const convertData = (data) => {
  return dayjs(data).format("DD/MM/YYYY");
};
export const removeEmptyProperties = (obj) => {
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
