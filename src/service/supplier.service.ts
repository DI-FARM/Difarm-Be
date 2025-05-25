import { PrismaClient, Supplier } from "@prisma/client";
import { CustomError } from "../util/customError";

const prisma = new PrismaClient();

export const SupplierService = {
  async createSupplier(data: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier> {
    try {
      const existingSupplier = await prisma.supplier.findFirst({
        where: { name: data.name, farmId: data.farmId }
      });
      
      if (existingSupplier) {
        throw new CustomError("A supplier with this name already exists for the given farm.", 400);
      }

      return await prisma.supplier.create({ data });
    } catch (error) {
      console.error("Error creating supplier:", error);
      if (error instanceof Error) {
        throw new CustomError(error.message || "Failed to create supplier", 500);
      }
      throw new CustomError("Failed to create supplier", 500);
    }
  },

  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      return await prisma.supplier.findMany();
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw new CustomError("Failed to fetch suppliers", 500);
    }
  },

  async getSuppliersByFarmId(farmId: string): Promise<Supplier[]> {
    try {
      return await prisma.supplier.findMany({ where: { farmId } });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw new CustomError("Failed to retrieve suppliers", 500);
    }
  },

  async getSupplierById(id: string): Promise<Supplier | null> {
    try {
      const supplier = await prisma.supplier.findUnique({ where: { id } });
      if (!supplier) throw new CustomError("Supplier not found", 404);
      return supplier;
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw new CustomError("Failed to fetch supplier", 500);
    }
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    try {
      const existingSupplier = await prisma.supplier.findUnique({ where: { id } });
      if (!existingSupplier) throw new CustomError("Supplier not found", 404);
      return await prisma.supplier.update({ where: { id }, data });
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw new CustomError("Failed to update supplier", 500);
    }
  },

  async deleteSupplier(id: string): Promise<void> {
    try {
        await prisma.$transaction([
        prisma.item.deleteMany({
          where: { supplierId: id },
        }),
        prisma.supplier.delete({
          where: { id },
        }),
      ]);
      // await prisma.supplier.delete({ where: { id } });
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw new CustomError("Failed to delete supplier", 500);
    }
  }
};