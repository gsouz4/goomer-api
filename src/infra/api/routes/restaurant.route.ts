import express, { Router, Request, Response } from "express";
import RestaurantRepository from "../../restaurant/repository/mysql/restaurant.repository";
import ListRestaurantUseCase from "../../../usecase/list/list.restaurant.usecase";
import FindpRestaurantUseCase from "../../../usecase/find/find.restaurant.usecase";
import CreateRestaurantUseCase from "../../../usecase/create/create.restaurant.usecase";
import RestaurantNotFoundError from "../../../usecase/errors/restaurant.notfound.error";
import { InputCreateRestaurantDTO } from "../../../usecase/create/create.restaurant.dto";

export const restaurantRoute: Router = express.Router();

restaurantRoute.get("/", async (req, res: Response) => {
  const restaurantRepository = new RestaurantRepository();
  const usecase = new ListRestaurantUseCase(restaurantRepository);

  const output = await usecase.execute();

  const statusCode = output.restaurants.length > 0 ? 200 : 204;
  res.status(statusCode).json(output.restaurants);
});

restaurantRoute.get(
  "/:restaurant_uuid",
  async (req: Request, res: Response) => {
    const restaurantRepository = new RestaurantRepository();
    const usecase = new FindpRestaurantUseCase(restaurantRepository);

    let restaurant;

    try {
      restaurant = await usecase.execute({
        id: req.params.restaurant_uuid,
      });
    } catch (err) {
      if (err instanceof RestaurantNotFoundError) {
        res.status(404).send({ message: err.message });
      }
    }

    res.status(200).json(restaurant);
  }
);

restaurantRoute.post(
  "/",
  async (req: Request<{}, InputCreateRestaurantDTO>, res: Response) => {
    const restaurantRepository = new RestaurantRepository();
    const usecase = new CreateRestaurantUseCase(restaurantRepository);

    let id;

    try {
      id = await usecase.execute(req.body);
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : "Something went wrong. Try later.";

      res.status(422).send({ message: `${errMessage}` });
    }

    res.status(201).json(id);
  }
);
