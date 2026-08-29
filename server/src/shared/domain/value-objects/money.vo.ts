export class Money {
  // do not expose entarnal properties - make private
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency: string = 'BDT'): Money {
    if (amount < 0) {
      throw new Error('the ammount of money cannot be negative');
    }

    const normalized = Math.round((amount * 100) / 100);
    return new Money(normalized, currency.toUpperCase());
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }
}
