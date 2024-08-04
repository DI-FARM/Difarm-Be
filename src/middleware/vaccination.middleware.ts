import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { Roles } from "@prisma/client";
import vaccinationService from "../service/vaccination.service";
import ResponseHandler from "../util/responseHandler";
import AuthorizedOnProperty from "./checkOwner.middleware";

const responseHandler = new ResponseHandler();

const checkUservaccineExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { vaccineId } = req.params;
  const user = (req as any).user.data;
  const vaccine = await vaccinationService.getSingleVaccination(vaccineId);
  if (!vaccine) {
    responseHandler.setError(
      StatusCodes.NOT_FOUND,
      "Vaccine with this id not found"
    );
    return responseHandler.send(res);
  }

  if (
    !AuthorizedOnProperty(vaccine, user) &&
    user.role !== Roles.SUPERADMIN
  ) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "You do not have access to this vaccine",
    });
  }
  req.vaccine = vaccine;
  next();
};

export default { checkUservaccineExists };
