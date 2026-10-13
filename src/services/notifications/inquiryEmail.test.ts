import { describe, expect, it } from "vitest";

import type { InquiryRecord } from "../inquiry.service";

import { buildInquiryEmail } from "./inquiryEmail";

const record: InquiryRecord = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Jane <script>alert(1)</script>",
  email: "jane@company.com",
  company: "Acme & Sons",
  phone: "",
  interest: "software",
  message: 'Hello "team" <img src=x onerror=alert(1)>',
};

describe("buildInquiryEmail", () => {
  it("escapes every visitor-supplied value in the HTML body", () => {
    const { html } = buildInquiryEmail(record, "team@omnisolve.example");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Acme &amp; Sons");
  });

  it("sends to the configured recipient and replies to the visitor", () => {
    const email = buildInquiryEmail(record, "team@omnisolve.example");
    expect(email.to).toBe("team@omnisolve.example");
    expect(email.replyTo).toBe("jane@company.com");
  });

  it("includes the reference id and a plain-text alternative", () => {
    const email = buildInquiryEmail(record, "team@omnisolve.example");
    expect(email.text).toContain(record.id);
    expect(email.text).toContain("Custom software");
  });
});
