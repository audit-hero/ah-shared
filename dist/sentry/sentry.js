// requires
// process.env.SENTRY_DSN and process.env.SENTRY_URL
let projectName = "sentry-project";
export let setSentryProjectName = (name) => {
    projectName = name;
};
export let getSentryProjectName = () => {
    return projectName;
};
let lastSendTime = 0;
let interval = 15000;
export let sentryMessage = async (message, level = "info") => {
    let event = {
        dsn: process.env.SENTRY_DSN,
        event: {
            message: message,
            level: level,
            tags: {
                module: projectName,
            },
        },
    };
    await sendRequest(event);
};
export let sentryError = async (message, payload, sentryInterval) => {
    if (sentryInterval == "daily" && new Date().getHours() != 0) {
        console.log(message, payload);
        console.log("skipping sentry error, only sending daily");
        return;
    }
    let event = {
        dsn: process.env.SENTRY_DSN,
        event: {
            message: message,
            level: "error",
            tags: {
                module: projectName,
            },
            ...(payload && {
                errors: [payload],
            }),
        },
    };
    await sendRequest(event);
};
let sendRequest = async (event) => {
    // map the errors to name and stack only
    if (event.event.errors) {
        event.event.errors = event.event.errors.map((it) => {
            return {
                type: it.name,
                path: it.stack,
                message: it.message,
            };
        });
    }
    let errorStr = "";
    if (event.event.errors && event.event.errors.length > 0) {
        if (event.event.errors[0].path) {
            errorStr = `${event.event.errors[0].path}`;
        }
    }
    else {
        errorStr = `${JSON.stringify(event.event, null, 2)}`;
    }
    console.error(`sending message to sentry:\n${event.event.message}\n${errorStr}`);
    if (!process.env.SENTRY_DSN) {
        console.log("no sentry dsn, skipping");
        return;
    }
    let json = JSON.stringify(event);
    if (new Date().getTime() - lastSendTime < interval) {
        console.log(`skipping sending sentry message, last sent ${new Date().getTime() - lastSendTime}ms ago`);
        return;
    }
    lastSendTime = new Date().getTime();
    await fetch(process.env.SENTRY_URL ?? "", {
        method: "POST",
        body: json,
    })
        .then((response) => {
        if (!response.ok) {
            console.log(`failed to send message to sentry ${response.status} ${response.statusText} ${JSON.stringify(response.body)}}`);
        }
    })
        .catch((e) => {
        console.log(`failed to send message to sentry ${e} ${e.stack}`);
    });
};
export * from "./sentry-lambda.js";
export * from "./sentry-lambda-either.js";
export * from "./corsRequest.js";
export * from "./types.js";
export * from "../lambda-stream/ResponseStream.js";
//# sourceMappingURL=sentry.js.map