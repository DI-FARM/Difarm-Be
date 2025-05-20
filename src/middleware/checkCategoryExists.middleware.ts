import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../db/prisma";

const checkCategoryExists = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const name = (req as any).body.name;

      const category = await prisma.category.findFirst({ where: { name } });
      if (category) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Category already exists" });
      }
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
  };

export default checkCategoryExists;
