import { Router } from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';
import { AddCategoryController, GetCategoryController, UpdateCategoryController, DeleteCategoryController } from '../controllers/category.controller.js';

const categoryRouter = Router();

categoryRouter.post("/add-category", auth, admin, AddCategoryController);
categoryRouter.get("/get-category", GetCategoryController);
categoryRouter.put("/update-category", auth, admin, UpdateCategoryController);
categoryRouter.delete("/delete", auth, admin, DeleteCategoryController);

export default categoryRouter;