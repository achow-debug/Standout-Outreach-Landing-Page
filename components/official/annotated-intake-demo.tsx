"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Lock, MessageCircle, Shield } from "lucide-react";
import {
  formatCallTimeWording,
  intakeCallback,
  intakeContact,
  intakeDemoChrome,
  intakeExit,
  intakeFirmChrome,
  intakeHelp,
  intakeNoteAudienceLabels,
  intakeNotes,
  intakeSignals,
  intakeStage,
  intakeStepCount,
  intakeSuccess,
  intakeUrgency,
  intakeWelcome,
  nextIntakeScreen,
  type CallbackWindowId,
  type HelpOptionId,
  type IntakeNoteId,
  type IntakeRoute,
  type IntakeScreenId,
  type SignalOptionId,
  type StageOptionId,
  type UrgencyOptionId,
} from "@/content/intake-demo";

type ContactErrors = {
  name?: string;
  phone?: string;
  email?: string;
};

type DemoAnswers = {
  help: HelpOptionId[];
  urgency: UrgencyOptionId | null;
  route: IntakeRoute | null;
  stage: StageOptionId | null;
  signals: SignalOptionId[];
  callback: CallbackWindowId | null;
  name: string;
  phone: string;
  email: string;
  voicemailSafe: boolean | null;
  emailSafe: boolean | null;
  note: string;
};

const initialAnswers: DemoAnswers = {
  help: [],
  urgency: null,
  route: null,
  stage: null,
  signals: [],
  callback: null,
  name: "",
  phone: "",
  email: "",
  voicemailSafe: null,
  emailSafe: null,
  note: "",
};

function firstNameFrom(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
}

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Interactive annotated Standout Legal enquiry demo.
 * Demo-only state — nothing is submitted to a backend.
 */
export function AnnotatedIntakeDemo() {
  const [screen, setScreen] = useState<IntakeScreenId>("welcome");
  const [answers, setAnswers] = useState<DemoAnswers>(initialAnswers);
  const [notesOn, setNotesOn] = useState(true);
  const [openNote, setOpenNote] = useState<IntakeNoteId | null>(null);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [restartSeconds, setRestartSeconds] = useState(
    Math.ceil(intakeSuccess.restartDelayMs / 1000),
  );
  const [screenBeforeExit, setScreenBeforeExit] =
    useState<Exclude<IntakeScreenId, "exit">>("welcome");
  const autoAdvanceRef = useRef<number | null>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  }, []);

  const resetDemo = useCallback(() => {
    clearAutoAdvance();
    setScreen("welcome");
    setAnswers(initialAnswers);
    setOpenNote(null);
    setContactErrors({});
    setRestartSeconds(Math.ceil(intakeSuccess.restartDelayMs / 1000));
  }, [clearAutoAdvance]);

  const goTo = useCallback(
    (next: IntakeScreenId) => {
      clearAutoAdvance();
      setOpenNote(null);
      setScreen(next);
      formTopRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [clearAutoAdvance],
  );

  const advanceFrom = useCallback(
    (current: IntakeScreenId, route = answers.route) => {
      goTo(nextIntakeScreen(current, route));
    },
    [answers.route, goTo],
  );

  const scheduleAdvance = useCallback(
    (current: IntakeScreenId, route: IntakeRoute | null) => {
      clearAutoAdvance();
      autoAdvanceRef.current = window.setTimeout(() => {
        goTo(nextIntakeScreen(current, route));
      }, 320);
    },
    [clearAutoAdvance, goTo],
  );

  useEffect(() => () => clearAutoAdvance(), [clearAutoAdvance]);

  // Success: auto-restart after a short delay, with a countdown on the button.
  useEffect(() => {
    if (screen !== "success") return;
    const total = Math.ceil(intakeSuccess.restartDelayMs / 1000);
    setRestartSeconds(total);
    const started = Date.now();
    const tick = window.setInterval(() => {
      const remaining = Math.max(
        0,
        total - Math.floor((Date.now() - started) / 1000),
      );
      setRestartSeconds(remaining);
      if (remaining === 0) {
        window.clearInterval(tick);
        resetDemo();
      }
    }, 250);
    return () => window.clearInterval(tick);
  }, [screen, resetDemo]);

  function toggleNote(id: IntakeNoteId) {
    setOpenNote((current) => (current === id ? null : id));
  }

  function toggleHelp(id: HelpOptionId) {
    setAnswers((prev) => {
      const has = prev.help.includes(id);
      return {
        ...prev,
        help: has ? prev.help.filter((x) => x !== id) : [...prev.help, id],
      };
    });
  }

  function pickUrgency(id: UrgencyOptionId) {
    const option = intakeUrgency.options.find((o) => o.id === id);
    if (!option) return;
    setAnswers((prev) => ({
      ...prev,
      urgency: id,
      route: option.route,
      // Clear non-urgent answers if switching to urgent.
      stage: option.route === "urgent" ? null : prev.stage,
      signals: option.route === "urgent" ? [] : prev.signals,
    }));
    scheduleAdvance("urgency", option.route);
  }

  function pickStage(id: StageOptionId) {
    setAnswers((prev) => ({ ...prev, stage: id }));
    scheduleAdvance("stage", "nonUrgent");
  }

  function toggleSignal(id: SignalOptionId) {
    setAnswers((prev) => {
      if (id === "none") {
        return { ...prev, signals: prev.signals.includes("none") ? [] : ["none"] };
      }
      const withoutNone = prev.signals.filter((s) => s !== "none");
      const has = withoutNone.includes(id);
      return {
        ...prev,
        signals: has
          ? withoutNone.filter((s) => s !== id)
          : [...withoutNone, id],
      };
    });
  }

  function pickCallback(id: CallbackWindowId) {
    setAnswers((prev) => ({ ...prev, callback: id }));
  }

  function submitContact() {
    const errors: ContactErrors = {};
    if (!answers.name.trim()) errors.name = intakeContact.fields.name.error;
    if (digitCount(answers.phone) < 10) errors.phone = intakeContact.fields.phone.error;
    if (!isValidEmail(answers.email)) errors.email = intakeContact.fields.email.error;
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (answers.voicemailSafe === null || answers.emailSafe === null) return;
    if (!answers.callback) return;
    goTo("success");
  }

  const stepTotal =
    answers.route === "urgent"
      ? intakeStepCount.urgent
      : answers.route === "nonUrgent"
        ? intakeStepCount.nonUrgent
        : intakeStepCount.nonUrgent;

  const stepIndex = (() => {
    const steps: IntakeScreenId[] =
      answers.route === "urgent"
        ? ["help", "urgency", "callback", "contact"]
        : ["help", "urgency", "stage", "signals", "callback", "contact"];
    const i = steps.indexOf(screen);
    return i >= 0 ? i + 1 : 0;
  })();

  const showProgress =
    screen !== "welcome" && screen !== "success" && screen !== "exit";

  return (
    <div
      className="intake-demo mx-auto w-full max-w-[520px]"
      style={
        {
          "--intake-ink": "#0e1628",
          "--intake-ink-soft": "#f3eee3",
          "--intake-paper": "#f7f4ee",
          "--intake-paper-deep": "#eee8dc",
          "--intake-surface": "#fffcf7",
          "--intake-brass": "#8a6a38",
          "--intake-brass-soft": "#efe6d3",
          "--intake-muted": "#5a6170",
          "--intake-line": "#e2d9c8",
          "--intake-error": "#9b2f28",
          "--intake-display": 'Georgia, "Times New Roman", serif',
        } as CSSProperties
      }
    >
      {/* Standout Group demo chrome */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl px-4 py-3"
        style={{ background: "var(--intake-ink)", color: "var(--intake-ink-soft)" }}
      >
        <div className="min-w-0">
          <p className="m-0 text-[13px] font-semibold tracking-wide">
            {intakeDemoChrome.brand}
          </p>
          <p className="m-0 mt-0.5 text-[12px] leading-snug opacity-80">
            {intakeDemoChrome.instruction}
          </p>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[13px] font-medium">
          <span>{intakeDemoChrome.notesLabel}</span>
          <button
            type="button"
            role="switch"
            aria-checked={notesOn}
            aria-label={`${intakeDemoChrome.notesLabel} ${notesOn ? "on" : "off"}`}
            className="relative h-7 w-12 rounded-full transition-colors"
            style={{
              background: notesOn ? "var(--intake-brass)" : "color-mix(in srgb, var(--intake-ink-soft) 25%, transparent)",
            }}
            onClick={() => {
              setNotesOn((v) => !v);
              if (notesOn) setOpenNote(null);
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 size-6 rounded-full bg-white transition-transform"
              style={{ transform: notesOn ? "translateX(1.25rem)" : "translateX(0)" }}
            />
          </button>
        </label>
      </div>

      <p
        className="m-0 px-4 py-2 text-center text-[11.5px] leading-snug"
        style={{
          background: "color-mix(in srgb, var(--intake-brass-soft) 70%, var(--intake-paper))",
          color: "var(--intake-muted)",
        }}
      >
        {intakeDemoChrome.disclaimer}
      </p>

      {/* Firm form frame */}
      <div
        ref={formTopRef}
        className="relative overflow-hidden rounded-b-xl border border-t-0 shadow-[0_18px_40px_-24px_rgba(14,22,40,0.35)]"
        style={{
          borderColor: "var(--intake-line)",
          background:
            "linear-gradient(180deg, var(--intake-paper) 0%, var(--intake-paper-deep) 100%)",
          color: "var(--intake-ink)",
        }}
      >
        {screen === "exit" ? (
          <ExitPanel onBack={() => goTo(screenBeforeExit)} />
        ) : (
          <>
            <FirmHeader
              notesOn={notesOn}
              openNote={openNote}
              onToggleNote={toggleNote}
              onExit={() => {
                setScreenBeforeExit(screen);
                goTo("exit");
              }}
            />

            <div className="px-4 pb-6 pt-4 sm:px-5">
              {showProgress ? (
                <ProgressRow step={stepIndex} total={stepTotal} />
              ) : null}

              {screen === "welcome" ? (
                <WelcomeScreen
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onBegin={() => advanceFrom("welcome")}
                />
              ) : null}

              {screen === "help" ? (
                <HelpScreen
                  selected={answers.help}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onToggle={toggleHelp}
                  onContinue={() => advanceFrom("help")}
                />
              ) : null}

              {screen === "urgency" ? (
                <UrgencyScreen
                  selected={answers.urgency}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onPick={pickUrgency}
                />
              ) : null}

              {screen === "stage" ? (
                <StageScreen
                  selected={answers.stage}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onPick={pickStage}
                />
              ) : null}

              {screen === "signals" ? (
                <SignalsScreen
                  selected={answers.signals}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onToggle={toggleSignal}
                  onContinue={() => advanceFrom("signals")}
                />
              ) : null}

              {screen === "callback" ? (
                <CallbackScreen
                  route={answers.route ?? "nonUrgent"}
                  selected={answers.callback}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onPick={pickCallback}
                  onContinue={() => {
                    if (answers.callback) advanceFrom("callback");
                  }}
                />
              ) : null}

              {screen === "contact" ? (
                <ContactScreen
                  answers={answers}
                  errors={contactErrors}
                  route={answers.route ?? "nonUrgent"}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  onChange={(patch) =>
                    setAnswers((prev) => ({ ...prev, ...patch }))
                  }
                  onSubmit={submitContact}
                />
              ) : null}

              {screen === "success" ? (
                <SuccessScreen
                  answers={answers}
                  notesOn={notesOn}
                  openNote={openNote}
                  onToggleNote={toggleNote}
                  restartSeconds={restartSeconds}
                  onRestart={resetDemo}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Shared UI pieces ────────────────────────────────────────────────────────

function FirmHeader({
  notesOn,
  openNote,
  onToggleNote,
  onExit,
}: {
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onExit: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-10 px-4 py-3 sm:px-5"
      style={{ background: "var(--intake-ink)", color: "var(--intake-ink-soft)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="m-0 text-[18px] leading-tight"
            style={{ fontFamily: "var(--intake-display)" }}
          >
            {intakeFirmChrome.firmName}
          </p>
          <Pinned
            noteId={1}
            notesOn={notesOn}
            openNote={openNote}
            onToggleNote={onToggleNote}
            align="start"
          >
            <p
              className="m-0 mt-1 text-[10.5px] font-semibold tracking-[0.16em] uppercase"
              style={{ color: "var(--intake-brass)" }}
            >
              {intakeFirmChrome.accreditations}
            </p>
          </Pinned>
        </div>
        <Pinned
          noteId={2}
          notesOn={notesOn}
          openNote={openNote}
          onToggleNote={onToggleNote}
          align="end"
        >
          <button
            type="button"
            className="min-h-11 px-1 text-[14px] font-medium underline-offset-4 hover:underline"
            style={{ color: "color-mix(in srgb, var(--intake-ink-soft) 82%, transparent)" }}
            onClick={onExit}
          >
            {intakeFirmChrome.exitLabel}
          </button>
        </Pinned>
      </div>
    </div>
  );
}

function ProgressRow({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className="h-[3px] flex-1 overflow-hidden rounded-sm"
        style={{ background: "var(--intake-line)" }}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${total}`}
      >
        <span
          className="block h-full rounded-sm transition-[width] duration-300"
          style={{ width: `${pct}%`, background: "var(--intake-brass)" }}
        />
      </div>
      <span
        className="shrink-0 text-[12px] font-medium tracking-[0.12em] uppercase"
        style={{ color: "var(--intake-muted)" }}
      >
        {step} / {total}
      </span>
    </div>
  );
}

function Pinned({
  noteId,
  notesOn,
  openNote,
  onToggleNote,
  children,
  align = "start",
}: {
  noteId: IntakeNoteId;
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  children: ReactNode;
  align?: "start" | "end";
}) {
  const open = notesOn && openNote === noteId;
  return (
    <div className="relative">
      <div
        className={`flex gap-2 ${align === "end" ? "flex-row-reverse items-center" : "items-start"}`}
      >
        <div className="min-w-0 flex-1">{children}</div>
        {notesOn ? (
          <NotePin
            id={noteId}
            open={open}
            onToggle={() => onToggleNote(noteId)}
          />
        ) : null}
      </div>
      {open ? (
        <NotePanel noteId={noteId} onClose={() => onToggleNote(noteId)} />
      ) : null}
    </div>
  );
}

function NotePin({
  id,
  open,
  onToggle,
}: {
  id: IntakeNoteId;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={`Note ${id}${open ? ", open" : ""}`}
      className="relative z-[1] flex size-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-transform active:scale-95"
      style={{
        background: open ? "var(--intake-brass)" : "var(--intake-ink)",
        color: "var(--intake-ink-soft)",
        boxShadow: "0 2px 8px rgba(14,22,40,0.2)",
      }}
      onClick={onToggle}
    >
      {id}
    </button>
  );
}

function NotePanel({
  noteId,
  onClose,
}: {
  noteId: IntakeNoteId;
  onClose: () => void;
}) {
  const note = intakeNotes[noteId];
  const titleId = useId();
  return (
    <aside
      className="relative mt-2 rounded-lg border p-3 text-left shadow-sm"
      style={{
        borderColor: "var(--intake-line)",
        background: "var(--intake-surface)",
      }}
      aria-labelledby={titleId}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p
          id={titleId}
          className="m-0 text-[14px] font-semibold"
          style={{ color: "var(--intake-ink)" }}
        >
          {noteId}. {note.title}
        </p>
        <button
          type="button"
          className="min-h-11 min-w-11 shrink-0 rounded-md text-[18px] leading-none"
          style={{ color: "var(--intake-muted)" }}
          aria-label="Close note"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <p className="m-0 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--intake-brass)" }}>
        {intakeNoteAudienceLabels.forClient}
      </p>
      <p className="mt-1 mb-3 text-[13.5px] leading-snug" style={{ color: "var(--intake-ink)" }}>
        {note.forClient}
      </p>
      <p className="m-0 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--intake-brass)" }}>
        {intakeNoteAudienceLabels.forFirm}
      </p>
      <p className="mt-1 mb-0 text-[13.5px] leading-snug" style={{ color: "var(--intake-ink)" }}>
        {note.forFirm}
      </p>
      {note.citation ? (
        <blockquote
          className="mt-3 mb-0 border-l-2 pl-3 text-[13px] leading-snug"
          style={{ borderColor: "var(--intake-brass)", color: "var(--intake-muted)" }}
        >
          <strong style={{ color: "var(--intake-ink)" }}>{note.citation.figure}</strong>{" "}
          {note.citation.text}{" "}
          <cite className="not-italic">
            <a
              href={note.citation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              style={{ color: "var(--intake-brass)" }}
            >
              Source: {note.citation.sourceLabel}
            </a>
          </cite>
        </blockquote>
      ) : null}
    </aside>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="mt-5 flex min-h-12 w-full items-center justify-center rounded-[10px] px-4 text-[15.5px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      style={{ background: "var(--intake-ink)", color: "var(--intake-ink-soft)" }}
    >
      {children}
    </button>
  );
}

function ChoiceCard({
  selected,
  brassEdge,
  label,
  description,
  onClick,
  multi,
}: {
  selected: boolean;
  brassEdge?: boolean;
  label: string;
  description?: string;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[10px] border px-3.5 py-3 text-left transition-colors"
      style={{
        borderColor: selected
          ? "var(--intake-ink)"
          : brassEdge
            ? "var(--intake-brass)"
            : "var(--intake-line)",
        background: selected ? "var(--intake-ink)" : "var(--intake-surface)",
        color: selected ? "var(--intake-ink-soft)" : "var(--intake-ink)",
        boxShadow: brassEdge && !selected ? "inset 3px 0 0 var(--intake-brass)" : undefined,
      }}
    >
      <span
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]"
        style={{
          borderColor: selected
            ? "color-mix(in srgb, var(--intake-ink-soft) 50%, transparent)"
            : "var(--intake-line)",
          background: selected ? "var(--intake-brass)" : "transparent",
          color: selected ? "var(--intake-ink-soft)" : "transparent",
        }}
        aria-hidden
      >
        {selected ? "✓" : ""}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-snug">{label}</span>
        {description ? (
          <span
            className="mt-0.5 block text-[13.5px] leading-snug"
            style={{
              color: selected
                ? "color-mix(in srgb, var(--intake-ink-soft) 78%, transparent)"
                : "var(--intake-muted)",
            }}
          >
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function ScreenHeading({ children }: { children: ReactNode }) {
  return (
    <h3
      className="m-0 text-[clamp(1.35rem,4.5vw,1.7rem)] leading-tight font-normal"
      style={{ fontFamily: "var(--intake-display)" }}
    >
      {children}
    </h3>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 mb-4 text-[14.5px] leading-snug" style={{ color: "var(--intake-muted)" }}>
      {children}
    </p>
  );
}

function TrustFooter({
  notesOn,
  openNote,
  onToggleNote,
}: {
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
}) {
  return (
    <Pinned
      noteId={17}
      notesOn={notesOn}
      openNote={openNote}
      onToggleNote={onToggleNote}
    >
      <p className="m-0 text-[12.5px] leading-snug" style={{ color: "var(--intake-muted)" }}>
        {intakeFirmChrome.trustFooter}
      </p>
    </Pinned>
  );
}

// ── Screens ─────────────────────────────────────────────────────────────────

function WelcomeScreen({
  notesOn,
  openNote,
  onToggleNote,
  onBegin,
}: {
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onBegin: () => void;
}) {
  return (
    <div>
      <p
        className="m-0 mb-2 text-[11.5px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: "var(--intake-brass)" }}
      >
        {intakeWelcome.eyebrow}
      </p>
      <Pinned noteId={3} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <ScreenHeading>{intakeWelcome.heading}</ScreenHeading>
      </Pinned>

      <Pinned
        noteId={4}
        notesOn={notesOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
      >
        <ul className="mt-4 mb-0 list-none space-y-2.5 p-0">
          {intakeWelcome.reassurances.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 text-[14.5px] leading-snug">
              <span className="mt-0.5 shrink-0" style={{ color: "var(--intake-brass)" }} aria-hidden>
                {item.icon === "shield-lock" ? (
                  <Shield className="size-4" strokeWidth={2} />
                ) : (
                  <MessageCircle className="size-4" strokeWidth={2} />
                )}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </Pinned>

      <PrimaryButton onClick={onBegin}>{intakeWelcome.beginLabel}</PrimaryButton>

      <Pinned
        noteId={5}
        notesOn={notesOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
      >
        <p className="mt-3 mb-5 text-center text-[13.5px]" style={{ color: "var(--intake-muted)" }}>
          {intakeWelcome.effortHint}
        </p>
      </Pinned>

      <TrustFooter notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote} />
    </div>
  );
}

function HelpScreen({
  selected,
  notesOn,
  openNote,
  onToggleNote,
  onToggle,
  onContinue,
}: {
  selected: HelpOptionId[];
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onToggle: (id: HelpOptionId) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <Pinned noteId={6} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <ScreenHeading>{intakeHelp.heading}</ScreenHeading>
        <Hint>{intakeHelp.hint}</Hint>
      </Pinned>
      <div className="flex flex-col gap-2" role="group" aria-label={intakeHelp.heading}>
        {intakeHelp.options.map((option) => (
          <ChoiceCard
            key={option.id}
            multi
            selected={selected.includes(option.id)}
            label={option.label}
            description={option.description}
            onClick={() => onToggle(option.id)}
          />
        ))}
      </div>
      <PrimaryButton disabled={selected.length === 0} onClick={onContinue}>
        {intakeHelp.continueLabel}
      </PrimaryButton>
    </div>
  );
}

function UrgencyScreen({
  selected,
  notesOn,
  openNote,
  onToggleNote,
  onPick,
}: {
  selected: UrgencyOptionId | null;
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onPick: (id: UrgencyOptionId) => void;
}) {
  return (
    <div>
      <Pinned noteId={7} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <ScreenHeading>{intakeUrgency.heading}</ScreenHeading>
        <Hint>{intakeUrgency.hint}</Hint>
      </Pinned>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={intakeUrgency.heading}>
        {intakeUrgency.options.map((option) => (
          <ChoiceCard
            key={option.id}
            selected={selected === option.id}
            brassEdge={"brassEdge" in option ? option.brassEdge : false}
            label={option.label}
            description={option.description}
            onClick={() => onPick(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

function StageScreen({
  selected,
  notesOn,
  openNote,
  onToggleNote,
  onPick,
}: {
  selected: StageOptionId | null;
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onPick: (id: StageOptionId) => void;
}) {
  return (
    <div>
      <Pinned noteId={8} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <ScreenHeading>{intakeStage.heading}</ScreenHeading>
      </Pinned>
      <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label={intakeStage.heading}>
        {intakeStage.options.map((option) => (
          <ChoiceCard
            key={option.id}
            selected={selected === option.id}
            label={option.label}
            description={option.description}
            onClick={() => onPick(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SignalsScreen({
  selected,
  notesOn,
  openNote,
  onToggleNote,
  onToggle,
  onContinue,
}: {
  selected: SignalOptionId[];
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onToggle: (id: SignalOptionId) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <Pinned noteId={9} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <ScreenHeading>{intakeSignals.heading}</ScreenHeading>
        <Hint>{intakeSignals.hint}</Hint>
      </Pinned>
      <div className="flex flex-col gap-2" role="group" aria-label={intakeSignals.heading}>
        {intakeSignals.options.map((option) => (
          <ChoiceCard
            key={option.id}
            multi
            selected={selected.includes(option.id)}
            label={option.label}
            onClick={() => onToggle(option.id)}
          />
        ))}
        <Pinned noteId={10} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
          <ChoiceCard
            multi
            selected={selected.includes("none")}
            label={intakeSignals.noneOption.label}
            onClick={() => onToggle("none")}
          />
        </Pinned>
      </div>
      <PrimaryButton disabled={selected.length === 0} onClick={onContinue}>
        {intakeSignals.continueLabel}
      </PrimaryButton>
    </div>
  );
}

function CallbackScreen({
  route,
  selected,
  notesOn,
  openNote,
  onToggleNote,
  onPick,
  onContinue,
}: {
  route: IntakeRoute;
  selected: CallbackWindowId | null;
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onPick: (id: CallbackWindowId) => void;
  onContinue: () => void;
}) {
  const copy = route === "urgent" ? intakeCallback.urgent : intakeCallback.nonUrgent;
  return (
    <div>
      <Pinned noteId={11} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        {"badge" in copy && copy.badge ? (
          <p
            className="m-0 mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase"
            style={{
              background: "var(--intake-brass-soft)",
              color: "var(--intake-brass)",
            }}
          >
            {copy.badge}
          </p>
        ) : null}
        <ScreenHeading>{copy.heading}</ScreenHeading>
        <Hint>{copy.subtext}</Hint>
      </Pinned>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={copy.heading}>
        <ChoiceCard
          selected={selected === "asap"}
          brassEdge={copy.asap.brassEdge}
          label={copy.asap.label}
          description={copy.asap.description}
          onClick={() => onPick("asap")}
        />
      </div>

      <Pinned noteId={12} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <p
          className="mt-4 mb-2 text-[12px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: "var(--intake-muted)" }}
        >
          {intakeCallback.orChooseLabel}
        </p>
        <div className="flex flex-col gap-2" role="group">
          {intakeCallback.windows.map((window) => (
            <ChoiceCard
              key={window.id}
              selected={selected === window.id}
              label={window.label}
              description={window.hours}
              onClick={() => onPick(window.id)}
            />
          ))}
        </div>
      </Pinned>

      <PrimaryButton disabled={!selected} onClick={onContinue}>
        {intakeCallback.continueLabel}
      </PrimaryButton>
    </div>
  );
}

function ContactScreen({
  answers,
  errors,
  route,
  notesOn,
  openNote,
  onToggleNote,
  onChange,
  onSubmit,
}: {
  answers: DemoAnswers;
  errors: ContactErrors;
  route: IntakeRoute;
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  onChange: (patch: Partial<DemoAnswers>) => void;
  onSubmit: () => void;
}) {
  const canSubmit =
    answers.name.trim() &&
    digitCount(answers.phone) >= 10 &&
    isValidEmail(answers.email) &&
    answers.voicemailSafe !== null &&
    answers.emailSafe !== null;

  return (
    <div>
      <ScreenHeading>{intakeContact.heading}</ScreenHeading>
      <Hint>{intakeContact.subtext}</Hint>

      <Field
        label={intakeContact.fields.name.label}
        error={errors.name}
        value={answers.name}
        autoComplete="name"
        onChange={(value) => onChange({ name: value })}
      />
      <Field
        label={intakeContact.fields.phone.label}
        error={errors.phone}
        value={answers.phone}
        autoComplete="tel"
        inputMode="tel"
        onChange={(value) => onChange({ phone: value })}
      />
      <Field
        label={intakeContact.fields.email.label}
        error={errors.email}
        value={answers.email}
        autoComplete="email"
        inputMode="email"
        onChange={(value) => onChange({ email: value })}
      />

      <Pinned noteId={13} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <div className="mt-4 space-y-3">
          <YesNo
            label={intakeContact.discretion.voicemail}
            value={answers.voicemailSafe}
            onChange={(value) => onChange({ voicemailSafe: value })}
          />
          <YesNo
            label={intakeContact.discretion.email}
            value={answers.emailSafe}
            onChange={(value) => onChange({ emailSafe: value })}
          />
        </div>
      </Pinned>

      <Pinned noteId={14} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <label className="mt-4 block">
          <span className="text-[14px] font-semibold">
            {intakeContact.optionalNote.label}{" "}
            <span className="font-normal" style={{ color: "var(--intake-muted)" }}>
              {intakeContact.optionalNote.hint}
            </span>
          </span>
          <textarea
            className="mt-1.5 min-h-[5rem] w-full rounded-[10px] border px-3 py-2.5 text-[15px] outline-none"
            style={{
              borderColor: "var(--intake-line)",
              background: "var(--intake-surface)",
              color: "var(--intake-ink)",
            }}
            value={answers.note}
            onChange={(e) => onChange({ note: e.target.value })}
          />
        </label>
      </Pinned>

      <PrimaryButton disabled={!canSubmit} onClick={onSubmit}>
        {route === "urgent"
          ? intakeContact.submitUrgent
          : intakeContact.submitNonUrgent}
      </PrimaryButton>

      <Pinned noteId={15} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <p className="mt-3 mb-0 flex items-center justify-center gap-1.5 text-center text-[13px]" style={{ color: "var(--intake-muted)" }}>
          <Lock className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          {intakeContact.lockLine}
        </p>
      </Pinned>
    </div>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const id = useId();
  return (
    <div className="mt-3">
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        className="mt-1.5 min-h-12 w-full rounded-[10px] border px-3 text-[15px] outline-none"
        style={{
          borderColor: error ? "var(--intake-error)" : "var(--intake-line)",
          background: "var(--intake-surface)",
          color: "var(--intake-ink)",
        }}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <p className="mt-1 mb-0 text-[13px]" style={{ color: "var(--intake-error)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-1.5 text-[14px] font-semibold">{label}</legend>
      <div className="flex gap-2">
        {(
          [
            { v: true, text: intakeContact.discretion.yes },
            { v: false, text: intakeContact.discretion.no },
          ] as const
        ).map((opt) => {
          const selected = value === opt.v;
          return (
            <button
              key={opt.text}
              type="button"
              className="min-h-11 flex-1 rounded-[10px] border text-[14px] font-semibold"
              style={{
                borderColor: selected ? "var(--intake-ink)" : "var(--intake-line)",
                background: selected ? "var(--intake-ink)" : "var(--intake-surface)",
                color: selected ? "var(--intake-ink-soft)" : "var(--intake-ink)",
              }}
              aria-pressed={selected}
              onClick={() => onChange(opt.v)}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SuccessScreen({
  answers,
  notesOn,
  openNote,
  onToggleNote,
  restartSeconds,
  onRestart,
}: {
  answers: DemoAnswers;
  notesOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  restartSeconds: number;
  onRestart: () => void;
}) {
  const route = answers.route ?? "nonUrgent";
  const callTime = answers.callback
    ? formatCallTimeWording(answers.callback, route)
    : formatCallTimeWording("asap", route);

  const callExtras = [
    answers.voicemailSafe === false ? intakeSuccess.noVoicemail : null,
    answers.emailSafe === false ? intakeSuccess.noEmail : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {route === "urgent" ? (
        <p
          className="m-0 mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase"
          style={{
            background: "var(--intake-brass-soft)",
            color: "var(--intake-brass)",
          }}
        >
          {intakeSuccess.urgentBadge}
        </p>
      ) : null}
      <p
        className="m-0 mb-2 text-[11.5px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: "var(--intake-brass)" }}
      >
        {intakeSuccess.eyebrow}
      </p>
      <ScreenHeading>
        {intakeSuccess.heading(firstNameFrom(answers.name))}
      </ScreenHeading>
      <Hint>{intakeSuccess.subtext}</Hint>

      <Pinned noteId={16} notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote}>
        <ol className="m-0 list-none space-y-4 p-0">
          {intakeSuccess.timeline.map((item, index) => {
            const body =
              "bodyLead" in item
                ? `${item.bodyLead} ${callTime}.${callExtras ? ` ${callExtras}` : ""}`
                : item.body;
            return (
              <li key={item.title} className="flex gap-3">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{
                    background: "var(--intake-brass-soft)",
                    color: "var(--intake-brass)",
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="m-0 text-[15px] font-semibold leading-snug">{item.title}</p>
                  <p className="mt-0.5 mb-0 text-[13.5px] leading-snug" style={{ color: "var(--intake-muted)" }}>
                    {body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Pinned>

      <PrimaryButton onClick={onRestart}>
        {intakeSuccess.restartLabel}
        {restartSeconds > 0 ? ` (${restartSeconds})` : ""}
      </PrimaryButton>

      <div className="mt-5">
        <TrustFooter notesOn={notesOn} openNote={openNote} onToggleNote={onToggleNote} />
      </div>
    </div>
  );
}

function ExitPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-5 py-10 text-center">
      <h3
        className="m-0 text-[clamp(1.35rem,4.5vw,1.7rem)] leading-tight font-normal"
        style={{ fontFamily: "var(--intake-display)" }}
      >
        {intakeExit.heading}
      </h3>
      <p className="mx-auto mt-3 mb-0 max-w-[36ch] text-[15px] leading-snug" style={{ color: "var(--intake-muted)" }}>
        {intakeExit.body}
      </p>
      <PrimaryButton onClick={onBack}>{intakeExit.backLabel}</PrimaryButton>
    </div>
  );
}
