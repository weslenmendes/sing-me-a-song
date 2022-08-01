import { Request, Response } from "express";
import { testsService } from "./../services/testsService.js";

async function create(req: Request, res: Response) {
  const amount = parseInt(req.params.amount) || 1;
  const score = Number(req.query.score) || 0;

  await testsService.create(amount, score);

  res.sendStatus(201);
}

async function removeAll(_req: Request, res: Response) {
  await testsService.removeAll();
  res.sendStatus(204);
}

export const testController = {
  create,
  removeAll,
};
