export declare let withSentryE: (props: {
    name: string;
    event: any;
    block: (event: any) => Promise<any>;
}) => Promise<any>;
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 */
export declare let withStreamingSentryE: (props: {
    name: string;
    event: any;
    stream: any;
    block: () => Promise<any>;
}) => Promise<any>;
