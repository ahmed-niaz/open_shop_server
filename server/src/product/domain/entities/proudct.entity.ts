import { AggregateRoot } from '../../../shared/domain/aggregate-root.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { ProudctId } from '../value-objects/product-id.vo.js';
import { SKU } from '../value-objects/sku.vo.js';

export interface ProudctProps {
  id: ProudctId;
  name: string;
  price: Money;
  description: string;
  sku: SKU;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
  private _id: ProudctId;
  private _name: string;
  private _price: Money;
  private _description: string;
  private _sku: SKU;
  private _stock: number;
  private _isActive: boolean;
  private _lowStockThreshold: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ProudctProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._sku = props.sku;
    this._stock = props.stock;
    this._isActive = props.isActive;
    this._lowStockThreshold = props.lowStockThreshold;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  //   create method
  static create(
    name: string,
    description: string,
    sku: string,
    price: number,
    currency: string,
    stock: number,
  ) {
    Product.validateName(name);
    Product.validateStock(stock);

    const now = new Date();

    return new Product({
      id: new ProudctId(),
      name,
      description,
      sku: SKU.create(sku),
      price: Money.create(price, currency),
      stock,
      isActive: true,
      lowStockThreshold: 10,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }
  get sku() {
    return this._sku;
  }
  get price() {
    return this._price;
  }
  get stock() {
    return this._stock;
  }
  get isActive() {
    return this._isActive;
  }
  get lowStockThreshold() {
    return this._lowStockThreshold;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  //   method reconstitue
  static reconstitute(props: ProudctProps): Product {
    return new Product(props);
  }

  private static validateName(name: string): void {
    if (name.length < 3) {
      throw new Error('Name must be at least 3 characters');
    }
  }

  private static validateStock(stock: number): void {
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }
  }
}
