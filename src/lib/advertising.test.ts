import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { advertisingConfig, mayLoadAdvertising } from "./advertising";
describe("Advertising safeguards", () => {
  const ready = { enabled: true, approved: true, cmpCertified: true, publisherId: `ca-pub-${"1".repeat(16)}` };
  it("is disabled by default", () => assert.equal(advertisingConfig.enabled, false));
  it("requires visitor consent", () => assert.equal(mayLoadAdvertising(ready, false), false));
  it("requires Google approval", () => assert.equal(mayLoadAdvertising({ ...ready, approved: false }, true), false));
  it("requires a certified CMP", () => assert.equal(mayLoadAdvertising({ ...ready, cmpCertified: false }, true), false));
  it("rejects an absent publisher ID", () => assert.equal(mayLoadAdvertising({ ...ready, publisherId: "" }, true), false));
});