import { Customer } from '../../domain/entities/customers.entity.js';

export class CustomerResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    dto.id = customer.getId().getValue();
    dto.email = customer.getEmail().getValue();
    dto.firstName = customer.getFirstName();
    dto.lastName = customer.getLastName();
    dto.phoneNumber = customer.getPhoneNumber();
    dto.isActive = customer.getIsActive();
    dto.createdAt = customer.getCreatedAt().toISOString();
    dto.updatedAt = customer.getUpdatedAt().toISOString();

    return dto;
  }
}
