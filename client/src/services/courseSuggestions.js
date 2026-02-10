// src/services/courseSuggestions.js

export const getCourseSuggestions = (category) => {
  if (category.toLowerCase() === "java") {
    return [
      {
        title: "Introduction to Java",
        lessons: [
          { title: "What is Java?", description: "Overview of Java language." },
          { title: "Setting up Java", description: "Install JDK and IDE." },
          { title: "Hello World Program", description: "Your first Java program." },
        ],
      },
      {
        title: "OOP Concepts",
        lessons: [
          { title: "Classes & Objects", description: "Basics of OOP in Java." },
          { title: "Inheritance & Polymorphism", description: "OOP principles." },
          { title: "Encapsulation & Abstraction", description: "Key OOP concepts." },
        ],
      },
      {
        title: "Advanced Java",
        lessons: [
          { title: "Collections Framework", description: "Lists, Sets, Maps in Java." },
          { title: "Exception Handling", description: "Try-catch and custom exceptions." },
          { title: "File I/O & Streams", description: "Reading and writing files." },
        ],
      },
    ];
  }

  // Add more categories like Python, Web Development...
  return [];
};
