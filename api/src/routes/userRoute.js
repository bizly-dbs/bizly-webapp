import express from "express"
import { createUser, getUserById, updateUser, deleteUser } from "../controllers/users.js"
import { verifyUser, authorized } from "../middlewares/authUser.js"

const router = express.Router()

router.get("/user/:id", verifyUser, authorized, getUserById);
router.post("/user", createUser);
router.put("/user/:id", verifyUser, authorized, updateUser);
router.delete("/user/:id", verifyUser, authorized, deleteUser);

export default router