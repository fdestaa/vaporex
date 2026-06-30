import React from 'react';
import { useLocation } from 'react-router';

const contentMap = {
  '/privacy': {
    title: 'Kebijakan Privasi',
    content: (
      <>
        <p>Kebijakan privasi ini mengatur bagaimana VapoRex mengumpulkan, menggunakan, memelihara, dan mengungkapkan informasi yang dikumpulkan dari pengguna situs web kami. Privasi Anda sangat penting bagi kami.</p>
        <br/>
        <h3>1. Informasi yang Kami Kumpulkan</h3>
        <p>Kami dapat mengumpulkan informasi identifikasi pribadi dari Pengguna ketika mereka mendaftar di situs, melakukan pemesanan, berlangganan newsletter, atau berinteraksi dengan fitur lain di platform kami. Informasi yang dikumpulkan mencakup nama, alamat email, alamat pengiriman, dan nomor telepon. Kami hanya mengumpulkan informasi ini jika Pengguna menyerahkannya secara sukarela.</p>
        <br/>
        <h3>2. Penggunaan Informasi</h3>
        <p>Informasi yang kami kumpulkan digunakan untuk:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Memproses Pesanan:</strong> Mengirimkan produk dan konfirmasi pembayaran.</li>
          <li><strong>Meningkatkan Layanan:</strong> Masukan Anda membantu kami merespons kebutuhan pelanggan dengan lebih baik.</li>
          <li><strong>Mengirimkan Email Berkala:</strong> Memberikan update terkait pesanan, promo terbaru, atau informasi produk.</li>
        </ul>
        <br/>
        <h3>3. Perlindungan Data</h3>
        <p>Kami menerapkan praktik pengumpulan, penyimpanan, dan pemrosesan data yang tepat serta langkah-langkah keamanan untuk melindungi dari akses yang tidak sah, perubahan, pengungkapan, atau perusakan informasi pribadi dan data transaksi Anda.</p>
        <br/>
        <h3>4. Berbagi Informasi Pribadi</h3>
        <p>Kami <strong>tidak pernah</strong> menjual, memperdagangkan, atau menyewakan informasi identifikasi pribadi Pengguna kepada pihak ketiga. Kami hanya berbagi data generik yang tidak terkait dengan informasi pribadi dengan mitra bisnis terpercaya untuk keperluan analitik logistik.</p>
      </>
    )
  },
  '/terms': {
    title: 'Syarat & Ketentuan',
    content: (
      <>
        <p>Selamat datang di VapoRex. Dengan mengakses situs web ini, kami berasumsi Anda menyetujui syarat dan ketentuan ini secara penuh. Harap baca dengan saksama sebelum melakukan transaksi.</p>
        <br/>
        <h3>1. Batasan Usia (18+)</h3>
        <p><strong>PENTING:</strong> Produk yang kami jual (terutama e-liquid yang mengandung nikotin) diperuntukkan <strong>HANYA untuk orang dewasa berusia 18 tahun ke atas</strong>. Dengan menggunakan situs ini, Anda secara hukum menyatakan bahwa Anda berusia minimal 18 tahun. VapoRex berhak membatalkan pesanan jika terbukti ada pemalsuan umur.</p>
        <br/>
        <h3>2. Informasi Produk dan Harga</h3>
        <p>Kami berusaha menampilkan warna, deskripsi, dan harga produk seakurat mungkin. Namun, kami tidak menjamin bahwa semua deskripsi produk sepenuhnya bebas dari kesalahan. Harga dan ketersediaan produk dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>
        <br/>
        <h3>3. Kebijakan Pembayaran</h3>
        <p>Pembayaran harus diselesaikan dalam waktu 1x24 jam setelah pesanan dibuat (Checkout). Jika melewati batas waktu tersebut, pesanan akan dibatalkan secara otomatis oleh sistem kami.</p>
        <br/>
        <h3>4. Kebijakan Pengembalian (Return)</h3>
        <p>Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali terdapat cacat produksi dari pabrik. Klaim barang cacat wajib menyertakan <strong>Video Unboxing</strong> utuh tanpa jeda, maksimal 1x24 jam setelah barang berstatus "Diterima" oleh sistem kurir.</p>
      </>
    )
  },
  '/faq': {
    title: 'Pertanyaan yang Sering Diajukan (FAQ)',
    content: (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '0.5rem' }}>Q: Apakah semua produk yang dijual di VapoRex original?</h3>
            <p><strong>A:</strong> Ya, kami berani menjamin 100% bahwa seluruh produk yang kami jual, mulai dari Device, Liquid, hingga Aksesoris adalah barang otentik dan original dari pabrikan. Kami tidak menjual barang clone atau palsu.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '0.5rem' }}>Q: Kapan pesanan saya akan dikirim?</h3>
            <p><strong>A:</strong> Pesanan yang pembayarannya dikonfirmasi sebelum jam 15:00 WIB (Senin-Jumat) atau jam 13:00 WIB (Sabtu) akan dikirim pada hari yang sama. Pesanan di luar jam tersebut atau pada hari libur akan dikirim pada hari kerja berikutnya.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '0.5rem' }}>Q: Bagaimana jika barang yang saya terima rusak atau kurang?</h3>
            <p><strong>A:</strong> Jangan panik! Segera hubungi Customer Service kami melalu WhatsApp. Anda diwajibkan untuk melampirkan <strong>Video Unboxing</strong> (dari paket tersegel hingga dibuka) sebagai syarat mutlak klaim garansi. Kami akan mengganti produk Anda sepenuhnya.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '0.5rem' }}>Q: Apakah VapoRex melayani pembayaran COD (Cash on Delivery)?</h3>
            <p><strong>A:</strong> Untuk saat ini, kami belum melayani metode pembayaran COD guna menghindari pembatalan sepihak dan kerusakan produk cairan selama proses retur kurir. Kami hanya menerima Transfer Bank dan E-Wallet (OVO, GoPay, Dana).</p>
          </div>
        </div>
      </>
    )
  },
  '/how-to-order': {
    title: 'Panduan Cara Pemesanan',
    content: (
      <>
        <p style={{ marginBottom: '1.5rem' }}>Berbelanja di VapoRex sangat mudah, cepat, dan aman. Ikuti panduan langkah demi langkah berikut ini untuk menyelesaikan pesanan Anda:</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>1. Pilih Produk</h3>
            <p>Jelajahi halaman <a href="/shop" style={{color: 'var(--color-primary)'}}>Produk</a> kami. Gunakan fitur pencarian atau filter kategori di sebelah kiri untuk menemukan Device atau Liquid yang Anda cari. Klik produk untuk melihat detail dan varian.</p>
          </div>
          
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>2. Tambahkan ke Keranjang</h3>
            <p>Setelah memilih produk beserta varian (Warna/Kadar Nikotin) dan jumlahnya, klik tombol <strong>"Tambah ke Keranjang"</strong>. Anda bisa melanjutkan belanja atau langsung menuju kasir.</p>
          </div>
          
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>3. Proses Checkout</h3>
            <p>Klik ikon keranjang di sudut kanan atas dan pilih <strong>"Checkout"</strong>. Isi data diri dan alamat pengiriman Anda dengan lengkap dan benar agar kurir tidak kesulitan menemukan lokasi Anda.</p>
          </div>
          
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>4. Pembayaran</h3>
            <p>Pilih metode pembayaran yang Anda inginkan (BCA, Mandiri, OVO, atau GoPay). Lakukan transfer sesuai dengan nominal hingga tiga digit terakhir untuk mempermudah proses verifikasi otomatis oleh sistem kami.</p>
          </div>
          
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>5. Konfirmasi & Pengiriman</h3>
            <p>Setelah pembayaran terverifikasi, Anda akan menerima email notifikasi bahwa pesanan sedang diproses. Nomor resi pengiriman akan diupdate paling lambat H+1 setelah pengiriman dilakukan.</p>
          </div>
        </div>
      </>
    )
  },
  '/about': {
    title: 'Tentang VapoRex',
    content: (
      <>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>VapoRex</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-subtle)' }}>Pionir Gaya Hidup Vaping Modern di Indonesia</p>
        </div>
        
        <h3>Kisah Kami</h3>
        <p>Didirikan pada awal tahun 2023, VapoRex bermula dari sebuah komunitas kecil penikmat vapor di Jakarta Selatan yang kesulitan menemukan produk original dengan harga yang masuk akal. Kami menyadari tingginya peredaran barang palsu (clone) yang dapat membahayakan pengguna.</p>
        <br/>
        <p>Dari situlah VapoRex lahir. Kami membangun platform e-commerce yang didedikasikan sepenuhnya untuk menyajikan kurasi produk vape otentik 100%, mulai dari pod system pemula hingga mod kit bagi enthusiast, serta pilihan liquid lokal maupun internasional terlengkap.</p>
        <br/>
        
        <h3>Visi & Misi</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Visi:</strong> Menjadi destinasi utama dan terpercaya bagi perokok dewasa di Indonesia yang mencari alternatif yang lebih baik melalui produk vaping yang aman dan berkualitas.</li>
          <li><strong>Misi:</strong> Memberikan edukasi yang tepat tentang industri vape, memerangi peredaran barang palsu, dan memberikan layanan pelanggan dengan standar tertinggi (Bintang 5).</li>
        </ul>
        <br/>
        
        <h3>Mengapa Memilih Kami?</h3>
        <p>Kami tidak sekadar menjual barang. Tim support kami terdiri dari <em>vapers</em> berpengalaman yang siap membantu merekomendasikan device atau liquid yang paling cocok dengan preferensi Anda. Kami percaya bahwa transisi dari rokok konvensional membutuhkan pendampingan dan perangkat yang tepat.</p>
      </>
    )
  },
  '/contact': {
    title: 'Hubungi Kami',
    content: (
      <>
        <p style={{ marginBottom: '2rem' }}>Punya pertanyaan seputar produk? Mengalami kendala saat pemesanan? Atau sekadar ingin meminta rekomendasi liquid yang enak? Tim VapoRex selalu siap sedia membantu Anda!</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-light)' }}>Informasi Kontak</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text)' }}>📍 Alamat Toko Offline</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>Jl. Vape Street No. 42, Senopati<br/>Jakarta Selatan, DKI Jakarta 12190</span>
              </div>
              
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text)' }}>📞 Telepon / WhatsApp</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>+62 812-3456-7890 (Fast Response)</span>
              </div>
              
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text)' }}>✉️ Email Support</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>hello@vaporex.id</span>
              </div>
              
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text)' }}>🕒 Jam Operasional</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>Senin - Sabtu: 10:00 - 21:00 WIB<br/>Minggu & Hari Libur: Tutup</span>
              </div>
            </div>
          </div>
          
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-light)' }}>Tinggalkan Pesan</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Pesan berhasil dikirim!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nama Lengkap</label>
                <input type="text" className="vpr-input" placeholder="Masukkan nama Anda" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                <input type="email" className="vpr-input" placeholder="Masukkan email Anda" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Pesan</label>
                <textarea className="vpr-input" rows="4" placeholder="Tuliskan pertanyaan atau kendala Anda..." required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white', resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" className="vpr-btn vpr-btn--primary" style={{ marginTop: '0.5rem' }}>Kirim Pesan</button>
            </form>
          </div>
        </div>
      </>
    )
  }
};

export default function StaticPage() {
  const location = useLocation();
  const pageData = contentMap[location.pathname] || {
    title: 'Halaman Tidak Ditemukan',
    content: <p>Maaf, konten yang Anda cari tidak ada.</p>
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary-light)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>{pageData.title}</h1>
      <div style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
        {pageData.content}
      </div>
    </div>
  );
}
