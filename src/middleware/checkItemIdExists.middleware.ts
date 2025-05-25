import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../db/prisma";

const checkItemIdExists = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const item = await prisma.item.findFirst({ where: { id } });
      if (!item) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Item wit this ID does not exist" });
      }
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
  };

export default checkItemIdExists;
