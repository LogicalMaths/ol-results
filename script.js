/* ===================================
   O/L Results Form — Logic
   Province-District data, validation,
   and Google Sheets submission
   =================================== */

// =============================================
// CONFIGURATION — Update this after Apps Script
// =============================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrE--7ihTC9EgB0EEMvDUKwfePSvQeIFajvyutp0oU4RdsejcrOzSTmck4s9gs79UK/exec';
// ☝️ Replace with your deployed Google Apps Script Web App URL
// Example: 'https://script.google.com/macros/s/AKfyc.../exec'

// =============================================
// Province → District Data (Sri Lanka)
// =============================================
const PROVINCE_DISTRICT_MAP = {
  'බස්නාහිර පළාත (Western)': [
    'කොළඹ (Colombo)',
    'ගම්පහ (Gampaha)',
    'කළුතර (Kalutara)'
  ],
  'මධ්‍යම පළාත (Central)': [
    'මහනුවර (Kandy)',
    'මාතලේ (Matale)',
    'නුවරඑළිය (Nuwara Eliya)'
  ],
  'දකුණු පළාත (Southern)': [
    'ගාල්ල (Galle)',
    'මාතර (Matara)',
    'හම්බන්තොට (Hambantota)'
  ],
  'උතුරු පළාත (Northern)': [
    'යාපනය (Jaffna)',
    'කිලිනොච්චි (Kilinochchi)',
    'මුලතිව් (Mullaitivu)',
    'වවුනියා (Vavuniya)',
    'මන්නාරම (Mannar)'
  ],
  'නැගෙනහිර පළාත (Eastern)': [
    'බට්ටිකලෝවා (Batticaloa)',
    'අම්පාර (Ampara)',
    'ත්‍රිකුණාමලය (Trincomalee)'
  ],
  'වයඹ පළාත (North Western)': [
    'කුරුණෑගල (Kurunegala)',
    'පුත්තලම (Puttalam)'
  ],
  'උතුරු මැද පළාත (North Central)': [
    'අනුරාධපුර (Anuradhapura)',
    'පොළොන්නරුව (Polonnaruwa)'
  ],
  'ඌව පළාත (Uva)': [
    'බදුල්ල (Badulla)',
    'මොනරාගල (Monaragala)'
  ],
  'සබරගමුව පළාත (Sabaragamuwa)': [
    'රත්නපුර (Ratnapura)',
    'කෑගල්ල (Kegalle)'
  ]
};

// =============================================
// DOM Elements
// =============================================
const form = document.getElementById('resultsForm');
const submitBtn = document.getElementById('submitBtn');
const successOverlay = document.getElementById('successOverlay');
const successCloseBtn = document.getElementById('successCloseBtn');
const confettiContainer = document.getElementById('confettiContainer');
const toast = document.getElementById('toast');

// Form fields
const fields = {
  studentName: document.getElementById('studentName'),
  school: document.getElementById('school'),
  indexNumber: document.getElementById('indexNumber'),
  province: document.getElementById('province'),
  district: document.getElementById('district'),
  whatsapp: document.getElementById('whatsapp'),
  comments: document.getElementById('comments')
};

// Error elements
const errors = {
  studentName: document.getElementById('studentNameError'),
  school: document.getElementById('schoolError'),
  indexNumber: document.getElementById('indexNumberError'),
  grade: document.getElementById('gradeError'),
  province: document.getElementById('provinceError'),
  district: document.getElementById('districtError'),
  whatsapp: document.getElementById('whatsappError')
};

// =============================================
// Initialize
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  populateProvinces();
  setupProvinceChangeHandler();
  setupPhoneFormatting();
  setupRealTimeValidation();
});

// =============================================
// Province & District Dropdowns
// =============================================
function populateProvinces() {
  const provinceSelect = fields.province;
  Object.keys(PROVINCE_DISTRICT_MAP).forEach(province => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });
}

function setupProvinceChangeHandler() {
  fields.province.addEventListener('change', () => {
    const selectedProvince = fields.province.value;
    const districtSelect = fields.district;

    // Clear districts
    districtSelect.innerHTML = '<option value="" disabled selected>දිස්ත්‍රික්කය තෝරන්න</option>';

    if (selectedProvince && PROVINCE_DISTRICT_MAP[selectedProvince]) {
      districtSelect.disabled = false;
      PROVINCE_DISTRICT_MAP[selectedProvince].forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    } else {
      districtSelect.disabled = true;
    }

    // Clear province error
    clearFieldError('province');
  });
}

// =============================================
// Phone Number Formatting
// =============================================
function setupPhoneFormatting() {
  fields.whatsapp.addEventListener('input', (e) => {
    // Remove non-digits
    let value = e.target.value.replace(/\D/g, '');

    // Limit to 9 digits
    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    // Format: 7X XXX XXXX
    if (value.length > 2 && value.length <= 5) {
      value = value.substring(0, 2) + ' ' + value.substring(2);
    } else if (value.length > 5) {
      value = value.substring(0, 2) + ' ' + value.substring(2, 5) + ' ' + value.substring(5);
    }

    e.target.value = value;
  });
}

// =============================================
// Real-time Validation (clear errors on input)
// =============================================
function setupRealTimeValidation() {
  // Text inputs — clear error when typing
  ['studentName', 'school', 'indexNumber', 'whatsapp'].forEach(fieldName => {
    fields[fieldName].addEventListener('input', () => {
      clearFieldError(fieldName);
      fields[fieldName].classList.remove('error');
    });
  });

  // Dropdowns — clear error on change
  ['province', 'district'].forEach(fieldName => {
    fields[fieldName].addEventListener('change', () => {
      clearFieldError(fieldName);
      fields[fieldName].classList.remove('error');
    });
  });

  // Grade cards — clear error when selected
  document.querySelectorAll('input[name="grade"]').forEach(radio => {
    radio.addEventListener('change', () => {
      clearFieldError('grade');
      document.getElementById('gradeCards').classList.remove('error');
    });
  });
}

function clearFieldError(fieldName) {
  if (errors[fieldName]) {
    errors[fieldName].classList.remove('visible');
  }
}

function showFieldError(fieldName) {
  if (errors[fieldName]) {
    errors[fieldName].classList.add('visible');
  }
}

// =============================================
// Form Validation
// =============================================
function validateForm() {
  let isValid = true;

  // Name
  if (!fields.studentName.value.trim()) {
    showFieldError('studentName');
    fields.studentName.classList.add('error');
    isValid = false;
  }

  // School
  if (!fields.school.value.trim()) {
    showFieldError('school');
    fields.school.classList.add('error');
    isValid = false;
  }

  // Index Number
  if (!fields.indexNumber.value.trim()) {
    showFieldError('indexNumber');
    fields.indexNumber.classList.add('error');
    isValid = false;
  }

  // Grade
  const selectedGrade = document.querySelector('input[name="grade"]:checked');
  if (!selectedGrade) {
    showFieldError('grade');
    document.getElementById('gradeCards').classList.add('error');
    isValid = false;
  }

  // Province
  if (!fields.province.value) {
    showFieldError('province');
    fields.province.classList.add('error');
    isValid = false;
  }

  // District
  if (!fields.district.value) {
    showFieldError('district');
    fields.district.classList.add('error');
    isValid = false;
  }

  // WhatsApp — must be 9 digits (after removing formatting)
  const phoneDigits = fields.whatsapp.value.replace(/\D/g, '');
  if (!phoneDigits || phoneDigits.length !== 9 || !phoneDigits.startsWith('7')) {
    showFieldError('whatsapp');
    fields.whatsapp.classList.add('error');
    isValid = false;
  }

  // Scroll to first error
  if (!isValid) {
    const firstError = document.querySelector('.form-error.visible');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return isValid;
}

// =============================================
// Form Submission
// =============================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Collect data
  const selectedGrade = document.querySelector('input[name="grade"]:checked');
  const formData = {
    timestamp: new Date().toLocaleString('si-LK', { timeZone: 'Asia/Colombo' }),
    name: fields.studentName.value.trim(),
    school: fields.school.value.trim(),
    indexNumber: fields.indexNumber.value.trim(),
    grade: selectedGrade.value,
    province: fields.province.value,
    district: fields.district.value,
    whatsapp: "'" + '+94 ' + fields.whatsapp.value,
    comments: fields.comments.value.trim()
  };

  // Set loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    // Check if Apps Script URL is configured
    if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
      // Demo mode — simulate success after 1.5s
      console.log('📋 Form Data (Demo Mode):', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess();
      return;
    }

    // Submit to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    // With no-cors, we can't read the response, but if fetch didn't throw, it was sent
    showSuccess();

  } catch (error) {
    console.error('Submission error:', error);
    showToast('⚠️ ඉදිරිපත් කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.');
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

// =============================================
// Success State
// =============================================
function showSuccess() {
  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;

  successOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
  launchConfetti();
}

successCloseBtn.addEventListener('click', () => {
  successOverlay.classList.remove('visible');
  document.body.style.overflow = '';
  confettiContainer.innerHTML = '';
  form.reset();

  // Reset district dropdown
  fields.district.innerHTML = '<option value="" disabled selected>මුලින්ම පළාත තෝරන්න</option>';
  fields.district.disabled = true;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// Confetti Animation
// =============================================
function launchConfetti() {
  const colors = [
    'hsl(145, 65%, 45%)',
    'hsl(252, 70%, 55%)',
    'hsl(280, 70%, 60%)',
    'hsl(45, 80%, 50%)',
    'hsl(210, 70%, 55%)',
    'hsl(0, 70%, 55%)',
    '#fff'
  ];

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.width = (Math.random() * 8 + 4) + 'px';
    confetti.style.height = (Math.random() * 8 + 4) + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = (Math.random() * 1.5) + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confettiContainer.appendChild(confetti);
  }

  // Cleanup after animation
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 5000);
}

// =============================================
// Toast Notification
// =============================================
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}
