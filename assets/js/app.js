const kota = "Batam";
const DURASI_SHOLAT = 30; // menit

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=11`)
    .then(res => res.json())
    .then(data => {
        const t = data.data.timings;

        const jadwal = [
            { nama: "Subuh", waktu: t.Fajr },
            { nama: "Dzuhur", waktu: t.Dhuhr },
            { nama: "Ashar", waktu: t.Asr },
            { nama: "Maghrib", waktu: t.Maghrib },
            { nama: "Isya", waktu: t.Isha }
        ];

        document.getElementById("tanggal").innerText =
            data.data.date.readable + " • " + kota;

        renderJadwal(jadwal);
        setInterval(() => renderJadwal(jadwal), 1000);
    });

function renderJadwal(jadwal) {
    const container = document.getElementById("jadwal");
    container.innerHTML = "";

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    jadwal.forEach(item => {
        const [h, m] = item.waktu.split(":").map(Number);
        const start = h * 60 + m;
        const end = start + DURASI_SHOLAT;

        const card = document.createElement("div");
        card.className = "prayer-card";

        let statusText = "";

        if (nowMinutes >= start && nowMinutes < end) {
            card.classList.add("active");
            statusText = `<small>Sedang Berlangsung</small>`;
        } else if (nowMinutes < start) {
            const diff = start - nowMinutes;
            statusText = `<small>${formatCountdown(diff)}</small>`;
        } else {
            statusText = `<small>Telah Selesai</small>`;
        }

        card.innerHTML = `
      <h3>${item.nama}</h3>
      <p>${item.waktu}</p>
      ${statusText}
    `;

        container.appendChild(card);
    });
}

function formatCountdown(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `Mulai ${h}j ${m}m lagi`;
    return `Mulai ${m} menit lagi`;
}

document.querySelectorAll(".accordion-header").forEach(btn => {
    btn.addEventListener("click", () => {
        const item = btn.parentElement;
        item.classList.toggle("active");
    });
});
