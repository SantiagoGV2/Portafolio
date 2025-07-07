function oscuro() {
    document.body.classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('cv-download-btn');
    var countDiv = document.getElementById('cv-download-count');
    var count = localStorage.getItem('cvDownloadCount') || 0;
    countDiv.textContent = `Descargas en este navegador: ${count}`;

    btn.addEventListener('click', function () {
        count++;
        localStorage.setItem('cvDownloadCount', count);
        countDiv.textContent = `Descargas en este navegador: ${count}`;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var videoModal = document.getElementById('videoModal');
    var projectVideo = document.getElementById('projectVideo');
    var videoSource = projectVideo.querySelector('source');
    var projectIframe = document.getElementById('projectIframe');
    var modalBody = projectVideo.parentElement;

    // Crear mensaje de error si no existe
    var errorMsg = document.createElement('div');
    errorMsg.className = 'text-center text-white py-5';
    errorMsg.style.display = 'none';
    errorMsg.textContent = 'No se encuentra el video para este proyecto.';

    if (!modalBody.contains(errorMsg)) {
        modalBody.appendChild(errorMsg);
    }

    document.querySelectorAll('.live-demo-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var videoUrl = btn.getAttribute('data-video');
            var youtubeUrl = btn.getAttribute('data-youtube');

            // Reset
            errorMsg.style.display = 'none';
            projectVideo.style.display = 'none';
            projectIframe.style.display = 'none';

            if (youtubeUrl && youtubeUrl.trim() !== "") {
                // Convertir enlace de YouTube a embed
                let embedUrl = youtubeUrl.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/");
                projectIframe.src = embedUrl + "?autoplay=1";
                projectIframe.style.display = 'block';
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            } else if (videoUrl && videoUrl.trim() !== "") {
                videoSource.src = videoUrl;
                projectVideo.load();
                projectVideo.style.display = 'block';
                projectVideo.oncanplay = function() {
                    projectVideo.play();
                };
                projectVideo.onerror = function() {
                    projectVideo.style.display = 'none';
                    errorMsg.style.display = 'block';
                };
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            } else {
                errorMsg.style.display = 'block';
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            }

            // Limpiar al cerrar
            videoModal.addEventListener('hidden.bs.modal', function () {
                projectVideo.pause();
                projectVideo.currentTime = 0;
                videoSource.src = "";
                projectVideo.load();
                projectIframe.src = "";
                errorMsg.style.display = 'none';
                projectVideo.style.display = 'none';
                projectIframe.style.display = 'none';
            }, { once: true });
        });
    });
});