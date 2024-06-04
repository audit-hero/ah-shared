export const isCorsRequest = (event) => {
    if (event?.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            body: JSON.stringify(""),
            headers: getCorsHeaders(event),
        };
    }
};
export let addCorsHeaders = (event) => (response) => {
    if (typeof response === "string") {
        return {
            body: response,
            statusCode: 200,
            headers: getCorsHeaders({}),
        };
    }
    else if (typeof response === "object") {
        return {
            ...response,
            headers: {
                ...(response.headers || {}),
                ...getCorsHeaders(event),
            },
        };
    }
    return response;
};
export let getCorsHeaders = (event) => {
    let headers = event.headers || {};
    let origin = headers["Origin"] || headers["origin"] || "*";
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Credentials": true,
    };
};
//# sourceMappingURL=corsRequest.js.map