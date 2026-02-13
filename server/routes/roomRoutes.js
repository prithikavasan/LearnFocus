import express from "express";
import {
  createRoom,
  joinRoom,
  getRooms,
  getRoomById,
  generateRoomCode,
  updateRoomRule,
  getStudentRooms,
  updateBasic,
  updateCourses,
  updateTasks,
  updateMaterials,
  toggleCourseComplete,   // ✅ add this
  toggleTaskComplete,
  updateLive,
  updateStudents,
  removeStudent,
  resetStudentProgress
} from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ROOM ROUTES
   Base URL example: /api/rooms
===================================================== */

/* ================= CREATE ROOM ================= */
// Instructor creates a room
router.post("/", protect, createRoom);

/* ================= JOIN ROOM ================= */
// Student joins using room code
router.post("/join", protect, joinRoom);

/* ================= STUDENT ROOMS ================= */
// ⚠️ MUST come before /:roomId
router.get("/student/rooms", protect, getStudentRooms);
router.put("/:roomId/basic", protect, updateBasic);
router.put("/:roomId/courses", protect, updateCourses);
router.put("/:roomId/tasks", protect, updateTasks);

router.put("/:roomId/materials", protect, updateMaterials);

router.put("/:roomId/live", protect, updateLive);


/* ================= GENERATE ROOM CODE ================= */
// Instructor generates room code
router.post("/:roomId/generate-code", protect, generateRoomCode);

/* ================= UPDATE ROOM RULE ================= */
// Instructor updates rules
router.put("/:roomId/update-rule", protect, updateRoomRule);

/* ================= INSTRUCTOR ROOMS ================= */
// Get all rooms created by instructor
router.get("/", protect, getRooms);
// Toggle course completion
router.post("/:roomId/courses/:courseId/toggle-complete", protect, toggleCourseComplete);

// Toggle task completion
router.post("/:roomId/tasks/:taskId/toggle-complete", protect, toggleTaskComplete);

/* ================= GET ROOM BY ID ================= */
// ⚠️ MUST BE LAST (dynamic route)
router.delete("/:roomId/students/:studentId", protect, removeStudent);
router.put("/:roomId/students/:studentId/reset", protect, resetStudentProgress);

router.put("/:roomId/students", protect, updateStudents);
router.get("/:roomId", protect, getRoomById);



export default router;
