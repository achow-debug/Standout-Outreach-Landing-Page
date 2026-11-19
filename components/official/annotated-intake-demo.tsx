"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { Lock } from "lucide-react";
import {
  buildIntakeTeamRecord,
  formatCallTimeWording,
  intakeBeforeCall,
  intakeCallback,
  intakeContact,
  intakeDemoChrome,
  intakeExit,
  intakeFirmChrome,
  intakeHelp,
  intakeNotes,
  intakeRoutingTables,
  intakeSignals,
  intakeStage,
  intakeStepNumber,
  intakeSuccess,
  intakeTeamRecord,
  intakeTotalSteps,
  intakeUrgency,
  intakeValue,
  isUrgentSelection,
  nextIntakeScreen,
  prevIntakeScreen,
  sampleTeamRecordView,
  type BuiltTeamRecord,
  type CallbackWindowId,
  type HelpOptionId,
  type IntakeDemoTab,
  type IntakeNoteId,
  type IntakeRoute,
  type IntakeScreenId,
  type SignalOptionId,
  type StageOptionId,
  type UrgencyOptionId,
  type ValueOptionId,
} from "@/content/intake-demo";
import { getRecaptchaSiteKey } from "@/lib/recaptcha-config";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
  loading: () => <p className="sl-captcha-loading m-0">Loading verification…</p>,
});

type ContactErrors = {
  name?: string;
  phone?: string;
  email?: string;
};

type DemoAnswers = {
  help: HelpOptionId[];
  urgency: UrgencyOptionId[];
  route: IntakeRoute | null;
  stage: StageOptionId | null;
  signals: SignalOptionId[];
  value: ValueOptionId | null;
  callback: CallbackWindowId | null;
  name: string;
  phone: string;
  email: string;
  contactSafe: boolean;
  otherPerson: string;
  note: string;
};

type NoteAnchor = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

const initialAnswers: DemoAnswers = {
  help: [],
  urgency: [],
  route: null,
  stage: null,
  signals: [],
  value: null,
  callback: null,
  name: "",
  phone: "",
  email: "",
  contactSafe: false,
  otherPerson: "",
  note: "",
};

const STEP_SCREENS: IntakeScreenId[] = [
  "help",
  "urgency",
  "stage",
  "signals",
  "value",
  "callback",
  "contact",
  "beforeCall",
  "success",
];

const OPTION_STEPS = new Set<IntakeScreenId>([
  "help",
  "urgency",
  "stage",
  "signals",
  "value",
  "callback",
]);

function firstNameFrom(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "there";
}

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function screenIsReady(id: IntakeScreenId, answers: DemoAnswers): boolean {
  switch (id) {
    case "help":
      return answers.help.length > 0;
    case "urgency":
      return answers.urgency.length > 0;
    case "stage":
      return answers.stage !== null;
    case "signals":
      return answers.signals.length > 0;
    case "value":
      return answers.value !== null;
    case "callback":
      return answers.callback !== null;
    default:
      return true;
  }
}

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setPhone(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return phone;
}

type AnnotatedIntakeDemoProps = {
  /**
   * Homepage Card 1: dark form only — no title/lead/tabs/annotations toggle.
   * Client view only; numbered annotation dots stay on.
   */
  hideChrome?: boolean;
};

/**
 * Interactive annotated Standout Legal enquiry demo.
 * Demo-only state — nothing is submitted to a backend.
 */
export function AnnotatedIntakeDemo({ hideChrome = false }: AnnotatedIntakeDemoProps) {
  const [screen, setScreen] = useState<IntakeScreenId>("help");
  const [returnScreen, setReturnScreen] = useState<IntakeScreenId>("help");
  const [tab, setTab] = useState<IntakeDemoTab>("client");
  const [answers, setAnswers] = useState<DemoAnswers>(initialAnswers);
  const [annotationsOn, setAnnotationsOn] = useState(false);
  const [openNote, setOpenNote] = useState<IntakeNoteId | null>(null);
  const [noteAnchor, setNoteAnchor] = useState<NoteAnchor | null>(null);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const recaptchaSiteKey = getRecaptchaSiteKey();
  const [recordArriving, setRecordArriving] = useState(false);
  const [conflictCleared, setConflictCleared] = useState(false);
  const pinRef = useRef<HTMLButtonElement | null>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const isPhone = useIsPhone();

  useLayoutEffect(() => {
    const panels = panelsRef.current;
    if (!panels) return;

    let frame = 0;
    const measure = () => {
      panels.style.minHeight = "0px";
      const cards = panels.querySelectorAll<HTMLElement>(".sl-card");
      let max = 0;
      cards.forEach((card) => {
        max = Math.max(max, card.offsetHeight);
      });
      if (max > 0) panels.style.minHeight = `${max}px`;
      return panels.clientWidth;
    };

    let lastWidth = measure();
    const observer = new ResizeObserver(() => {
      const next = panels.clientWidth;
      if (Math.abs(next - lastWidth) < 1) return;
      lastWidth = next;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lastWidth = measure();
      });
    });
    observer.observe(panels);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const flowInput = {
    route: answers.route,
    help: answers.help,
  };

  const closeNote = useCallback(() => {
    setOpenNote(null);
    pinRef.current?.focus();
  }, []);

  const openNoteFrom = (id: IntakeNoteId, button: HTMLButtonElement) => {
    pinRef.current = button;
    const rect = button.getBoundingClientRect();
    setNoteAnchor({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
    });
    setOpenNote(id);
  };

  const goTo = (next: IntakeScreenId) => {
    setOpenNote(null);
    setContactErrors({});
    if (next !== "beforeCall") {
      setCaptchaToken(null);
      setCaptchaError(null);
    }
    setScreen(next);
  };

  const resetToUrgency = () => {
    setAnswers((prev) => ({
      ...initialAnswers,
      help: prev.help,
    }));
    setSubmitted(false);
    setRecordArriving(false);
    setConflictCleared(false);
    setCaptchaToken(null);
    setCaptchaError(null);
    setTab("client");
    goTo("urgency");
  };

  const toggleHelp = (id: HelpOptionId) => {
    setAnswers((prev) => {
      const has = prev.help.includes(id);
      return {
        ...prev,
        help: has ? prev.help.filter((item) => item !== id) : [...prev.help, id],
      };
    });
  };

  const toggleUrgency = (id: UrgencyOptionId) => {
    setAnswers((prev) => {
      if (id === "none") {
        return {
          ...prev,
          urgency: prev.urgency.includes("none") ? [] : ["none"],
          route: prev.urgency.includes("none") ? null : "nonUrgent",
        };
      }
      const withoutNone = prev.urgency.filter((item) => item !== "none");
      const has = withoutNone.includes(id);
      const next = has
        ? withoutNone.filter((item) => item !== id)
        : [...withoutNone, id];
      return {
        ...prev,
        urgency: next,
        route: next.length > 0 ? "urgent" : null,
      };
    });
  };

  const toggleSignal = (id: SignalOptionId) => {
    setAnswers((prev) => {
      if (id === "none") {
        return {
          ...prev,
          signals: prev.signals.includes("none") ? [] : ["none"],
        };
      }
      const withoutNone = prev.signals.filter((item) => item !== "none");
      const has = withoutNone.includes(id);
      return {
        ...prev,
        signals: has
          ? withoutNone.filter((item) => item !== id)
          : [...withoutNone, id],
      };
    });
  };

  const validateContact = (): boolean => {
    const next: ContactErrors = {};
    if (!answers.name.trim()) next.name = intakeContact.fields.name.error;
    if (digitCount(answers.phone) < 10) next.phone = intakeContact.fields.phone.error;
    if (!isValidEmail(answers.email)) next.email = intakeContact.fields.email.error;
    setContactErrors(next);
    return Object.keys(next).length === 0;
  };

  const continueFrom = (id: IntakeScreenId) => {
    if (id !== screen) return;
    if (id === "contact") {
      if (!validateContact()) return;
      goTo(nextIntakeScreen(id, flowInput));
      return;
    }
    if (id === "beforeCall") {
      if (recaptchaSiteKey && !captchaToken) {
        setCaptchaError(intakeBeforeCall.captchaError);
        return;
      }
      setCaptchaError(null);
      setConflictCleared(false);
      setRecordArriving(true);
      setSubmitted(true);
      setTab("team");
      goTo("success");
      return;
    }
    if (!screenIsReady(id, answers)) return;
    const route: IntakeRoute | null =
      id === "urgency"
        ? isUrgentSelection(answers.urgency)
          ? "urgent"
          : "nonUrgent"
        : answers.route;
    if (id === "urgency" && route) {
      setAnswers((prev) => ({ ...prev, route }));
    }
    goTo(
      nextIntakeScreen(id, {
        route,
        help: answers.help,
      }),
    );
  };

  const selectTab = (next: IntakeDemoTab) => {
    setRecordArriving(false);
    setTab(next);
  };

  const showChrome = !hideChrome;
  /** Homepage peek has no toggle — dots stay available; full demo uses the switch. */
  const annotationsEnabled = hideChrome || annotationsOn;
  const activeTab: IntakeDemoTab = hideChrome ? "client" : tab;

  return (
    <div
      className={`sl-demo mx-auto flex w-full max-w-[40rem] flex-col lg:max-w-none ${
        hideChrome
          ? "sl-demo--peek gap-0 p-0"
          : "gap-4 lg:gap-3 lg:p-6 xl:p-8"
      }`}
    >
      {showChrome ? (
        <>
          <div className="sl-demo-heading relative flex flex-col items-center gap-3 px-1 text-center lg:items-stretch lg:gap-2 lg:px-0 lg:text-left">
            <h3 className="m-0 min-w-0 text-h2 text-ink lg:pr-[9.5rem] lg:text-[1.75rem] lg:leading-tight">
              {intakeDemoChrome.title}
            </h3>
            <p className="m-0 w-full min-w-0 text-body text-ink lg:max-w-[54ch]">
              {intakeDemoChrome.leadLine}
            </p>
            <label className="inline-flex shrink-0 items-center gap-2 text-small font-semibold text-ink lg:absolute lg:top-0 lg:right-0">
              <span>{intakeDemoChrome.annotationsLabel}</span>
              <button
                type="button"
                role="switch"
                aria-checked={annotationsOn}
                className={`relative h-7 w-12 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  annotationsOn ? "bg-brand" : "bg-ink/20"
                }`}
                onClick={() => {
                  setAnnotationsOn((on) => !on);
                  if (annotationsOn) setOpenNote(null);
                }}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white transition-transform ${
                    annotationsOn ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </label>
          </div>

          <div
            role="tablist"
            aria-label="Enquiry demo views"
            className="sl-demo-tabs flex gap-1 border-b border-line"
          >
            {(
              [
                ["client", intakeDemoChrome.tabs.client],
                ["team", intakeDemoChrome.tabs.team],
              ] as const
            ).map(([id, label]) => {
              const selected = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`min-h-11 px-3 text-small font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    selected
                      ? "border-b-2 border-ink text-ink"
                      : "border-b-2 border-transparent text-ink-muted hover:text-ink"
                  }`}
                  onClick={() => selectTab(id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      <div className="sl-tab-panels" ref={panelsRef}>
        <div
          role={showChrome ? "tabpanel" : "region"}
          id={`${baseId}-panel-client`}
          aria-labelledby={showChrome ? `${baseId}-tab-client` : undefined}
          aria-label={showChrome ? undefined : intakeDemoChrome.title}
          className={`sl-tab-panel ${activeTab === "client" ? "is-active" : ""}`}
          aria-hidden={activeTab !== "client"}
          inert={activeTab !== "client"}
        >
          <div className="sl-card">
            <CardHeader
              annotationsOn={annotationsEnabled}
              onExit={() => {
                setOpenNote(null);
                setReturnScreen(screen === "exit" ? returnScreen : screen);
                setScreen("exit");
              }}
              onOpenNote={openNoteFrom}
            />
            <div className="sl-steps">
              {STEP_SCREENS.map((id) => {
                const active = screen === id;
                return (
                  <div
                    key={id}
                    className={`sl-step ${active ? "is-active" : ""}`}
                    aria-hidden={!active}
                    inert={!active}
                  >
                    <div className="sl-step-body">
                      {id in intakeStepNumber ? (
                        <p className="sl-count">
                          {intakeStepNumber[id as keyof typeof intakeStepNumber]}{" "}
                          / {intakeTotalSteps}
                        </p>
                      ) : null}
                      <ScreenBody
                        id={id}
                        answers={answers}
                        contactErrors={contactErrors}
                        annotationsOn={annotationsEnabled}
                        onOpenNote={openNoteFrom}
                        setAnswers={setAnswers}
                        toggleHelp={toggleHelp}
                        toggleUrgency={toggleUrgency}
                        toggleSignal={toggleSignal}
                      />
                    </div>
                    <CardFooter
                      screen={id}
                      route={answers.route}
                      ready={screenIsReady(id, answers)}
                      annotationsOn={annotationsEnabled}
                      onOpenNote={openNoteFrom}
                      recaptchaSiteKey={recaptchaSiteKey}
                      captchaError={captchaError}
                      onCaptchaChange={(token) => {
                        setCaptchaToken(token);
                        if (token) setCaptchaError(null);
                      }}
                      onBack={() => {
                        if (id === screen) goTo(prevIntakeScreen(id, flowInput));
                      }}
                      onContinue={() => continueFrom(id)}
                      onTryOther={resetToUrgency}
                    />
                  </div>
                );
              })}
            </div>
            {screen === "exit" ? (
              <div className="sl-exit-overlay">
                <h4 className="sl-serif sl-question m-0">{intakeExit.heading}</h4>
                <p className="sl-body m-0">{intakeExit.body}</p>
                <button
                  type="button"
                  className="sl-btn sl-btn-primary"
                  onClick={() => goTo(returnScreen)}
                >
                  {intakeExit.backLabel}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {showChrome ? (
          <div
            role="tabpanel"
            id={`${baseId}-panel-team`}
            aria-labelledby={`${baseId}-tab-team`}
            className={`sl-tab-panel ${activeTab === "team" ? "is-active" : ""}`}
            aria-hidden={activeTab !== "team"}
            inert={activeTab !== "team"}
          >
            <div className="sl-card sl-card--record">
              <TeamRecordPanel
                submitted={submitted}
                arriving={recordArriving && submitted && activeTab === "team"}
                cleared={conflictCleared}
                onClear={() => setConflictCleared(true)}
                answers={answers}
                annotationsOn={annotationsEnabled}
                onOpenNote={openNoteFrom}
              />
            </div>
          </div>
        ) : null}
      </div>

      {showChrome ? (
        <p className="sl-demo-caption m-0 text-center text-small text-ink-muted">
          {intakeDemoChrome.caption}
        </p>
      ) : null}

      {openNote !== null && annotationsEnabled ? (
        <NoteDialog
          noteId={openNote}
          anchor={noteAnchor}
          isPhone={isPhone}
          onClose={closeNote}
        />
      ) : null}
    </div>
  );
}

function CardHeader({
  annotationsOn,
  onExit,
  onOpenNote,
}: {
  annotationsOn: boolean;
  onExit: () => void;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
}) {
  return (
    <div className="sl-header">
      <div className="sl-header-main min-w-0">
        <p className="sl-serif sl-firm m-0">{intakeFirmChrome.firmName}</p>
      </div>
      <div className="sl-pin-host shrink-0 self-start">
        <button type="button" className="sl-exit" onClick={onExit}>
          {intakeFirmChrome.exitLabel}
        </button>
        {annotationsOn ? (
          <NotePin id={2} onOpen={onOpenNote} className="sl-pin-corner" />
        ) : null}
      </div>
    </div>
  );
}

function CardFooter({
  screen,
  route,
  ready,
  annotationsOn,
  onOpenNote,
  recaptchaSiteKey,
  captchaError,
  onCaptchaChange,
  onBack,
  onContinue,
  onTryOther,
}: {
  screen: IntakeScreenId;
  route: IntakeRoute | null;
  ready: boolean;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
  recaptchaSiteKey: string | null;
  captchaError: string | null;
  onCaptchaChange: (token: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
  onTryOther: () => void;
}) {
  if (screen === "success") {
    return (
      <div className="sl-footer">
        <button type="button" className="sl-text-link" onClick={onTryOther}>
          {intakeSuccess.tryOtherRoute}
        </button>
        <DemoSraBadge annotationsOn={annotationsOn} onOpenNote={onOpenNote} />
        <p className="sl-trust m-0">{intakeFirmChrome.trustFooter}</p>
      </div>
    );
  }

  const isSubmit = screen === "beforeCall";
  const continueLabel = isSubmit
    ? route === "urgent"
      ? intakeBeforeCall.submitUrgent
      : intakeBeforeCall.submitNonUrgent
    : intakeDemoChrome.continueLabel;
  const waiting = OPTION_STEPS.has(screen) && !ready;
  const showLock = screen === "contact" || screen === "beforeCall";
  const showBack = screen !== "help";

  return (
    <div className="sl-footer">
      {showLock ? (
        <p className="sl-lock m-0">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          {screen === "contact" ? intakeContact.lockLine : intakeBeforeCall.lockLine}
        </p>
      ) : null}
      {isSubmit ? (
        <>
          <p className="sl-pin-host sl-privacy-notice m-0">
            {intakeBeforeCall.privacyNotice}
            {annotationsOn ? (
              <NotePin id={20} onOpen={onOpenNote} className="sl-pin-end" />
            ) : null}
          </p>
          <div className="sl-pin-host sl-captcha">
            {recaptchaSiteKey ? (
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                theme="dark"
                onChange={onCaptchaChange}
                onExpired={() => onCaptchaChange(null)}
              />
            ) : (
              <p className="sl-captcha-missing m-0">
                {intakeBeforeCall.captchaMissingKey}
              </p>
            )}
            {annotationsOn ? (
              <NotePin id={21} onOpen={onOpenNote} className="sl-pin-end" />
            ) : null}
          </div>
          {captchaError ? (
            <p className="sl-captcha-error m-0" role="alert">
              {captchaError}
            </p>
          ) : null}
          <DemoSraBadge annotationsOn={annotationsOn} onOpenNote={onOpenNote} />
        </>
      ) : null}
      <p className="sl-footer-hint m-0">{waiting ? intakeDemoChrome.chooseHint : "\u00a0"}</p>
      <div className="sl-footer-actions">
        {showBack ? (
          <button type="button" className="sl-btn sl-btn-back" onClick={onBack}>
            {intakeDemoChrome.backLabel}
          </button>
        ) : null}
        <button
          type="button"
          className={`sl-btn sl-btn-primary ${waiting ? "is-waiting" : "is-ready"}`}
          onClick={onContinue}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}

function DemoSraBadge({
  annotationsOn,
  onOpenNote,
}: {
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
}) {
  const { sraBadge } = intakeFirmChrome;

  return (
    <div className="sl-pin-host sl-sra-badge-wrap">
      <div
        className="sl-sra-badge"
        role="img"
        aria-label={`${sraBadge.demoLabel}. SRA number ${sraBadge.number}.`}
      >
        <div className="sl-sra-badge-mark" aria-hidden>
          <span className="sl-sra-badge-mark-text">SRA</span>
        </div>
        <div className="sl-sra-badge-body">
          <p className="sl-sra-badge-title m-0">Solicitors Regulation Authority</p>
          <p className="sl-sra-badge-firm m-0">{sraBadge.firmLine}</p>
          <p className="sl-sra-badge-meta m-0">
            <span>SRA no. {sraBadge.number}</span>
            <span aria-hidden>·</span>
            <span>{sraBadge.dateLabel}</span>
          </p>
          <p className="sl-sra-badge-demo m-0">{sraBadge.demoLabel}</p>
        </div>
      </div>
      {annotationsOn ? (
        <NotePin id={18} onOpen={onOpenNote} className="sl-pin-end" />
      ) : null}
    </div>
  );
}

function ScreenBody({
  id,
  answers,
  contactErrors,
  annotationsOn,
  onOpenNote,
  setAnswers,
  toggleHelp,
  toggleUrgency,
  toggleSignal,
}: {
  id: IntakeScreenId;
  answers: DemoAnswers;
  contactErrors: ContactErrors;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
  setAnswers: Dispatch<SetStateAction<DemoAnswers>>;
  toggleHelp: (id: HelpOptionId) => void;
  toggleUrgency: (id: UrgencyOptionId) => void;
  toggleSignal: (id: SignalOptionId) => void;
}) {
  if (id === "help") {
    return (
      <OptionFieldset
        legend={intakeHelp.heading}
        hint={intakeHelp.hint}
        noteId={6}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
      >
        {intakeHelp.options.map((option) => (
          <ChoiceRow
            key={option.id}
            multi
            name="help"
            option={option}
            checked={answers.help.includes(option.id)}
            onChange={() => toggleHelp(option.id)}
          />
        ))}
      </OptionFieldset>
    );
  }
  if (id === "urgency") {
    return (
      <div className="sl-stack">
        <OptionFieldset
          legend={intakeUrgency.heading}
          hint={intakeUrgency.hint}
          noteId={7}
          annotationsOn={annotationsOn}
          onOpenNote={onOpenNote}
        >
          {intakeUrgency.options.map((option) => (
            <ChoiceRow
              key={option.id}
              multi
              name="urgency"
              option={option}
              checked={answers.urgency.includes(option.id)}
              onChange={() => toggleUrgency(option.id)}
            />
          ))}
          <ChoiceRow
            multi
            name="urgency"
            option={intakeUrgency.noneOption}
            checked={answers.urgency.includes("none")}
            onChange={() => toggleUrgency("none")}
          />
        </OptionFieldset>
        <div className="sl-reserved">
          {intakeUrgency.alwaysVisible.map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }
  if (id === "stage") {
    return (
      <OptionFieldset
        legend={intakeStage.heading}
        noteId={8}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
      >
        {intakeStage.options.map((option) => (
          <ChoiceRow
            key={option.id}
            name="stage"
            option={option}
            checked={answers.stage === option.id}
            onChange={() => setAnswers((prev) => ({ ...prev, stage: option.id }))}
          />
        ))}
      </OptionFieldset>
    );
  }
  if (id === "signals") {
    return (
      <OptionFieldset
        legend={intakeSignals.heading}
        hint={intakeSignals.hint}
        noteId={9}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
      >
        {intakeSignals.options.map((option) => (
          <ChoiceRow
            key={option.id}
            multi
            name="signals"
            option={option}
            checked={answers.signals.includes(option.id)}
            onChange={() => toggleSignal(option.id)}
          />
        ))}
        <div className="sl-pin-host">
          <ChoiceRow
            multi
            name="signals"
            option={intakeSignals.noneOption}
            checked={answers.signals.includes("none")}
            onChange={() => toggleSignal("none")}
          />
          {annotationsOn ? (
            <NotePin id={10} onOpen={onOpenNote} className="sl-pin-row" />
          ) : null}
        </div>
      </OptionFieldset>
    );
  }
  if (id === "value") {
    return (
      <OptionFieldset
        legend={intakeValue.heading}
        hint={intakeValue.subtext}
        noteId={11}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
      >
        {intakeValue.options.map((option) => (
          <ChoiceRow
            key={option.id}
            name="value"
            option={option}
            checked={answers.value === option.id}
            onChange={() => setAnswers((prev) => ({ ...prev, value: option.id }))}
          />
        ))}
      </OptionFieldset>
    );
  }
  if (id === "callback") {
    const copy =
      answers.route === "urgent" ? intakeCallback.urgent : intakeCallback.nonUrgent;
    return (
      <div className="sl-stack">
        {"badge" in copy && copy.badge ? <p className="sl-pill m-0">{copy.badge}</p> : null}
        <OptionFieldset
          legend={copy.heading}
          hint={copy.subtext}
          noteId={12}
          annotationsOn={annotationsOn}
          onOpenNote={onOpenNote}
        >
          <ChoiceRow
            name="callback"
            option={copy.asap}
            checked={answers.callback === "asap"}
            onChange={() => setAnswers((prev) => ({ ...prev, callback: "asap" }))}
          />
          <p className="sl-pin-host sl-or m-0">
            {intakeCallback.orChooseLabel}
            {annotationsOn ? (
              <NotePin id={13} onOpen={onOpenNote} className="sl-pin-end" />
            ) : null}
          </p>
          {intakeCallback.windows.map((window) => (
            <ChoiceRow
              key={window.id}
              name="callback"
              option={{
                id: window.id,
                label: window.label,
                description: window.hours,
              }}
              checked={answers.callback === window.id}
              onChange={() =>
                setAnswers((prev) => ({ ...prev, callback: window.id }))
              }
            />
          ))}
        </OptionFieldset>
      </div>
    );
  }
  if (id === "contact") {
    return (
      <ContactScreen
        answers={answers}
        errors={contactErrors}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
        setAnswers={setAnswers}
      />
    );
  }
  if (id === "beforeCall") {
    return (
      <BeforeCallScreen
        answers={answers}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
        setAnswers={setAnswers}
      />
    );
  }
  if (id === "success") {
    return (
      <SuccessScreen
        answers={answers}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
      />
    );
  }
  return null;
}

function ContactScreen({
  answers,
  errors,
  annotationsOn,
  onOpenNote,
  setAnswers,
}: {
  answers: DemoAnswers;
  errors: ContactErrors;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
  setAnswers: Dispatch<SetStateAction<DemoAnswers>>;
}) {
  return (
    <div className="sl-stack">
      <h4 className="sl-serif sl-question m-0">{intakeContact.heading}</h4>
      <p className="sl-hint m-0">{intakeContact.subtext}</p>
      <div className="sl-fields-grid">
        <Field
          label={intakeContact.fields.name.label}
          value={answers.name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => setAnswers((prev) => ({ ...prev, name: value }))}
        />
        <Field
          label={intakeContact.fields.phone.label}
          value={answers.phone}
          error={errors.phone}
          autoComplete="tel"
          inputMode="tel"
          onChange={(value) => setAnswers((prev) => ({ ...prev, phone: value }))}
        />
        <Field
          label={intakeContact.fields.email.label}
          value={answers.email}
          error={errors.email}
          autoComplete="email"
          inputMode="email"
          onChange={(value) => setAnswers((prev) => ({ ...prev, email: value }))}
        />
      </div>
      <div className="sl-pin-host">
        <ChoiceRow
          multi
          name="discretion"
          option={{ id: "safe", label: intakeContact.discretionLabel, description: "" }}
          checked={answers.contactSafe}
          onChange={() =>
            setAnswers((prev) => ({ ...prev, contactSafe: !prev.contactSafe }))
          }
        />
        {annotationsOn ? (
          <NotePin id={14} onOpen={onOpenNote} className="sl-pin-row" />
        ) : null}
      </div>
    </div>
  );
}

function BeforeCallScreen({
  answers,
  annotationsOn,
  onOpenNote,
  setAnswers,
}: {
  answers: DemoAnswers;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
  setAnswers: Dispatch<SetStateAction<DemoAnswers>>;
}) {
  return (
    <div className="sl-stack sl-fields-grid sl-fields-grid--before-call">
      <div className="sl-pin-host sl-field">
        <label className="sl-field-label" htmlFor="sl-other-person">
          {intakeBeforeCall.otherPerson.label}{" "}
          <span className="sl-optional">{intakeBeforeCall.otherPerson.hint}</span>
        </label>
        <p className="sl-hint m-0">{intakeBeforeCall.otherPerson.helper}</p>
        <input
          id="sl-other-person"
          type="text"
          value={answers.otherPerson}
          onChange={(event) =>
            setAnswers((prev) => ({ ...prev, otherPerson: event.target.value }))
          }
        />
        {annotationsOn ? (
          <NotePin id={15} onOpen={onOpenNote} className="sl-pin-field" />
        ) : null}
      </div>
      <div className="sl-pin-host sl-field">
        <label className="sl-field-label" htmlFor="sl-note">
          {intakeBeforeCall.optionalNote.label}{" "}
          <span className="sl-optional">{intakeBeforeCall.optionalNote.hint}</span>
        </label>
        <textarea
          id="sl-note"
          rows={3}
          value={answers.note}
          onChange={(event) =>
            setAnswers((prev) => ({ ...prev, note: event.target.value }))
          }
        />
        {annotationsOn ? (
          <NotePin id={16} onOpen={onOpenNote} className="sl-pin-field" />
        ) : null}
      </div>
    </div>
  );
}

function SuccessScreen({
  answers,
  annotationsOn,
  onOpenNote,
}: {
  answers: DemoAnswers;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
}) {
  const route = answers.route ?? "nonUrgent";
  const callTime = answers.callback
    ? formatCallTimeWording(answers.callback, route)
    : intakeSuccess.callTimeWording.asapNonUrgent;

  return (
    <div className="sl-stack">
      {route === "urgent" ? (
        <p className="sl-pill m-0">{intakeSuccess.urgentBadge}</p>
      ) : null}
      <p className="sl-eyebrow m-0">{intakeSuccess.eyebrow}</p>
      <h4 className="sl-serif sl-display m-0">
        {intakeSuccess.heading(firstNameFrom(answers.name))}
      </h4>
      <p className="sl-hint m-0">{intakeSuccess.subtext}</p>
      <ol className="sl-pin-host sl-timeline m-0">
        {annotationsOn ? (
          <NotePin id={17} onOpen={onOpenNote} className="sl-pin-end" />
        ) : null}
        {intakeSuccess.timeline.map((item, index) => (
          <li key={item.title}>
            <span className="sl-timeline-num" aria-hidden>
              {index + 1}
            </span>
            <div>
              <p className="m-0">{item.title}</p>
              <p className="sl-hint m-0">
                {"body" in item
                  ? item.body
                  : `${item.bodyLead} ${callTime}.${
                      answers.contactSafe ? "" : ` ${intakeSuccess.noContact}`
                    }`}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OptionFieldset({
  legend,
  hint,
  noteId,
  annotationsOn,
  onOpenNote,
  children,
}: {
  legend: string;
  hint?: string;
  noteId?: IntakeNoteId;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="sl-fieldset">
      <legend className="sl-pin-host sl-legend">
        <span className="sl-serif sl-question">{legend}</span>
        {annotationsOn && noteId ? (
          <NotePin id={noteId} onOpen={onOpenNote} className="sl-pin-end" />
        ) : null}
      </legend>
      {hint ? <p className="sl-hint">{hint}</p> : null}
      <div className="sl-options">{children}</div>
    </fieldset>
  );
}

function ChoiceRow({
  option,
  checked,
  onChange,
  multi = false,
  name,
}: {
  option: { id: string; label: string; description: string };
  checked: boolean;
  onChange: () => void;
  multi?: boolean;
  name: string;
}) {
  return (
    <label className="sl-option">
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        value={option.id}
        checked={checked}
        onChange={onChange}
      />
      <span className="sl-control" aria-hidden>
        {multi ? (
          <svg className="sl-tick" viewBox="0 0 16 16">
            <path
              d="M3.5 8.4 6.4 11.2 12.5 4.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="sl-radio-dot" />
        )}
      </span>
      <span className="sl-option-copy">
        <span className="sl-option-label">{option.label}</span>
        {option.description ? (
          <span className="sl-option-desc">{option.description}</span>
        ) : null}
      </span>
    </label>
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
  const errorId = `${id}-error`;
  return (
    <div className={`sl-field ${error ? "is-invalid" : ""}`}>
      <label className="sl-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={errorId} className={`sl-field-error ${error ? "is-shown" : ""}`}>
        {error ? (
          <>
            <ErrorMark />
            <span>{error}</span>
          </>
        ) : (
          "\u00a0"
        )}
      </p>
    </div>
  );
}

function TeamRecordPanel({
  submitted,
  arriving,
  cleared,
  onClear,
  answers,
  annotationsOn,
  onOpenNote,
}: {
  submitted: boolean;
  arriving: boolean;
  cleared: boolean;
  onClear: () => void;
  answers: DemoAnswers;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId, button: HTMLButtonElement) => void;
}) {
  const record: BuiltTeamRecord = submitted
    ? buildIntakeTeamRecord(answers)
    : sampleTeamRecordView();
  const labels = intakeTeamRecord.labels;
  const badge =
    record.priorityKind === "urgent"
      ? "Urgent"
      : record.priorityKind === "priority"
        ? "Priority"
        : "Standard";
  const conflictStatus = cleared
    ? labels.cleared
    : record.conflictName
      ? labels.checkBeforeCalling
      : labels.notProvided;
  const clearLabel = record.conflictName ? labels.markCleared : labels.markChecked;

  return (
    <div className="sl-record-wrap">
      {submitted ? null : (
        <p className="sl-sample m-0">{intakeTeamRecord.sampleLabel}</p>
      )}
      <div className={`sl-record ${arriving ? "is-arriving" : ""}`}>
        <div className="sl-block sl-record-priority" style={{ "--i": 0 } as CSSProperties}>
          <span
            className={`sl-rec-badge ${record.priorityKind === "urgent" ? "is-urgent" : ""}`}
          >
            {badge}
          </span>
          <span>{record.priorityDetail}</span>
        </div>
        <p className="sl-block sl-pin-host m-0" style={{ "--i": 1 } as CSSProperties}>
          <span className="sl-rec-label">{labels.routeTo}</span> {record.routeTo}
          {annotationsOn ? (
            <NotePin id={19} onOpen={onOpenNote} className="sl-pin-end" />
          ) : null}
        </p>
        <div className="sl-block" style={{ "--i": 2 } as CSSProperties}>
          <p className="sl-rec-name m-0">{record.name}</p>
          <p className="m-0">
            {record.phone} · <em>{record.contactInstruction}</em>
          </p>
          <p className="m-0">{record.email}</p>
        </div>
        <div className="sl-block sl-record-conflict" style={{ "--i": 3 } as CSSProperties}>
          <p className="m-0">
            <span className="sl-rec-label">{labels.conflictCheck}</span>{" "}
            {record.conflictName ? `${record.conflictName} · ` : null}
            {conflictStatus}
          </p>
          {cleared ? null : (
            <button type="button" className="sl-clear" onClick={onClear}>
              {clearLabel}
            </button>
          )}
        </div>
        <div className="sl-block sl-record-matter" style={{ "--i": 4 } as CSSProperties}>
          <p className="m-0">
            <span className="sl-rec-label">{labels.matter}</span> {record.matter}
          </p>
          <p className="m-0">
            <span className="sl-rec-label">{labels.stage}</span> {record.stage}
          </p>
          <p className="m-0">
            <span className="sl-rec-label">{labels.flags}</span> {record.flags}
          </p>
          <p className="m-0">
            <span className="sl-rec-label">{labels.assetBand}</span> {record.assetBand}
          </p>
        </div>
        <div className="sl-block" style={{ "--i": 5 } as CSSProperties}>
          <p className="m-0">
            <span className="sl-rec-label">{labels.clientNote}</span>
          </p>
          <HeldNote
            text={record.noteText}
            revealed={cleared || !record.noteText}
            heldLabel={labels.heldBack}
            emptyLabel={labels.noNote}
            moreLabel={labels.fullNote}
          />
        </div>
        <div className="sl-block sl-record-meta" style={{ "--i": 6 } as CSSProperties}>
          <p className="m-0">
            <span className="sl-rec-label">{labels.bestTime}</span> {record.bestTime}
          </p>
          <p className="m-0">
            <span className="sl-rec-label">{labels.received}</span> {record.received}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeldNote({
  text,
  revealed,
  heldLabel,
  emptyLabel,
  moreLabel,
}: {
  text: string | null;
  revealed: boolean;
  heldLabel: string;
  emptyLabel: string;
  moreLabel: string;
}) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [long, setLong] = useState(false);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || !text) {
      setLong(false);
      return;
    }
    const line = parseFloat(getComputedStyle(el).lineHeight) || 20;
    setLong(el.scrollHeight > line * 3 + 1);
  }, [text]);

  if (!text) {
    return <p className="m-0">{emptyLabel}</p>;
  }

  return (
    <div className="sl-note-slot">
      <p className="sl-note-clamp m-0">{revealed ? text : heldLabel}</p>
      <p ref={measureRef} className="sl-note-measure" aria-hidden>
        {text}
      </p>
      {long ? (
        <p className={`sl-note-more m-0 ${revealed ? "" : "is-pending"}`}>{moreLabel}</p>
      ) : null}
    </div>
  );
}

function NotePin({
  id,
  onOpen,
  className,
}: {
  id: IntakeNoteId;
  onOpen: (id: IntakeNoteId, button: HTMLButtonElement) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      className={`sl-pin ${className}`}
      style={{ "--i": id } as CSSProperties}
      aria-label={`Annotation ${id}: ${intakeNotes[id].title}`}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen(id, event.currentTarget);
      }}
    >
      <span className="sl-pin-face">{id}</span>
    </button>
  );
}

function NoteDialog({
  noteId,
  anchor,
  isPhone,
  onClose,
}: {
  noteId: IntakeNoteId;
  anchor: NoteAnchor | null;
  isPhone: boolean;
  onClose: () => void;
}) {
  const note = intakeNotes[noteId];
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = `sl-note-title-${noteId}`;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    titleRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    if (isPhone) document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isPhone, noteId, onClose]);

  if (!mounted) return null;

  let popoverStyle: CSSProperties | undefined;
  if (!isPhone && anchor) {
    const width = Math.min(360, window.innerWidth - 24);
    let left = anchor.right + 12;
    if (left + width > window.innerWidth - 12) left = anchor.left - width - 12;
    if (left < 12) left = 12;
    let top = anchor.top;
    const maxHeight = Math.min(window.innerHeight * 0.7, 520);
    if (top + maxHeight > window.innerHeight - 12) {
      top = Math.max(12, window.innerHeight - maxHeight - 12);
    }
    popoverStyle = { top, left, width };
  }

  return createPortal(
    <div className="sl-demo">
      <button
        type="button"
        aria-label="Close annotation"
        className={isPhone ? "sl-sheet-backdrop" : "sl-popover-backdrop"}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={isPhone ? "sl-sheet" : "sl-note-popover"}
        style={popoverStyle}
      >
        <h4 id={titleId} ref={titleRef} tabIndex={-1} className="sl-note-title m-0">
          {note.id}. {note.title}
        </h4>
        {note.showRoutingTables ? (
          <p className="m-0 mt-2 text-small font-semibold text-ink-muted">
            {intakeRoutingTables.label}
          </p>
        ) : null}
        <div className="mt-3 space-y-3">
          {note.sections.map((section) => (
            <div key={section.label}>
              <p className="m-0 text-small font-semibold text-ink">{section.label}</p>
              <p className="m-0 mt-1 text-body text-ink">{section.body}</p>
            </div>
          ))}
        </div>
        {note.citation ? (
          <blockquote className="m-0 mt-4 border-l-2 border-brand pl-3 text-small text-ink-muted">
            <strong className="text-ink">{note.citation.figure}</strong>{" "}
            {note.citation.text}
            <span className="mt-1 block italic">
              Source:{" "}
              <a
                href={note.citation.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline underline-offset-2"
              >
                {note.citation.sourceLabel}
              </a>
            </span>
          </blockquote>
        ) : null}
        {note.showRoutingTables ? <RoutingTables /> : null}
        <button
          type="button"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-button text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

function RoutingTables() {
  return (
    <div className="mt-4 space-y-4 text-small text-ink">
      <div>
        <p className="m-0 font-semibold">{intakeRoutingTables.howFast.title}</p>
        <p className="m-0 mt-1 text-ink-muted">{intakeRoutingTables.howFast.note}</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {intakeRoutingTables.howFast.rows.map((row) => (
            <li key={row.priority}>
              <strong>{row.priority}:</strong> {row.signal}. {row.handling}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="m-0 font-semibold">{intakeRoutingTables.whoHandles.title}</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {intakeRoutingTables.whoHandles.rows.map((row) => (
            <li key={row.routeTo + row.signal}>
              <strong>{row.routeTo}:</strong> {row.signal}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ErrorMark() {
  return (
    <svg className="sl-error-icon" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.8" fill="currentColor" />
    </svg>
  );
}
