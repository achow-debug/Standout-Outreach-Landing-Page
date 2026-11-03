"use client";

import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { Lock, MessageCircle, Shield } from "lucide-react";
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
  intakeNoteAudienceLabels,
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
  intakeWelcome,
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
  "welcome",
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

function firstNameFrom(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "there";
}

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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
  const [tab, setTab] = useState<IntakeDemoTab>("client");
  const [answers, setAnswers] = useState<DemoAnswers>(initialAnswers);
  const [annotationsOn, setAnnotationsOn] = useState(false);
  const [openNote, setOpenNote] = useState<IntakeNoteId | null>(null);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [footerHint, setFooterHint] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const baseId = useId();

  const flowInput = {
    route: answers.route,
    help: answers.help,
  };

  const goTo = useCallback((next: IntakeScreenId) => {
    setOpenNote(null);
    setFooterHint("");
    setContactErrors({});
    setScreen(next);
  }, []);

  const resetToUrgency = useCallback(() => {
    setAnswers((prev) => ({
      ...initialAnswers,
      help: prev.help,
    }));
    setSubmitted(false);
    setTab("client");
    goTo("urgency");
  }, [goTo]);

  const toggleHelp = (id: HelpOptionId) => {
    setAnswers((prev) => {
      const has = prev.help.includes(id);
      return {
        ...prev,
        help: has ? prev.help.filter((item) => item !== id) : [...prev.help, id],
      };
    });
    setFooterHint("");
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
    setFooterHint("");
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
    setFooterHint("");
  };

  const canContinue = (): boolean => {
    switch (screen) {
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
      case "contact":
      case "beforeCall":
        return true;
      default:
        return false;
    }
  };

  const validateContact = (): boolean => {
    const next: ContactErrors = {};
    if (!answers.name.trim()) next.name = intakeContact.fields.name.error;
    if (digitCount(answers.phone) < 10) next.phone = intakeContact.fields.phone.error;
    if (!isValidEmail(answers.email)) next.email = intakeContact.fields.email.error;
    setContactErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = () => {
    if (screen === "welcome") {
      goTo("help");
      return;
    }
    if (screen === "contact") {
      if (!validateContact()) return;
      goTo(nextIntakeScreen(screen, flowInput));
      return;
    }
    if (screen === "beforeCall") {
      setSubmitted(true);
      setTab("team");
      goTo("success");
      return;
    }
    if (!canContinue()) {
      setFooterHint(intakeDemoChrome.chooseHint);
      return;
    }
    const route: IntakeRoute | null =
      screen === "urgency"
        ? isUrgentSelection(answers.urgency)
          ? "urgent"
          : "nonUrgent"
        : answers.route;
    if (screen === "urgency" && route) {
      setAnswers((prev) => ({ ...prev, route }));
    }
    goTo(
      nextIntakeScreen(screen, {
        route,
        help: answers.help,
      }),
    );
  };

  const onBack = () => {
    goTo(prevIntakeScreen(screen, flowInput));
  };

  const stepLabel =
    screen in intakeStepNumber
      ? `${intakeStepNumber[screen as keyof typeof intakeStepNumber]} / ${intakeTotalSteps}`
      : null;

  return (
    <div className="intake-demo mx-auto flex w-full max-w-[520px] flex-col gap-4 lg:max-w-[640px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="m-0 text-h2 text-ink max-w-[18ch]">
            {intakeDemoChrome.title}
          </h3>
          <p className="m-0 mt-2 text-small text-ink-muted max-w-[42ch]">
            {intakeDemoChrome.leadLine}
          </p>
        </div>
        <label className="inline-flex shrink-0 items-center gap-2 text-small font-semibold text-ink">
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
        className="flex gap-1 border-b border-line"
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
              className={`min-h-11 px-3 text-small font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                selected
                  ? "border-b-2 border-ink text-ink"
                  : "border-b-2 border-transparent text-ink-muted hover:text-ink"
              }`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="intake-tab-panels">
        <div
          role="tabpanel"
          id={`${baseId}-panel-client`}
          aria-labelledby={`${baseId}-tab-client`}
          className={`intake-tab-panel ${tab === "client" ? "is-active" : ""}`}
          hidden={tab !== "client"}
        >
          <div className="intake-card relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_8px_24px_rgba(17,23,41,0.06)]">
            <CardHeader
              annotationsOn={annotationsOn}
              onExit={() => {
                setOpenNote(null);
                setScreen("exit");
              }}
              onOpenNote={setOpenNote}
            />

            <div className="intake-steps relative">
              {STEP_SCREENS.map((id) => (
                <div
                  key={id}
                  className={`intake-step flex flex-col ${
                    screen === id && tab === "client" ? "is-active" : ""
                  }`}
                  aria-hidden={screen !== id}
                >
                  <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-3 sm:px-5">
                    {stepLabel && id !== "welcome" && id !== "success" ? (
                      <p className="m-0 mb-2 text-[0.75rem] font-semibold tracking-wide text-ink-muted uppercase">
                        {screen === id ? stepLabel : "\u00a0"}
                      </p>
                    ) : null}
                    <ScreenBody
                      id={id}
                      active={screen === id}
                      answers={answers}
                      contactErrors={contactErrors}
                      annotationsOn={annotationsOn}
                      openNote={openNote}
                      onOpenNote={setOpenNote}
                      setAnswers={setAnswers}
                      toggleHelp={toggleHelp}
                      toggleUrgency={toggleUrgency}
                      toggleSignal={toggleSignal}
                      setFooterHint={setFooterHint}
                    />
                  </div>
                </div>
              ))}

              {screen === "exit" ? (
                <div className="intake-step is-active absolute inset-0 z-20 flex flex-col bg-surface px-5 py-6">
                  <h4 className="m-0 text-h3 text-ink">{intakeExit.heading}</h4>
                  <p className="m-0 mt-3 text-body text-ink-muted">
                    {intakeExit.body}
                  </p>
                  <button
                    type="button"
                    className="mt-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-button text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    onClick={() => goTo(answers.help.length ? "help" : "welcome")}
                  >
                    {intakeExit.backLabel}
                  </button>
                </div>
              ) : null}
            </div>

            <CardFooter
              screen={screen}
              route={answers.route}
              canContinue={canContinue()}
              footerHint={footerHint}
              onBack={onBack}
              onContinue={onContinue}
              onTryOther={resetToUrgency}
            />

            {annotationsOn && openNote !== null ? (
              <NoteOverlay
                noteId={openNote}
                reduceMotion={reduceMotion}
                onClose={() => setOpenNote(null)}
              />
            ) : null}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel-team`}
          aria-labelledby={`${baseId}-tab-team`}
          className={`intake-tab-panel ${tab === "team" ? "is-active" : ""}`}
          hidden={tab !== "team"}
        >
          <div className="intake-card relative overflow-hidden rounded-2xl border border-line bg-surface px-5 py-5 shadow-[0_8px_24px_rgba(17,23,41,0.06)]">
            <TeamRecordPanel
              submitted={submitted}
              answers={answers}
              annotationsOn={annotationsOn}
              onOpenNote={setOpenNote}
            />
            {annotationsOn && openNote === 20 ? (
              <NoteOverlay
                noteId={20}
                reduceMotion={reduceMotion}
                onClose={() => setOpenNote(null)}
              />
            ) : null}
          </div>
        </div>
      </div>

      <p className="m-0 text-center text-small text-ink-muted">
        {intakeDemoChrome.caption}
      </p>
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
  onOpenNote: (id: IntakeNoteId) => void;
}) {
  return (
    <div className="relative flex items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <p className="m-0 text-[1.0625rem] font-bold text-ink">
          {intakeFirmChrome.firmName}
        </p>
        <p className="relative m-0 mt-0.5 text-[0.8125rem] text-ink-muted">
          {intakeFirmChrome.accreditations}
          {annotationsOn ? (
            <NotePin id={1} onOpen={onOpenNote} className="-top-1 -right-7" />
          ) : null}
        </p>
      </div>
      <div className="relative shrink-0">
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-lg px-2 text-small font-semibold text-ink-muted hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onExit}
        >
          {intakeFirmChrome.exitLabel}
        </button>
        {annotationsOn ? (
          <NotePin id={2} onOpen={onOpenNote} className="-top-1 -right-1" />
        ) : null}
      </div>
    </div>
  );
}

function CardFooter({
  screen,
  route,
  canContinue,
  footerHint,
  onBack,
  onContinue,
  onTryOther,
}: {
  screen: IntakeScreenId;
  route: IntakeRoute | null;
  canContinue: boolean;
  footerHint: string;
  onBack: () => void;
  onContinue: () => void;
  onTryOther: () => void;
}) {
  if (screen === "exit") return null;

  if (screen === "welcome") {
    return (
      <div className="border-t border-line px-4 py-3 sm:px-5">
        <div className="flex min-h-5 items-center justify-center">
          <span className="text-[0.75rem] text-ink-muted">&nbsp;</span>
        </div>
        <button
          type="button"
          className="inline-flex w-full min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-button text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onContinue}
        >
          {intakeWelcome.beginLabel}
        </button>
      </div>
    );
  }

  if (screen === "success") {
    return (
      <div className="border-t border-line px-4 py-3 sm:px-5">
        <button
          type="button"
          className="inline-flex w-full min-h-11 items-center justify-center rounded-xl border border-line bg-transparent px-5 text-button text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onTryOther}
        >
          {intakeSuccess.tryOtherRoute}
        </button>
      </div>
    );
  }

  const isSubmit = screen === "beforeCall";
  const continueLabel = isSubmit
    ? route === "urgent"
      ? intakeBeforeCall.submitUrgent
      : intakeBeforeCall.submitNonUrgent
    : intakeDemoChrome.continueLabel;

  return (
    <div className="border-t border-line px-4 py-3 sm:px-5">
      <div className="mb-2 flex min-h-5 items-center">
        <span className="text-[0.75rem] text-ink-muted">{footerHint || "\u00a0"}</span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-line bg-transparent px-4 text-button text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onBack}
        >
          {intakeDemoChrome.backLabel}
        </button>
        <button
          type="button"
          className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-brand px-4 text-button text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            canContinue || screen === "contact" || screen === "beforeCall"
              ? "hover:bg-brand-hover"
              : "opacity-45"
          }`}
          onClick={onContinue}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}

function ScreenBody({
  id,
  active,
  answers,
  contactErrors,
  annotationsOn,
  onOpenNote,
  setAnswers,
  toggleHelp,
  toggleUrgency,
  toggleSignal,
  setFooterHint,
}: {
  id: IntakeScreenId;
  active: boolean;
  answers: DemoAnswers;
  contactErrors: ContactErrors;
  annotationsOn: boolean;
  openNote: IntakeNoteId | null;
  onOpenNote: (id: IntakeNoteId) => void;
  setAnswers: React.Dispatch<React.SetStateAction<DemoAnswers>>;
  toggleHelp: (id: HelpOptionId) => void;
  toggleUrgency: (id: UrgencyOptionId) => void;
  toggleSignal: (id: SignalOptionId) => void;
  setFooterHint: (hint: string) => void;
}) {
  if (!active && id !== "help") {
    /* Still render help (tallest) and all steps for height budget via parent grid. */
  }

  if (id === "welcome") {
    return (
      <WelcomeScreen annotationsOn={annotationsOn} onOpenNote={onOpenNote} />
    );
  }
  if (id === "help") {
    return (
      <OptionFieldset
        legend={intakeHelp.heading}
        hint={intakeHelp.hint}
        noteId={6}
        annotationsOn={annotationsOn}
        onOpenNote={onOpenNote}
        multi
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
      <div className="flex flex-col gap-3">
        <OptionFieldset
          legend={intakeUrgency.heading}
          hint={intakeUrgency.hint}
          noteId={7}
          annotationsOn={annotationsOn}
          onOpenNote={onOpenNote}
          multi
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
        <div className="space-y-1 text-[0.8125rem] text-ink-muted">
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
            onChange={() => {
              setAnswers((prev) => ({ ...prev, stage: option.id }));
              setFooterHint("");
            }}
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
        multi
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
        <div className="relative">
          <ChoiceRow
            multi
            name="signals"
            option={intakeSignals.noneOption}
            checked={answers.signals.includes("none")}
            onChange={() => toggleSignal("none")}
          />
          {annotationsOn ? (
            <NotePin id={10} onOpen={onOpenNote} className="top-2 right-2" />
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
            onChange={() => {
              setAnswers((prev) => ({ ...prev, value: option.id }));
              setFooterHint("");
            }}
          />
        ))}
      </OptionFieldset>
    );
  }
  if (id === "callback") {
    const copy =
      answers.route === "urgent" ? intakeCallback.urgent : intakeCallback.nonUrgent;
    return (
      <div className="flex flex-col gap-3">
        {"badge" in copy && copy.badge ? (
          <p className="m-0 text-[0.75rem] font-semibold tracking-wide text-brand uppercase">
            {copy.badge}
          </p>
        ) : null}
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
            onChange={() => {
              setAnswers((prev) => ({ ...prev, callback: "asap" }));
              setFooterHint("");
            }}
          />
          <p className="relative m-0 pt-1 text-[0.8125rem] font-semibold text-ink-muted">
            {intakeCallback.orChooseLabel}
            {annotationsOn ? (
              <NotePin id={13} onOpen={onOpenNote} className="-top-1 right-0" />
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
              onChange={() => {
                setAnswers((prev) => ({ ...prev, callback: window.id }));
                setFooterHint("");
              }}
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

function WelcomeScreen({
  annotationsOn,
  onOpenNote,
}: {
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId) => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <p className="m-0 text-[0.75rem] font-semibold tracking-[0.08em] text-ink-muted">
        {intakeWelcome.eyebrow}
      </p>
      <h4 className="relative m-0 mt-2 text-h2 text-ink max-w-[16ch]">
        {intakeWelcome.heading}
        {annotationsOn ? (
          <NotePin id={3} onOpen={onOpenNote} className="-top-1 -right-7" />
        ) : null}
      </h4>
      <ul className="relative m-0 mt-5 list-none space-y-3 p-0">
        {annotationsOn ? (
          <NotePin id={4} onOpen={onOpenNote} className="top-0 -right-1" />
        ) : null}
        {intakeWelcome.reassurances.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 text-body text-ink">
            {item.icon === "shield-lock" ? (
              <Shield className="mt-0.5 size-5 shrink-0 text-ink-muted" aria-hidden />
            ) : (
              <MessageCircle
                className="mt-0.5 size-5 shrink-0 text-ink-muted"
                aria-hidden
              />
            )}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      <p className="relative m-0 mt-auto pt-6 text-center text-small text-ink-muted">
        {intakeWelcome.effortHint}
        {annotationsOn ? (
          <NotePin id={5} onOpen={onOpenNote} className="-top-1 right-8" />
        ) : null}
      </p>
      <p className="relative m-0 mt-4 text-center text-[0.75rem] leading-snug text-ink-muted">
        {intakeFirmChrome.trustFooter}
        {annotationsOn ? (
          <NotePin id={19} onOpen={onOpenNote} className="-top-1 right-0" />
        ) : null}
      </p>
    </div>
  );
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
  onOpenNote: (id: IntakeNoteId) => void;
  setAnswers: React.Dispatch<React.SetStateAction<DemoAnswers>>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="m-0 text-h3 text-ink">{intakeContact.heading}</h4>
      <p className="m-0 text-small text-ink-muted">{intakeContact.subtext}</p>
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
      <label className="relative flex min-h-11 items-center gap-3 text-small text-ink">
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-[4px] border ${
            answers.contactSafe
              ? "border-[var(--color-intake-gold)] bg-[var(--color-intake-gold)] text-white"
              : "border-line bg-white"
          }`}
          aria-hidden
        >
          {answers.contactSafe ? "✓" : null}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={answers.contactSafe}
          onChange={(event) =>
            setAnswers((prev) => ({
              ...prev,
              contactSafe: event.target.checked,
            }))
          }
        />
        <span>{intakeContact.discretionLabel}</span>
        {annotationsOn ? (
          <NotePin id={14} onOpen={onOpenNote} className="-top-1 -right-1" />
        ) : null}
      </label>
      <p className="relative m-0 flex items-center gap-2 text-[0.8125rem] text-ink-muted">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        {intakeContact.lockLine}
        {annotationsOn ? (
          <NotePin id={15} onOpen={onOpenNote} className="-top-2 right-0" />
        ) : null}
      </p>
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
  onOpenNote: (id: IntakeNoteId) => void;
  setAnswers: React.Dispatch<React.SetStateAction<DemoAnswers>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <label className="flex flex-col gap-1">
          <span className="text-small font-semibold text-ink">
            {intakeBeforeCall.otherPerson.label}{" "}
            <span className="font-normal text-ink-muted">
              {intakeBeforeCall.otherPerson.hint}
            </span>
          </span>
          <input
            type="text"
            className="min-h-11 rounded-xl border border-line bg-white px-3 text-body text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            value={answers.otherPerson}
            onChange={(event) =>
              setAnswers((prev) => ({
                ...prev,
                otherPerson: event.target.value,
              }))
            }
          />
          <span className="text-[0.8125rem] text-ink-muted">
            {intakeBeforeCall.otherPerson.helper}
          </span>
        </label>
        {annotationsOn ? (
          <NotePin id={16} onOpen={onOpenNote} className="top-0 right-0" />
        ) : null}
      </div>
      <div className="relative">
        <label className="flex flex-col gap-1">
          <span className="text-small font-semibold text-ink">
            {intakeBeforeCall.optionalNote.label}{" "}
            <span className="font-normal text-ink-muted">
              {intakeBeforeCall.optionalNote.hint}
            </span>
          </span>
          <textarea
            rows={3}
            className="rounded-xl border border-line bg-white px-3 py-2 text-body text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            value={answers.note}
            onChange={(event) =>
              setAnswers((prev) => ({ ...prev, note: event.target.value }))
            }
          />
        </label>
        {annotationsOn ? (
          <NotePin id={17} onOpen={onOpenNote} className="top-0 right-0" />
        ) : null}
      </div>
      <p className="m-0 flex items-center gap-2 text-[0.8125rem] text-ink-muted">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        {intakeBeforeCall.lockLine}
      </p>
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
  onOpenNote: (id: IntakeNoteId) => void;
}) {
  const route = answers.route ?? "nonUrgent";
  const callTime = answers.callback
    ? formatCallTimeWording(answers.callback, route)
    : intakeSuccess.callTimeWording.asapNonUrgent;

  return (
    <div className="flex flex-1 flex-col">
      {route === "urgent" ? (
        <p className="m-0 text-[0.75rem] font-semibold tracking-wide text-brand uppercase">
          {intakeSuccess.urgentBadge}
        </p>
      ) : null}
      <p className="m-0 mt-2 text-[0.75rem] font-semibold tracking-[0.08em] text-ink-muted">
        {intakeSuccess.eyebrow}
      </p>
      <h4 className="m-0 mt-1 text-h2 text-ink">
        {intakeSuccess.heading(firstNameFrom(answers.name))}
      </h4>
      <p className="m-0 mt-1 text-body text-ink-muted">{intakeSuccess.subtext}</p>
      <ol className="relative m-0 mt-5 list-none space-y-4 p-0">
        {annotationsOn ? (
          <NotePin id={18} onOpen={onOpenNote} className="top-0 right-0" />
        ) : null}
        {intakeSuccess.timeline.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-[0.75rem] font-semibold text-ink"
            >
              {index + 1}
            </span>
            <div>
              <p className="m-0 text-small font-semibold text-ink">{item.title}</p>
              <p className="m-0 mt-1 text-small text-ink-muted">
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
      <p className="relative m-0 mt-auto pt-6 text-center text-[0.75rem] leading-snug text-ink-muted">
        {intakeFirmChrome.trustFooter}
        {annotationsOn ? (
          <NotePin id={19} onOpen={onOpenNote} className="-top-1 right-0" />
        ) : null}
      </p>
    </div>
  );
}

function OptionFieldset({
  legend,
  hint,
  noteId,
  annotationsOn,
  onOpenNote,
  multi = false,
  children,
}: {
  legend: string;
  hint?: string;
  noteId?: IntakeNoteId;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId) => void;
  multi?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="relative mb-1 float-left w-full text-h3 text-ink">
        {legend}
        {annotationsOn && noteId ? (
          <NotePin id={noteId} onOpen={onOpenNote} className="-top-1 -right-1" />
        ) : null}
      </legend>
      <div className="clear-both" />
      {hint ? <p className="m-0 mb-3 text-small text-ink-muted">{hint}</p> : null}
      <div className="flex flex-col gap-2" role={multi ? "group" : undefined}>
        {children}
      </div>
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
    <label
      className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color-mix(in_oklab,var(--color-ink)_35%,transparent)] ${
        checked
          ? "border-[var(--color-intake-gold)] bg-[color-mix(in_oklab,var(--color-intake-gold)_10%,white)]"
          : "border-line bg-white hover:bg-ink/[0.02]"
      }`}
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border text-[0.7rem] font-bold text-white ${
          multi ? "rounded-[4px]" : "rounded-full"
        } ${
          checked
            ? "border-[var(--color-intake-gold)] bg-[var(--color-intake-gold)]"
            : "border-line bg-white text-transparent"
        }`}
        aria-hidden
      >
        {checked ? "✓" : ""}
      </span>
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="min-w-0">
        <span className="block text-small font-semibold text-ink">
          {option.label}
        </span>
        {option.description ? (
          <span className="mt-0.5 block text-[0.8125rem] text-ink-muted">
            {option.description}
          </span>
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
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-small font-semibold text-ink">{label}</span>
      <input
        type="text"
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="min-h-11 rounded-xl border border-line bg-white px-3 text-body text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
      <span className="min-h-4 text-[0.75rem] text-red-700">{error || "\u00a0"}</span>
    </label>
  );
}

function TeamRecordPanel({
  submitted,
  answers,
  annotationsOn,
  onOpenNote,
}: {
  submitted: boolean;
  answers: DemoAnswers;
  annotationsOn: boolean;
  onOpenNote: (id: IntakeNoteId) => void;
}) {
  const record: BuiltTeamRecord = submitted
    ? buildIntakeTeamRecord(answers)
    : sampleTeamRecordView();
  const labels = intakeTeamRecord.labels;

  return (
    <div className="intake-team-record text-left">
      <p className="m-0 text-[0.75rem] font-semibold tracking-wide text-ink-muted uppercase">
        {submitted ? intakeTeamRecord.yourLabel : intakeTeamRecord.sampleLabel}
      </p>
      <p className="m-0 mt-3 text-[0.8125rem] font-bold tracking-wide text-ink uppercase">
        {record.priorityLine}
      </p>
      <p className="relative m-0 mt-3 text-small text-ink">
        <span className="font-semibold">{labels.routeTo}</span> {record.routeTo}
        {annotationsOn ? (
          <NotePin id={20} onOpen={onOpenNote} className="-top-1 -right-1" />
        ) : null}
      </p>
      <div className="mt-4 border-t border-line pt-3">
        <p className="m-0 text-small font-bold text-ink">{record.name}</p>
        <p className="m-0 mt-1 text-small text-ink">
          {record.phone} · <em>{record.contactInstruction}</em>
        </p>
        <p className="m-0 mt-0.5 text-small text-ink">{record.email}</p>
      </div>
      <p className="m-0 mt-3 text-small text-ink">
        <span className="font-semibold">{labels.conflictCheck}</span>{" "}
        {record.conflictLine}
      </p>
      <div className="mt-3 space-y-1 text-small text-ink">
        <p className="m-0">
          <span className="font-semibold">{labels.matter}</span> {record.matter}
        </p>
        <p className="m-0">
          <span className="font-semibold">{labels.stage}</span> {record.stage}
        </p>
        <p className="m-0">
          <span className="font-semibold">{labels.flags}</span> {record.flags}
        </p>
        <p className="m-0">
          <span className="font-semibold">{labels.assetBand}</span>{" "}
          {record.assetBand}
        </p>
      </div>
      <p className="m-0 mt-3 text-small text-ink">
        <span className="font-semibold">{labels.clientNote}</span>{" "}
        {record.note.startsWith("“") || record.note === labels.noNote
          ? record.note
          : `“${record.note}”`}
      </p>
      <div className="mt-3 space-y-1 border-t border-line pt-3 text-small text-ink">
        <p className="m-0">
          <span className="font-semibold">{labels.bestTime}</span> {record.bestTime}
        </p>
        <p className="m-0">
          <span className="font-semibold">{labels.received}</span> {record.received}
        </p>
      </div>
    </div>
  );
}

function NotePin({
  id,
  onOpen,
  className = "",
}: {
  id: IntakeNoteId;
  onOpen: (id: IntakeNoteId) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={`Annotation ${id}`}
      className={`intake-pin absolute z-10 flex size-6 items-center justify-center rounded-full bg-brand text-[0.7rem] font-bold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen(id);
      }}
    >
      {id}
    </button>
  );
}

function NoteOverlay({
  noteId,
  onClose,
  reduceMotion,
}: {
  noteId: IntakeNoteId;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const note = intakeNotes[noteId];
  return (
    <div className="absolute inset-0 z-30 flex items-end sm:items-center sm:justify-center">
      <button
        type="button"
        aria-label="Close annotation"
        className={`absolute inset-0 bg-ink/35 ${reduceMotion ? "" : "intake-backdrop-enter"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`intake-note-${noteId}`}
        className={`relative z-10 m-3 max-h-[85%] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-5 shadow-lg ${
          reduceMotion ? "" : "intake-overlay-enter"
        }`}
      >
        <h4 id={`intake-note-${noteId}`} className="m-0 text-h3 text-ink">
          {note.title}
        </h4>
        {note.showRoutingTables ? (
          <p className="m-0 mt-2 text-small font-semibold text-ink-muted">
            {intakeRoutingTables.label}
          </p>
        ) : null}
        <p className="m-0 mt-3 text-[0.75rem] font-semibold tracking-wide text-ink-muted uppercase">
          {intakeNoteAudienceLabels.forClient}
        </p>
        <p className="m-0 mt-1 text-body text-ink">{note.forClient}</p>
        <p className="m-0 mt-3 text-[0.75rem] font-semibold tracking-wide text-ink-muted uppercase">
          {intakeNoteAudienceLabels.forFirm}
        </p>
        <p className="m-0 mt-1 text-body text-ink">{note.forFirm}</p>
        {note.citation ? (
          <blockquote className="m-0 mt-4 border-l-2 border-brand pl-3 text-small text-ink-muted">
            <strong className="text-ink">{note.citation.figure}</strong>{" "}
            {note.citation.text}{" "}
            <a
              href={note.citation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-2"
            >
              {note.citation.sourceLabel}
            </a>
          </blockquote>
        ) : null}
        {note.showRoutingTables ? (
          <div className="mt-4 space-y-4 text-small text-ink">
            <div>
              <p className="m-0 font-semibold">{intakeRoutingTables.howFast.title}</p>
              <p className="m-0 mt-1 text-ink-muted">
                {intakeRoutingTables.howFast.note}
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {intakeRoutingTables.howFast.rows.map((row) => (
                  <li key={row.priority}>
                    <strong>{row.priority}:</strong> {row.signal}. {row.handling}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="m-0 font-semibold">
                {intakeRoutingTables.whoHandles.title}
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {intakeRoutingTables.whoHandles.rows.map((row) => (
                  <li key={row.routeTo}>
                    <strong>{row.routeTo}:</strong> {row.signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-button text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
