import { Cattle, Farm, Insemination, Production, ProductType, Stock, Transaction, Vaccination, Veterinarian,User } from "@prisma/client";
import { UserI } from './interface/user.interface';


declare global {
  namespace Express {
    interface Request {
      productInfo?: {
        productType: ProductType;
        totalQuantity: number;
        pricePerUnit: number;
      },
      transaction:any,
      productInfo: any,
      production: Production,
      farm: Farm,
      cattle: Cattle,
      stock: Stock,
      stockTransaction: Transaction,
      vaccine: Vaccination,
      veterian: Veterinarian,
      insemination: Insemination,
      actionUser:any
    }
  }
}
export {}; // this line ensures the file is treated as a module.

