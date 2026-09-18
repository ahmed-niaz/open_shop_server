import { randomUUID } from 'crypto';

export class UniqueId {
  private readonly value: string; //immutable or it can be changed

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UniqueId) {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
