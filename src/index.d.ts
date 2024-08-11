import { Cattle, Farm, Insemination, Production, ProductType, Stock, Transaction, Vaccination, Veterinarian } from "@prisma/client";


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
      insemination: Insemination
    }
  }
}
export {}; // this line ensures the file is treated as a module.

