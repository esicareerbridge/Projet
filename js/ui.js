/**
 * UI Module for EsiCareerBridge
 * Handles displaying data from storage on pages
 */

/**
 * Display all companies from storage
 * @param {string} containerId - ID of container element
 * @param {Object} options - Display options (limit, filter, etc.)
 */
function displayAllCompanies(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const companies = getAllCompanies();
    
    if (companies.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Aucune entreprise trouvée</p>';
        return;
    }
    
    let html = '';
    companies.forEach(company => {
        const rating = getCompanyRating(company.id);
        const ratingStars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
        
        html += `
            <div class="company-card" style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">${company.name}</h3>
                <p style="color: #666; margin-bottom: 8px;"><strong>Secteur:</strong> ${company.industry || 'Non spécifié'}</p>
                <p style="color: #666; margin-bottom: 8px;"><strong>Localisation:</strong> ${company.location || 'Non spécifié'}</p>
                <p style="color: #666; margin-bottom: 8px;"><strong>Sites web:</strong> <a href="${company.website}" target="_blank">${company.website}</a></p>
                <div style="color: #f39c12; margin-bottom: 12px;">
                    <span>${ratingStars}</span> <span>(${rating.toFixed(1)}/5)</span>
                </div>
                <button onclick="showCompanyDetails(${company.id})" class="cta-button" style="padding: 8px 16px; font-size: 14px;">Voir les avis</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Show company details and reviews
 * @param {string|number} companyId - Company ID to display
 */
function showCompanyDetails(companyId) {
    const company = getCompanyById(companyId);
    if (!company) {
        showNotification('Entreprise non trouvée', 'error');
        return;
    }
    
    const reviews = getCompanyReviews(companyId);
    const rating = getCompanyRating(companyId);
    const ratingStars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    
    let reviewsHTML = reviews.length === 0 ? 
        '<p style="color: #999;">Aucun avis pour cette entreprise</p>' :
        reviews.map(review => `
            <div style="border-left: 4px solid #3498db; padding: 16px; margin-bottom: 16px; background-color: #f9f9f9; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="color: #2c3e50;">${review.user_name || 'Anonyme'}</strong>
                    <span style="color: #f39c12;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p style="color: #666; margin-bottom: 8px;"><strong>${review.title}</strong></p>
                <p style="color: #555; margin-bottom: 8px;">${review.content}</p>
                <small style="color: #999;">${formatDate(review.created_at)}</small>
            </div>
        `).join('');
    
    alert(`
ENTREPRISE: ${company.name}
SECTEUR: ${company.industry}
NOTE: ${ratingStars} (${rating.toFixed(1)}/5)
AVIS: ${reviews.length}

${reviews.map(r => `- "${r.title}" (${r.rating}/5 étoiles)\n  "${r.content}"\n`).join('\n')}
    `);
}

/**
 * Display all internships
 * @param {string} containerId - ID of container element
 * @param {Object} options - Display options (filter, sort, etc.)
 */
function displayAllInternships(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const internships = getAllInternships();
    
    if (internships.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Aucun stage trouvé</p>';
        return;
    }
    
    let html = '';
    internships.forEach(internship => {
        const company = getCompanyById(internship.company_id);
        const companyName = company ? company.name : 'Entreprise inconnue';
        
        html += `
            <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">${internship.title}</h3>
                <p style="color: #666; margin-bottom: 8px;"><strong>Entreprise:</strong> ${companyName}</p>
                <p style="color: #666; margin-bottom: 8px;"><strong>Durée:</strong> ${internship.duration} mois</p>
                <p style="color: #666; margin-bottom: 8px;"><strong>Localisation:</strong> ${internship.location || 'À déterminer'}</p>
                <p style="color: #666; margin-bottom: 12px;">${internship.description.substring(0, 150)}...</p>
                <button onclick="showInternshipDetails(${internship.id})" class="cta-button" style="padding: 8px 16px; font-size: 14px;">Voir plus</button>
                <button onclick="saveInternshipAction(${internship.id})" class="cta-button" style="padding: 8px 16px; font-size: 14px; background-color: #3498db; margin-left: 8px;">Sauvegarder</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Show internship details
 * @param {string|number} internshipId - Internship ID to display
 */
function showInternshipDetails(internshipId) {
    const internship = getInternshipById(internshipId);
    if (!internship) {
        showNotification('Stage non trouvé', 'error');
        return;
    }
    
    const company = getCompanyById(internship.company_id);
    const companyName = company ? company.name : 'Entreprise inconnue';
    
    alert(`
OFFRE DE STAGE
Titre: ${internship.title}
Entreprise: ${companyName}
Durée: ${internship.duration} mois
Localisation: ${internship.location}
Type: ${internship.internship_type}

Description:
${internship.description}

Compétences requises:
${internship.required_skills.join(', ')}
    `);
}

/**
 * Save internship action
 * @param {string|number} internshipId - Internship ID to save
 */
function saveInternshipAction(internshipId) {
    const user = getCurrentUser();
    if (!user) {
        alert('Veuillez vous connecter pour sauvegarder un stage');
        window.location.href = 'login.html';
        return;
    }
    
    const result = saveInternship(user.id, internshipId);
    if (result.success) {
        showNotification('Stage sauvegardé avec succès', 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

/**
 * Display user profile
 * @param {string} containerId - ID of container element
 */
function displayUserProfile(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = '<p style="color: #999;">Veuillez vous connecter pour voir votre profil</p>';
        return;
    }
    
    const savedInternships = getSavedInternships(user.id);
    
    let html = `
        <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Mon Profil</h2>
            
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e0e0e0;">
                <p><strong>Nom:</strong> ${user.full_name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Type de compte:</strong> ${user.user_type === 'student' ? 'Étudiant' : 'Entreprise'}</p>
                <p><strong>Inscrit le:</strong> ${formatDate(user.created_at)}</p>
            </div>
            
            <div>
                <h3 style="color: #2c3e50; margin-bottom: 16px;">Stages Sauvegardés (${savedInternships.length})</h3>
                ${savedInternships.length === 0 ? 
                    '<p style="color: #999;">Aucun stage sauvegardé pour le moment</p>' :
                    savedInternships.map(item => {
                        const internship = getInternshipById(item.internship_id);
                        return internship ? `
                            <div style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 12px;">
                                <strong>${internship.title}</strong> - ${internship.duration} mois
                            </div>
                        ` : '';
                    }).join('')
                }
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Display soft skills progress
 * @param {string} containerId - ID of container element
 */
function displaySoftSkillsProgress(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = '<p style="color: #999;">Veuillez vous connecter pour voir votre progression</p>';
        return;
    }
    
    const progress = getProgress(user.id);
    const guides = getAllSoftSkillsContent();
    
    let html = '<div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
    html += '<h2 style="color: #2c3e50; margin-bottom: 20px;">Votre Progression</h2>';
    
    guides.forEach(guide => {
        const guideProgress = progress.find(p => p.skill_id === guide.id);
        const progressPercent = guideProgress ? guideProgress.progress_percentage : 0;
        
        html += `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong style="color: #2c3e50;">${guide.title}</strong>
                    <span style="color: #3498db;">${progressPercent}%</span>
                </div>
                <div style="width: 100%; background-color: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
                    <div style="background-color: #3498db; height: 100%; width: ${progressPercent}%; border-radius: 10px;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Display LinkedIn optimization guides
 * @param {string} containerId - ID of container element
 */
function displayLinkedInGuides(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const guides = getLinkedInGuides();
    
    if (guides.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Aucun guide disponible</p>';
        return;
    }
    
    let html = '';
    guides.forEach(guide => {
        html += `
            <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 12px;">${guide.title}</h3>
                <p style="color: #666; line-height: 1.8;">${guide.content}</p>
                <small style="color: #999;">Dernière mise à jour: ${formatDate(guide.updated_at)}</small>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Display company reviews count
 * @param {string|number} companyId - Company ID
 * @returns {number} Number of reviews
 */
function getReviewCount(companyId) {
    const reviews = getCompanyReviews(companyId);
    return reviews.length;
}

/**
 * Display recommendations
 * @param {string} containerId - ID of container element
 */
function displayRecommendations(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const recommendations = getRecommendations();
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Aucune recommandation</p>';
        return;
    }
    
    let html = '';
    recommendations.forEach(rec => {
        html += `
            <div style="background-color: #f0f8ff; border-left: 4px solid #3498db; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
                <strong style="color: #2c3e50;">${rec.title}</strong>
                <p style="color: #666; margin-top: 8px;">${rec.description}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Display activity log
 * @param {string} containerId - ID of container element
 * @param {number} limit - Number of recent activities to show
 */
function displayActivityLog(containerId, limit = 10) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = '<p style="color: #999;">Veuillez vous connecter pour voir votre historique</p>';
        return;
    }
    
    const activities = getActivityLog();
    const userActivities = activities
        .filter(a => a.user_id === user.id)
        .slice(0, limit);
    
    if (userActivities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Aucune activité enregistrée</p>';
        return;
    }
    
    let html = '';
    userActivities.forEach(activity => {
        html += `
            <div style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #666;">
                <strong>${activity.action}</strong>
                <small style="display: block; color: #999; margin-top: 4px;">${formatDate(activity.timestamp)}</small>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Generate personalized LinkedIn optimization suggestions for the current user
 * Inserts results into `#linkedin-personalized-output` element
 */
function optimizeLinkedInForUser() {
    const out = document.getElementById('linkedin-personalized-output');
    if (!out) return;

    const user = getCurrentUser();
    if (!user) {
        out.innerHTML = '<div style="padding:16px; background:#fff; border-radius:8px; border:1px solid #e0e0e0; text-align:center;">Veuillez vous connecter pour obtenir des suggestions personnalisées.</div>';
        return;
    }

    const name = user.fullName || user.full_name || user.email.split('@')[0];
    const headline = `${name} • Étudiant / Jeune talent en recherche de stage • Compétences : data, IA, cybersécurité`;
    const summary = `Bonjour, je suis ${name}. Actuellement en formation d'ingénieur, je m'intéresse particulièrement à la data science, à la cybersécurité et à l'IA. Je suis à la recherche de stages où je peux appliquer mes compétences en analyse de données, apprentissage automatique et sécurité des systèmes. Je suis disponible pour des missions pratiques et des collaborations.`;

    // Suggest skills: try to infer from saved internships or fallback list
    let skills = ['Python', 'SQL', 'Machine Learning', 'Analyse de données', 'Git'];
    try {
        const internships = getAllInternships();
        if (internships && internships.length > 0) {
            const sample = internships.slice(0,3).map(i => i.required_skills || []).flat();
            if (sample.length > 0) skills = Array.from(new Set(sample.concat(skills))).slice(0,8);
        }
    } catch (e) {
        // ignore
    }

    const html = `
        <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
            <h3 style="margin-top:0; color:#2c3e50;">Suggestions personnalisées pour ${name}</h3>
            <div style="margin-bottom:12px;"><strong>Titre conseillé :</strong>
                <div style="background:#f7fbff; padding:10px; border-radius:6px; margin-top:6px;">${headline}</div>
            </div>
            <div style="margin-bottom:12px;"><strong>Résumé (À utiliser dans la section « Infos ») :</strong>
                <div style="background:#f7fbff; padding:12px; border-radius:6px; margin-top:6px; white-space:pre-wrap;">${summary}</div>
            </div>
            <div style="margin-bottom:12px;"><strong>Compétences recommandées :</strong>
                <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
                    ${skills.map(s => `<span style="background:#eef6ff; padding:8px 10px; border-radius:20px; color:#2c3e50;">${s}</span>`).join('')}
                </div>
            </div>
            <div style="margin-top:16px; display:flex; gap:12px;">
                <button class="cta-button" onclick="copyToClipboard(\`${headline}\`)" style="background:#3498db;">Copier le titre</button>
                <button class="cta-button" onclick="copyToClipboard(\`${summary}\`)" style="background:#2ecc71;">Copier le résumé</button>
            </div>
        </div>
    `;

    out.innerHTML = html;
    showNotification('Suggestions LinkedIn générées', 'success');
}

// small helper to copy text to clipboard
function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text);
        showNotification('Copié dans le presse-papiers', 'success');
    } catch (e) {
        showNotification('Impossible de copier. Veuillez copier manuellement.', 'warning');
    }
}
