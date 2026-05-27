//#region src/lib/api.ts
var API_BASE = "";
try {
	API_BASE = "http://localhost:3001";
} catch {}
function getApiBase() {
	return API_BASE;
}
async function request(path, options) {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers
		}
	});
	if (!res.ok) {
		const body = await res.json().catch((err) => console.error("API error:", err));
		throw new Error(body.error || `Error ${res.status}`);
	}
	return res.json();
}
var api = {
	getStats() {
		return request("/api/stats");
	},
	getMembers() {
		return request("/api/members");
	},
	getCompatibilities() {
		return request("/api/compatibilities");
	},
	getGuides() {
		return request("/api/guides");
	},
	getParts(params) {
		const queryString = new URLSearchParams(params).toString();
		return request(queryString ? `/api/parts?${queryString}` : "/api/parts");
	},
	confirmCompatibility(id) {
		return request(`/api/compatibilities/${id}/confirm`, { method: "POST" });
	},
	getConfirmationStatus(id) {
		return request(`/api/compatibilities/${id}/confirmations/count`);
	},
	submit(data) {
		return request("/api/submissions", {
			method: "POST",
			body: JSON.stringify(data)
		});
	},
	getGallery() {
		return request("/api/gallery");
	},
	submitGalleryPhoto(formData) {
		return fetch(`${API_BASE}/api/gallery/submit`, {
			method: "POST",
			body: formData
		}).then(async (res) => {
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || `Error ${res.status}`);
			}
			return res.json();
		});
	}
};
//#endregion
export { getApiBase as n, api as t };
