"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
router.post("/", user_controller_1.register);
router.get("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), user_controller_1.getAll);
router.put("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), user_controller_1.update);
router.post("/login", user_controller_1.login);
router.post("/admin/login", user_controller_1.adminlogin);
exports.default = router;
