import { describe, expect, it } from "vitest";
import { LOCATIONS, localHref, locationByHost, locationBySlug, locationHref, mapHref, phoneHref } from "@/lib/locations";

describe("location routing", () => {
  it.each(LOCATIONS)("resolves $name by its exact host", (location) => {
    expect(locationByHost(location.domain)).toBe(location);
    expect(locationByHost(`WWW.${location.domain.toUpperCase()}:3000`)).toBe(location);
    expect(locationByHost(`${location.domain}.`)).toBe(location);
  });

  it.each(["localhost:3000", "kingsword.org", "preview.vercel.app", "chicago.kingsword.org.evil.test", "evilchicago.kingsword.org", "chicago.kingsword.org,calgary.kingsword.org", "https://chicago.kingsword.org", "chicago.kingsword.org@evil.test"])("does not select a location for %s", (host) => {
    expect(locationByHost(host)).toBeUndefined();
  });

  it("keeps a preview in the selected location and uses the requested domains in production", () => {
    const london = locationBySlug("london")!;
    expect(locationHref(london)).toBe("/locations/london");
    expect(locationHref(london, true)).toBe("https://londonkingsword.org");
    expect(localHref({ location: london, basePath: "/locations/london", customDomain: false }, "contact")).toBe("/locations/london/contact");
    expect(localHref({ location: london, basePath: "", customDomain: true }, "contact")).toBe("/contact");
    expect(locationBySlug("missing")).toBeUndefined();
  });

  it("does not send other congregations' donations to Chicago", () => {
    const chicagoGiving = locationBySlug("chicago")!.giveUrl;
    for (const location of LOCATIONS.filter((item) => item.slug !== "chicago")) {
      expect(location.giveUrl).not.toBe(chicagoGiving);
    }
  });

  it("preserves international calling codes and safely encodes map addresses", () => {
    expect(phoneHref("+44 20 3026 0745")).toBe("tel:+442030260745");
    expect(new URL(mapHref("107–115 Eastmoor Street & Charlton")).searchParams.get("query")).toBe("107–115 Eastmoor Street & Charlton");
  });
});
