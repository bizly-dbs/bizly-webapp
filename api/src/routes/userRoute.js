import express from "express"
import { createUser, getUserById, updateUser, deleteUser} from "../controllers/users"
import { verifyUser, authorized } from "../middlewares/authUser"

const router = express.Router()

router.get("/user/:id", verifyUser, authorized, getUserById);
router.post("/user", createUser);
router.put("/user/:id", verifyUser, authorized, updateUser);
router.delete("/user/:id", verifyUser, authorized, deleteUser);