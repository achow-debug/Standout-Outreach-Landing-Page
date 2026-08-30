"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { landingCopy } from "@/lib/landing-copy";
import { siteConfig } from "@/lib/site-config";

export type FooterInfoPanel = "whyChooseUs" | "faq" | "contact";

type InfoDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/**
 * Native dialog chrome matching the strategy-call modal (wordmark, title, close).
 */
export function InfoDialog({ open, title, onClose, children }: InfoDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [standout, group] = siteConfig.businessName.split(" ");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        const active = document.activeElement;
        triggerRef.current =
          active instanceof HTMLElement ? active : null;
        document.documentElement.classList.add("modal-open");
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      document.documentElement.classList.remove("modal-open");
      onCloseRef.current();
      const trigger = triggerRef.current;
      requestAnimationFrame(() => {
        trigger?.focus();
      });
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="review-modal info-dialog"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div className="review-modal-panel">
        <header className="review-modal-header">
          <div className="review-modal-heading">
            <p className="review-modal-brand brand-mark">
              <span className="brand-mark-name">
                {standout}{" "}
                <span className="brand-mark-accent">{group}</span>
              </span>
            </p>
            <h2 id={titleId} className="review-modal-title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="review-modal-close"
            onClick={closeDialog}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </header>
        <div className="review-modal-body">{children}</div>
      </div>
    </dialog>
  );
}

function WhyChooseUsBody() {
  const { items } = landingCopy.footer.whyChooseUs;

  return (
    <div className="info-dialog-stack">
      {items.map((item) => (
        <section key={item.heading} className="info-dialog-block">
          <h3>{item.heading}</h3>
          <p>{item.body}</p>
        </section>
      ))}
    </div>
  );
}

function FaqBody() {
  const { items } = landingCopy.footer.faq;

  return (
    <div className="info-dialog-stack">
      {items.map((item) => {
        const paragraphs: string[] = Array.isArray(item.answer)
          ? [...item.answer]
          : [item.answer];
        return (
          <section key={item.question} className="info-dialog-block">
            <h3>{item.question}</h3>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function ContactBody() {
  const { contact } = landingCopy.footer;

  return (
    <ul className="info-dialog-contacts">
      <li>
        <a href={`mailto:${siteConfig.contactEmail}`}>
          <span className="info-dialog-contact-label">{contact.emailLabel}</span>
          <span>{siteConfig.contactEmail}</span>
        </a>
      </li>
      <li>
        <a href={siteConfig.contactPhoneHref}>
          <span className="info-dialog-contact-label">{contact.phoneLabel}</span>
          <span>{siteConfig.contactPhone}</span>
        </a>
      </li>
      <li>
        <a
          href={siteConfig.contactWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="info-dialog-contact-label">
            {contact.whatsappLabel}
          </span>
          <span>{siteConfig.contactPhone}</span>
        </a>
      </li>
    </ul>
  );
}

const PANEL_TITLE: Record<FooterInfoPanel, string> = {
  whyChooseUs: landingCopy.footer.whyChooseUs.title,
  faq: landingCopy.footer.faq.title,
  contact: landingCopy.footer.contact.title,
};

/**
 * One dialog at a time for footer Why choose us / FAQ / Contact.
 */
export function FooterInfoDialog({
  panel,
  onClose,
}: {
  panel: FooterInfoPanel | null;
  onClose: () => void;
}) {
  return (
    <InfoDialog
      open={panel !== null}
      title={panel ? PANEL_TITLE[panel] : PANEL_TITLE.whyChooseUs}
      onClose={onClose}
    >
      {panel === "whyChooseUs" ? <WhyChooseUsBody /> : null}
      {panel === "faq" ? <FaqBody /> : null}
      {panel === "contact" ? <ContactBody /> : null}
    </InfoDialog>
  );
}
