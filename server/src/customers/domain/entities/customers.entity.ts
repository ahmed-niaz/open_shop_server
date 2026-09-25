import { AggregateRoot } from '../../../shared/domain/aggregate-root.js';
import { CustomerId } from '../value-objects/customer-id.vo.js';
import { Email } from '../value-objects/email.vo.js';

export interface CustomerProps {
  id: CustomerId;
  email: Email;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends AggregateRoot {
  private _id: CustomerId;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _isActive: boolean;
  private _phoneNumber: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    super();
    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._isActive = props.isActive;
    this._phoneNumber = props.phoneNumber;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static register(
    email: Email,
    firstName: string,
    lastName: string,
    phoneNumber: string | null = null,
  ): Customer {
    const id = new CustomerId();
    const now = new Date();

    return new Customer({
      id,
      email,
      firstName,
      lastName,
      isActive: true,
      phoneNumber,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Reconstitute method for restoring entity from persistence
  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  // Standard camelCase getters
  get id(): CustomerId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // PascalCase aliases for backward compatibility
  get Id(): CustomerId {
    return this.id;
  }

  get Email(): Email {
    return this.email;
  }

  get FirstName(): string {
    return this.firstName;
  }

  get LastName(): string {
    return this.lastName;
  }

  get FullName(): string {
    return this.fullName;
  }

  get PhoneNumber(): string | null {
    return this.phoneNumber;
  }

  get IsActive(): boolean {
    return this.isActive;
  }
}
