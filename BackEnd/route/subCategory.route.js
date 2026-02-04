import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import { AddSubCategoryController, GetSubCategoryController, UpdateSubCategoryController, DeleteSubCategoryController } from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create", auth, admin, AddSubCategoryController);
subCategoryRouter.post("/get", GetSubCategoryController);
subCategoryRouter.put("/update", auth, admin, UpdateSubCategoryController);
subCategoryRouter.delete("/delete", auth, admin, DeleteSubCategoryController);

export default subCategoryRouter;