export interface GlobalResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
    errors?: string[];
    timestamp?: string;
    path?: string;
}