export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginate<T>(items: T[], params: PaginationParams): PaginatedResponse<T> {
  const { page = 1, limit = 10 } = params;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const total = items.length;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(total / limit);

  return {
    items: paginatedItems,
    total,
    page,
    limit,
    totalPages,
  };
}
