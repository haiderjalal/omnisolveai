import { InquiryService } from "./inquiry.service";
import { EmailInquiryNotifier } from "./notifications/inquiryEmail";

/**
 * Composition root: the one place concrete implementations are wired to the services.
 * Swap or add notifiers here (WhatsApp, CRM) without touching business logic.
 */
export const inquiryService = new InquiryService(new EmailInquiryNotifier());
