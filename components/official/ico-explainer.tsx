"use client";

import { credentials, dpaRequest, icoExplainer } from "@/content/landing";
import { DpaRequestTrigger } from "@/components/official/dpa-request";
import { Sheet } from "@/components/official/sheet";

function Paragraph({ text }: { text: string }) {
  const email = icoExplainer.email;
  const index = text.indexOf(email);
  if (index < 0) return <p className="ico-explainer-copy">{text}</p>;

  return (
    <p className="ico-explainer-copy">
      {text.slice(0, index)}
      <a className="ico-explainer-mail" href={`mailto:${email}`}>
        {email}
      </a>
      {text.slice(index + email.length)}
    </p>
  );
}

export function IcoExplainer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={icoExplainer.title}>
      {icoExplainer.paragraphs.map((paragraph) => (
        <Paragraph key={paragraph} text={paragraph} />
      ))}
      <div className="source-sheet-actions">
        <a
          className="source-sheet-link"
          href={credentials.icoRegisterUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icoExplainer.registerLabel}
        </a>
        <DpaRequestTrigger
          className="source-sheet-link"
          closeOtherFirst={() => onOpenChange(false)}
        >
          {dpaRequest.title}
        </DpaRequestTrigger>
      </div>
    </Sheet>
  );
}
