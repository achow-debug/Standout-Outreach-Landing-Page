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

const TIP_STORAGE_KEY = "standout-intake-tip-dismissed";
const NUDGE_STORAGE_KEY = "standout-intake-nudge-shown";

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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * Interactive annotated Standout Legal enquiry demo.
 * Demo-only state — nothing is submitted to a backend.
 */
export function AnnotatedIntakeDemo() {
  const [screen, setScreen] = useState<IntakeScreenId>("welcome");
  const [answers, setAnswers] = useState<DemoAnswers>(initialAnswers);
  const [annotationsOn, setAnnotationsOn] = useState(false);
  const [openNote, setOpenNote] = useState<IntakeNoteId | null>(null);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [restartSeconds, setRestartSeconds] = useState(
    Math.ceil(intakeSuccess.restartDelayMs / 1000),
  );
  const [tipVisible, setTipVisible] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [pulseSwitch, setPulseSwitch] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);
  const hasInteractedRef = useRef(false);
  const autoAdvanceRef = useRef<number | null>(null);
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(TIP_STORAGE_KEY) !== "1") {
        setTipVisible(true);
      }
    } catch {
      setTipVisible(true);
    }
  }, []);

  const dismissTip = useCallback(() => {
    setTipVisible(false);
    try {
      sessionStorage.setItem(TIP_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const dismissNudge = useCallback(() => {
    setNudgeVisible(false);
    setPulseSwitch(false);
    try {
      sessionStorage.setItem(NUDGE_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const markInteracted = useCallback(() => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;
    dismissTip();
    if (annotationsOn) return;
    try {
      if (sessionStorage.getItem(NUDGE_STORAGE_KEY) === "1") return;
    } catch {
      /* show nudge */
    }
    window.setTimeout(() => {
      setNudgeVisible(true);
      setPulseSwitch(true);
    }, 420);
  }, [annotationsOn, dismissTip]);

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
    setNoteFocused(false);
    setRestartSeconds(Math.ceil(intakeSuccess.restartDelayMs / 1000));
  }, [clearAutoAdvance]);

  const goTo = useCallback(
    (next: IntakeScreenId) => {
      clearAutoAdvance();
      setOpenNote(null);
      setScreen(next);
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
    markInteracted();
    setAnswers((prev) => {
      const has = prev.help.includes(id);
      return {
        ...prev,
        help: has ? prev.help.filter((x) => x !== id) : [...prev.help, id],
      };
    });
  }

  function pickUrgency(id: UrgencyOptionId) {
    markInteracted();
    const option = intakeUrgency.options.find((o) => o.id === id);
    if (!option) return;
    setAnswers((prev) => ({
      ...prev,
      urgency: id,
      route: option.route,
      stage: option.route === "urgent" ? null : prev.stage,
      signals: option.route === "urgent" ? [] : prev.signals,
    }));
    scheduleAdvance("urgency", option.route);
  }

  function pickStage(id: StageOptionId) {
    markInteracted();
    setAnswers((prev) => ({ ...prev, stage: id }));
    scheduleAdvance("stage", "nonUrgent");
  }

  function toggleSignal(id: SignalOptionId) {
    markInteracted();
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
    markInteracted();
    setAnswers((prev) => ({ ...prev, callback: id }));
  }

  function submitContact() {
    markInteracted();
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

  const annotationProps = {
    annotationsOn,
    openNote,
    onToggleNote: toggleNote,
    isDesktop,
  };

  return (
    <div
      className="intake-demo mx-auto flex w-full max-w-[520px] flex-col gap-3 lg:max-w-[860px] lg:flex-row lg:items-stretch lg:gap-5"
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
          "--intake-purple": "var(--color-brand)",
          "--intake-purple-hover": "var(--color-brand-hover)",
          "--intake-purple-tint": "var(--color-brand-tint)",
          "--intake-purple-on-dark": "var(--color-brand-on-dark)",
        } as CSSProperties
      }
    >
      <div
        className="relative flex w-full max-w-[520px] shrink-0 flex-col overflow-visible rounded-xl shadow-[0_18px_40px_-24px_rgba(29,25,40,0.28)] lg:mx-0"
        style={{
          border: "1px solid var(--intake-line)",
          background:
            "linear-gradient(180deg, var(--intake-paper) 0%, var(--intake-paper-deep) 100%)",
          color: "var(--intake-ink)",
        }}
      >
        {/* Standout Group demo chrome — site tokens */}
        <div className="relative z-20 rounded-t-xl bg-ink px-4 py-3 font-sans text-on-dark">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="t-kicker--on-dark m-0 text-[0.8125rem] font-semibold tracking-wide">
                {intakeDemoChrome.brand}
              </p>
              <p className="m-0 mt-1 text-[0.9375rem] leading-snug font-semibold text-on-dark sm:text-[1rem]">
                {intakeDemoChrome.instructionPrimary}
              </p>
              <p className="m-0 mt-1 text-[0.8125rem] leading-snug text-on-dark-muted">
                {intakeDemoChrome.instructionSecondary}
              </p>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[0.8125rem] font-semibold text-on-dark">
              <span>{intakeDemoChrome.annotationsLabel}</span>
              <button
                type="button"
                role="switch"
                aria-checked={annotationsOn}
                aria-label={`${intakeDemoChrome.annotationsLabel} ${annotationsOn ? "on" : "off"}`}
                className={`relative h-7 w-12 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${pulseSwitch ? "intake-switch-pulse" : ""}`}
                style={{
                  background: annotationsOn
                    ? "var(--color-brand)"
                    : "color-mix(in srgb, var(--color-on-dark) 25%, transparent)",
                }}
                onClick={() => {
                  setAnnotationsOn((v) => {
                    const next = !v;
                    if (!next) setOpenNote(null);
                    else {
                      dismissTip();
                      dismissNudge();
                    }
                    return next;
                  });
                }}
                onAnimationEnd={() => setPulseSwitch(false)}
              >
                <span
                  className="absolute top-0.5 left-0.5 size-6 rounded-full bg-white transition-transform"
                  style={{
                    transform: annotationsOn ? "translateX(1.25rem)" : "translateX(0)",
                  }}
                />
              </button>
            </label>
          </div>

          {tipVisible && !annotationsOn ? (
            <div
              className={`mt-3 flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left ${reduceMotion ? "" : "intake-tip-enter"}`}
              style={{
                background: "color-mix(in srgb, var(--color-brand) 28%, transparent)",
              }}
              role="status"
            >
              <p className="m-0 flex-1 text-[0.875rem] leading-snug text-on-dark">
                {intakeDemoChrome.tipBody}
              </p>
              <button
                type="button"
                className="shrink-0 rounded-[var(--radius-sm)] px-2 py-1 text-[0.8125rem] font-semibold text-brand-on-dark underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                onClick={dismissTip}
              >
                {intakeDemoChrome.tipDismiss}
              </button>
            </div>
          ) : null}

          {nudgeVisible && !annotationsOn && !tipVisible ? (
            <div
              className={`mt-3 flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left ${reduceMotion ? "" : "intake-tip-enter"}`}
              style={{
                background: "color-mix(in srgb, var(--color-brand) 36%, transparent)",
              }}
              role="status"
            >
              <p className="m-0 flex-1 text-[0.875rem] leading-snug text-on-dark">
                {intakeDemoChrome.nudgeBody}
              </p>
              <button
                type="button"
                className="shrink-0 rounded-[var(--radius-sm)] px-2 py-1 text-[0.8125rem] font-semibold text-brand-on-dark underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                onClick={dismissNudge}
              >
                {intakeDemoChrome.tipDismiss}
              </button>
            </div>
          ) : null}
        </div>

        <p
          className="m-0 px-4 py-2 text-center font-sans text-[0.75rem] leading-snug"
          style={{
            background:
              "color-mix(in srgb, var(--intake-brass-soft) 70%, var(--intake-paper))",
            color: "var(--intake-muted)",
          }}
        >
          {intakeDemoChrome.disclaimer}
        </p>

        {/* Firm form frame — grows with content, no clip */}
        <div className="relative flex flex-col overflow-visible rounded-b-xl">
          {screen === "exit" ? (
            <ExitPanel onBack={resetDemo} />
          ) : (
            <>
              <FirmHeader
                {...annotationProps}
                onExit={() => goTo("exit")}
              />

              <div
                key={screen}
                className={`px-4 pt-4 pb-5 sm:px-5 ${
                  annotationsOn ? "pr-6 sm:pr-7" : ""
                } ${reduceMotion ? "" : "intake-screen-enter"}`}
              >
                {showProgress ? (
                  <ProgressRow step={stepIndex} total={stepTotal} />
                ) : null}

                {screen === "welcome" ? (
                  <WelcomeScreen
                    {...annotationProps}
                    onBegin={() => {
                      markInteracted();
                      advanceFrom("welcome");
                    }}
                  />
                ) : null}

                {screen === "help" ? (
                  <HelpScreen
                    selected={answers.help}
                    {...annotationProps}
                    onToggle={toggleHelp}
                    onContinue={() => advanceFrom("help")}
                  />
                ) : null}

                {screen === "urgency" ? (
                  <UrgencyScreen
                    selected={answers.urgency}
                    {...annotationProps}
                    onPick={pickUrgency}
                  />
                ) : null}

                {screen === "stage" ? (
                  <StageScreen
                    selected={answers.stage}
                    {...annotationProps}
                    onPick={pickStage}
                  />
                ) : null}

                {screen === "signals" ? (
                  <SignalsScreen
                    selected={answers.signals}
                    {...annotationProps}
                    onToggle={toggleSignal}
                    onContinue={() => advanceFrom("signals")}
                  />
                ) : null}

                {screen === "callback" ? (
                  <CallbackScreen
                    route={answers.route ?? "nonUrgent"}
                    selected={answers.callback}
                    {...annotationProps}
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
                    noteFocused={noteFocused}
                    onNoteFocus={() => setNoteFocused(true)}
                    {...annotationProps}
                    onChange={(patch) =>
                      setAnswers((prev) => ({ ...prev, ...patch }))
                    }
                    onSubmit={submitContact}
                  />
                ) : null}

                {screen === "success" ? (
                  <SuccessScreen
                    answers={answers}
                    {...annotationProps}
                    restartSeconds={restartSeconds}
                    onRestart={resetDemo}
                  />
                ) : null}
              </div>
            </>
          )}

          {/* Mobile annotation overlay */}
          {!isDesktop && annotationsOn && openNote !== null ? (
            <MobileAnnotationOverlay
              noteId={openNote}
              onClose={() => setOpenNote(null)}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </div>
      </div>

      {/* Desktop side annotation panel — only when Annotations are on */}
      {isDesktop && annotationsOn ? (
        <DesktopAnnotationPanel
          openNote={openNote}
          onClose={() => setOpenNote(null)}
          reduceMotion={reduceMotion}
        />
      ) : null}
    </div>
  );
}

// ── Annotation surfaces ─────────────────────────────────────────────────────

function AnnotationBody({ noteId }: { noteId: IntakeNoteId }) {
  const note = intakeNotes[noteId];
  const titleId = useId();
  return (
    <div className="font-sans" aria-labelledby={titleId}>
      <p id={titleId} className="m-0 text-[1.0625rem] font-semibold leading-snug text-ink">
        {noteId}. {note.title}
      </p>
      <p className="m-0 mt-4 text-[0.75rem] font-semibold tracking-[0.08em] text-brand uppercase">
        {intakeNoteAudienceLabels.forClient}
      </p>
      <p className="mt-1.5 mb-0 text-[0.9375rem] leading-[1.55] text-ink">
        {note.forClient}
      </p>
      <p className="m-0 mt-4 text-[0.75rem] font-semibold tracking-[0.08em] text-brand uppercase">
        {intakeNoteAudienceLabels.forFirm}
      </p>
      <p className="mt-1.5 mb-0 text-[0.9375rem] leading-[1.55] text-ink">
        {note.forFirm}
      </p>
      {note.citation ? (
        <blockquote className="mt-4 mb-0 border-l-2 border-brand pl-3 text-[0.875rem] leading-[1.55] text-ink-muted">
          <strong className="text-ink">{note.citation.figure}</strong> {note.citation.text}{" "}
          <cite className="not-italic">
            <a
              href={note.citation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Source: {note.citation.sourceLabel}
            </a>
          </cite>
        </blockquote>
      ) : null}
    </div>
  );
}

function DesktopAnnotationPanel({
  openNote,
  onClose,
  reduceMotion,
}: {
  openNote: IntakeNoteId | null;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  return (
    <aside
      className={`flex w-[min(320px,30vw)] shrink-0 flex-col self-stretch overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface font-sans shadow-[0_12px_32px_-20px_rgba(79,49,146,0.28)] ${reduceMotion ? "" : "intake-side-enter"}`}
      aria-live="polite"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line bg-brand-tint px-4 py-3">
        <p className="m-0 text-[0.75rem] font-semibold tracking-[0.08em] text-brand uppercase">
          {intakeDemoChrome.annotationsLabel}
        </p>
        {openNote !== null ? (
          <button
            type="button"
            className="rounded-[var(--radius-sm)] px-2 py-1 text-[1.125rem] leading-none text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Close annotation"
            onClick={onClose}
          >
            ×
          </button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {openNote !== null ? (
          <AnnotationBody noteId={openNote} />
        ) : (
          <p className="m-0 text-[0.9375rem] leading-[1.55] text-ink-muted">
            {intakeDemoChrome.sidePanelEmpty}
          </p>
        )}
      </div>
    </aside>
  );
}

function MobileAnnotationOverlay({
  noteId,
  onClose,
  reduceMotion,
}: {
  noteId: IntakeNoteId;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end overflow-hidden rounded-b-xl">
      <button
        type="button"
        className={`absolute inset-0 bg-ink/45 ${reduceMotion ? "" : "intake-backdrop-enter"}`}
        aria-label="Dismiss annotation"
        onClick={onClose}
      />
      <div
        className={`relative z-10 mx-3 mb-3 max-h-[min(70%,28rem)] overflow-y-auto rounded-[var(--radius-md)] border border-brand bg-surface p-4 font-sans shadow-[0_16px_40px_-16px_rgba(29,25,40,0.4)] ${reduceMotion ? "" : "intake-overlay-enter"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-[0.8125rem] font-bold text-white"
            aria-hidden
          >
            {noteId}
          </span>
          <button
            type="button"
            className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[1.25rem] leading-none text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Close annotation"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <AnnotationBody noteId={noteId} />
      </div>
    </div>
  );
}

// ── Shared UI pieces ────────────────────────────────────────────────────────

type AnnotationShared = {
  annotationsOn: boolean;
  openNote: IntakeNoteId | null;
  onToggleNote: (id: IntakeNoteId) => void;
  isDesktop: boolean;
};

function FirmHeader({
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onExit,
}: AnnotationShared & { onExit: () => void }) {
  return (
    <div
      className="relative z-10 shrink-0 px-3.5 py-2 sm:px-4"
      style={{ background: "var(--intake-ink)", color: "var(--intake-ink-soft)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="m-0 text-[16px] leading-tight sm:text-[17px]"
            style={{ fontFamily: "var(--intake-display)" }}
          >
            {intakeFirmChrome.firmName}
          </p>
          <Pinned
            noteId={1}
            annotationsOn={annotationsOn}
            openNote={openNote}
            onToggleNote={onToggleNote}
            isDesktop={isDesktop}
            pinAlign="end"
          >
            <p
              className="m-0 mt-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: "var(--intake-brass)" }}
            >
              {intakeFirmChrome.accreditations}
            </p>
          </Pinned>
        </div>
        <Pinned
          noteId={2}
          annotationsOn={annotationsOn}
          openNote={openNote}
          onToggleNote={onToggleNote}
          isDesktop={isDesktop}
          pinAlign="start"
        >
          <button
            type="button"
            className="min-h-9 px-1 text-[13px] font-medium underline-offset-4 hover:underline"
            style={{
              color: "color-mix(in srgb, var(--intake-ink-soft) 82%, transparent)",
            }}
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
    <div className="mb-2.5 flex shrink-0 items-center gap-2.5">
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
        key={step}
        className="shrink-0 text-[11px] font-medium tracking-[0.12em] uppercase transition-opacity"
        style={{ color: "var(--intake-muted)" }}
      >
        {step} / {total}
      </span>
    </div>
  );
}

function Pinned({
  noteId,
  annotationsOn,
  openNote,
  onToggleNote,
  children,
  pinAlign = "end",
}: AnnotationShared & {
  noteId: IntakeNoteId;
  children: ReactNode;
  pinAlign?: "start" | "end";
}) {
  const open = annotationsOn && openNote === noteId;
  return (
    <div className="relative">
      {children}
      {annotationsOn ? (
        <NotePin
          id={noteId}
          open={open}
          onToggle={() => onToggleNote(noteId)}
          align={pinAlign}
        />
      ) : null}
    </div>
  );
}

function NotePin({
  id,
  open,
  onToggle,
  align,
}: {
  id: IntakeNoteId;
  open: boolean;
  onToggle: () => void;
  align: "start" | "end";
}) {
  const delayMs = Math.min(Number(id) * 32, 400);
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={`Annotation ${id}${open ? ", open" : ""}`}
      className={`intake-pin-enter absolute z-[2] flex size-8 items-center justify-center rounded-full font-sans text-[0.6875rem] font-bold text-white transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        align === "end" ? "-top-1 -right-1" : "-top-1 -left-1"
      } ${open ? "intake-pin-pulse" : ""}`}
      style={{
        background: open ? "var(--color-brand)" : "var(--color-ink)",
        boxShadow: open
          ? "0 0 0 2px var(--color-brand-tint), 0 2px 8px rgba(79, 49, 146, 0.35)"
          : "0 2px 8px rgba(29,25,40,0.22)",
        outline: open ? "2px solid var(--color-brand)" : undefined,
        outlineOffset: 1,
        animationDelay: `${delayMs}ms`,
        border: "1.5px solid color-mix(in srgb, var(--color-brand) 55%, white)",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {id}
    </button>
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
      className="mt-2.5 flex min-h-10 w-full shrink-0 items-center justify-center rounded-[10px] px-4 text-[14.5px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
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
  compact,
}: {
  selected: boolean;
  brassEdge?: boolean;
  label: string;
  description?: string;
  onClick: () => void;
  multi?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-start gap-2.5 rounded-[9px] border text-left transition-[color,background-color,transform,border-color] active:scale-[0.99] ${
        compact ? "px-2.5 py-1.5" : "px-3 py-2"
      }`}
      style={{
        borderColor: selected
          ? "var(--intake-ink)"
          : brassEdge
            ? "var(--intake-brass)"
            : "var(--intake-line)",
        background: selected ? "var(--intake-ink)" : "var(--intake-surface)",
        color: selected ? "var(--intake-ink-soft)" : "var(--intake-ink)",
        boxShadow:
          brassEdge && !selected ? "inset 3px 0 0 var(--intake-brass)" : undefined,
      }}
    >
      <span
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]"
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
        <span
          className={`block font-semibold leading-snug ${compact ? "text-[13px]" : "text-[13.5px]"}`}
        >
          {label}
        </span>
        {description ? (
          <span
            className="mt-0.5 block text-[12px] leading-snug"
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
      className="m-0 text-[clamp(1.15rem,3.8vw,1.4rem)] leading-tight font-normal"
      style={{ fontFamily: "var(--intake-display)" }}
    >
      {children}
    </h3>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-1 mb-2 text-[12.5px] leading-snug"
      style={{ color: "var(--intake-muted)" }}
    >
      {children}
    </p>
  );
}

function TrustFooter({
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
}: AnnotationShared) {
  return (
    <Pinned
      noteId={17}
      annotationsOn={annotationsOn}
      openNote={openNote}
      onToggleNote={onToggleNote}
      isDesktop={isDesktop}
    >
      <p
        className="m-0 text-[12px] leading-snug"
        style={{ color: "var(--intake-muted)" }}
      >
        {intakeFirmChrome.trustFooter}
      </p>
    </Pinned>
  );
}

// ── Screens ─────────────────────────────────────────────────────────────────

function WelcomeScreen({
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onBegin,
}: AnnotationShared & { onBegin: () => void }) {
  return (
    <div className="flex flex-col">
      <p
        className="m-0 mb-1.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: "var(--intake-brass)" }}
      >
        {intakeWelcome.eyebrow}
      </p>
      <Pinned
        noteId={3}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ScreenHeading>{intakeWelcome.heading}</ScreenHeading>
      </Pinned>

      <Pinned
        noteId={4}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ul className="mt-3 mb-0 list-none space-y-2 p-0">
          {intakeWelcome.reassurances.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 text-[13.5px] leading-snug"
            >
              <span
                className="mt-0.5 shrink-0"
                style={{ color: "var(--intake-brass)" }}
                aria-hidden
              >
                {item.icon === "shield-lock" ? (
                  <Shield className="size-3.5" strokeWidth={2} />
                ) : (
                  <MessageCircle className="size-3.5" strokeWidth={2} />
                )}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </Pinned>

      <div className="mt-6">
        <PrimaryButton onClick={onBegin}>{intakeWelcome.beginLabel}</PrimaryButton>
        <Pinned
          noteId={5}
          annotationsOn={annotationsOn}
          openNote={openNote}
          onToggleNote={onToggleNote}
          isDesktop={isDesktop}
        >
          <p
            className="mt-2 mb-3 text-center text-[12.5px]"
            style={{ color: "var(--intake-muted)" }}
          >
            {intakeWelcome.effortHint}
          </p>
        </Pinned>
        <TrustFooter
          annotationsOn={annotationsOn}
          openNote={openNote}
          onToggleNote={onToggleNote}
          isDesktop={isDesktop}
        />
      </div>
    </div>
  );
}

function HelpScreen({
  selected,
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onToggle,
  onContinue,
}: AnnotationShared & {
  selected: HelpOptionId[];
  onToggle: (id: HelpOptionId) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Pinned
        noteId={6}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ScreenHeading>{intakeHelp.heading}</ScreenHeading>
        <Hint>{intakeHelp.hint}</Hint>
      </Pinned>
      <div
        className="flex flex-col gap-1.5"
        role="group"
        aria-label={intakeHelp.heading}
      >
        {intakeHelp.options.map((option) => (
          <ChoiceCard
            key={option.id}
            multi
            compact
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
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onPick,
}: AnnotationShared & {
  selected: UrgencyOptionId | null;
  onPick: (id: UrgencyOptionId) => void;
}) {
  return (
    <div className="flex flex-col">
      <Pinned
        noteId={7}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ScreenHeading>{intakeUrgency.heading}</ScreenHeading>
        <Hint>{intakeUrgency.hint}</Hint>
      </Pinned>
      <div
        className="flex flex-col gap-2"
        role="radiogroup"
        aria-label={intakeUrgency.heading}
      >
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
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onPick,
}: AnnotationShared & {
  selected: StageOptionId | null;
  onPick: (id: StageOptionId) => void;
}) {
  return (
    <div className="flex flex-col">
      <Pinned
        noteId={8}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ScreenHeading>{intakeStage.heading}</ScreenHeading>
      </Pinned>
      <div
        className="mt-2 flex flex-col gap-1.5"
        role="radiogroup"
        aria-label={intakeStage.heading}
      >
        {intakeStage.options.map((option) => (
          <ChoiceCard
            key={option.id}
            compact
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
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onToggle,
  onContinue,
}: AnnotationShared & {
  selected: SignalOptionId[];
  onToggle: (id: SignalOptionId) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Pinned
        noteId={9}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ScreenHeading>{intakeSignals.heading}</ScreenHeading>
        <Hint>{intakeSignals.hint}</Hint>
      </Pinned>
      <div
        className="flex flex-col gap-1.5"
        role="group"
        aria-label={intakeSignals.heading}
      >
        {intakeSignals.options.map((option) => (
          <ChoiceCard
            key={option.id}
            multi
            compact
            selected={selected.includes(option.id)}
            label={option.label}
            onClick={() => onToggle(option.id)}
          />
        ))}
        <Pinned
          noteId={10}
          annotationsOn={annotationsOn}
          openNote={openNote}
          onToggleNote={onToggleNote}
          isDesktop={isDesktop}
        >
          <ChoiceCard
            multi
            compact
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
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onPick,
  onContinue,
}: AnnotationShared & {
  route: IntakeRoute;
  selected: CallbackWindowId | null;
  onPick: (id: CallbackWindowId) => void;
  onContinue: () => void;
}) {
  const copy = route === "urgent" ? intakeCallback.urgent : intakeCallback.nonUrgent;
  return (
    <div className="flex flex-col">
      <Pinned
        noteId={11}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        {"badge" in copy && copy.badge ? (
          <p
            className="m-0 mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
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

      <div className="flex flex-col gap-1.5" role="radiogroup" aria-label={copy.heading}>
        <ChoiceCard
          compact
          selected={selected === "asap"}
          brassEdge={copy.asap.brassEdge}
          label={copy.asap.label}
          description={copy.asap.description}
          onClick={() => onPick("asap")}
        />
      </div>

      <Pinned
        noteId={12}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <p
          className="mt-2.5 mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: "var(--intake-muted)" }}
        >
          {intakeCallback.orChooseLabel}
        </p>
        <div className="flex flex-col gap-1.5" role="group">
          {intakeCallback.windows.map((window) => (
            <ChoiceCard
              key={window.id}
              compact
              selected={selected === window.id}
              label={window.label}
              description={window.hours}
              onClick={() => onPick(window.id)}
            />
          ))}
        </div>
      </Pinned>

      <div className="mt-4">
        <PrimaryButton disabled={!selected} onClick={onContinue}>
          {intakeCallback.continueLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}

function ContactScreen({
  answers,
  errors,
  route,
  noteFocused,
  onNoteFocus,
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  onChange,
  onSubmit,
}: AnnotationShared & {
  answers: DemoAnswers;
  errors: ContactErrors;
  route: IntakeRoute;
  noteFocused: boolean;
  onNoteFocus: () => void;
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
    <div className="flex flex-col">
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

      <Pinned
        noteId={13}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <div className="mt-2 space-y-2">
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

      <Pinned
        noteId={14}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <label className="mt-2 block">
          <span className="text-[12.5px] font-semibold">
            {intakeContact.optionalNote.label}{" "}
            <span className="font-normal" style={{ color: "var(--intake-muted)" }}>
              {intakeContact.optionalNote.hint}
            </span>
          </span>
          {noteFocused || answers.note ? (
            <textarea
              className="mt-1 min-h-[2.5rem] w-full rounded-[9px] border px-2.5 py-1.5 text-[13.5px] outline-none"
              style={{
                borderColor: "var(--intake-line)",
                background: "var(--intake-surface)",
                color: "var(--intake-ink)",
              }}
              value={answers.note}
              onChange={(e) => onChange({ note: e.target.value })}
            />
          ) : (
            <input
              className="mt-1 min-h-9 w-full rounded-[9px] border px-2.5 text-[13.5px] outline-none"
              style={{
                borderColor: "var(--intake-line)",
                background: "var(--intake-surface)",
                color: "var(--intake-ink)",
              }}
              value={answers.note}
              onFocus={onNoteFocus}
              onChange={(e) => onChange({ note: e.target.value })}
              placeholder="Optional"
            />
          )}
        </label>
      </Pinned>

      <div className="mt-4">
        <PrimaryButton disabled={!canSubmit} onClick={onSubmit}>
          {route === "urgent"
            ? intakeContact.submitUrgent
            : intakeContact.submitNonUrgent}
        </PrimaryButton>

        <Pinned
          noteId={15}
          annotationsOn={annotationsOn}
          openNote={openNote}
          onToggleNote={onToggleNote}
          isDesktop={isDesktop}
        >
          <p
            className="mt-2 mb-0 flex items-center justify-center gap-1.5 text-center text-[11.5px]"
            style={{ color: "var(--intake-muted)" }}
          >
            <Lock className="size-3 shrink-0" strokeWidth={2} aria-hidden />
            {intakeContact.lockLine}
          </p>
        </Pinned>
      </div>
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
    <div className="mt-1.5">
      <label htmlFor={id} className="text-[12.5px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        className="mt-1 min-h-9 w-full rounded-[9px] border px-2.5 text-[13.5px] outline-none"
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
        <p className="mt-0.5 mb-0 text-[11.5px]" style={{ color: "var(--intake-error)" }}>
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
      <legend className="mb-1 text-[12.5px] font-semibold">{label}</legend>
      <div className="flex gap-1.5">
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
              className="min-h-9 flex-1 rounded-[9px] border text-[13px] font-semibold"
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
  annotationsOn,
  openNote,
  onToggleNote,
  isDesktop,
  restartSeconds,
  onRestart,
}: AnnotationShared & {
  answers: DemoAnswers;
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
    <div className="flex flex-col">
      {route === "urgent" ? (
        <p
          className="m-0 mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
          style={{
            background: "var(--intake-brass-soft)",
            color: "var(--intake-brass)",
          }}
        >
          {intakeSuccess.urgentBadge}
        </p>
      ) : null}
      <p
        className="m-0 mb-1.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: "var(--intake-brass)" }}
      >
        {intakeSuccess.eyebrow}
      </p>
      <ScreenHeading>
        {intakeSuccess.heading(firstNameFrom(answers.name))}
      </ScreenHeading>
      <Hint>{intakeSuccess.subtext}</Hint>

      <Pinned
        noteId={16}
        annotationsOn={annotationsOn}
        openNote={openNote}
        onToggleNote={onToggleNote}
        isDesktop={isDesktop}
      >
        <ol className="m-0 list-none space-y-2.5 p-0">
          {intakeSuccess.timeline.map((item, index) => {
            const body =
              "bodyLead" in item
                ? `${item.bodyLead} ${callTime}.${callExtras ? ` ${callExtras}` : ""}`
                : item.body;
            return (
              <li key={item.title} className="flex gap-2.5">
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: "var(--intake-brass-soft)",
                    color: "var(--intake-brass)",
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="m-0 text-[13.5px] font-semibold leading-snug">
                    {item.title}
                  </p>
                  <p
                    className="mt-0.5 mb-0 text-[12px] leading-snug"
                    style={{ color: "var(--intake-muted)" }}
                  >
                    {body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Pinned>

      <div className="mt-5">
        <PrimaryButton onClick={onRestart}>
          {intakeSuccess.restartLabel}
          {restartSeconds > 0 ? ` (${restartSeconds})` : ""}
        </PrimaryButton>

        <div className="mt-3">
          <TrustFooter
            annotationsOn={annotationsOn}
            openNote={openNote}
            onToggleNote={onToggleNote}
            isDesktop={isDesktop}
          />
        </div>
      </div>
    </div>
  );
}

function ExitPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col justify-center px-5 py-10 text-center">
      <h3
        className="m-0 text-[clamp(1.15rem,3.8vw,1.4rem)] leading-tight font-normal"
        style={{ fontFamily: "var(--intake-display)" }}
      >
        {intakeExit.heading}
      </h3>
      <p
        className="mx-auto mt-3 mb-0 max-w-[36ch] text-[14px] leading-snug"
        style={{ color: "var(--intake-muted)" }}
      >
        {intakeExit.body}
      </p>
      <PrimaryButton onClick={onBack}>{intakeExit.backLabel}</PrimaryButton>
    </div>
  );
}
