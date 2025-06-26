let currentStep = 1;
const totalSteps = 6;

function showStep(step) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show current page
    document.getElementById(`page${step}`).classList.add('active');
    
    // Update page indicators
    document.querySelectorAll('.page-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === step);
    });
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = step === 1;
    document.getElementById('nextBtn').disabled = step === totalSteps;
    
    // Update step counter
    document.getElementById('currentStep').textContent = step;
    
    currentStep = step;
}

function changeStep(direction) {
    const newStep = currentStep + direction;
    if (newStep >= 1 && newStep <= totalSteps) {
        showStep(newStep);
    }
}

function showPreview() {
    const form = document.getElementById('itrForm');
    const formData = new FormData(form);
    const previewContent = document.getElementById('previewContent');
    const previewSection = document.getElementById('previewSection');
    
    let previewHTML = '';
    
    // Personal Information
    previewHTML += '<div class="preview-group">';
    previewHTML += '<h3>Personal Information</h3>';
    
    // PAN
    let pan = '';
    for(let i = 1; i <= 10; i++) {
        pan += formData.get(`pan${i}`) || '_';
    }
    if(pan !== '__________') {
        previewHTML += `<div class="preview-item"><span class="preview-label">PAN:</span><span class="preview-value">${pan}</span></div>`;
    }
    
    if(formData.get('firstName')) {
        previewHTML += `<div class="preview-item"><span class="preview-label">Name:</span><span class="preview-value">${formData.get('firstName')} ${formData.get('middleName') || ''} ${formData.get('lastName') || ''}</span></div>`;
    }
    
    // Date of Birth
    let dob = '';
    dob += (formData.get('dobD1') || '_') + (formData.get('dobD2') || '_') + '/';
    dob += (formData.get('dobM1') || '_') + (formData.get('dobM2') || '_') + '/';
    dob += (formData.get('dobY1') || '_') + (formData.get('dobY2') || '_') + (formData.get('dobY3') || '_') + (formData.get('dobY4') || '_');
    if(dob !== '__/__/____') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Date of Birth:</span><span class="preview-value">${dob}</span></div>`;
    }
    
    if(formData.get('aadhaar')) {
        previewHTML += `<div class="preview-item"><span class="preview-label">Aadhaar Number:</span><span class="preview-value">${formData.get('aadhaar')}</span></div>`;
    }
    
    if(formData.get('mobile')) {
        previewHTML += `<div class="preview-item"><span class="preview-label">Mobile:</span><span class="preview-value">${formData.get('mobile')}</span></div>`;
    }
    
    if(formData.get('email')) {
        previewHTML += `<div class="preview-item"><span class="preview-label">Email:</span><span class="preview-value">${formData.get('email')}</span></div>`;
    }
    
    previewHTML += '</div>';
    
    // Address Information
    let hasAddress = formData.get('flatNo') || formData.get('building') || formData.get('street') || formData.get('area') || formData.get('city') || formData.get('state') || formData.get('country') || formData.get('pincode');
    if(hasAddress) {
        previewHTML += '<div class="preview-group">';
        previewHTML += '<h3>Address</h3>';
        let address = '';
        if(formData.get('flatNo')) address += formData.get('flatNo') + ', ';
        if(formData.get('building')) address += formData.get('building') + ', ';
        if(formData.get('street')) address += formData.get('street') + ', ';
        if(formData.get('area')) address += formData.get('area') + ', ';
        if(formData.get('city')) address += formData.get('city') + ', ';
        if(formData.get('state')) address += formData.get('state') + ', ';
        if(formData.get('country')) address += formData.get('country') + ' - ';
        if(formData.get('pincode')) address += formData.get('pincode');
        previewHTML += `<div class="preview-item"><span class="preview-label">Complete Address:</span><span class="preview-value">${address}</span></div>`;
        previewHTML += '</div>';
    }
    
    // Income Information
    let hasIncome = false;
    previewHTML += '<div class="preview-group">';
    previewHTML += '<h3>Income Information</h3>';
    
    if(formData.get('grossSalary') && formData.get('grossSalary') !== '0') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Gross Salary:</span><span class="preview-value">₹${Number(formData.get('grossSalary')).toLocaleString('en-IN')}</span></div>`;
        hasIncome = true;
    }
    
    if(formData.get('incomeFromSalaries') && formData.get('incomeFromSalaries') !== '0') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Income from Salaries:</span><span class="preview-value">₹${Number(formData.get('incomeFromSalaries')).toLocaleString('en-IN')}</span></div>`;
        hasIncome = true;
    }
    
    if(formData.get('grossTotalIncome') && formData.get('grossTotalIncome') !== '0') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Gross Total Income:</span><span class="preview-value">₹${Number(formData.get('grossTotalIncome')).toLocaleString('en-IN')}</span></div>`;
        hasIncome = true;
    }
    
    if(!hasIncome) {
        previewHTML += '<div class="preview-item"><span class="preview-value">No income information filled</span></div>';
    }
    
    previewHTML += '</div>';
    
    // Tax Information
    let hasTax = false;
    previewHTML += '<div class="preview-group">';
    previewHTML += '<h3>Tax Computation</h3>';
    
    if(formData.get('taxPayable') && formData.get('taxPayable') !== '0') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Tax Payable:</span><span class="preview-value">₹${Number(formData.get('taxPayable')).toLocaleString('en-IN')}</span></div>`;
        hasTax = true;
    }
    
    if(formData.get('totalTaxCess') && formData.get('totalTaxCess') !== '0') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Total Tax and Cess:</span><span class="preview-value">₹${Number(formData.get('totalTaxCess')).toLocaleString('en-IN')}</span></div>`;
        hasTax = true;
    }
    
    if(formData.get('refund') && formData.get('refund') !== '0') {
        previewHTML += `<div class="preview-item"><span class="preview-label">Refund:</span><span class="preview-value">₹${Number(formData.get('refund')).toLocaleString('en-IN')}</span></div>`;
        hasTax = true;
    }
    
    if(!hasTax) {
        previewHTML += '<div class="preview-item"><span class="preview-value">No tax information filled</span></div>';
    }
    
    previewHTML += '</div>';
    
    if(previewHTML === '') {
        previewHTML = '<div class="preview-item"><span class="preview-value">No information has been filled in the form yet.</span></div>';
    }
    
    previewContent.innerHTML = previewHTML;
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

function hidePreview() {
    document.getElementById('previewSection').style.display = 'none';
}

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    showStep(1);
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && currentStep > 1) {
        changeStep(-1);
    } else if (e.key === 'ArrowRight' && currentStep < totalSteps) {
        changeStep(1);
    }
});

function showITRForm(regime) {
    document.getElementById("itrFormContainer").style.display = "block";
    document.getElementById("preFormGuidance").style.display = "none";

    // Optionally scroll to the form
    document.getElementById("itrFormContainer").scrollIntoView({ behavior: "smooth" });

    // You could also pre-set the regime toggle radio if needed
    if (regime === 'old') {
      const radio = document.getElementById('newTaxNo');
      if (radio) radio.checked = true;
    } else {
      const radio = document.getElementById('newTaxYes');
      if (radio) radio.checked = true;
    }
  }