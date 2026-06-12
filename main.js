// Main Application Controller 
$(document).ready(function() {
    
    $('.nav-tab').click(function() {
        const tabName = $(this).data('tab');
        
       
        $('.nav-tab').removeClass('active');
        $(this).addClass('active');
        
      
        $('.app-section').removeClass('active');
        $(`#${tabName}`).addClass('active');
    });

    
    initializeApps();
});

function initializeApps() {
    // Initialize ToDo App (already handled in todo.js)
    // Initialize Appointment Scheduler (already handled in appointment.js)
    console.log('Task Manager & Scheduler initialized successfully');
}