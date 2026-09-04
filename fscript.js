document.addEventListener('DOMContentLoaded', function() {
    // -------------------------------------------------------------
    // Mobile Navbar Toggle
    // -------------------------------------------------------------
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
    }

    document.addEventListener('click', function(event) {
        if (!navbarMenu || !navbarToggle) return;
        const isClickInsideMenu = navbarMenu.contains(event.target);
        const isClickOnToggle = navbarToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
        }
    });

    // -------------------------------------------------------------
    // Multi-Step Form Logic
    // -------------------------------------------------------------
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.stepper .step');
    const stepLines = document.querySelectorAll('.stepper .step-line');
    
    let currentStep = 0; // 0-indexed: 0 = Step 1, 1 = Step 2, 2 = Step 3, 3 = Step 4 (Review)

    function populateReview() {
        document.getElementById('review-name').textContent = document.getElementById('name').value || 'N/A';
        document.getElementById('review-membership-id').textContent = document.getElementById('membership-id').value || 'N/A';
        document.getElementById('review-email').textContent = document.getElementById('email').value || 'N/A';
        document.getElementById('review-phone').textContent = document.getElementById('phone').value || 'N/A';
        document.getElementById('review-programme').textContent = document.getElementById('programme').value || 'N/A';
        document.getElementById('review-year').textContent = document.getElementById('year').value || 'N/A';
        
        const inCommittee = document.getElementById('in-committee').value;
        document.getElementById('review-in-committee').textContent = inCommittee;
        
        const reviewCommitteeRow = document.getElementById('review-committee-row');
        if (inCommittee === 'Yes') {
            reviewCommitteeRow.style.display = 'flex';
            document.getElementById('review-committee').textContent = document.getElementById('committee').value || 'N/A';
        } else {
            reviewCommitteeRow.style.display = 'none';
        }
        
        document.getElementById('review-role').textContent = document.getElementById('role').value || 'N/A';
        document.getElementById('review-experience').textContent = document.getElementById('experience').value || 'N/A';
        document.getElementById('review-why-role').textContent = document.getElementById('why-role').value || 'N/A';
        document.getElementById('review-skills-vision').textContent = document.getElementById('skills-vision').value || 'N/A';
    }

    function updateStepUI() {
        // Populate review step fields when transitioned
        if (currentStep === 3) {
            populateReview();
        }

        // Toggle step blocks
        steps.forEach((step, idx) => {
            if (idx === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Toggle stepper indicator numbers and labels
        stepIndicators.forEach((indicator, idx) => {
            if (idx === currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else if (idx < currentStep) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('active');
                indicator.classList.remove('completed');
            }
        });

        // Toggle step divider lines
        stepLines.forEach((line, idx) => {
            if (idx < currentStep) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }

    // Validate inputs of the active step block
    function validateStep(stepIdx) {
        const stepContainer = steps[stepIdx];
        if (!stepContainer) return true;

        // Find all input, select, textarea elements in the current step
        const fields = stepContainer.querySelectorAll('input, select, textarea');
        let isValid = true;

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            
            // Check if the field is visible (ignore conditional inputs that are hidden)
            const isVisible = field.offsetWidth > 0 || field.offsetHeight > 0 || field.type === 'hidden';
            
            if (isVisible && !field.checkValidity()) {
                field.reportValidity();
                isValid = false;
                break; // Trigger validity popups one-by-one
            }
        }
        return isValid;
    }

    // Set up step navigation buttons
    const nextButtons = document.querySelectorAll('.next-button');
    const backButtons = document.querySelectorAll('.back-button');

    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStepUI();
                    window.scrollTo({ top: document.querySelector('.form-section').offsetTop - 90, behavior: 'smooth' });
                }
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                updateStepUI();
                window.scrollTo({ top: document.querySelector('.form-section').offsetTop - 90, behavior: 'smooth' });
            }
        });
    });

    // Initialize UI step state
    updateStepUI();

    // -------------------------------------------------------------
    // Toggle Group Button Logic (Yes/No buttons)
    // -------------------------------------------------------------
    const toggleGroups = document.querySelectorAll('.toggle-group');

    toggleGroups.forEach(group => {
        const buttons = group.querySelectorAll('.toggle-btn');
        const hiddenInput = group.querySelector('input[type="hidden"]');

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Clear active from all buttons in this group
                buttons.forEach(b => b.classList.remove('active'));
                
                // Add active to clicked button
                btn.classList.add('active');

                // Update hidden input value
                const value = btn.getAttribute('data-value');
                hiddenInput.value = value;
                
                // Fire a custom change event to trigger conditional formatting
                hiddenInput.dispatchEvent(new Event('change'));
            });
        });
    });

    // -------------------------------------------------------------
    // Conditional Field Logic (Are you in a committee? -> Yes)
    // -------------------------------------------------------------
    const inCommitteeInput = document.getElementById('in-committee');
    const committeeContainer = document.getElementById('committee-select-container');
    const committeeSelect = document.getElementById('committee');

    if (inCommitteeInput && committeeContainer && committeeSelect) {
        inCommitteeInput.addEventListener('change', function() {
            if (inCommitteeInput.value === 'Yes') {
                committeeContainer.classList.add('show');
                committeeSelect.setAttribute('required', 'required');
            } else {
                committeeContainer.classList.remove('show');
                committeeSelect.removeAttribute('required');
                committeeSelect.value = ''; // Reset value when hidden
            }
        });
    }

    // -------------------------------------------------------------
    // Form Submission Handling
    // -------------------------------------------------------------
    const form = document.getElementById('committeeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Final step validation
            if (!validateStep(currentStep)) return;

            const submitBtn = form.querySelector('.submit-button');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                mode: 'no-cors',   // required for cross-origin Apps Script requests
                body: formData
            })
            .then(function() {
                window.location.href = 'thank-you.html';
            })
            .catch(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                alert('Something went wrong. Please check your connection and try again.');
            });
        });
    }
});
