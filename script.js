// Sample course data
const courses = [
    { id: 1, title: "JavaScript Basics", progress: 0, subtopics: [] },
    { id: 2, title: "HTML & CSS", progress: 0, subtopics: [] },
    { id: 3, title: "React.js", progress: 0, subtopics: [] },
];

// Load courses from local storage
function loadCourses() {
    const savedCourses = JSON.parse(localStorage.getItem('courses'));
    if (savedCourses) {
        return savedCourses;
    }
    return courses; // Return default courses if none are saved
}

// Save courses to local storage
function saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Render courses to the dashboard
function renderCourses() {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; // Clear existing courses

    const loadedCourses = loadCourses();
    loadedCourses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-card' + (course.progress === 100 ? ' completed' : '');
        courseDiv.innerHTML = `
            <h5>${course.title}</h5>
            <p>Progress: ${course.progress}%</p>
            <input type="number" min="0" max="100" value="${course.progress}" class="form-control" onchange="updateProgress(${course.id}, this.value)">
            <button class="btn btn-danger mt-2" onclick="removeCourse(${course.id})">Remove</button>
            <div class="subtopic">
                <h6>Subtopics</h6>
                <input type="text" id="subtopic-input-${course.id}" placeholder="Add Subtopic" class="form-control">
                <button class="btn btn-primary mt-2" onclick="addSubtopic(${course.id})">Add Subtopic</button>
                <ul id="subtopic-list-${course.id}"></ul>
            </div>
        `;
        courseList.appendChild(courseDiv);
        renderSubtopics(course.id); // Render existing subtopics
    });
}

// Update course progress
function updateProgress(courseId, progress) {
    const loadedCourses = loadCourses();
    const course = loadedCourses.find(c => c.id === courseId);
    if (course) {
        course.progress = parseInt(progress);
        saveCourses(loadedCourses);
        renderCourses(); // Re-render courses to reflect changes
    }
}

// Remove a course
function removeCourse(courseId) {
    const loadedCourses = loadCourses();
    const updatedCourses = loadedCourses.filter(c => c.id !== courseId);
    saveCourses(updatedCourses);
    renderCourses(); // Re-render courses after removal
}

// Add a subtopic to a course
function addSubtopic(courseId) {
    const subtopicInput = document.getElementById(`subtopic-input-${courseId}`);
    const subtopicText = subtopicInput.value.trim();
    if (subtopicText) {
        const loadedCourses = loadCourses();
        const course = loadedCourses.find(c => c.id === courseId);
        if (course) {
            course.subtopics.push({ title: subtopicText, completed: false });
            saveCourses(loadedCourses);
            subtopicInput.value = ''; // Clear input
            renderSubtopics(courseId); // Re-render subtopics
            updateCourseProgress(courseId); // Update course progress
        }
    }
}

// Render subtopics for a specific course
function renderSubtopics(courseId) {
    const loadedCourses = loadCourses();
    const course = loadedCourses.find(c => c.id === courseId);
    const subtopicList = document.getElementById(`subtopic-list-${courseId}`);
    subtopicList.innerHTML = ''; // Clear existing subtopics

    if (course && course.subtopics.length > 0) {
        course.subtopics.forEach((subtopic, index) => {
            const subtopicItem = document.createElement('li');
            subtopicItem.innerHTML = `
                <span style="text-decoration: ${subtopic.completed ? 'line-through' : 'none'};">${subtopic.title}</span>
                <button class="btn btn-warning btn-sm" onclick="toggleSubtopic(${courseId}, ${index})">${subtopic.completed ? 'Undo' : 'Complete'}</button>
                <button class="btn btn-danger btn-sm" onclick="removeSubtopic(${courseId}, ${index})">Remove</button>
            `;
            subtopicList.appendChild(subtopicItem);
        });
    }
}

// Toggle subtopic completion status
function toggleSubtopic(courseId, subtopicIndex) {
    const loadedCourses = loadCourses();
    const course = loadedCourses.find(c => c.id === courseId);
    if (course && course.subtopics[subtopicIndex]) {
        course.subtopics[subtopicIndex].completed = !course.subtopics[subtopicIndex].completed;
        saveCourses(loadedCourses);
        renderSubtopics(courseId); // Re-render subtopics to reflect changes
        updateCourseProgress(courseId); // Update course progress
    }
}

// Remove a subtopic
function removeSubtopic(courseId, subtopicIndex) {
    const loadedCourses = loadCourses();
    const course = loadedCourses.find(c => c.id === courseId);
    if (course) {
        course.subtopics.splice(subtopicIndex, 1); // Remove subtopic
        saveCourses(loadedCourses);
        renderSubtopics(courseId); // Re-render subtopics after removal
        updateCourseProgress(courseId); // Update course progress
    }
}

// Update course progress based on subtopics
function updateCourseProgress(courseId) {
    const loadedCourses = loadCourses();
    const course = loadedCourses.find(c => c.id === courseId);
    if (course) {
        const totalSubtopics = course.subtopics.length;
        const completedSubtopics = course.subtopics.filter(subtopic => subtopic.completed).length;
        course.progress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0; // Calculate progress
        saveCourses(loadedCourses);
        renderCourses(); // Re-render courses to reflect updated progress
    }
}

// Add new course
document.getElementById('add-course').addEventListener('click', () => {
    const newCourseTitle = document.getElementById('new-course-title').value.trim();
    if (newCourseTitle) {
        const loadedCourses = loadCourses();
        const newCourse = { id: loadedCourses.length + 1, title: newCourseTitle, progress: 0, subtopics: [] };
        loadedCourses.push(newCourse);
        saveCourses(loadedCourses);
        document.getElementById('new-course-title').value = ''; // Clear input
        renderCourses(); // Re-render courses
    }
});

// Initial render
renderCourses();