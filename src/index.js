"use strict";
// Дані
let professors = [];
let classrooms = [];
let courses = [];
let schedule = [];
// Функція для додавання професора
function addProfessor(professor) {
    professors.push(professor);
}
// Функція для додавання курсу
function addCourse(course) {
    courses.push(course);
}
// Функція для додавання аудиторії
function addClassroom(classroom) {
    classrooms.push(classroom);
}
// Функція для додавання заняття до розкладу
function addLesson(lesson) {
    if (validateLesson(lesson) === null) {
        schedule.push(lesson);
        return true;
    }
    return false;
}
// Функція для пошуку вільних аудиторій
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    return classrooms
        .filter(classroom => !schedule.some(lesson => lesson.classroomNumber === classroom.number &&
        lesson.timeSlot === timeSlot &&
        lesson.dayOfWeek === dayOfWeek))
        .map(classroom => classroom.number);
}
// Функція для отримання розкладу професора
function getProfessorSchedule(professorId) {
    return schedule.filter(lesson => lesson.professorId === professorId);
}
// Функція для валідації заняття (перевірка конфліктів)
function validateLesson(lesson) {
    // Перевірка конфліктів з професором
    const professorConflict = schedule.some(l => l.professorId === lesson.professorId &&
        l.timeSlot === lesson.timeSlot &&
        l.dayOfWeek === lesson.dayOfWeek);
    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: lesson
        };
    }
    // Перевірка конфліктів з аудиторією
    const classroomConflict = schedule.some(l => l.classroomNumber === lesson.classroomNumber &&
        l.timeSlot === lesson.timeSlot &&
        l.dayOfWeek === lesson.dayOfWeek);
    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: lesson
        };
    }
    return null;
}
// Функція для отримання використання аудиторії у відсотках
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 5 * 5; // 5 днів на тиждень, 5 часових слотів щодня
    const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}
// Функція для визначення найпопулярнішого типу курсу
function getMostPopularCourseType() {
    const courseTypeCounts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    schedule.forEach(lesson => {
        const course = courses.find(course => course.id === lesson.courseId);
        if (course) {
            courseTypeCounts[course.type]++;
        }
    });
    return Object.entries(courseTypeCounts).sort(([, a], [, b]) => b - a)[0][0];
}
// Функція для переназначення аудиторії
function reassignClassroom(lessonId, newClassroomNumber) {
    const lesson = schedule.find(l => l.courseId === lessonId);
    if (lesson && !schedule.some(l => l.classroomNumber === newClassroomNumber &&
        l.timeSlot === lesson.timeSlot &&
        l.dayOfWeek === lesson.dayOfWeek)) {
        lesson.classroomNumber = newClassroomNumber;
        return true;
    }
    return false;
}
// Функція для скасування заняття
function cancelLesson(lessonId) {
    const lessonIndex = schedule.findIndex(l => l.courseId === lessonId);
    if (lessonIndex !== -1) {
        schedule.splice(lessonIndex, 1);
    }
}
