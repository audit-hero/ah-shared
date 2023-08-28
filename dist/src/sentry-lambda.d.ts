export declare let setProjectName: (name: string) => void;
export type SentryLevel = "error" | "warning" | "info" | "debug" | "fatal";
export type SentryInterval = "daily" | "hourly";
export declare let sentryMessage: (message: string, level?: SentryLevel) => Promise<void>;
export declare let sentryError: (payload: any, message?: any, sentryInterval?: SentryInterval | undefined) => Promise<void>;
export declare let withSentry: (block: () => Promise<any>) => Promise<any>;