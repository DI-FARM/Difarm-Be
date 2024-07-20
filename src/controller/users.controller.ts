import { Request, Response } from 'express';
import ResponseHandler from '../util/responseHandler';
import prisma from '../db/prisma';


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

  try {
    const users = await prisma.user.findMany();

    responseHandler.setSuccess(200, 'Users retrieved successfully', users);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error retrieving users');
    responseHandler.send(res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { farms: true, account: true },
    });

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
  const { id } = req.params;
  const { fullname, gender, profilePic } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullname,
        gender,
        profilePic,
      },
    });

    responseHandler.setSuccess(200, 'User updated successfully', updatedUser);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error updating user');
    responseHandler.send(res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const responseHandler = new ResponseHandler();
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    responseHandler.setSuccess(200, 'User deleted successfully', null);
    responseHandler.send(res);
  } catch (error) {
    responseHandler.setError(400, 'Error deleting user');
    responseHandler.send(res);
  }
};
