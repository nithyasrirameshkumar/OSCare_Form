
// const PATIENT_DOCTORS = [
//   { id: 1, name: 'Dr. Nisha Rao', department: 'Cardiology', slots: ['08:30', '11:00', '15:30'] },
//   { id: 2, name: 'Dr. Arun Mehta', department: 'Neurology', slots: ['09:00', '14:00'] },
//   { id: 3, name: 'Dr. Martin Cole', department: 'Orthopedics', slots: ['10:00', '13:00'] },
//   { id: 4, name: 'Dr. Priya Shah', department: 'General Medicine', slots: ['07:30', '12:30', '16:00'] }
// ];

// function getPatientState() {
//   const stored = localStorage.getItem(PATIENT_STORAGE_KEY);
//   if (!stored) {
//     const seeded = {
//       patients: [],
//       appointments: [],
//       doctors: PATIENT_DOCTORS,
//       notifications: [],
//       recentActivity: [],
//       calendar: [],
//       queue: []
//     };
//     localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(seeded));
//     return seeded;
//   }
//   try {
//     const parsed = JSON.parse(stored);
//     parsed.patients = Array.isArray(parsed.patients) ? parsed.patients : [];
//     parsed.appointments = Array.isArray(parsed.appointments) ? parsed.appointments : [];
//     parsed.doctors = Array.isArray(parsed.doctors) && parsed.doctors.length ? parsed.doctors : PATIENT_DOCTORS;
//     parsed.notifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
//     parsed.recentActivity = Array.isArray(parsed.recentActivity) ? parsed.recentActivity : [];
//     parsed.calendar = Array.isArray(parsed.calendar) ? parsed.calendar : [];
//     parsed.queue = Array.isArray(parsed.queue) ? parsed.queue : [];
//     return parsed;
//   } catch (error) {
//     const seeded = {
//       patients: [],
//       appointments: [],
//       doctors: PATIENT_DOCTORS,
//       notifications: [],
//       recentActivity: [],
//       calendar: [],
//       queue: []
//     };
//     localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(seeded));
//     return seeded;
//   }
// }

// function savePatientState(state) {
//   localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(state));
//   window.dispatchEvent(new Event('patient-state-updated'));
//   return state;
// }

function formatStatusLabel(status) {
  const labels = {
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    WAITING: 'Waiting',
    IN_CONSULTATION: 'In Consultation',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
    RESCHEDULED: 'Rescheduled'
  };
  return labels[status] || status;
}

function getStatusStages(status) {
  const stages = ['Submitted', 'Pending Approval', 'Approved', 'Waiting', 'In Consultation', 'Completed'];
  const currentIndex = Math.max(0, stages.indexOf(formatStatusLabel(status)));
  return stages.map((stage, index) => ({
    label: stage,
    active: index <= currentIndex
  }));
}

// function getPatientByPhone(phone) {
//   const state = getPatientState();
//   return state.patients.find(patient => String(patient.phone).toLowerCase() === String(phone).toLowerCase()) || null;
// }

// function getAppointmentsForPhone(phone) {
//   const state = getPatientState();
//   return state.appointments.filter(appointment => String(appointment.phone).toLowerCase() === String(phone).toLowerCase())
//     .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
// }

// function upsertPatient(state, payload) {
//   const existing = state.patients.find(patient => patient.phone === payload.phone || patient.email === payload.email);
//   if (existing) {
//     Object.assign(existing, {
//       name: payload.patientName,
//       phone: payload.phone,
//       email: payload.email,
//       age: payload.age || existing.age || '',
//       gender: payload.gender || existing.gender || '',
//       address: payload.address || existing.address || '',
//       medicalHistory: payload.medicalHistory || existing.medicalHistory || '',
//       emergencyContact: payload.emergencyContact || existing.emergencyContact || '',
//       insurance: payload.insurance || existing.insurance || '',
//       previousDoctor: payload.previousDoctor || existing.previousDoctor || '',
//       lastSeen: new Date().toISOString()
//     });
//     return existing;
//   }

//   const patient = {
//     id: `patient-${Date.now()}`,
//     name: payload.patientName,
//     phone: payload.phone,
//     email: payload.email,
//     age: payload.age || '',
//     gender: payload.gender || '',
//     address: payload.address || '',
//     medicalHistory: payload.medicalHistory || '',
//     emergencyContact: payload.emergencyContact || '',
//     insurance: payload.insurance || '',
//     previousDoctor: payload.previousDoctor || '',
//     lastSeen: new Date().toISOString()
//   };
//   state.patients.unshift(patient);
//   return patient;
// }

// function createAppointment(state, payload) {
//   // const doctor = state.doctors.find(item => Number(item.id) === Number(payload.doctorId));
//   // if (!doctor) return null;

//   const appointment = {
//     id: `appointment-${Date.now()}`,
//     reference: `APT-${String(state.appointments.length + 1000).slice(-4)}`,
//     patientName: payload.patientName,
//     phone: payload.phone,
//     date: payload.date,
//     time: payload.time,
//     reason: payload.reason,
//     priority: payload.priority || 'Routine',
//     status: 'PENDING_APPROVAL',
//     createdAt: new Date().toISOString()    
//   };

//   upsertPatient(state, payload);
//   state.appointments.unshift(appointment);
//   state.notifications.unshift({
//     id: `patient-notif-${Date.now()}`,
//     title: 'New appointment requested',
//     message: `${appointment.patientName} requested an appointment`,   
//     unread: true,
//     createdAt: new Date().toISOString(),
//     relatedId: appointment.id
//   });
//   state.recentActivity.unshift({
//     id: `patient-activity-${Date.now()}`,
//     title: 'Patient request submitted',
//     detail: `${appointment.reference} received.`,
//     createdAt: new Date().toISOString()
//   });
//   state.calendar.unshift({
//     id: appointment.id,
//     date: appointment.date,
//     title: `${appointment.patientName}`,
//     status: 'warning',
//     appointmentId: appointment.id
//   });
//   state.queue.unshift({
//     id: appointment.id,
//     token: appointment.reference,
//     patient: appointment.patientName,
//     time: `${appointment.date} • ${appointment.time}`,
//     priority: appointment.priority,
//     status: appointment.status,
//     appointment
//   });

//   savePatientState(state);
//   sessionStorage.setItem(PATIENT_SESSION_KEY, payload.phone);
//   return appointment;
// }

function buildNextDates(count = 6) {
  const dates = [];
  for (let index = 0; index < count; index += 1) {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function renderBookingPage() {
  const root = document.getElementById('patient-page-root');
  if (!root) return;

  // const state = getPatientState();
  const params = new URLSearchParams(window.location.search);
  const phoneParam = params.get('phone') || '';
  const showDetails = params.get('step') === 'details' || sessionStorage.getItem('patient-booking-step') === 'details';
  const phoneValue = phoneParam || sessionStorage.getItem('patient-booking-phone') || '';
  const patient = null;

  if (!showDetails) {
    root.innerHTML = `
      <div class="patient-card-grid">
        <div class="patient-metric-card">
          <h2>Start with your mobile number</h2>
          <p>We’ll instantly check whether you already have a saved profile with CuraHealth.</p>
        </div>
        <form id="patient-mobile-form" class="patient-form-grid">
          <label>
            Mobile number
            <input name="phone" type="tel" inputmode="tel" placeholder="Enter your mobile number" value="${phoneValue}" required>
          </label>
          <button class="patient-button" type="submit">Continue</button>
        </form>
      </div>
    `;
    const form = document.getElementById('patient-mobile-form');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const phone = new FormData(form).get('phone').toString().trim();
      if (!phone) return;
      sessionStorage.setItem('patient-booking-phone', phone);
      sessionStorage.setItem('patient-booking-step', 'details');
      window.location.search = `?phone=${encodeURIComponent(phone)}&step=details`;
    });
    return;
  }

  const nextDates = buildNextDates();
  // const doctorOptions = state.doctors.map(doctor => `<option value="${doctor.id}" ${Number(doctor.id) === 1 ? 'selected' : ''}>${doctor.name} • ${doctor.department}</option>`).join('');
  // const doctorSlots = state.doctors[0]?.slots || ['09:00'];
  const doctorSlots = [
    "08:30",
    "09:00",
    "10:00",
    "11:00"
  ];
  const profileSection = patient ? `
    <div class="patient-metric-card">
      <strong>${patient.name}</strong>
      <div class="patient-appointment-meta">
        <span>${patient.phone}</span>
      </div>
    </div>
  ` : `
    <div class="patient-grid-2">
      <label>Name<input name="patientName" required placeholder="Enter full name"></label>
      <label>Mobile<input name="phone" type="tel" required placeholder="Mobile number" value="${phoneValue}"></label>
    </div>
      `;

  root.innerHTML = `
    <div class="patient-card-grid">
      <div class="patient-metric-card">
        <h3>${patient ? 'We found your profile' : 'No existing profile found'}</h3>
        <p>${patient ? 'Your saved details are ready. Only the consultation details are needed.' : 'Please complete the form below and we’ll create your profile for future visits.'}</p>
      </div>

      <form id="patient-booking-form" class="patient-form-grid">
        ${profileSection}

        <div class="patient-grid-2">
          <label>Date<select name="date">${nextDates.map(date => `<option value="${date}">${date}</option>`).join('')}</select></label>
          <label>Time<select name="time" id="patient-time-select">${doctorSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('')}</select></label>
        </div>
        <button class="patient-button" type="submit">Submit appointment</button>
      </form>
    </div>
  `;
  
  const form = document.getElementById('patient-booking-form');
  // const doctorSelect = document.getElementById('patient-doctor-select');
  // const timeSelect = document.getElementById('patient-time-select');

  // doctorSelect?.addEventListener('change', (event) => {
  //   const selectedDoctor = state.doctors.find(doctor => Number(doctor.id) === Number(event.target.value));
  //   if (!selectedDoctor || !timeSelect) return;
  //   timeSelect.innerHTML = (selectedDoctor.slots || ['09:00']).map(slot => `<option value="${slot}">${slot}</option>`).join('');
  // });

  form?.addEventListener('submit',async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const phone = String(payload.phone || phoneValue).trim();
    const patientName = String(payload.patientName || (patient?.name || '')).trim();
    console.log(payload);

    if (!phone || !patientName || !payload.date || !payload.time ) {
      return;
    }

  //   const appointment = createAppointment(getPatientState(), {
  //     patientName,
  //     phone,
  //     date: payload.date,
  //     time: payload.time,
  //  });

    // if (appointment) {
    //   window.location.href = `success.html?ref=${appointment.reference}&phone=${encodeURIComponent(phone)}`;
    // }
    const response = await fetch(
    "http://localhost:8000/api/patient_appointment/booking",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            patient_name: patientName,
            patient_phone: phone,
            appointment_date: payload.date,
            appointment_time: payload.time
        })
    }
    );

    if (!response.ok) {
      const error = await response.json();
      alert(error.detail);
      return;
    }

    const appointment = await response.json();

    window.location.href =
    `success.html?id=${appointment.id}`;
      });
}

function renderStatusPage() {
  const root = document.getElementById('patient-page-root');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const phoneValue = params.get('phone') || sessionStorage.getItem(PATIENT_SESSION_KEY) || '';
  // const state = getPatientState();
  // const appointments = getAppointmentsForPhone(phoneValue);
  const currentAppointment = appointments[0] || null;
  // const history = appointments.slice(1);

  root.innerHTML = `
    <div class="patient-card-grid">
      <div class="patient-metric-card">
        <h2>Track your appointment</h2>
        <p>Use your mobile number to revisit the live appointment status at any time.</p>
        <form id="patient-status-form" class="patient-form-grid" style="margin-top: 14px;">
          <label>
            Mobile number
            <input name="phone" type="tel" inputmode="tel" placeholder="Enter your mobile number" value="${phoneValue}" required>
          </label>
          <button class="patient-button" type="submit">Track</button>
        </form>
      </div>

       ${currentAppointment ? `
        <div class="patient-status-card">
          <div class="patient-status-pill">${formatStatusLabel(currentAppointment.status)}</div>
          <h3 style="margin-top: 10px;">${currentAppointment.id}</h3>
          <div class="patient-appointment-meta">
            <span>${currentAppointment.appointment_date}</span>
            <span>${currentAppointment.appointment_time}</span>
          </div>
          <div class="patient-timeline">
            ${getStatusStages(currentAppointment.status).map(step => `
              <div class="patient-timeline-step ${step.active ? 'active' : ''}">
                <span class="patient-timeline-dot"></span>
                <span class="patient-timeline-label">${step.label}</span>
              </div>
            `).join('')}
          </div>
          <div class="patient-actions">
            <a class="patient-button secondary" href="booking.html?phone=${encodeURIComponent(currentAppointment.patient_phone)}&step=details">Book another appointment</a>
            <a class="patient-button" href="tel:+912241288190">Call hospital</a>
          </div>
        </div>
      ` : `
        <div class="patient-zero-state">No appointment was found for this number yet. Use the booking link to create one.</div>
     `}

    //   <div class="patient-metric-card">
    //     <h3>Appointment history</h3>
    //     ${history.length ? `<div class="patient-history-list">${history.map(appointment => `
    //       <div class="patient-history-card" data-reference="${appointment.reference}">
    //         <strong>${appointment.reference}</strong>
    //         <div class="patient-appointment-meta">
    //           <span>${appointment.doctorName}</span>
    //           <span>${appointment.department}</span>
    //           <span>${appointment.date}</span>
    //           <span>${formatStatusLabel(appointment.status)}</span>
    //         </div>
    //       </div>
    //     `).join('')}</div>` : '<p>No previous appointments yet.</p>'}
    //   </div>
    // </div>
  `;

  document.getElementById('patient-status-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get('phone')).trim();
    if (!phone) return;
    sessionStorage.setItem(PATIENT_SESSION_KEY, phone);
    window.location.search = `?phone=${encodeURIComponent(phone)}`;
  });

  // document.querySelectorAll('.patient-history-card').forEach(card => {
  //   card.addEventListener('click', () => {
  //     const reference = card.getAttribute('data-reference');
  //     // const appointment = state.appointments.find(item => item.reference === reference);
  //     // if (!appointment) return;
  //     window.location.href = `status.html?phone=${encodeURIComponent(appointment.phone)}`;
  //   });
  // });
}
async function renderSuccessPage() {

    const root = document.getElementById("patient-page-root");

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    const response = await fetch(
        `http://localhost:8000/api/patient_appointment/${id}`
    );

    if (!response.ok) {
        root.innerHTML = "Appointment not found";
        return;
    }

    const appointment = await response.json();
    if (!appointment) {
    root.innerHTML = "Appointment not found";
    return;
    }

// function renderSuccessPage() {
//   const root = document.getElementById('patient-page-root');
//   if (!root) return;

//   const params = new URLSearchParams(window.location.search);
//   const id = params.get("id");
  // const ref = params.get('ref') || '';
  // const phone = params.get('phone') || sessionStorage.getItem(PATIENT_SESSION_KEY) || '';
  // const state = getPatientState();
  // const appointment = state.appointments.find(item => item.reference === ref) || getAppointmentsForPhone(phone)[0] || null;

  // if (!appointment) {
  //   root.innerHTML = '<div class="patient-zero-state">We could not locate your appointment confirmation.</div>';
  //   return;
  // }

  root.innerHTML = `
    <div class="patient-card-grid">
      <div class="patient-metric-card">
        <div class="eyebrow">Appointment request submitted successfully</div>
        <h2 style="margin-top: 10px;">Your request is in safe hands.</h2>
        <p>We’ve saved your details and sent the appointment to our reception team for review.</p>
      </div>
      <div class="patient-status-card">
        <strong>${appointment.patient_name}</strong>
        <div class="patient-appointment-meta">
          <span>${appointment.appointment_date}</span>
          <span>${appointment.appointment_time}</span>
        </div>
        <div class="patient-status-pill" style="margin-top: 12px;">Pending Approval</div>
        <div class="patient-actions">
          <a class="patient-button" href="status.html?phone=${encodeURIComponent(appointment.patient_phone)}">Track appointment</a>
          <a class="patient-button secondary" href="booking.html?phone=${encodeURIComponent(appointment.patient_phone)}&step=details">Book another appointment</a>
          <a class="patient-button secondary" href="tel:+912241288190">Call hospital</a>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    window.location.href = `status.html?phone=${encodeURIComponent(appointment.patient_phone)}`;
  }, 2600);
}

function initializePatientExperience() {
  const pathname = window.location.pathname;
  if (pathname.includes('booking.html')) {
    renderBookingPage();
  } else if (pathname.includes('success.html')) {
    renderSuccessPage();
  } else if (pathname.includes('status.html')) {
    renderStatusPage();
    // window.addEventListener('storage', () => renderStatusPage());
    window.addEventListener('focus', () => renderStatusPage());
    setInterval(() => renderStatusPage(), 5000);
  }
}

// window.addEventListener('patient-state-updated', () => {
//   if (window.location.pathname.includes('status.html')) {
//     renderStatusPage();
//   }
// });

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initializePatientExperience);
} else {
  initializePatientExperience();
}
