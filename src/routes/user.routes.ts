import express from "express";
import {
	register,
	update,
	login,
	adminlogin,
	getAll,
} from "../controllers/user.controller";
import { Authenticate } from "../middlewares/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/global.types";

const router = express.Router();


router.post("/", register);

router.get("/", Authenticate(onlyAdmin), getAll);

router.put("/:id", Authenticate(onlyUser), update);

router.post("/login", login); 

router.post("/admin/login", adminlogin);

export default router;
