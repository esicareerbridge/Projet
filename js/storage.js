// =====================================================
// EsiCareerBridge - LocalStorage Database Functions
// =====================================================

// =====================================================
// USER MANAGEMENT
// =====================================================

function initializeStorage() {
  // Initialize default data structures if they don't exist
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('companies')) {
    localStorage.setItem('companies', JSON.stringify(getDefaultCompanies()));
  }
  if (!localStorage.getItem('internships')) {
    localStorage.setItem('internships', JSON.stringify(getDefaultInternships()));
  }
  if (!localStorage.getItem('reviews')) {
    localStorage.setItem('reviews', JSON.stringify([]));
  }
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
  if (!localStorage.getItem('contacts')) {
    localStorage.setItem('contacts', JSON.stringify([]));
  }
}

// Register new user
function registerUser(email, password, fullName, userType = 'student') {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
      id: Date.now(),
      email: email,
      password: password, // In production, hash this!
      fullName: fullName,
      userType: userType,
      createdAt: new Date().toISOString(),
      profilePhoto: null,
      bio: '',
      phone: ''
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'User registered successfully', user: newUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Login user
function loginUser(email, password) {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: 'Login successful', user: user };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Get current user
function getCurrentUser() {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'accueil.html';
}

// Update user profile
function updateUserProfile(userId, updates) {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      }
      
      return { success: true, message: 'Profile updated', user: users[userIndex] };
    }
    return { success: false, message: 'User not found' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Get user by email
function getUserByEmail(email) {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    return user || null;
  } catch (error) {
    return null;
  }
}

// =====================================================
// COMPANIES & INTERNSHIPS
// =====================================================

function getDefaultCompanies() {
  return [
    {
      id: 1,
      name: 'ONCF',
      description: 'Office National des Chemins de Fer',
      industry: 'Transportation',
      website: 'https://www.oncf.ma',
      logo: 'media/image2.png',
      location: 'Rabat, Morocco',
      size: 'large',
      founded: 1963,
      averageRating: 4.5,
      totalReviews: 5
    },
    {
      id: 2,
      name: 'Inwi',
      description: 'Moroccan Telecommunications Company',
      industry: 'Telecommunications',
      website: 'https://www.inwi.ma',
      logo: 'media/image3.png',
      location: 'Rabat, Morocco',
      size: 'large',
      founded: 2006,
      averageRating: 4.2,
      totalReviews: 3
    },
    {
      id: 3,
      name: 'Oracle',
      description: 'Global Technology Company',
      industry: 'Technology',
      website: 'https://www.oracle.com',
      logo: 'media/image4.png',
      location: 'Casablanca, Morocco',
      size: 'enterprise',
      founded: 1977,
      averageRating: 4.7,
      totalReviews: 4
    },
    {
      id: 4,
      name: '3T Développement Maroc',
      description: 'Multi-brand development company',
      industry: 'Retail & Fitness',
      website: 'https://www.3t-dev.com',
      logo: 'media/image5.png',
      location: 'Marrakech, Morocco',
      size: 'medium',
      founded: 2016,
      averageRating: 4.0,
      totalReviews: 2
    },
    {
      id: 5,
      name: 'Lotus Capital Gestion',
      description: 'Quantitative Trading & Fintech',
      industry: 'Finance',
      website: 'https://www.lotuscapital.ma',
      logo: 'media/image6.png',
      location: 'Casablanca, Morocco',
      size: 'small',
      founded: 2015,
      averageRating: 4.6,
      totalReviews: 2
    }
  ];
}

function getDefaultInternships() {
  return [
    {
      id: 1,
      companyId: 1,
      title: 'Data Science Internship',
      description: 'Work on real-world data projects with ONCF',
      location: 'Rabat',
      remoteType: 'hybrid',
      durationMonths: 3,
      salaryMin: 3000,
      salaryMax: 5000,
      requiredSkills: 'Python, Machine Learning, SQL',
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      applicationsCount: 12,
      viewsCount: 245
    },
    {
      id: 2,
      companyId: 2,
      title: 'Web Development Internship',
      description: 'Build web applications for Inwi',
      location: 'Rabat',
      remoteType: 'on-site',
      durationMonths: 2,
      salaryMin: 2500,
      salaryMax: 4000,
      requiredSkills: 'JavaScript, React, Node.js',
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      applicationsCount: 8,
      viewsCount: 180
    },
    {
      id: 3,
      companyId: 3,
      title: 'Cloud Engineering Internship',
      description: 'Work with Oracle Cloud infrastructure',
      location: 'Casablanca',
      remoteType: 'remote',
      durationMonths: 4,
      salaryMin: 4000,
      salaryMax: 6000,
      requiredSkills: 'Cloud Computing, AWS/Azure, DevOps',
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      applicationsCount: 15,
      viewsCount: 320
    }
  ];
}

function getCompanies() {
  try {
    initializeStorage();
    return JSON.parse(localStorage.getItem('companies')) || [];
  } catch (error) {
    console.error('Error getting companies:', error);
    return [];
  }
}

function getCompanyById(companyId) {
  try {
    const companies = getCompanies();
    return companies.find(c => c.id === companyId);
  } catch (error) {
    console.error('Error getting company:', error);
    return null;
  }
}

function getInternships() {
  try {
    initializeStorage();
    return JSON.parse(localStorage.getItem('internships')) || [];
  } catch (error) {
    console.error('Error getting internships:', error);
    return [];
  }
}

function getInternshipById(internshipId) {
  try {
    const internships = getInternships();
    return internships.find(i => i.id === internshipId);
  } catch (error) {
    console.error('Error getting internship:', error);
    return null;
  }
}

function getInternshipsByCompany(companyId) {
  try {
    const internships = getInternships();
    return internships.filter(i => i.companyId === companyId);
  } catch (error) {
    console.error('Error getting internships by company:', error);
    return [];
  }
}

// =====================================================
// REVIEWS
// =====================================================

function addReview(companyId, rating, title, comment, isAnonymous = false) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to review' };
    }
    
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    const newReview = {
      id: Date.now(),
      companyId: companyId,
      userId: currentUser.id,
      userName: isAnonymous ? 'Anonymous' : currentUser.fullName,
      rating: rating,
      title: title,
      comment: comment,
      isAnonymous: isAnonymous,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Update company average rating
    updateCompanyRating(companyId);
    
    return { success: true, message: 'Review added successfully', review: newReview };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function getReviews(companyId) {
  try {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    return reviews.filter(r => r.companyId === companyId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

function deleteReview(reviewId) {
  try {
    const currentUser = getCurrentUser();
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1 && (reviews[reviewIndex].userId === currentUser.id || currentUser.userType === 'admin')) {
      reviews.splice(reviewIndex, 1);
      localStorage.setItem('reviews', JSON.stringify(reviews));
      return { success: true, message: 'Review deleted' };
    }
    
    return { success: false, message: 'You cannot delete this review' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function updateCompanyRating(companyId) {
  try {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const companyReviews = reviews.filter(r => r.companyId === companyId);
    
    if (companyReviews.length === 0) return;
    
    const averageRating = companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length;
    
    const companies = JSON.parse(localStorage.getItem('companies')) || [];
    const companyIndex = companies.findIndex(c => c.id === companyId);
    
    if (companyIndex !== -1) {
      companies[companyIndex].averageRating = parseFloat(averageRating.toFixed(2));
      companies[companyIndex].totalReviews = companyReviews.length;
      localStorage.setItem('companies', JSON.stringify(companies));
    }
  } catch (error) {
    console.error('Error updating company rating:', error);
  }
}

// =====================================================
// INTERNSHIP APPLICATIONS
// =====================================================

function applyForInternship(internshipId) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to apply' };
    }
    
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    // Check if already applied
    if (applications.find(a => a.internshipId === internshipId && a.studentId === currentUser.id)) {
      return { success: false, message: 'You have already applied for this internship' };
    }
    
    const newApplication = {
      id: Date.now(),
      internshipId: internshipId,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      status: 'submitted',
      appliedAt: new Date().toISOString(),
      coverLetter: '',
      cvUrl: ''
    };
    
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    // Update internship application count
    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    const internshipIndex = internships.findIndex(i => i.id === internshipId);
    if (internshipIndex !== -1) {
      internships[internshipIndex].applicationsCount += 1;
      localStorage.setItem('internships', JSON.stringify(internships));
    }
    
    return { success: true, message: 'Application submitted successfully', application: newApplication };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function getUserApplications(userId) {
  try {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    return applications.filter(a => a.studentId === userId);
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
}

// =====================================================
// CONTACT SUBMISSIONS
// =====================================================

function submitContact(name, email, subject, message) {
  try {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    
    const newContact = {
      id: Date.now(),
      name: name,
      email: email,
      subject: subject,
      message: message,
      status: 'new',
      submittedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    return { success: true, message: 'Thank you! We will contact you soon.', contact: newContact };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// =====================================================
// INITIALIZATION
// =====================================================

// Initialize storage when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeStorage();
});
