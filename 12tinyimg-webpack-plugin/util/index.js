/**
 * 范围随机数
 * @param {*} min 最小值，默认0
 * @param {*} max 最大值，默认10
 */
function randomNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
module.exports = { randomNum };
