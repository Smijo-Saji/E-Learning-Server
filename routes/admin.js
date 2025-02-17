import express from "express";
import { isAdmin, isAuth } from "../middleware/isAuth.js";
import {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  editLecture,
  getAllStats,
  getAllUsers,
  updateRole,
} from "../controllers/admin.js";
import { uploadFiles } from "../middleware/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);

router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLecture);

router.delete("/course/:id", isAuth, isAdmin, deleteCourse);

router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);

router.get("/stats", isAuth, isAdmin, getAllStats);

router.put("/user/:id", isAuth, updateRole);

router.get("/users", isAuth, isAdmin, getAllUsers);

router.put("/lecture/:id", isAuth, isAdmin, uploadFiles, editLecture);

export default router;
