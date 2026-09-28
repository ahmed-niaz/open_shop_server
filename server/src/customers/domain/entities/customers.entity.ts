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
  getId(): CustomerId {
    return this._id;
  }

  getEmail(): Email {
    return this._email;
  }

  getFirstName(): string {
    return this._firstName;
  }

  getLastName(): string {
    return this._lastName;
  }

  getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  getPhoneNumber(): string | null {
    return this._phoneNumber;
  }

  getIsActive(): boolean {
    return this._isActive;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }

  // PascalCase aliases for backward compatibility
  get Id(): CustomerId {
    return this.getId();
  }

  get Email(): Email {
    return this.getEmail();
  }

  get FirstName(): string {
    return this.getFirstName();
  }

  get LastName(): string {
    return this.getLastName();
  }

  get FullName(): string {
    return this.getFullName();
  }

  get PhoneNumber(): string | null {
    return this.getPhoneNumber();
  }

  get IsActive(): boolean {
    return this.getIsActive();
  }
}
