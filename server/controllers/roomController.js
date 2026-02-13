import Room from "../models/Room.js";
import crypto from "crypto";

/* =========================================================
   HELPER: Check Instructor Authorization
========================================================= */
const checkInstructor = (room, userId, res) => {
  if (room.instructor.toString() !== userId) {
    res.status(403).json({ message: "Not authorized" });
    return false;
  }
  return true;
};

/* =========================================================
   HELPER: Generate Unique Room Code
========================================================= */
const generateUniqueRoomCode = async () => {
  let roomCode;
  let exists = true;

  while (exists) {
    roomCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const existingRoom = await Room.findOne({ roomCode });
    if (!existingRoom) exists = false;
  }

  return roomCode;
};

/* =========================================================
   CREATE ROOM (Instructor)
========================================================= */
export const createRoom = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { roomName, startTime, endTime, rules, capacity, focusSettings } = req.body;

    // Basic validation
    if (!roomName || !startTime || !endTime || !focusSettings) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { sessionType, sessionDuration, totalSessions } = focusSettings;

    if (!sessionType || !sessionDuration || !totalSessions) {
      return res.status(400).json({ message: "Missing required focusSettings fields" });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const roomCode = await generateUniqueRoomCode();

    const room = await Room.create({
      roomName,
      instructor: instructorId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      rules: rules || {},
      capacity: capacity || 50,
      focusSettings,
      students: [],
      isActive: true,
      isLocked: false,
      roomCode,
    });

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Create Room Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   JOIN ROOM (Student)
========================================================= */
export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const studentId = req.user.id;

    if (!roomCode) return res.status(400).json({ message: "Room code is required" });

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) return res.status(404).json({ message: "Invalid room code" });
    if (!room.isActive) return res.status(400).json({ message: "Room is not active" });
    if (room.isLocked) return res.status(403).json({ message: "Room is locked by instructor" });
    if (room.students.length >= room.capacity) return res.status(400).json({ message: "Room is full" });

    const alreadyJoined = room.students.some(s => s.student.toString() === studentId);
    if (alreadyJoined) return res.status(409).json({ message: "Already joined this room" });

    room.students.push({ student: studentId, status: "not_started", joinedAt: new Date() });
    await room.save();

    res.status(200).json({ message: "Joined room successfully", roomId: room._id });
  } catch (error) {
    console.error("Join Room Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET ALL ROOMS (Instructor)
========================================================= */
export const getRooms = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const rooms = await Room.find({ instructor: instructorId })
      .populate("students.student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Get Rooms Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET ROOM BY ID (Instructor/Student)
========================================================= */
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate("instructor", "name email")
      .populate("students.student", "name email");

    if (!room) return res.status(404).json({ message: "Room not found" });

    const isInstructor = room.instructor._id.toString() === req.user.id;
    const isStudent = room.students.some(s => s.student._id.toString() === req.user.id);

    if (!isInstructor && !isStudent) return res.status(403).json({ message: "Not authorized" });

    res.status(200).json(room);
  } catch (error) {
    console.error("Get Room Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GENERATE ROOM CODE
========================================================= */
export const generateRoomCode = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!checkInstructor(room, req.user.id, res)) return;

    if (!room.roomCode) {
      room.roomCode = await generateUniqueRoomCode();
      await room.save();
    }

    res.status(200).json({ roomCode: room.roomCode });
  } catch (error) {
    console.error("Generate Code Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   UPDATE ROOM BASIC SETTINGS
========================================================= */
export const updateBasic = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!checkInstructor(room, req.user.id, res)) return;

    const { roomName, description, capacity, startTime, endTime } = req.body;

    const newStart = startTime ? new Date(startTime) : room.startTime;
    const newEnd = endTime ? new Date(endTime) : room.endTime;

    if (newEnd <= newStart) return res.status(400).json({ message: "End time must be after start time" });

    room.roomName = roomName || room.roomName;
    room.description = description || room.description;
    room.capacity = capacity || room.capacity;
    room.startTime = newStart;
    room.endTime = newEnd;

    await room.save();
    res.json({ message: "Basic settings updated", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   UPDATE COURSES
========================================================= */
export const updateCourses = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room)
      return res.status(404).json({ message: "Room not found" });

    if (!checkInstructor(room, req.user.id, res)) return;

    const { courses } = req.body;

    if (!Array.isArray(courses)) {
      return res.status(400).json({ message: "Courses must be an array" });
    }

    // Validate manually before saving
    for (let course of courses) {
      if (!course.title || course.title.trim() === "") {
        return res.status(400).json({
          message: "Course title is required",
        });
      }
    }

    room.courses = courses;

    await room.save();

    res.json({ message: "Courses updated", room });
  } catch (error) {
    console.error("UPDATE COURSES ERROR:", error); // 👈 VERY IMPORTANT
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   UPDATE TASKS
========================================================= */
export const updateTasks = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!checkInstructor(room, req.user.id, res)) return;

    room.tasks = req.body.tasks || [];
    await room.save();

    res.json({ message: "Tasks updated", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* =========================================================
   UPDATE MATERIALS
========================================================= */
export const updateMaterials = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!checkInstructor(room, req.user.id, res)) return;

    room.materials = req.body.materials || [];
    await room.save();

    res.json({ message: "Materials updated", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   UPDATE LIVE SESSION
========================================================= */
export const updateLive = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!checkInstructor(room, req.user.id, res)) return;

    // Push new session to array
    room.liveSessions.push(req.body.liveSession);

    await room.save();
    res.json({ message: "Live session added", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================================================
   GET STUDENT ROOMS
========================================================= */
export const getStudentRooms = async (req, res) => {
  try {
    const studentId = req.user.id;
    const rooms = await Room.find({ "students.student": studentId })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Get Student Rooms Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateRoomRule = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!checkInstructor(room, req.user.id, res)) return;

    room.rules = { ...room.rules, ...req.body.rules };
    await room.save();

    res.json({ message: "Room rules updated", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controller
export const addCourse = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.courses.push(req.body); // push single course
    await room.save();

    res.json(room);
  } catch (err) {
    console.error("ADD COURSE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateStudents = async (req, res) => {
  try {
    const { students } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    room.students = students;
    await room.save();

    res.json(room);
  } catch (error) {
    console.error("UPDATE STUDENTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const removeStudent = async (req, res) => {
  try {
    const { roomId, studentId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove student from array
    room.students = room.students.filter(
      (s) => s.student.toString() !== studentId
    );

    await room.save();

    res.json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("REMOVE STUDENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const resetStudentProgress = async (req, res) => {
  try {
    const { roomId, studentId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const student = room.students.find(
      (s) => s.student.toString() === studentId
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔥 RESET EVERYTHING
    student.progress = 0;
    student.status = "not_started";

    // if you track completed tasks
    student.completedTasks = [];

    // if you track course progress
    student.courseProgress = {};

    await room.save();

    res.json({ message: "Student progress reset successfully" });
  } catch (error) {
    console.error("RESET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const toggleCourseComplete = async (req, res) => {
  try {
    const { roomId, courseId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Find course by _id
    const course = room.courses.id(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Toggle a "completed" field (add it if missing)
    course.completed = !course.completed;

    await room.save();
    res.json({ message: "Course toggled", course });
  } catch (err) {
    console.error("Toggle Course Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTaskComplete = async (req, res) => {
  try {
    const { roomId, taskId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const task = room.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await room.save();
    res.json({ message: "Task toggled", task });
  } catch (err) {
    console.error("Toggle Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
