import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../db/prisma";

const checkItemExists = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const name = (req as any).body.name;

      const item = await prisma.item.findFirst({ where: { name } });
      if (item) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Item already exists" });
      }
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
  };

export default checkItemExists;
