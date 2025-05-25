import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../db/prisma";

const checkItemExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = (req as any).body.name;
    const supplierId = (req as any).body.supplierId;
    const { farmId } = req.params;

    const item = await prisma.item.findFirst({
      where: { name, farmId, supplierId },
    });
    if (item) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "An item with this name already exists for the given farm and supplier." });
    }
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

export default checkItemExists;
