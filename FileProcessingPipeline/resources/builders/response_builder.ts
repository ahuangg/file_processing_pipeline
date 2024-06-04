export class ResponseBuilder {
    private statusCode: number = 200;
    private headers: { [header: string]: boolean | string } = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET, POST",
    };
    private body: any = {};
    private isBase64Encoded: boolean = false;

    setStatusCode(code: number): ResponseBuilder {
        this.statusCode = code;
        return this;
    }

    setBody(body: any): ResponseBuilder {
        this.body = body;
        return this;
    }

    addHeader(key: string, value: string | boolean): ResponseBuilder {
        this.headers[key] = value;
        return this;
    }

    build(): {
        statusCode: number;
        body: string;
        headers: { [header: string]: string | boolean };
        isBase64Encoded: boolean;
    } {
        return {
            statusCode: this.statusCode,
            headers: this.headers,
            body: JSON.stringify(this.body),
            isBase64Encoded: this.isBase64Encoded,
        };
    }
}
