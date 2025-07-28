// Chuẩn hóa kiểu ApiResponse cho toàn bộ frontend

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiMeta {
  timestamp: string;
  version: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Type cho error handling
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Helper function để extract error message
export const extractErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  const axiosError = error as AxiosErrorResponse;
  return axiosError.response?.data?.message || fallbackMessage;
};
