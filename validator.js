function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function nonEmptyNumber(value) {
  return typeof value === "number" && !isNaN(value);
}
module.exports = { nonEmptyString, nonEmptyNumber };
