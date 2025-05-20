import { PrismaClient, Item } from "@prisma/client";
import { CustomError } from "../util/customError";

const prisma = new PrismaClient();

export const ItemService = {
  async createItem(data: Omit<Item, "id">): Promise<Item> {
    try {
      const existingItem = await prisma.item.findFirst({ 
        where: { 
          name: data.name, 
          farmId: data.farmId, 
        }, 
      });
  
      if (existingItem) {
        throw new CustomError("An item with this name already exists for the given farm.", 400);
      }
  
      const newItem = await prisma.item.create({ data });

      await prisma.stock.create({
        data: {
          itemId: newItem.id,  
          quantityInStock: 0,
          balanceInStock: 0,
          totalValueReceived: 0,
          totalBalance: 0,
          quantityOutStock: 0,
          farmId: data.farmId
        }
      });
  
      return newItem;
      
    } catch (error) {
      console.error("Error creating item:", error);
      throw new CustomError("Failed to create item", 500);
    }
  },

  async getAllItems(): Promise<Item[]> {
    try {
      return await prisma.item.findMany({
        include: { category: true, supplier: true, stock: true }
      });
    } catch (error) {
      console.error("Error fetching items:", error);
      throw new CustomError("Failed to fetch items", 500);
    }
  },

  async getItemByFarmId(farmId: string): Promise<Item[]> {
      try {
          return await prisma.item.findMany({
              where: { farmId },
          });
      } catch (error) {
          console.error("Error fetching items:", error);
          throw new CustomError("Failed to retrieve items", 500);
      }
    },

  async getItemById(id: string): Promise<Item | null> {
    try {
      const item = await prisma.item.findUnique({ where: { id } });
      if (!item) throw new CustomError("Item not found", 404);
      return item;
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      throw new CustomError("Failed to fetch item", 500);
    }
  },

  async updateItem(id: string, data: Partial<Item>): Promise<Item> {
    try {
      return await prisma.item.update({ where: { id }, data });
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw new CustomError("Failed to update item", 500);
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      await prisma.$transaction([
        prisma.stock.deleteMany({
          where: { itemId: id },
        }),
        prisma.item.delete({
          where: { id },
        }),
      ]);
    } catch (error) {
      console.error(`Error deleting item with ID ${id}:`, error);
      throw new CustomError("Failed to delete item", 500);
    }
  }
};
