import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

interface ShippingAddressProps {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class ShippingAddress {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _postalCode: string;
  private readonly _country: string;

  private constructor(private readonly props: ShippingAddressProps) {
    this._street = props.street;
    this._city = props.city;
    this._state = props.state;
    this._postalCode = props.postalCode;
    this._country = props.country;
  }

  //   static create factory method to create a new ShippingAddress instance
  static create(props: ShippingAddressProps): ShippingAddress {
    if (!props.street || props.state.trim().length === 0) {
      throw new DomainException('Shipping address street is required');
    }

    if (!props.city || props.city.trim().length === 0) {
      throw new DomainException('Shipping address city is required');
    }

    if (!props.state || props.state.trim().length === 0) {
      throw new DomainException('Shipping address state is required');
    }

    if (!props.postalCode || props.postalCode.trim().length === 0) {
      throw new DomainException('Shipping address postal code is required');
    }

    if (!props.country || props.country.trim().length !== 2) {
      throw new DomainException(
        'Shipping address country is required and must be a valid ISO 3166-1 alpha-2 country code',
      );
    }
    return new ShippingAddress({
      street: props.street.trim(),
      city: props.city.trim(),
      state: props.state.trim(),
      postalCode: props.postalCode.trim(),
      country: props.country.trim().toUpperCase(),
    });
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get country(): string {
    return this._country;
  }

  equals(other: ShippingAddress): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }
}
