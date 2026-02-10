import express from "express";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/Course.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET USER COURSE PROGRESS ================= */
router.get("/:courseId", protect, async (req, res) => {
  try {
    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    if (!progress) {
      progress = await CourseProgress.create({
        userId: req.user._id,
        courseId: req.params.courseId,
        completedLessons: [],
        completedModules: [],
      });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch progress" });
  }
});

/* ================= MARK LESSON COMPLETED ================= */
router.post("/lesson", protect, async (req, res) => {
  const { courseId, moduleIndex, lessonIndex } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId,
    });

    if (!progress) {
      progress = new CourseProgress({
        userId: req.user._id,
        courseId,
        completedLessons: [],
        completedModules: [],
        isCourseCompleted: false,
      });
    }

    /* ================= TOGGLE LESSON ================= */

    const lessonIndexInProgress = progress.completedLessons.findIndex(
      (l) =>
        l.moduleIndex === moduleIndex &&
        l.lessonIndex === lessonIndex
    );

    if (lessonIndexInProgress !== -1) {
      // 🔁 UNDO (MARK INCOMPLETE)
      progress.completedLessons.splice(lessonIndexInProgress, 1);
    } else {
      // ✅ MARK COMPLETE
      progress.completedLessons.push({ moduleIndex, lessonIndex });
    }

    /* ================= UPDATE MODULE STATUS ================= */

    const totalLessons =
      course.modules[moduleIndex].lessons.length;

    const completedLessonsInModule = progress.completedLessons.filter(
      (l) => l.moduleIndex === moduleIndex
    ).length;

    const moduleIndexInProgress = progress.completedModules.findIndex(
      (m) => m.moduleIndex === moduleIndex
    );

    if (completedLessonsInModule === totalLessons) {
      // ✅ mark module complete
      if (moduleIndexInProgress === -1) {
        progress.completedModules.push({ moduleIndex });
      }
    } else {
      // ❌ undo module completion
      if (moduleIndexInProgress !== -1) {
        progress.completedModules.splice(moduleIndexInProgress, 1);
      }
    }

    /* ================= UPDATE COURSE STATUS ================= */

    if (
      progress.completedModules.length === course.modules.length
    ) {
      progress.isCourseCompleted = true;
    } else {
      progress.isCourseCompleted = false;
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update progress" });
  }
});


export default router;
