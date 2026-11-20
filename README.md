# PEMBELAJARAN – Dashboard Pembelajaran Magister Teknik Elektro ITS

Dashboard pembelajaran terstruktur (Semester 1–3, Rekayasa Elektrik Berkelanjutan) yang disusun dari folder kuliah `1. MAGISTER TEKNIK ITS`.

Isi:
- **Ringkasan** – jumlah mata kuliah, SKS, dan progres penguasaan per semester
- **Mata Kuliah** – peta materi per minggu/topik, tugas, bahan rujukan, kaitan dengan tesis, dan lokasi file; dapat dicari dan dicentang
- **Benang Merah Materi** – urutan belajar per tema lintas semester
- **Jalur Tesis** – linimasa hingga penelitian hosting capacity EV + PLTS
- **Pelatihan & Pendukung** – training DIgSILENT, belajar coding, referensi umum

Buka `index.html` di browser atau melalui GitHub Pages. Data dapat diperbarui pada objek `DATA` di dalam `index.html`.
Centang topik tersimpan di browser masing-masing (localStorage).

## Koneksi Google Drive (selalu terbaru)

Menu **Google Drive → File materi kuliah** dan bagian **File di Google Drive** di setiap halaman mata kuliah membaca folder *MATERI KULIAH* langsung dari Drive. Isinya otomatis diperbarui setiap 60 detik dan setiap kali halaman dibuka. File dibaca di dalam dashboard lewat pratinjau Drive.

Folder Drive tetap privat. Dashboard membacanya lewat Google Apps Script (`apps-script/Code.gs`) yang berjalan di akun pemilik dan hanya melayani permintaan yang membawa kunci akses. URL dan kunci disimpan di browser masing-masing perangkat (menu **Pengaturan Drive**), tidak di repo ini.

Langkah pemasangannya ada di menu Pengaturan Drive dan di bagian atas `apps-script/Code.gs`.
