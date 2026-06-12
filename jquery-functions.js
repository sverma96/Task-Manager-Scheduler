
$(document).ready(function() {
    
    initializeJQueryEnhancements();
});

function initializeJQueryEnhancements() {
    
    $('.nav-tab').click(function() {
        const $this = $(this);
        const tabName = $this.data('tab');
        
       
        $('.app-section.active').fadeOut(200, function() {
            $(this).removeClass('active');
            $(`#${tabName}`).fadeIn(300).addClass('active');
        });
    });

    
    setupFormValidation();
    
    
    setupAutoSave();
    
    
    setupKeyboardShortcuts();
    
    
    setupNotificationSystem();
}

function setupFormValidation() {
   
    $('.todo-input').on('input', function() {
        const $input = $(this);
        const value = $input.val().trim();
        
        if (value.length > 80) {
            $input.addClass('warning');
            showValidationMessage('Task is getting long. Consider breaking it down.', 'warning');
        } else {
            $input.removeClass('warning');
        }
    });

    
    $('#appointmentTitle').on('blur', function() {
        const $input = $(this);
        if ($input.val().trim().length < 3) {
            $input.addClass('error');
            showValidationMessage('Title should be at least 3 characters long.', 'error');
        } else {
            $input.removeClass('error');
        }
    });

    
    $('#appointmentDate').on('change', function() {
        const selectedDate = new Date($(this).val());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            $(this).addClass('error');
            showValidationMessage('Cannot schedule appointments in the past.', 'error');
        } else {
            $(this).removeClass('error');
        }
    });
}

function setupAutoSave() {
    
    let autoSaveTimeout;
    
    $(document).on('change', '.todo-input', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            if (typeof(Storage) !== "undefined" && window.todoApp) {
                try {
                    localStorage.setItem('todoList', JSON.stringify(window.todoApp.todos));
                    showMiniNotification('Draft saved', 'info');
                } catch (e) {
                    console.log('LocalStorage not available');
                }
            }
        }, 1000);
    });

    
    if (typeof(Storage) !== "undefined") {
        try {
            const savedTodos = localStorage.getItem('todoList');
            if (savedTodos && window.todoApp) {
                const todos = JSON.parse(savedTodos);
                if (todos.length > 0) {
                    window.todoApp.todos = todos;
                    window.todoApp.render();
                    showMiniNotification('Previous tasks restored', 'success');
                }
            }
        } catch (e) {
            console.log('Could not load saved todos');
        }
    }
}

function setupKeyboardShortcuts() {
   
    $(document).keydown(function(e) {
        
        if ((e.ctrlKey || e.metaKey) && e.which === 49) {
            e.preventDefault();
            $('.nav-tab[data-tab="todo"]').click();
            $('.todo-input').focus();
        }
        
       
        if ((e.ctrlKey || e.metaKey) && e.which === 50) {
            e.preventDefault();
            $('.nav-tab[data-tab="scheduler"]').click();
        }
        
       
        if (e.which === 27) {
            $('.todo-input, #appointmentTitle').val('').blur();
        }
    });

    
    $('#todo').on('keydown', function(e) {
      
        if ((e.ctrlKey || e.metaKey) && e.which === 13) {
            e.preventDefault();
            $('.add-btn').click();
        }
    });
}

function setupNotificationSystem() {
   
    window.notificationQueue = [];
    
   
    setInterval(() => {
        if (window.notificationQueue.length > 0) {
            const notification = window.notificationQueue.shift();
            displayEnhancedNotification(notification.message, notification.type);
        }
    }, 500);
}

function showValidationMessage(message, type) {
    
    $('.validation-message').remove();
    
    
    const $message = $(`<div class="validation-message ${type}">${message}</div>`);
    $message.css({
        'position': 'fixed',
        'top': '10px',
        'left': '50%',
        'transform': 'translateX(-50%)',
        'background': type === 'error' ? '#e74c3c' : '#f39c12',
        'color': 'white',
        'padding': '10px 20px',
        'border-radius': '5px',
        'z-index': '1001',
        'font-size': '14px',
        'box-shadow': '0 2px 10px rgba(0,0,0,0.2)'
    });
    
    $('body').append($message);
    
   
    setTimeout(() => {
        $message.fadeOut(() => $message.remove());
    }, 3000);
}

function showMiniNotification(message, type) {
    const $notification = $(`<div class="mini-notification">${message}</div>`);
    $notification.css({
        'position': 'fixed',
        'bottom': '20px',
        'left': '20px',
        'background': type === 'success' ? '#27ae60' : '#3498db',
        'color': 'white',
        'padding': '8px 15px',
        'border-radius': '20px',
        'font-size': '12px',
        'z-index': '1000',
        'opacity': '0',
        'transform': 'translateY(20px)',
        'transition': 'all 0.3s ease'
    });
    
    $('body').append($notification);
    
    
    setTimeout(() => {
        $notification.css({
            'opacity': '1',
            'transform': 'translateY(0)'
        });
    }, 100);
    
    
    setTimeout(() => {
        $notification.css({
            'opacity': '0',
            'transform': 'translateY(-20px)'
        });
        setTimeout(() => $notification.remove(), 300);
    }, 2000);
}

function displayEnhancedNotification(message, type = 'info') {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    
    const $notification = $(`
        <div class="enhanced-notification">
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        </div>
    `);
    
    $notification.css({
        'position': 'fixed',
        'top': '20px',
        'right': '20px',
        'background': colors[type] || colors.info,
        'color': 'white',
        'padding': '15px 20px',
        'border-radius': '8px',
        'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
        'z-index': '1002',
        'display': 'flex',
        'align-items': 'center',
        'gap': '15px',
        'max-width': '300px',
        'opacity': '0',
        'transform': 'translateX(100%)',
        'transition': 'all 0.3s ease'
    });
    
    $notification.find('.close-btn').css({
        'background': 'none',
        'border': 'none',
        'color': 'white',
        'font-size': '18px',
        'cursor': 'pointer',
        'padding': '0',
        'margin': '0'
    });
    
    $('body').append($notification);
    
   
    setTimeout(() => {
        $notification.css({
            'opacity': '1',
            'transform': 'translateX(0)'
        });
    }, 100);
    
  
    $notification.find('.close-btn').click(() => {
        $notification.css({
            'opacity': '0',
            'transform': 'translateX(100%)'
        });
        setTimeout(() => $notification.remove(), 300);
    });
    
  
    setTimeout(() => {
        if ($notification.parent().length) {
            $notification.css({
                'opacity': '0',
                'transform': 'translateX(100%)'
            });
            setTimeout(() => $notification.remove(), 300);
        }
    }, 4000);
}


function queueNotification(message, type = 'info') {
    window.notificationQueue.push({ message, type });
}


$('<style>').text(`
    .validation-message {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    .form-input.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .form-input.warning {
        border-color: #f39c12 !important;
        box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1) !important;
    }
    
    .todo-input.warning {
        border-color: #f39c12 !important;
        box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1) !important;
    }
`).appendTo('head');