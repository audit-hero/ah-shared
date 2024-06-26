import { LambdaSentryProps, StreamingSentryProps, StreamingRequestHandler, LambdaRequestHandler } from "./types.js";
export declare let withSentry: (props: LambdaSentryProps) => LambdaRequestHandler;
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 *
 * Also, allows local testing with lambda-stream lib
 */
export declare let withStreamingSentry: (props: StreamingSentryProps) => StreamingRequestHandler;
