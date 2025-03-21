// task.js
export class Task {
    constructor(title, status) {
        this.title = title;
        this.status = status;
    }
}

export class ProjectTask {
    constructor(title, description, image) {
        this.title = title;
        this.description = description;
        this.image = image;
    }

    getProjectDetails() {
        return this.description;
    }
}