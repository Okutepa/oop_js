// main.js
import { Task, ProjectTask } from './modules/task.js';
import { gsap } from 'gsap';

// Import the images directly
import placeholderImage from '../images/inkspire.png';
import webRedesignImage from '../images/web-redesign.png';
import amapianoImage from '../images/amapiano.png';

// Task and Project data
let tasks = [
    new Task("Design Logo", "In Progress"),
    new Task("Write Blog Post", "Completed")
];

let projectTasks = [
    new ProjectTask("Inkspire Tattoo", "Tattoo Branding", placeholderImage),
    new ProjectTask("Web Redesign", "Web Redesign", webRedesignImage),
    new ProjectTask("Amapiano Jamming", "Amapiano", amapianoImage),
    new ProjectTask("Amapiano Jamming", "Amapiano", amapianoImage),
];

projectTasks.forEach(project => {
    console.log('Loading image:', project.image);
});

// Render tasks
function renderTasks() {
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = `
        <div class="add-task-btn">
            <i class="fas fa-plus"></i>
        </div>
    `;

    tasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-tasks"></i>
                    <span>Task</span>
                </div>
                <i class="fas fa-arrow-right"></i>
            </div>
            <div class="card-body">
                <div class="card-title">${task.title}</div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="${task.status === 'In Progress' ? 'progress-green' : ''}"></div>
                    </div>
                    <div class="progress-bar">
                        <div class="${task.status === 'Completed' ? 'progress-blue' : ''}"></div>
                    </div>
                </div>
                <div class="progress-legend">
                    <div class="legend-item">
                        <div class="legend-dot dot-green"></div>
                        <span>In Work</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot dot-blue"></div>
                        <span>Completed</span>
                    </div>
                </div>
            </div>
            <button class="delete-task">Delete</button>
        `;
        // Add status toggle on card click
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-task')) return; // Ignore clicks on the delete button
            task.status = task.status === 'In Progress' ? 'Completed' : 'In Progress';
            renderTasks();
            updateStats(); // Update stats after status change
        });
        card.querySelector('.delete-task').addEventListener('click', (e) => {
            e.stopPropagation();
            gsap.to(card, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    tasks.splice(index, 1);
                    renderTasks();
                    updateStats(); // Update stats after deleting a task
                }
            });
        });
        cardsContainer.appendChild(card);
    });

    // Reattach the event listener to the new add-task-btn
    const addTaskBtn = document.querySelector('.add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const newTaskTitleInput = document.getElementById('new-task-title');
    const submitTaskBtn = document.getElementById('submit-task');
    const cancelTaskBtn = document.getElementById('cancel-task');

    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
        gsap.from('.modal-content', {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    cancelTaskBtn.addEventListener('click', () => {
        gsap.to('.modal-content', {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                taskModal.style.display = 'none';
                newTaskTitleInput.value = '';
            }
        });
    });

    submitTaskBtn.addEventListener('click', () => {
        const title = newTaskTitleInput.value.trim();
        if (title) {
            const newTask = new Task(title, "In Progress");
            tasks.push(newTask);
            gsap.to('.modal-content', {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    taskModal.style.display = 'none';
                    newTaskTitleInput.value = '';
                    renderTasks();
                    updateStats(); // Update stats after adding a task
                }
            });
        }
    });

    gsap.from('.card', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    });
}

// Render projects (static, with click to view details)
function renderProjects() {
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.innerHTML = '';
    projectTasks.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
            </div>
            <div class="project-content">
                <div class="project-date">2 weeks ago</div>
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.getProjectDetails()}</div>
                <div class="project-progress">
                    <div class="project-progress-bar"></div>
                </div>
            </div>
        `;
        projectCard.addEventListener('click', () => {
            alert(project.getProjectDetails());
        });
        projectsContainer.appendChild(projectCard);
    });

    // GSAP animation for projects
    gsap.from('.project-card', {
        opacity: 0,
        x: 50,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out"
    });

    // Update statistics after rendering projects
    updateStats();
}

// Update dashboard statistics
function updateStats() {
    // Calculate statistics
    const totalTasks = tasks.length;
    const tasksInProgress = tasks.filter(task => task.status === 'In Progress').length;
    const tasksCompleted = tasks.filter(task => task.status === 'Completed').length;
    const totalProjects = projectTasks.length;

    // Update DOM elements
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('tasks-in-progress').textContent = tasksInProgress;
    document.getElementById('tasks-completed').textContent = tasksCompleted;
    document.getElementById('total-projects').textContent = totalProjects;
}

// Sidebar toggle and navigation
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navItems = document.querySelectorAll('.nav-item');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        gsap.fromTo(sidebar, { x: "-100%" }, { x: 0, duration: 0.5, ease: "power2.out" });
    } else {
        gsap.to(sidebar, { x: "-100%", duration: 0.5, ease: "power2.in" });
    }
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    gsap.to(sidebar, { x: "-100%", duration: 0.5, ease: "power2.in" });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
});

// Add click event listener to nav items
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        navItems.forEach(nav => nav.classList.remove('active')); // Remove active class from all items
        item.classList.add('active'); // Add active class to clicked item
    });
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    renderProjects();
    updateStats(); // Initial stats update
});