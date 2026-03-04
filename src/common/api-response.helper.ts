export interface SuccessResult {
  success: true;
  message?: string;
  data: unknown;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ErrorDetail {
  field?: string;
  message: string;
}

export function successResponse(
  data: unknown,
  message?: string,
): SuccessResult {
  const res: SuccessResult = { success: true, data };
  if (message) res.message = message;
  return res;
}

export function paginatedResponse(data: unknown[], pagination: PaginationInfo) {
  return {
    success: true as const,
    data,
    pagination,
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: ErrorDetail[],
) {
  return {
    success: false as const,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
}
