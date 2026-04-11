const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxV8SUpbEi7UcveKyw5onvGiHVQpJbjwHM_AHc3cFXtDnczh0fTsltCfoXaX9dt7fcM/exec';

const STATE_LIST = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman & Nicobar Islands', 'Chandigarh', 'Delhi (NCT)', 
  'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Other country'
];

const DOMAIN_OPTIONS = [
  'Android App Development', 'Full Stack Web Development', 'Data Science', 'Data Analytics', 
  'Machine Learning', 'Artificial Intelligence', 'Cyber Security', 'IoT / Robotics', 
  'Cloud Computing', 'Graphic Design', 'AutoCAD', 'UI/UX Design', 'Embedded Systems', 'Digital Marketing',
  'Finance', 'Stock Market', 'Human Resource', 'Business Analytics', 'DevOps', 'VLSI'
];

const LANG_OPTIONS = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi'];

let submitting = false;

document.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById('state');
  if (stateSelect) {
    STATE_LIST.forEach(st => {
      stateSelect.innerHTML += `<option value="${st}">${st}</option>`;
    });
  }

  const domainGrid = document.getElementById('domain-grid');
  if (domainGrid) {
    DOMAIN_OPTIONS.forEach(d => {
      domainGrid.innerHTML += `
        <label class="cb-item">
          <input type="radio" name="domain" value="${d}">
          <span class="cb-box-radio"></span>
          <span class="cb-lbl-lg">${d}</span>
        </label>`;
    });
  }

  const langGrid = document.getElementById('lang-grid');
  if (langGrid) {
    LANG_OPTIONS.forEach(l => {
      langGrid.innerHTML += `
        <label class="cb-item">
          <input type="checkbox" name="lang" value="${l}">
          <span class="cb-box-check"></span>
          <span class="cb-lbl-lg">${l}</span>
        </label>`;
    });
  }
});

let toastTimeout;
function triggerToast(msg) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.remove('hide');
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
  }, 3500);
}

function getFormData() {
  const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const getChecked = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(e => e.value);

  const domainInput = document.querySelector('input[name="domain"]:checked');
  const consentInput = document.getElementById('consent');
  
  return {
    fullName: getVal('fullName'),
    phone: getVal('phone'),
    whatsapp: getVal('whatsapp'),
    collegeEmail: getVal('collegeEmail'),
    personalEmail: getVal('personalEmail'),
    state: getVal('state'),
    college: getVal('college'),
    branch: getVal('branch'),
    year: getVal('year'),
    crContact: getVal('crContact'),
    domain: domainInput ? domainInput.value : '',
    langs: getChecked('lang'),
    consent: consentInput ? consentInput.checked : false
  };
}

function validateAll() {
  const data = getFormData();
  const failStep = (label) => { triggerToast(`Please enter your ${label}.`); return false; };
  
  if (!data.fullName) return failStep('full name');
  if (!data.phone) return failStep('phone number');
  if (!data.whatsapp) return failStep('WhatsApp number');
  if (!data.collegeEmail) return failStep('college email');
  if (!data.personalEmail) return failStep('personal email');
  if (!data.state) return failStep('state');
  if (!data.college) return failStep('college name');
  if (!data.branch) return failStep('branch / stream');
  if (!data.year) return failStep('year of study');
  
  if (!data.domain) { triggerToast('Please select one domain to upskill in.'); return false; }
  if (data.langs.length === 0) { triggerToast('Please select at least one preferred language.'); return false; }
  if (!data.consent) { triggerToast('Please confirm your details by ticking the box at the end.'); return false; }
  
  return true;
}

function launchConfetti() {
  const cols = ['#6a71ff', '#1fb460', '#ffad29', '#00CFFF', '#C4B5FD', '#1a1f3a'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const s = Math.random() * 10 + 4;
    el.style.position = 'fixed';
    el.style.width = s + 'px';
    el.style.height = s + 'px';
    el.style.background = cols[Math.floor(Math.random() * cols.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-12px';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    el.style.animation = `cfall ${1.6 + Math.random() * 2.4}s ${Math.random() * 0.7}s ease-in forwards`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes cfall{to{transform:translateY(112vh) rotate(720deg);opacity:0}}`;
document.head.appendChild(style);

async function doSubmit() {
  if (!validateAll()) return;

  const data = getFormData();
  submitting = true;
  document.getElementById('btn-submit').innerText = 'Submitting...';
  document.getElementById('btn-submit').disabled = true;

  const payload = {
    studentName: data.fullName,
    studentEmail: data.collegeEmail,
    personalEmail: data.personalEmail,
    phone: data.phone,
    whatsapp: data.whatsapp,
    collegeName: data.college,
    branchName: data.branch,
    yearOfStudy: data.year,
    domain: data.domain,
    languages: data.langs,
    collegeState: data.state,
    crContact: data.crContact,
    chargesAgreed: data.consent
  };

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    
    document.getElementById('main-form-wrapper').style.display = 'none';
    const successScreen = document.getElementById('success-screen');
    successScreen.style.display = 'block';
    
    successScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    launchConfetti();

  } catch (err) {
    triggerToast('Server Connection Failed. Please try again.');
    document.getElementById('btn-submit').innerText = '🚀 Submit Application — Secure My Seat';
    document.getElementById('btn-submit').disabled = false;
  } finally {
    submitting = false;
  }
}
