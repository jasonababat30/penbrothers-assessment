export type ApiResponse<T> = {
    data: T,
    message: string,
    count?: number
}
