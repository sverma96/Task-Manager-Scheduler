
class AppointmentScheduler {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.appointments = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.setMinDate();
    }

    bindEvents() {
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('registerBtn').addEventListener('click', () => this.handleRegister());
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
      
        document.getElementById('scheduleBtn').addEventListener('click', () => this.handleSchedule());
        
        document.querySelector('.appointments-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('appointment-delete')) {
                this.handleAppointmentDelete(e);
            } else if (e.target.classList.contains('appointment-edit')) {
                this.handleAppointmentReschedule(e);
            }
        });

      
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.which === 13) this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('Please enter both username and password!');
            return;
        }

        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.login(user);
        } else {
            alert('Invalid credentials! Please register first.');
        }
    }

    handleRegister() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('Please enter both username and password!');
            return;
        }

        if (this.users.find(u => u.username === username)) {
            alert('Username already exists!');
            return;
        }

        const user = { username, password };
        this.users.push(user);
        this.login(user);
    }

    handleLogout() {
        this.currentUser = null;
        document.querySelector('.auth-section').style.display = 'block';
        document.querySelector('.scheduler-content').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    login(user) {
        this.currentUser = user;
        document.querySelector('.auth-section').style.display = 'none';
        document.querySelector('.scheduler-content').style.display = 'block';
        document.getElementById('welcomeText').textContent = `Welcome, ${user.username}!`;
        this.renderAppointments();
    }

    handleSchedule() {
        if (!this.currentUser) return;

        const title = document.getElementById('appointmentTitle').value.trim();
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const notes = document.getElementById('appointmentNotes').value.trim();

        if (!title || !date || !time) {
            alert('Please fill in all required fields!');
            return;
        }

        
        const appointmentDateTime = new Date(`${date} ${time}`);
        if (appointmentDateTime < new Date()) {
            alert('Cannot schedule appointments in the past!');
            return;
        }

     
        const userAppointments = this.appointments.filter(apt => apt.user === this.currentUser.username);
        const hasConflict = userAppointments.some(apt => {
            const existingDateTime = new Date(`${apt.date} ${apt.time}`);
            const timeDiff = Math.abs(appointmentDateTime - existingDateTime);
            return timeDiff < 30 * 60 * 1000; 
        });

        if (hasConflict) {
            alert('Scheduling conflict! Another appointment exists within 30 minutes.');
            return;
        }

        // Create appointment
        const appointment = {
            id: Date.now(), // Simple ID generation
            title,
            date,
            time,
            notes,
            user: this.currentUser.username,
            status: 'scheduled'
        };

        this.appointments.push(appointment);
        this.clearForm();
        this.renderAppointments();
        this.showNotification(`Appointment "${title}" scheduled successfully!`);
    }

    handleAppointmentDelete(e) {
        const appointmentId = parseInt(e.target.dataset.id);
        
        if (confirm('Are you sure you want to cancel this appointment?')) {
            this.appointments = this.appointments.filter(apt => apt.id !== appointmentId);
            this.renderAppointments();
            this.showNotification('Appointment cancelled successfully!');
        }
    }

    handleAppointmentReschedule(e) {
        const appointmentId = parseInt(e.target.dataset.id);
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        
        if (appointment) {
           
            document.getElementById('appointmentTitle').value = appointment.title;
            document.getElementById('appointmentDate').value = appointment.date;
            document.getElementById('appointmentTime').value = appointment.time;
            document.getElementById('appointmentNotes').value = appointment.notes;
            
           
            this.appointments = this.appointments.filter(apt => apt.id !== appointmentId);
            this.renderAppointments();
            
            alert('Please select new date and time, then click Schedule Appointment.');
        }
    }

    renderAppointments() {
        const list = document.querySelector('.appointments-list');
        const userAppointments = this.appointments
            .filter(apt => apt.user === this.currentUser.username)
            .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
        
        if (userAppointments.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <h3>No appointments scheduled</h3>
                    <p>Schedule your first appointment above</p>
                </div>
            `;
            return;
        }

        list.innerHTML = '';
        userAppointments.forEach(apt => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.innerHTML = `
                <div class="appointment-title">${this.escapeHtml(apt.title)}</div>
                <div class="appointment-details">
                    <div class="detail-item">Date: <span class="detail-value">${this.formatDate(apt.date)}</span></div>
                    <div class="detail-item">Time: <span class="detail-value">${this.formatTime(apt.time)}</span></div>
                    <div class="detail-item">Status: <span class="detail-value">${apt.status}</span></div>
                </div>
                ${apt.notes ? `<p style="color: #7f8c8d; margin-bottom: 15px;">${this.escapeHtml(apt.notes)}</p>` : ''}
                <div class="todo-actions">
                    <button class="btn-small edit-btn appointment-edit" data-id="${apt.id}">Reschedule</button>
                    <button class="btn-small delete-btn appointment-delete" data-id="${apt.id}">Cancel</button>
                </div>
            `;
            list.appendChild(card);
        });
    }

    clearForm() {
        document.getElementById('appointmentTitle').value = '';
        document.getElementById('appointmentDate').value = '';
        document.getElementById('appointmentTime').value = '';
        document.getElementById('appointmentNotes').value = '';
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTime(timeStr) {
        const time = new Date(`1970-01-01 ${timeStr}`);
        return time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentDate').setAttribute('min', today);
    }

    showNotification(message) {
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('scheduler')) {
        window.appointmentScheduler = new AppointmentScheduler();
    }
});