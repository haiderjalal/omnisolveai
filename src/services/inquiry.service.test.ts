import { beforeEach, describe, expect, it, vi } from "vitest";

import { inquirySchema, type InquiryInput } from "@/lib/validations/inquiry.schema";

import {
  InquiryService,
  NotificationFailedError,
  type InquiryNotifier,
  type InquiryRecord,
} from "./inquiry.service";

vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const input: InquiryInput = inquirySchema.parse({
  name: "Jane Cooper",
  email: "jane@company.com",
  company: "Acme",
  phone: "",
  interest: "cloud",
  message: "We need help moving to Kubernetes.",
  consent: true,
});

function createNotifier(
  impl?: () => Promise<"sent" | "demo">,
): InquiryNotifier & { notify: ReturnType<typeof vi.fn> } {
  return { notify: vi.fn(impl ?? (async () => "demo" as const)) };
}

describe("InquiryService", () => {
  let notifier: ReturnType<typeof createNotifier>;
  let service: InquiryService;

  beforeEach(() => {
    notifier = createNotifier();
    service = new InquiryService(notifier);
  });

  it("notifies the team and returns a receipt", async () => {
    const receipt = await service.submit(input);
    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(receipt.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(receipt.delivery).toBe("demo");
  });

  it("passes a sanitised record to the notifier", async () => {
    await service.submit({ ...input, name: "Jane\u0000   Cooper" });
    const record = notifier.notify.mock.calls[0][0] as InquiryRecord;
    expect(record.name).toBe("Jane Cooper");
    expect(record.interest).toBe("cloud");
  });

  it("silently discards honeypot submissions without notifying anyone", async () => {
    const receipt = await service.submit({ ...input, website: "http://spam.example" });
    expect(notifier.notify).not.toHaveBeenCalled();
    expect(receipt.id).toBeTruthy();
  });

  it("is idempotent: a retry with the same key does not notify twice", async () => {
    const first = await service.submit(input, "key-1");
    const second = await service.submit(input, "key-1");
    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
  });

  it("treats different keys as different submissions", async () => {
    await service.submit(input, "key-a");
    await service.submit(input, "key-b");
    expect(notifier.notify).toHaveBeenCalledTimes(2);
  });

  it("fails loudly when the team cannot be notified, so a lead is never silently lost", async () => {
    const failing = new InquiryService(
      createNotifier(async () => Promise.reject(new Error("provider down"))),
    );
    await expect(failing.submit(input, "key-fail")).rejects.toBeInstanceOf(NotificationFailedError);
  });

  it("allows a retry after a failed notification (failures are not cached)", async () => {
    let attempts = 0;
    const flaky = createNotifier(async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("timeout");
      return "sent";
    });
    const retrying = new InquiryService(flaky);
    await expect(retrying.submit(input, "key-retry")).rejects.toBeInstanceOf(NotificationFailedError);
    await expect(retrying.submit(input, "key-retry")).resolves.toMatchObject({ delivery: "sent" });
  });
});
