import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node";
import { E, pipe, TE } from "ti-fptsu/lib";
import { fromApiEitherTE } from "ah-shared/fetch";
const client = new LambdaClient({});
/**
 * Invoke a TE Lambda function and return the response
 *
 * The target lambda needs to accept input in the `body` parameter as string
 *
 * The target lambda handler needs to return toApiEither object inside a withSentry handler.
 */
export const invokeLambdaTE = (payLoad) => pipe(new InvokeCommand({
    FunctionName: payLoad.arn,
    Payload: getPayload(payLoad.style, payLoad.payload),
}), (it) => TE.tryCatch(() => client.send(it), E.toError), TE.map((it) => toUtf8(it.Payload)), TE.chain(fromApiEitherTE), TE.map((it) => it));
let getPayload = (style, payload) => {
    if (style === "WithBody") {
        return fromUtf8(JSON.stringify({
            ...payload,
            body: JSON.stringify(payload.body),
        }));
    }
    else {
        return fromUtf8(JSON.stringify(payload));
    }
};
/**
 * Same as invokeLambdaTE but doesn't call fromApiEitherTE. This means that the function returns the object without transforming it to E.Either<Error, T>
 */
export let invokeLambda = (payLoad) => pipe(new InvokeCommand({
    FunctionName: payLoad.arn,
    Payload: getPayload(payLoad.style, payLoad.payload),
}), (it) => TE.tryCatch(() => client.send(it), E.toError), TE.map((it) => toUtf8(it.Payload)), TE.toUnion, (it) => {
    if (it instanceof Error) {
        throw it;
    }
    return it;
})();
//# sourceMappingURL=lambda-invoke.js.map