import express from "express";
import {
  addComment,
  checkout,
  deleteComment,
  fetchLecture,
  fetchLectures,
  getAllCourses,
  getComments,
  getMyCourses,
  getSingleCourse,
  getThreeCourses,
} from "../controllers/course.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/course/all", getAllCourses);

router.get("/course/three", getThreeCourses);

router.get("/course/:id", getSingleCourse);

router.get("/lectures/:id", isAuth, fetchLectures);

router.get("/lecture/:id", isAuth, fetchLecture);

router.get("/mycourse", isAuth, getMyCourses);

router.post("/course/checkout/:id", isAuth, checkout);

router.post("/courses/:courseId/comments", isAuth, addComment);

router.get("/courses/:courseId/comments", isAuth, getComments);

router.delete("/courses/:courseId/comments/:commentId", isAuth, deleteComment);

export default router;
