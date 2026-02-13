import express from "express"
import { createUserController, deleteUserController, listUsersController, updateUserController } from "../controllers/usersControllers.js"

const usersRouter = express.Router()

usersRouter.post("/", createUserController)
usersRouter.get("/", listUsersController)
usersRouter.delete("/:id", deleteUserController)
usersRouter.patch("/:id", updateUserController)

export default usersRouter
