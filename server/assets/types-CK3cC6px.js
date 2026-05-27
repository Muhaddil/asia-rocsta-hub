//#region src/data/types.ts
function localize(value, lang) {
	if (typeof value === "string") return value;
	return value[lang] || value["es"] || "";
}
//#endregion
export { localize as t };
