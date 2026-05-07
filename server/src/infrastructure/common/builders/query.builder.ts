import { Prisma } from '@prisma/client';

export class QueryBuilder {
  static buildSearchCondition(
    searchTerm: string,
    fields: string[],
  ): any {
    if (!searchTerm?.trim()) {
      return undefined;
    }

    return {
      OR: fields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    };
  }

  static buildDateRangeCondition(
    field: string,
    fromDate?: string,
    toDate?: string,
  ): any {
    if (!fromDate && !toDate) {
      return undefined;
    }

    return {
      [field]: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
    };
  }

  static buildSortCondition(
    sortType?: string,
    defaultSort: any = { createdAt: 'desc' },
  ): any {
    return sortType ? this.parseSortType(sortType) : defaultSort;
  }

  private static parseSortType(sortType: string): any {
    const [field, direction] = sortType.split('_');
    return { [field]: direction || 'asc' };
  }

  static mergeWhere(...conditions: any[]): any {
    return conditions.reduce((acc, condition) => {
      if (!condition) return acc;
      return { ...acc, ...condition };
    }, {});
  }
}
