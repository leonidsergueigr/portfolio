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
