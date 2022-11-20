export class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorizedUser() {
        return new ApiError(401, "User is not authorized");
    }

    static badRequest(message, errors) {
        return new ApiError(400, message, errors);
    }

    static htmlChange() {
        return new ApiError(400, "Don't change html markup, sir.");
    }

    static FileSizeIsTooBig(filename) {
        if(Array.isArray(filename)) {
            if(filename.length > 1) {
                const fileNames = filename.join(", ");
                const message = `Your files: ${fileNames} ARE TOO BIG`
                return new ApiError(413, message);
            }
            const message = `Your file: ${filename[0]} IS TOO BIG`
            return new ApiError(413, message);
        }
        const message = `Your file: ${filename} IS TOO BIG`
        return new ApiError(413, message);
    }

    static unknown() {
        return new ApiError(500, "Unknown server error");
    }
}