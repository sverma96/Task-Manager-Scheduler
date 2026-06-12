
class TodoApp {
    constructor() {
        this.todos = ['Complete project documentation', 'Review code changes', 'Prepare presentation slides'];
        this.editingIndex = -1;
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        
        document.querySelector('.add-btn').addEventListener('click', () => this.handleAdd());
        
       
        document.querySelector('.todo-input').addEventListener('keypress', (e) => {
            if (e.which === 13) this.handleAdd();
        });

       
        document.querySelector('.todo-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn') && !e.target.classList.contains('appointment-delete')) {
                this.handleDelete(e);
            } else if (e.target.classList.contains('edit-btn') && !e.target.classList.contains('appointment-edit')) {
                this.handleEdit(e);
            } else if (e.target.classList.contains('todo-text')) {
                this.handleClickDelete(e);
            }
        });
    }

    handleAdd() {
        const input = document.querySelector('.todo-input');
        const text = input.value.trim();
        
        if (!text) return;

        if (this.editingIndex >= 0) {
            
            this.todos[this.editingIndex] = text;
            this.editingIndex = -1;
            document.querySelector('.add-btn').textContent = 'ADD';
        } else {
            
            this.todos.push(text);
        }

        input.value = '';
        this.render();
    }

    handleDelete(e) {
        const index = this.getItemIndex(e.target);
        this.todos.splice(index, 1);
        this.render();
    }

    handleEdit(e) {
        const index = this.getItemIndex(e.target);
        const input = document.querySelector('.todo-input');
        
        input.value = this.todos[index];
        document.querySelector('.add-btn').textContent = 'UPDATE';
        this.editingIndex = index;
        input.focus();
    }

    handleClickDelete(e) {
        const index = this.getItemIndex(e.target);
        this.todos.splice(index, 1);
        this.render();
    }

    getItemIndex(element) {
        const todoItem = element.closest('.todo-item');
        return Array.from(todoItem.parentNode.children).indexOf(todoItem);
    }

    render() {
        const list = document.querySelector('.todo-list');
        list.innerHTML = '';

        this.todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            todoItem.innerHTML = `
                <span class="todo-text">${this.escapeHtml(todo)}</span>
                <div class="todo-actions">
                    <button class="btn-small edit-btn">Edit</button>
                    <button class="btn-small delete-btn">Delete</button>
                </div>
            `;
            list.appendChild(todoItem);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.todo-list')) {
        window.todoApp = new TodoApp();
    }
});