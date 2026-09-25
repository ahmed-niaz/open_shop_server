// the query will the entirely speparation form he presentation layer.
export class ListProductQuery {
  constructor(
    public readonly isActive?: boolean,
    public readonly minPrice?: number,
    public readonly maxPrice?: number,
  ) {}
}
