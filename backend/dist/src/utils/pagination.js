"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
function paginate(items, params) {
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
//# sourceMappingURL=pagination.js.map