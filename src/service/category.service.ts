import { PrismaClient, Category } from "@prisma/client";
import { CustomError } from "../util/customError";

const prisma = new PrismaClient();

export const CategoryService = {
  async createCategory(data: Omit<Category, "id">): Promise<Category> {
    try {
      return await prisma.category.create({ data });
    } catch (error) {
      console.error("Error creating category:", error);
      throw new CustomError("Failed to create category", 500);
    }
  },

  async getAllCategories(): Promise<Category[]> {
    try {
      return await prisma.category.findMany();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new CustomError("Failed to fetch categories", 500);
    }
  },
  async getCategoriesByFarm(): Promise<Category[]> {
    try {
      return await prisma.category.findMany();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new CustomError("Failed to fetch categories", 500);
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) throw new CustomError("Category not found", 404);
      return category;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw new CustomError("Failed to fetch category", 500);
    }
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      console.log(id, data);
      return await prisma.category.update({ where: { id }, data });
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw new CustomError("Failed to update category", 500);
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await prisma.category.delete({ where: { id } });
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw new CustomError("Failed to delete category", 500);
    }
  },
};
