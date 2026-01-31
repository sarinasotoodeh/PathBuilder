// Read saved profile
const profileRaw = localStorage.getItem('userProfile');
if (!profileRaw) {
  alert('No profile found. Please complete the intake form.');
  window.location.href = 'index.html';
}

const profile = JSON.parse(profileRaw);
const field = profile.careerGoal || 'Career field';
const grade = profile.hsYear ? Number(profile.hsYear) : 9;

// Grade-specific prerequisites
const gradeMapping = {
  9: {
    'Technology & Engineering': [
      'Mathematics (Grade 9 academic)',
      'Science (covering basic physics concepts)',
      'English',
      'Consider: Computer Studies electives'
    ],
    'Business, Finance & Economics': [
      'Mathematics (Grade 9 academic)',
      'English',
      'Consider: Business Studies electives'
    ],
    'Health & Life Sciences': [
      'Mathematics (Grade 9 academic)',
      'Science (including life science)',
      'English'
    ],
    'Law, Politics & Public Policy': [
      'English',
      'Social Sciences / History',
      'Mathematics (Grade 9)'
    ],
    'Arts, Media & Design': [
      'Visual Arts or Drama or Music (elective)',
      'English',
      'Consider: Media/Design electives'
    ],
    'Education & Social Sciencesn': [
      'English',
      'Social Sciences / History',
      'Mathematics (Grade 9)'
    ],
    'Natural Sciences (Math, Physics, Chem, etc.)': [
      'Mathematics (Grade 9 academic)',
      'Science (Grade 9 - physics and chemistry components)',
      'English'
    ],
    'Skilled Trades & Technical Careers': [
      'Mathematics (applied)',
      'Technology / Shop courses',
      'English'
    ],
    'Environmental & Sustainability Studies': [
      'Science (Grade 9)',
      'Mathematics (Grade 9)',
      'English'
    ],
    'Not sure': [
      'English',
      'Mathematics (academic or applied)',
      'Science',
      'One arts or technology elective'
    ]
  },
  10: {
    'Technology & Engineering': [
      'Mathematics (Grade 10 academic)',
      'Science (including Physics)',
      'English',
      'Computer Studies / Programming (recommended)'
    ],
    'Business, Finance & Economics': [
      'Mathematics (Grade 10 academic)',
      'Business Studies / Economics',
      'English'
    ],
    'Health & Life Sciences': [
      'Mathematics (Grade 10 academic)',
      'Science (including Biology)',
      'English'
    ],
    'Law, Politics & Public Policy': [
      'English',
      'Social Sciences / History',
      'Mathematics (Grade 10)'
    ],
    'Arts, Media & Design': [
      'Visual Arts or Drama or Music',
      'English',
      'Media/Design electives (if available)'
    ],
    'Education & Social Sciencesn': [
      'English',
      'Social Sciences / Psychology / Sociology',
      'History or Social Studies'
    ],
    'Natural Sciences (Math, Physics, Chem, etc.)': [
      'Mathematics (Grade 10 academic)',
      'Science (Physics and Chemistry)',
      'English'
    ],
    'Skilled Trades & Technical Careers': [
      'Technology / Shop courses',
      'Mathematics (applied)',
      'Work Experience / Cooperative Education (if available)'
    ],
    'Environmental & Sustainability Studies': [
      'Science (Grade 10)',
      'Biology',
      'Mathematics (Grade 10)'
    ],
    'Not sure': [
      'English',
      'Mathematics (academic or applied)',
      'Science (Grade 10)',
      'One elective in your area of interest'
    ]
  },
  11: {
    'Technology & Engineering': [
      'Grade 11 Mathematics (Functions or Advanced Functions)',
      'Grade 11 Physics (essential)',
      'Computer Studies / Programming (recommended)',
      'English'
    ],
    'Business, Finance & Economics': [
      'Grade 11 Mathematics (Functions or data management)',
      'Business Studies or Economics',
      'English'
    ],
    'Health & Life Sciences': [
      'Grade 11 Biology',
      'Grade 11 Chemistry or Physics',
      'Mathematics (Grade 11)',
      'English'
    ],
    'Law, Politics & Public Policy': [
      'English (Grade 11)',
      'Social Sciences / History / Law courses (if available)',
      'Mathematics (Grade 11)'
    ],
    'Arts, Media & Design': [
      'Visual Arts or Drama or Music (Grade 11)',
      'English (Grade 11)',
      'Media/Design courses'
    ],
    'Education & Social Sciencesn': [
      'English (Grade 11)',
      'Social Sciences / Psychology / Sociology',
      'History',
      'Consider: Education or leadership courses'
    ],
    'Natural Sciences (Math, Physics, Chem, etc.)': [
      'Grade 11 Mathematics (Functions or Advanced Functions)',
      'Grade 11 Chemistry (essential)',
      'Grade 11 Physics (essential)',
      'English'
    ],
    'Skilled Trades & Technical Careers': [
      'Technological Education / Construction / Manufacturing',
      'Mathematics (Grade 11, applied)',
      'Work Experience / Cooperative Education'
    ],
    'Environmental & Sustainability Studies': [
      'Grade 11 Biology',
      'Environmental Science or Geography (Grade 11)',
      'Mathematics (Grade 11)',
      'English'
    ],
    'Not sure': [
      'English (Grade 11)',
      'Grade 11 Mathematics',
      'Science (Grade 11 - Physics, Chemistry, or Biology)',
      'One elective that interests you'
    ]
  },
  12: {
    'Technology & Engineering': [
      'Grade 12 Mathematics (Advanced Functions or Calculus)',
      'Grade 12 Physics (essential)',
      'Grade 12 Computer Science or Engineering courses',
      'English'
    ],
    'Business, Finance & Economics': [
      'Grade 12 Mathematics (Functions, Data Management, or Calculus)',
      'Grade 12 Business or Economics',
      'English'
    ],
    'Health & Life Sciences': [
      'Grade 12 Biology (essential)',
      'Grade 12 Chemistry and/or Physics',
      'Grade 12 Mathematics',
      'English'
    ],
    'Law, Politics & Public Policy': [
      'Grade 12 English (essential)',
      'Grade 12 Social Sciences / History / Law',
      'Grade 12 Mathematics'
    ],
    'Arts, Media & Design': [
      'Grade 12 Visual Arts or Drama or Music',
      'Grade 12 English',
      'Media Production or Design courses'
    ],
    'Education & Social Sciencesn': [
      'Grade 12 English (essential)',
      'Grade 12 Social Sciences / Psychology',
      'Grade 12 History',
      'Grade 12 Mathematics'
    ],
    'Natural Sciences (Math, Physics, Chem, etc.)': [
      'Grade 12 Mathematics (Advanced Functions or Calculus - essential)',
      'Grade 12 Chemistry (essential)',
      'Grade 12 Physics (essential)',
      'English'
    ],
    'Skilled Trades & Technical Careers': [
      'Grade 12 Technology / Skilled Trades courses',
      'Grade 12 Mathematics (Applied)',
      'Work Experience / Cooperative Education',
      'Trade-specific certifications (optional)'
    ],
    'Environmental & Sustainability Studies': [
      'Grade 12 Biology (essential)',
      'Grade 12 Environmental Science or Geography',
      'Grade 12 Mathematics',
      'English'
    ],
    'Not sure': [
      'Grade 12 English (essential)',
      'Grade 12 Mathematics',
      'Grade 12 Science (Chemistry, Physics, or Biology)',
      'Grade 12 electives in areas that interest you'
    ]
  }
};

const forField = document.getElementById('forField');
const list = document.getElementById('coursesList');
const gradeInfo = document.getElementById('gradeInfo');

forField.textContent = `For: ${field}`;

// Get courses for the specific career and grade
const gradeSpecificCourses = gradeMapping[grade] || {};
const courses = gradeSpecificCourses[field] || [
  'English',
  'Mathematics',
  'Science',
  'Relevant electives for your interests'
];

// For grades 9-10, show a roadmap of all future grades
if (grade <= 10) {
  gradeInfo.textContent = `Your pathway to ${field}`;
  
  // Show current grade first
  const currentGradeSection = document.createElement('div');
  currentGradeSection.style.marginBottom = '20px';
  
  const currentGradeHeader = document.createElement('h3');
  currentGradeHeader.textContent = `Grade ${grade} (This Year)`;
  currentGradeHeader.style.color = '#4f46e5';
  currentGradeHeader.style.marginTop = '0';
  currentGradeSection.appendChild(currentGradeHeader);
  
  const currentGradeList = document.createElement('ul');
  courses.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    currentGradeList.appendChild(li);
  });
  currentGradeSection.appendChild(currentGradeList);
  list.parentNode.insertBefore(currentGradeSection, list);
  
  // Show future grades
  for (let futureGrade = grade + 1; futureGrade <= 12; futureGrade++) {
    const futureGradeSection = document.createElement('div');
    futureGradeSection.style.marginBottom = '20px';
    
    const futureGradeHeader = document.createElement('h3');
    futureGradeHeader.textContent = `Grade ${futureGrade}`;
    futureGradeHeader.style.color = '#6b7280';
    futureGradeHeader.style.marginTop = '0';
    futureGradeSection.appendChild(futureGradeHeader);
    
    const futureCourses = gradeMapping[futureGrade] ? (gradeMapping[futureGrade][field] || []) : [];
    const futureGradeList = document.createElement('ul');
    futureCourses.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      futureGradeList.appendChild(li);
    });
    futureGradeSection.appendChild(futureGradeList);
    list.parentNode.insertBefore(futureGradeSection, list);
  }
  
  // Remove the main coursesList since we've added individual grade sections
  list.style.display = 'none';
} else {
  // For grades 11-12, just show current grade requirements
  gradeInfo.textContent = `Grade ${grade} requirements`;
  
  courses.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    list.appendChild(li);
  });
}

document.getElementById('editBtn').addEventListener('click', () => {
  window.location.href = 'index.html?edit=1';
});

document.getElementById('continueBtn').addEventListener('click', () => {
  window.location.href = 'pathways.html';
});
