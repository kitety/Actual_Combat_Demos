/**
 * 查询元素选择器是否还不是元素。
 */
export function query(el) {
  if (typeof el === "string") {
    const selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== "production" &&
        console.warn("Cannot find element: " + el);
      return document.createElement("div");
    }
    return selected;
  } else {
    return el;
  }
}
