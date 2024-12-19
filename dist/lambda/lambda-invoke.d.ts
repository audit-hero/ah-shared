import { TE } from "ti-fptsu/lib";
/**
 * Default:
 *  - this is a private lambda that we invoke straight with the payload.body object.
 *  - Response is an FpTsEither object as well, we don't JSON.parse
 *
 * WithBody:
 *  - this is a public lambda that expects a { body: string }.
 *  - It also returns { body: string }.
 *  - body is a stringified JSON
 */
type LambdaStyle = "Default" | "WithBody";
export type LambdaInvokeProps = {
    arn: string;
    style: LambdaStyle;
    payload: {
        httpMethod?: "POST" | "GET";
        body?: object;
        headers?: object;
        rawPath?: string;
    };
};
/**
 * Invoke a TE Lambda function and return the response
 *
 * The target lambda needs to accept input in the `body` parameter as string
 *
 * The target lambda handler needs to return toApiEither object inside a withSentry handler.
 */
export declare const invokeLambdaTE: <T>(payLoad: LambdaInvokeProps) => TE.TaskEither<Error, T>;
/**
 * Same as invokeLambdaTE but doesn't call fromApiEitherTE. This means that the function returns the object without transforming it to E.Either<Error, T>
 */
export declare let invokeLambda: (payLoad: LambdaInvokeProps) => Promise<string | Error>;
export {};
