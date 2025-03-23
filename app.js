const humb = document.getElementById("humdericon");
const navList = document.querySelector(".nav-list");

humb.addEventListener("click", () => {
    navList.classList.toggle("nav-show");
});

document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.getElementById('projects-grid');
    const loadingElement = document.getElementById('loading-projects');
    const noProjectsElement = document.getElementById('no-projects');
    const loadMoreButton = document.getElementById('load-more');
    const modal = document.getElementById('project-modal');
    const modalContentContainer = document.getElementById('modal-content-container');
    const closeModal = document.querySelector('.close-modal');
    const modalLoading = document.querySelector('.modal-loading');
    
    const API_URL = 'https://leonidgr-projects-production.up.railway.app/projects';
    let allProjects = [];
    let displayedProjects = 0;
    const projectsPerPage = 4;


    async function fetchProjects() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            
            const data = await response.json();
            loadingElement.style.display = 'none';
            

            allProjects = data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            if (allProjects.length === 0) {
                noProjectsElement.style.display = 'block';
                loadMoreButton.style.display = 'none';
            } else {
                displayProjects();
            }
        } catch (error) {
            console.error('Error:', error);
            loadingElement.style.display = 'none';
            noProjectsElement.style.display = 'block';
            loadMoreButton.style.display = 'none';
        }
    }


    function displayProjects() {
        const projectsToShow = allProjects.slice(displayedProjects, displayedProjects + projectsPerPage);
        displayedProjects += projectsToShow.length;
        
        projectsToShow.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        

        if (displayedProjects >= allProjects.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'flex';
        }
        

        const newCards = document.querySelectorAll('.project-card:not(.animated)');
        newCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }


    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.setAttribute('data-id', project.id);
        

        let statusClass = '';
        let statusText = '';
        
        switch(project.status?.toLowerCase()) {
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'Completed';
                break;
            case 'in progress':
                statusClass = 'status-in-progress';
                statusText = 'In Progress';
                break;
            case 'planned':
                statusClass = 'status-planned';
                statusText = 'Planned';
                break;
            default:
                statusClass = 'status-in-progress';
                statusText = project.status || 'In Progress';
        }
        
        const technologies = project.technologies || [];
        const displayedTechs = technologies.slice(0, 3);
        const hasMoreTechs = technologies.length > 3;
        
        let thumbnailHtml = '';
        if (project.thumbnail) {
            thumbnailHtml = `<img src="https://leonidgr-projects-production.up.railway.app/${project.thumbnail}" alt="${project.name}" class="project-thumbnail">`;
        } else {
            thumbnailHtml = `
                <div class="placeholder-thumbnail">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#171a1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            `;
        }
        
        const shortDescription = project.description ? project.description.substring(0, 120) + (project.description.length > 120 ? '...' : '') : 'No description available';
        
        card.innerHTML = `
            ${thumbnailHtml}
            <div class="project-status ${statusClass}">${statusText}</div>
            <div class="project-info">
                <h3 class="project-title">${project.name || 'Unnamed Project'}</h3>
                <p class="project-description">${shortDescription}</p>
                <div class="project-tech">
                    ${displayedTechs.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    ${hasMoreTechs ? `<span class="tech-tag">+${technologies.length - 3}</span>` : ''}
                </div>
            </div>
        `;
        

        card.addEventListener('click', () => {
            openProjectModal(project);
        });
        
        return card;
    }


    function openProjectModal(project) {
        modal.classList.add('modal-open');
        modalLoading.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const content = createModalContent(project);
        
        setTimeout(() => {
            modalContentContainer.innerHTML = content;
            modalLoading.style.display = 'none';
            
            document.querySelectorAll('.modal-gallery-image').forEach(img => {
                img.addEventListener('click', () => {
                    window.open(img.src, '_blank');
                });
            });
        }, 500);
    }

    function createModalContent(project) {
        let statusClass = '';
        let statusText = '';
        
        switch(project.status?.toLowerCase()) {
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'Completed';
                break;
            case 'in progress':
                statusClass = 'status-in-progress';
                statusText = 'In Progress';
                break;
            case 'planned':
                statusClass = 'status-planned';
                statusText = 'Planned';
                break;
            default:
                statusClass = 'status-in-progress';
                statusText = project.status || 'In Progress';
        }
        
        const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Unknown date';
        
        const updatedDate = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        }) : null;
        
        let linksHtml = '';
        if (project.github || project.live_demo) {
            linksHtml = `
                <div class="modal-project-links">
                    ${project.github ? `
                    <a href="${project.github}" target="_blank" class="modal-project-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        GitHub Repository
                    </a>
                    ` : ''}
                    ${project.live_demo ? `
                    <a href="${project.live_demo}" target="_blank" class="modal-project-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Live Demo
                    </a>
                    ` : ''}
                </div>
            `;
        }
        

        let imagesHtml = '';
        if (project.images && project.images.length > 0) {
            imagesHtml = `
                <div class="modal-images">
                    <div class="modal-section-title">Project Images</div>
                    <div class="modal-image-gallery">
                        ${project.images.map(img => `
                            <img src="https://leonidgr-projects-production.up.railway.app/${img}" alt="${project.name}" class="modal-gallery-image">
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="modal-header">
                <h1 class="modal-project-title">${project.name || 'Unnamed Project'}</h1>
                <span class="modal-project-status ${statusClass}">${statusText}</span>
                ${linksHtml}
            </div>
            
            <div class="modal-section">
                <div class="modal-section-title">Description</div>
                <div class="modal-section-content">
                    ${project.description || 'No description available'}
                </div>
            </div>
            
            ${project.goal ? `
            <div class="modal-section">
                <div class="modal-section-title">Project Goal</div>
                <div class="modal-section-content">
                    ${project.goal}
                </div>
            </div>
            ` : ''}
            
            ${project.role ? `
            <div class="modal-section">
                <div class="modal-section-title">My Role</div>
                <div class="modal-section-content">
                    ${project.role}
                </div>
            </div>
            ` : ''}
            
            ${project.technologies && project.technologies.length > 0 ? `
            <div class="modal-section">
                <div class="modal-section-title">Technologies</div>
                <div class="modal-tech-stack">
                    ${project.technologies.map(tech => `<span class="modal-tech-item">${tech}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${imagesHtml}
            
            <div class="modal-dates">
                Created: ${createdDate}
                ${updatedDate ? `<br>Last updated: ${updatedDate}` : ''}
            </div>
        `;
    }


    closeModal.addEventListener('click', () => {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
        

        setTimeout(() => {
            modalContentContainer.innerHTML = '';
        }, 300);
    });


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal-open');
            document.body.style.overflow = '';
            

            setTimeout(() => {
                modalContentContainer.innerHTML = '';
            }, 300);
        }
    });


    loadMoreButton.addEventListener('click', displayProjects);


    fetchProjects();
    

    loadMoreButton.addEventListener('mouseenter', () => {
        loadMoreButton.style.transform = 'translateY(-3px)';
    });
    
    loadMoreButton.addEventListener('mouseleave', () => {
        loadMoreButton.style.transform = 'translateY(0)';
    });


    const projectLink = document.getElementById('project-link');
    if (projectLink) {
        projectLink.setAttribute('href', '#project');
    }
});



function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}


function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        if (isInViewport(card)) {
            card.classList.add('animated');
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateSkillCards, 500);
});


window.addEventListener('scroll', function() {
    animateSkillCards();
});


document.addEventListener('DOMContentLoaded', function() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});