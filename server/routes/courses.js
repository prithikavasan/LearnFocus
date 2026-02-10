import express from "express";
import Course from "../models/Course.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CREATE COURSE ================= */
router.post("/", protect, async (req, res) => {
  const { title, description, modules, status, thumbnail } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required." });
  }

  try {
    const newCourse = new Course({
      title,
      description,
      modules: modules || [],
      status: status || "draft",
      mentorId: req.user._id,
      thumbnail: thumbnail || "",
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create course" });
  }
});

/* ================= GET ALL COURSES ================= */
router.get("/all", protect, async (req, res) => {
  try {
    const courses = await Course.find().populate("mentorId", "name email");
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ================= GET COURSES BY MENTOR ================= */
router.get("/", protect, async (req, res) => {
  try {
    const courses = await Course.find({ mentorId: req.user._id });
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ================= GET SINGLE COURSE ================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("mentorId", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    // ✅ Allow all authenticated users to view the course
    res.status(200).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

/* ================= UPDATE COURSE ================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only mentor who created the course can update
    if (course.mentorId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.modules = req.body.modules || course.modules;
    course.status = req.body.status || course.status;
    course.thumbnail = req.body.thumbnail || course.thumbnail;

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update course" });
  }
});

/* ================= DELETE COURSE ================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only mentor who created the course can delete
    if (course.mentorId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

export default router;
