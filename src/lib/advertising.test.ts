import { describe, it, expect } from "vitest";
import { advertisingConfig, mayLoadAdvertising } from "./advertising";

describe("Advertising safeguards", () => {
  const ready = {
    enabled: true,
    approved: true,
    cmpCertified: true,
    publisherId: `ca-pub-${"1".repeat(16)}`,
  };
  it("is disabled by default", () => {
    expect(advertisingConfig.enabled).toBe(false);
  });
  it("requires visitor consent", () => {
    expect(mayLoadAdvertising(ready, false)).toBe(false);
  });
  it("requires Google approval", () => {
    expect(mayLoadAdvertising({ ...ready, approved: false }, true)).toBe(false);
  });
  it("requires a certified CMP", () => {
    expect(mayLoadAdvertising({ ...ready, cmpCertified: false }, true)).toBe(false);
  });
  it("rejects an absent publisher ID", () => {
    expect(mayLoadAdvertising({ ...ready, publisherId: "" }, true)).toBe(false);
  });
});
