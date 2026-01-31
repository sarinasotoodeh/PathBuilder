// Read saved profile
const profileRaw = localStorage.getItem('userProfile');
if (!profileRaw) {
  alert('No profile found. Please complete the intake form.');
  window.location.href = 'index.html';
}

const profile = JSON.parse(profileRaw);
const field = profile.careerGoal || 'Career field';

const mapping = {
  'Technology & Engineering': [
    'Grade 11 and 12 Mathematics (including advanced functions / calculus where available)',
    'Grade 11 Physics',
    'Computer Studies / Programming (recommended)',
    'English'
  ],
  'Business, Finance & Economics': [
    'Grade 11 and 12 Mathematics (business or functions)',
    'Business Studies / Economics',
    'English'
  ],
  'Health & Life Sciences': [
    'Grade 12 Biology',
    'Grade 11 Chemistry or Physics (program-dependent)',
    'English'
  ],
  'Law, Politics & Public Policy': [
    'English',
    'Social Sciences / History',
    'Debate / Law (if available)'
  ],
  'Arts, Media & Design': [
    'Visual Arts / Media Arts / Drama or Music',
    'English',
    'Design / Technology electives (if available)'
  ],
  'Education & Social Sciencesn': [
    'English',
    'Social Sciences / Psychology / Sociology',
    'History or Equity studies'
  ],
  'Natural Sciences (Math, Physics, Chem, etc.)': [
    'Grade 12 Chemistry',
    'Grade 12 Mathematics (advanced functions / calculus)',
    'Grade 12 Physics',
    'English'
  ],
  'Skilled Trades & Technical Careers': [
    'Technological Education / Construction / Manufacturing courses',
    'Mathematics (applied)',
    'Work Experience / Cooperative Education (if available)'
  ],
  'Environmental & Sustainability Studies': [
    'Biology',
    'Environmental Science or Geography',
    'Mathematics',
    'English'
  ],
  'Not sure': [
    'English',
    'Mathematics',
    'Science (Biology/Chemistry/Physics)',
    'A mix of one technical/arts elective and one social science elective'
  ]
};

const forField = document.getElementById('forField');
const list = document.getElementById('coursesList');
const intro = document.getElementById('intro');

forField.textContent = `For: ${field}`;

const courses = mapping[field] || [
  'English', 'Mathematics', 'Science', 'Relevant electives depending on interest'
];

courses.forEach(c => {
  const li = document.createElement('li');
  li.textContent = c;
  list.appendChild(li);
});

document.getElementById('editBtn').addEventListener('click', () => {
  window.location.href = 'index.html?edit=1';
});
