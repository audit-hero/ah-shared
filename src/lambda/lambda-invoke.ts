import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda"
import { fromUtf8, toUtf8 } from "@aws-sdk/util-utf8-node"
import { E, pipe, TE } from "ti-fptsu/lib"
import { fromApiEitherTE } from "ah-shared/fetch"

const client = new LambdaClient({})

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
type LambdaStyle = "Default" | "WithBody"

export type LambdaInvokeProps = {
  arn: string
  style: LambdaStyle
  payload: {
    httpMethod?: "POST" | "GET"
    body?: object
    headers?: object
    rawPath?: string
  }
}

/**
 * Invoke a TE Lambda function and return the response
 *
 * The target lambda needs to accept input in the `body` parameter as string
 *
 * The target lambda handler needs to return toApiEither object inside a withSentry handler.
 */
export const invokeLambdaTE = <T>(payLoad: LambdaInvokeProps): TE.TaskEither<Error, T> =>
  pipe(
    new InvokeCommand({
      FunctionName: payLoad.arn,
      Payload: getPayload(payLoad.style, payLoad.payload),
    }),
    (it) => TE.tryCatch(() => client.send(it), E.toError),
    TE.map((it) => toUtf8(it.Payload as Uint8Array)),
    TE.chain(fromApiEitherTE),
    TE.map((it) => it as T),
  )

let getPayload = (style: LambdaStyle, payload: LambdaInvokeProps["payload"]) => {
  if (style === "WithBody") {
    return fromUtf8(
      JSON.stringify({
        ...payload,
        body: JSON.stringify(payload.body),
      }),
    )
  } else {
    return fromUtf8(JSON.stringify(payload))
  }
}

/**
 * Same as invokeLambdaTE but doesn't call fromApiEitherTE. This means that the function returns the object without transforming it to E.Either<Error, T>
 */
export let invokeLambda = (payLoad: LambdaInvokeProps): Promise<string | Error> =>
  pipe(
    new InvokeCommand({
      FunctionName: payLoad.arn,
      Payload: getPayload(payLoad.style, payLoad.payload),
    }),
    (it) => TE.tryCatch(() => client.send(it), E.toError),
    TE.map((it) => toUtf8(it.Payload as Uint8Array)),
    TE.toUnion,
    (it) => {
      if (it instanceof Error) {
        throw it
      }
      return it
    },
  )()
