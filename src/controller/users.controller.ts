import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import prisma from '../db/prisma';
import { Farm, Roles } from "@prisma/client";
import { UserI } from '../interface/user.interface';
import { AccountI } from '../interface/account.interface';
import farmService from "../service/farm.service";
import { StatusCodes } from "http-status-codes";


export const createUser = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { accountId, fullname, gender, profilePic } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        accountId,
        fullname,
        gender,
        profilePic,
      },
    });

    responseHandler.setSuccess(201, 'User created successfully', newUser);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error creating user');
    responseHandler.send(res);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const user = (req as any).user.data;
  const {farmId} = req.params
  let users = []
  try {
    if (user.role == Roles.SUPERADMIN) {
      users = await prisma.user.findMany({ include: { farms: true } });
    } else {
      const userFarm = await prisma.farm.findUnique({
        where: { id: farmId },
        include: { owner: true },
      });

      users.push(userFarm?.owner);
      if (userFarm?.managerId) {
        const manager = await prisma.user.findUnique({
          where: { id: userFarm.managerId },
        });
        users.push(manager);
      }
    }

    responseHandler.setSuccess(200, 'Users retrieved successfully', users);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error retrieving users');
    responseHandler.send(res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { userId } = req.params;

  try {
    const user = req.actionUser

    if (!user) {
      responseHandler.setError(404, 'User not found');
      responseHandler.send(res);
      return;
    }

    responseHandler.setSuccess(200, 'User retrieved successfully', user);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error retrieving user');
    responseHandler.send(res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { userId } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...req.body
      },
    });

    responseHandler.setSuccess(200, 'User updated successfully', updatedUser);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error updating user');
    responseHandler.send(res);
  }
};
export const updateAccount = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { accId } = req.params;
  const{email,phone,username} = req.body

  try {
    const updateData:any = {}

    // Check which fields are provided and add them to the update object
    if (email) {
      const emailExist = await prisma.account.findUnique({ where: { email } });
      if (!emailExist) {
        updateData.email = email; // Only add email if it doesn't exist
      }
      else{
        responseHandler.setError(
          StatusCodes.BAD_REQUEST,
          "An account with this email address already exists."
        );
        return responseHandler.send(res);
      }
    }
    
    if (phone) {
      const phoneExist = await prisma.account.findUnique({ where: { phone } });
      if (!phoneExist) {
        updateData.phone = phone; // Only add phone if it doesn't exist
      }
      else{
        responseHandler.setError(
          StatusCodes.BAD_REQUEST,
          "An account with this phone address already exists."
        );
        return responseHandler.send(res);
      }
    }
    
    if (username) {
      const accountExist = await prisma.account.findUnique({ where: { username } });
      if (!accountExist) {
        updateData.username = username; // Only add username if it doesn't exist
      }
      else{
        responseHandler.setError(
          StatusCodes.BAD_REQUEST,
          "An account with this  username already exists."
        );
        return responseHandler.send(res);
      }
    } 

    const updatedUser = await prisma.account.update({
      where: { id: accId },
      data: updateData,
    });

    responseHandler.setSuccess(
      200,
      "Account updated successfully",
      updatedUser
    );
    responseHandler.send(res);
  } catch (error) {
    console.log(error)
    responseHandler.setError(400, "Error updating account");
    responseHandler.send(res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { userId } = req.params;

  try {

    await Promise.all([
      prisma.user.delete({
        where: { id: userId },
      }),
      prisma.account.delete({
        where: { id: req.actionUser.accountId },
      }),
    ]);
    if (req.actionUser.account.role == Roles.MANAGER){
      const data = await farmService.removeManagerFromFarm(req.actionUser.id)
    }
    responseHandler.setSuccess(200, 'User deleted successfully', null);
    responseHandler.send(res);
  } catch (error) {
    console.log(error)
    responseHandler.setError(400, 'Error deleting user');
    responseHandler.send(res);
  }
};
