import { PrismaClient, StockIn, StockOut, Stock } from "@prisma/client";
import { CustomError } from "../util/customError";

const prisma = new PrismaClient();

export const StockService = {
  
  async addStockIn(data: Omit<StockIn, "id">, user:any): Promise<StockIn> {

    console.log(data);
    
    return await prisma.$transaction(async (tx) => {
      
      const stock = await tx.stock.findUnique({
        where: { itemId: data.itemId }
      });
  
      // If stock still doesn't exist after creation, throw an error
      if (!stock) {
        throw new CustomError("Stock record not found for the given item", 404);
      }
  
      // Update stock entity with the incoming stock data
      const updatedStock = await tx.stock.update({
        where: { itemId: data.itemId },
        data: {
          quantityInStock: stock.quantityInStock + data.quantity,
          balanceInStock: stock.balanceInStock + data.quantity,
          totalValueReceived: stock.totalValueReceived + (data.quantity * stock.totalBalance)
        }
      });
  
      // Add a new StockIn record
      return await tx.stockIn.create({
        data: {
          receiveDate: data.receiveDate, // Make sure to pass the correct date from data
          quarter: data.quarter,         // Make sure to pass the correct quarter from data
          item: { connect: { id: data.itemId } },         
          quantity: data.quantity,
          totalPrice: data.totalPrice,
          specification: data.specification,
          farm: { connect: { id: data.farmId } },          // Add the missing farmId property
        }
      });
    });
  },  

  // Fetch StockIn Records
  async getStockIn(): Promise<StockIn[]> {
    return await prisma.stockIn.findMany({ include: { item: true } });
  },

  // Handle StockOut Transaction
  async addStockOut(data: Omit<StockOut, "id">): Promise<StockOut> {
    return await prisma.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({
        where: { itemId: data.itemId }
      });

      if (!stock) {
        throw new CustomError("Stock record not found for the given item", 404);
      }

      if (stock.balanceInStock < data.quantity) {
        throw new CustomError("Insufficient stock balance", 400);
      }

      // Update stock entity
      const updatedStock = await tx.stock.update({
        where: { itemId: data.itemId },
        data: {
          quantityOutStock: stock.quantityOutStock + data.quantity,
          balanceInStock: stock.balanceInStock - data.quantity,
          totalBalance: stock.totalBalance - (data.quantity * stock.totalBalance)
        }
      });

      // Add StockOut record
      return await tx.stockOut.create({ data });
    });
  },

  // Fetch StockOut Records
  async getStockOut(): Promise<StockOut[]> {
    return await prisma.stockOut.findMany({ include: { item: true, farm: true } });
  }
};
