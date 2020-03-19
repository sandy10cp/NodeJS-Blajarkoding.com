//bold navigation
$(function () {
    var path = window.location.href; // Mengambil data URL pada Address bar
    $('.nav-item a').each(function () {
        // Jika URL pada menu ini sama persis dengan path...
        if (this.href == path) {
            // Tambahkan kelas "active" pada menu ini
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            $(this).addClass('active');
        }
    });
});