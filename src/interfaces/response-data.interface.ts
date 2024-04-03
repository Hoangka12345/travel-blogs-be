export interface I_Response<T> {
    statusCode: number,
    message?: string,
    data?: T | T[]
}