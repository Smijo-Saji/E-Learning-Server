import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.status(200).json({ courses });
});

export const getThreeCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find().limit(3);
  res.status(200).json({ courses });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  res.status(200).json({ course });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.status(200).json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res
      .status(400)
      .json({ message: "You have not subscribed to this course" });

  res.status(200).json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.status(200).json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res
      .status(400)
      .json({ message: "You have not subscribed to this course" });

  res.status(200).json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({ courses });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  user.subscription.push(course._id);

  await Progress.create({
    course: course._id,
    completedLectures: [],
    user: req.user._id,
  });
  await user.save();

  res
    .status(200)
    .json({ message: "Course Subscribed Successfully", _id: course._id });
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  res.status(201).json({
    message: "new Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress[0].completedLectures.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});

//comments

// Add a comment to a course
export const addComment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user, comment } = req.body;

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.comments.push({ user, comment });
    await course.save();

    res.status(200).json({ message: "Comment added successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a course
export const getComments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ comments: course.comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { courseId, commentId } = req.params;

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const commentIndex = course.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    course.comments.splice(commentIndex, 1);
    await course.save();

    res.status(200).json({ message: "Comment deleted successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
