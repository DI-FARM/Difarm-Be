import { Cattle, Farm, Production, ProductType, Stock, Transaction } from "@prisma/client";


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
      stockTransaction: Transaction
    }
  }
}
export {}; // this line ensures the file is treated as a module.

