const humb = document.getElementById("humdericon");
const navList = document.querySelector(".nav-list");

humb.addEventListener("click", () => {
    navList.classList.toggle("nav-show");
});




const splineViewer = document.querySelector('spline-viewer');

// Assurez-vous que le composant est bien chargé
splineViewer.addEventListener('load', () => {
    const canvas = splineViewer.shadowRoot.querySelector('canvas');
    if (canvas) {
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
});

// Créer un conteneur pour les particules dans le hero
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.getElementById('hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-container';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.zIndex = '0';
    
    // Insérer le conteneur au début du hero
    hero.insertBefore(particlesContainer, hero.firstChild);
    
    // Ajouter les styles CSS pour les particules
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(23, 26, 31, 0.1);
            pointer-events: none;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
            }
            50% {
                transform: translateY(-20px) translateX(10px);
            }
            100% {
                transform: translateY(0) translateX(0);
            }
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.7;
            }
            100% {
                transform: scale(1);
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Créer les particules
    const numberOfParticles = 30;
    
    for (let i = 0; i < numberOfParticles; i++) {
        createParticle(particlesContainer);
    }
    
    // Ajouter quelques formes géométriques pour plus de variété
    addGeometricShapes(particlesContainer);
});

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Taille aléatoire
    const size = Math.random() * 40 + 10; // entre 10px et 50px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position aléatoire
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Animation personnalisée
    const animationDuration = Math.random() * 15 + 10; // entre 10s et 25s
    const animationDelay = Math.random() * 5;
    
    particle.style.animation = `float ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
    
    // Appliquer une seconde animation pour plus de dynamisme
    if (Math.random() > 0.5) {
        const pulseAnimation = `pulse ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 2}s infinite`;
        particle.style.animation += `, ${pulseAnimation}`;
    }
    
    container.appendChild(particle);
}

function addGeometricShapes(container) {
    // Ajouter quelques formes géométriques en SVG
    const shapes = [
        // Forme 1: Cercle avec motif
        `<svg width="100" height="100" class="geo-shape" style="position: absolute; top: 20%; right: 15%; opacity: 0.1; transform: rotate(0deg);">
            <circle cx="50" cy="50" r="40" stroke="#171a1f" stroke-width="1" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#171a1f" stroke-width="1" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="#171a1f" stroke-width="1" fill="none" />
        </svg>`,
        
        // Forme 2: Triangle
        `<svg width="80" height="80" class="geo-shape" style="position: absolute; bottom: 30%; left: 10%; opacity: 0.1; transform: rotate(0deg);">
            <polygon points="40,10 70,70 10,70" stroke="#171a1f" stroke-width="1" fill="none" />
        </svg>`,
        
        // Forme 3: Hexagone
        `<svg width="120" height="120" class="geo-shape" style="position: absolute; top: 60%; right: 25%; opacity: 0.1; transform: rotate(0deg);">
            <polygon points="60,10 110,40 110,80 60,110 10,80 10,40" stroke="#171a1f" stroke-width="1" fill="none" />
        </svg>`,
        
        // Forme 4: Lignes croisées
        `<svg width="150" height="150" class="geo-shape" style="position: absolute; top: 15%; left: 20%; opacity: 0.1; transform: rotate(0deg);">
            <line x1="0" y1="0" x2="150" y2="150" stroke="#171a1f" stroke-width="1" />
            <line x1="150" y1="0" x2="0" y2="150" stroke="#171a1f" stroke-width="1" />
            <circle cx="75" cy="75" r="50" stroke="#171a1f" stroke-width="1" fill="none" />
        </svg>`
    ];
    
    // Ajouter les formes au conteneur
    shapes.forEach(shapeSvg => {
        const shapeWrapper = document.createElement('div');
        shapeWrapper.innerHTML = shapeSvg;
        const shape = shapeWrapper.firstChild;
        
        // Animation pour faire tourner lentement les formes
        const rotationSpeed = Math.random() * 60 + 40; // entre 40s et 100s
        shape.style.animation = `rotate ${rotationSpeed}s linear infinite`;
        
        container.appendChild(shape);
    });
    
    // Ajouter le keyframe pour la rotation
    const rotateStyle = document.createElement('style');
    rotateStyle.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(rotateStyle);
}
