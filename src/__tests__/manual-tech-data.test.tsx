import { describe, it, expect, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ManualTechData } from "../components/manual/manual-tech-data";
import { LanguageProvider, type Language } from "../components/language-provider";

afterEach(cleanup);

function renderTech(language: Language, motor: "all" | "F8" | "R2" = "all") {
  return render(
    <LanguageProvider initialLanguage={language}>
      <ManualTechData motor={motor} onMotorChange={() => {}} onViewPage={() => {}} />
    </LanguageProvider>,
  );
}

function expandAll(language: Language) {
  fireEvent.click(
    screen.getByRole("button", { name: language === "en" ? /expand all/i : /expandir todo/i }),
  );
}

function search(value: string) {
  fireEvent.change(screen.getByRole("searchbox"), { target: { value } });
}

describe("ManualTechData", () => {
  it("renders every group and table title while collapsed", () => {
    const { container } = renderTech("en");
    const text = container.textContent ?? "";
    expect(text).toContain("Engine & systems");
    expect(text).toContain("Drivetrain");
    expect(text).toContain("Chassis");
    expect(text).toContain("Body");
    expect(text).toContain("Engine — general");
    expect(text).toContain("Cylinder head, valves & tappets");
    expect(text).toContain("Cylinder block, pistons & rings");
    expect(text).toContain("Tightening torques — engine");
    expect(text).toContain("Wheels & tires");
    expect(text).toContain("Body electrical system");
  });

  it("keeps rows hidden until a table is expanded", () => {
    renderTech("en");
    expect(screen.queryByText("Diesel, four-cycle")).toBeNull();
    expandAll("en");
    expect(screen.getAllByText("Diesel, four-cycle").length).toBeGreaterThan(0);
  });

  it("localizes row labels and textual values", () => {
    renderTech("en");
    expandAll("en");
    expect(screen.getAllByText("Gasoline, four-cycle").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Swirl flow type").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Multispherical").length).toBeGreaterThan(0);
  });

  it("localizes to Spanish when the language is es", () => {
    renderTech("es");
    expandAll("es");
    expect(screen.getAllByText("Diésel, 4 tiempos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gasolina, 4 tiempos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Culata, válvulas y taqués").length).toBeGreaterThan(0);
  });

  it("shows shared values in both engine columns instead of a dash", () => {
    renderTech("en");
    expandAll("en");
    // "Four cylinders, in-line" is a ditto value shared by R2 and F8.
    expect(screen.getAllByText("Four cylinders, in-line")).toHaveLength(2);
  });

  it("keeps missing split columns as a dash", () => {
    renderTech("en");
    expandAll("en");
    // Timing belt cover (upper) only has a gasoline value.
    const row = screen.getByText("Timing belt cover (upper)").closest("tr");
    expect(row).not.toBeNull();
    const cells = row?.querySelectorAll("td") ?? [];
    expect(cells).toHaveLength(3);
    expect(cells[1].textContent).toBe("—");
    expect(cells[2].textContent).toBe("0.8–1.2 kg·m (5.8–8.6 ft·lb)");
  });

  it("shows the per-engine final drive ratio and pinion teeth", () => {
    renderTech("en");
    expandAll("en");

    const ratioRow = screen.getByText("Reduction ratio").closest("tr");
    const ratioCells = ratioRow?.querySelectorAll("td") ?? [];
    expect(ratioCells).toHaveLength(3);
    expect(ratioCells[1].textContent).toBe("4.333");
    expect(ratioCells[2].textContent).toBe("4.875");

    const pinionRow = screen.getByText("Drive pinion teeth").closest("tr");
    const pinionCells = pinionRow?.querySelectorAll("td") ?? [];
    expect(pinionCells[1].textContent).toBe("9");
    expect(pinionCells[2].textContent).toBe("8");
  });

  it("shows the table note explaining the final drive difference", () => {
    renderTech("en");
    expandAll("en");
    expect(screen.getByText(/parts catalog \(sections 2600 and 2710\)/i)).toBeTruthy();
  });

  it("hides the R2 column when filtering for F8", () => {
    renderTech("en", "F8");
    expandAll("en");
    expect(screen.queryByText("MAGMA")).toBeNull();
    expect(screen.getAllByText("JF8 F/B CAR.").length).toBeGreaterThan(0);
  });

  it("hides the F8 column when filtering for R2", () => {
    renderTech("en", "R2");
    expandAll("en");
    expect(screen.queryByText("JF8 F/B CAR.")).toBeNull();
    expect(screen.getAllByText("MAGMA").length).toBeGreaterThan(0);
  });

  it("filters tables and rows by query and highlights matches", () => {
    const { container } = renderTech("en");
    search("4.875");
    expect(screen.getByText("Rear axle / differential")).toBeTruthy();
    expect(screen.queryByText("Engine — general")).toBeNull();
    expect(container.querySelectorAll("mark").length).toBeGreaterThan(0);
    expect(screen.getByRole("status").textContent).toMatch(/Showing 1 of \d+ values/);
  });

  it("ignores accents when searching in Spanish", () => {
    const { container } = renderTech("es");
    search("valvula");
    expect(container.textContent).toContain("Culata, válvulas y taqués");
    expect(container.textContent).not.toContain("Dirección");
    expect(container.querySelectorAll("mark").length).toBeGreaterThan(0);
  });

  it("shows an empty state when nothing matches", () => {
    renderTech("en");
    search("zzzzzz");
    expect(screen.getByText("No results")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toMatch(/Showing 0 of \d+ values/);
  });

  it("collapses the list again when the search is cleared", () => {
    renderTech("en");
    search("4.875");
    expect(screen.getByText("Rear axle / differential")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(screen.queryByText("4.875")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("");
    expect(screen.getByText(/tables · \d+ values/)).toBeTruthy();
  });

  it("focuses the search box with the / shortcut and clears it with Escape", () => {
    renderTech("en");
    const input = screen.getByRole("searchbox") as HTMLInputElement;

    fireEvent.keyDown(window, { key: "/" });
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: "brake" } });
    expect(input.value).toBe("brake");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(input.value).toBe("");
  });
});
