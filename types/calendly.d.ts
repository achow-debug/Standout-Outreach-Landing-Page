export type CalendlyEventName =
  | "calendly.event_type_viewed"
  | "calendly.date_and_time_selected"
  | "calendly.event_scheduled"
  | "calendly.page_height"
  | "calendly.profile_page_viewed"
  | "calendly.popup_closed"
  | "calendly.popup_widget_ready";

export type CalendlyMessagePayload = {
  event: CalendlyEventName | (string & {});
  payload?: unknown;
};

export type CalendlyPrefillOptions = {
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  customAnswers?: Record<string, string>;
};

export type CalendlyUtmOptions = {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type CalendlyInlineWidgetOptions = {
  url: string;
  parentElement: HTMLElement;
  prefill?: CalendlyPrefillOptions;
  utm?: CalendlyUtmOptions;
};

export type CalendlyPopupWidgetOptions = {
  url: string;
  prefill?: CalendlyPrefillOptions;
  utm?: CalendlyUtmOptions;
};

export type CalendlyWidgetApi = {
  initInlineWidget: (options: CalendlyInlineWidgetOptions) => void;
  initPopupWidget: (options: CalendlyPopupWidgetOptions) => void;
  closePopupWidget?: () => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyWidgetApi;
  }
}

export {};
