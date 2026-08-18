import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { compressImageFile } from '../utils/imageUpload';
import { uploadVideoFile, deleteVideoByUrl } from '../utils/videoUpload';
import { useStoreStatus, DAY_LABELS } from '../utils/storeStatus';
import { 
  AdminUser, 
  SiteSettings, 
  StoreInfo, 
  Product, 
  CustomPhoto, 
  OrderDetails,
  FontFamilyType, 
  FontSizeScale, 
  PrimaryColorTheme,
  TahfidzProfile,
  Santri,
  KegiatanSantri,
  CustomPage,
  NavLabels,
  KiosSedekahProfile,
  KiosSedekahPhoto,
  NavItemConfig,
  HeroContent,
  FooterContent,
  AboutPageContent
} from '../types';
import { 
  Lock, 
  UserCheck, 
  LogOut, 
  Type, 
  Image as ImageIcon, 
  Package, 
  Store, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  Sliders, 
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  DollarSign,
  Clock,
  Truck,
  Search,
  Eye,
  X,
  FileText,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  Download,
  Printer,
  FileSpreadsheet,
  FileCode,
  BookOpen,
  GraduationCap,
  Calendar,
  Upload,
  UserPlus,
  User,
  HeartHandshake,
  EyeOff,
  GripVertical,
  SlidersHorizontal,
  Info,
  Video as VideoIcon
} from 'lucide-react';

/** Pratinjau real-time badge BUKA/TUTUP mengikuti jam & hari yang sedang diketik admin,
 * sebelum disimpan — supaya admin langsung tahu hasilnya tanpa harus save dulu. */
const StoreStatusPreview: React.FC<{
  statusMode: 'otomatis' | 'manual';
  storeStatus: 'buka' | 'tutup';
  openTime: string;
  closeTime: string;
  closedDays: number[];
}> = ({ statusMode, storeStatus, openTime, closeTime, closedDays }) => {
  const { isOpen, currentTime } = useStoreStatus({
    statusMode,
    storeStatus,
    openTime,
    closeTime,
    closedDays,
  } as StoreInfo);

  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200">
      <div className="text-[11px] text-neutral-500">
        Pratinjau saat ini ({currentTime} WIB):
      </div>
      <span
        className={`text-[11px] px-2.5 py-1 rounded-full border font-bold ${
          isOpen
            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
            : 'bg-rose-500/10 text-rose-700 border-rose-300'
        }`}
      >
        {isOpen ? 'BUKA' : 'TUTUP'}
      </span>
    </div>
  );
};

interface AdminPanelProps {
  adminUser?: AdminUser | null;
  siteSettings?: SiteSettings;
  storeInfo?: StoreInfo;
  products?: Product[];
  photos?: CustomPhoto[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adminUser = db.getAdminUser(),
  siteSettings = db.getSiteSettings(),
  storeInfo = db.getStoreInfo(),
  products = db.getProducts(),
  photos = db.getPhotos(),
}) => {
  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'photos' | 'page_content' | 'tahfidz_profile' | 'tahfidz_santri' | 'tahfidz_kegiatan' | 'kios_sedekah' | 'styling' | 'store_info' | 'pages' | 'database'>('overview');

  // Orders State
  const [orders, setOrders] = useState<OrderDetails[]>(() => db.getOrders());
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<OrderDetails | null>(null);

  // Tahfidz States
  const [tahfidzProfile, setTahfidzProfile] = useState<TahfidzProfile>(() => db.getTahfidzProfile());
  const [santriList, setSantriList] = useState<Santri[]>(() => db.getSantriList());
  const [kegiatanList, setKegiatanList] = useState<KegiatanSantri[]>(() => db.getKegiatanList());

  // Custom Pages State (halaman tambahan)
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => db.getCustomPages());
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageForm, setPageForm] = useState<{ title: string; content: string; icon: string }>({
    title: '',
    content: '',
    icon: '📄',
  });

  // Kios Sedekah State
  const [kiosSedekahProfile, setKiosSedekahProfile] = useState<KiosSedekahProfile>(() => db.getKiosSedekahProfile());

  // Editing Santri State
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [santriForm, setSantriForm] = useState<Omit<Santri, 'id'>>({
    nis: '',
    name: '',
    gender: 'L',
    age: 12,
    hafalanJuz: 1,
    status: 'Aktif',
    wali: '',
    phoneWali: '',
    photoUrl: '',
    joinedDate: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  // Editing Kegiatan State
  const [editingKegiatan, setEditingKegiatan] = useState<KegiatanSantri | null>(null);
  const [kegiatanForm, setKegiatanForm] = useState<Omit<KegiatanSantri, 'id' | 'createdAt'>>({
    title: '',
    category: 'Setoran Hafalan',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: '08:00 - 10:00 WIB',
    location: "Rumah Tahfidz Nurul A'laa",
    description: '',
    photoUrl: ''
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Peringatan bila data gagal tersimpan ke cloud (dulu hanya muncul di console).
  const [syncWarning, setSyncWarning] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setOrders(db.getOrders());
      setTahfidzProfile(db.getTahfidzProfile());
      setSantriList(db.getSantriList());
      setKegiatanList(db.getKegiatanList());
      setCustomPages(db.getCustomPages());
      setKiosSedekahProfile(db.getKiosSedekahProfile());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db.subscribeSyncStatus((status) => {
      setSyncWarning(status.ok ? null : status.message);
    });
    return () => unsubscribe();
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Handle Login — memverifikasi lewat Firebase Authentication sungguhan.
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Silakan masukkan email aktif dan kata sandi Anda.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      setLoginError('Format email tidak valid. Gunakan email aktif seperti admin@tokosembako.com');
      return;
    }

    setIsLoggingIn(true);
    try {
      await db.loginAdmin(loginEmail.trim(), loginPassword);
      showToast(`Selamat datang, ${loginEmail}! Login admin berhasil.`);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setLoginError('Email atau kata sandi salah. Periksa kembali data Anda.');
      } else if (code === 'auth/too-many-requests') {
        setLoginError('Terlalu banyak percobaan login. Coba lagi beberapa saat lagi.');
      } else {
        setLoginError('Gagal login. Silakan coba lagi.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    db.logoutAdmin();
    showToast('Anda telah keluar dari Panel Admin.');
  };

  // ---------------- ORDERS HANDLERS ----------------
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderDetails['status']) => {
    db.updateOrderStatus(orderId, newStatus);
    showToast(`Status pesanan ${orderId} berhasil diubah ke "${newStatus}"!`);
  };

  const handleDeleteOrder = (orderId: string, customerName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pesanan ${orderId} milik ${customerName}?`)) {
      db.deleteOrder(orderId);
      if (selectedOrderForDetail?.id === orderId) {
        setSelectedOrderForDetail(null);
      }
      showToast(`Pesanan ${orderId} berhasil dihapus.`);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const searchLower = orderSearch.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.phone.includes(searchLower) ||
      order.address.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  // Analytics Metrics
  const totalOmset = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Menunggu Konfirmasi').length;
  const processingOrdersCount = orders.filter((o) => o.status === 'Diproses' || o.status === 'Siap Diantar').length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // ---------------- EXPORT HANDLERS (CSV, PDF, JSON) ----------------
  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('Tidak ada data pesanan untuk diekspor.');
      return;
    }
    const headers = ['ID Pesanan', 'Tanggal', 'Nama Pembeli', 'No Telepon', 'Alamat', 'Tipe Pengiriman', 'Metode Bayar', 'Total Belanja (Rp)', 'Status', 'Catatan'];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${o.date}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.deliveryType}"`,
      `"${o.paymentMethod}"`,
      o.totalAmount,
      `"${o.status}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Pesanan_Sembako_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan Pesanan berhasil diekspor ke CSV!');
  };

  const handleExportOrdersPDF = () => {
    if (orders.length === 0) {
      alert('Tidak ada data pesanan untuk diekspor PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Mohon izinkan popup browser.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Pesanan Toko Sembako</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #111; }
          h2 { text-align: center; margin-bottom: 5px; color: #065f46; }
          p.subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
          th { background-color: #065f46; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .total { font-weight: bold; text-align: right; margin-top: 15px; font-size: 14px; color: #065f46; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h2>LAPORAN PESANAN TOKO SEMBAKO BERKAH UTAMA</h2>
        <p class="subtitle">Dicetak pada: ${new Date().toLocaleString('id-ID')} | Total Pesanan: ${orders.length}</p>
        <table>
          <thead>
            <tr>
              <th>ID & Tanggal</th>
              <th>Pembeli & No. HP</th>
              <th>Alamat</th>
              <th>Metode & Tipe</th>
              <th>Status</th>
              <th>Total Belanja</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((o) => `
              <tr>
                <td><strong>${o.id}</strong><br><small>${o.date}</small></td>
                <td><strong>${o.customerName}</strong><br><small>${o.phone}</small></td>
                <td><small>${o.address}</small></td>
                <td>${o.paymentMethod.toUpperCase()} (${o.deliveryType})</td>
                <td>${o.status}</td>
                <td><strong>${formatRupiah(o.totalAmount)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">Total Omset Pesanan: ${formatRupiah(totalOmset)}</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    showToast('Pratinjau cetak PDF laporan pesanan siap!');
  };

  const handleExportProductsCSV = () => {
    if (products.length === 0) {
      alert('Tidak ada produk untuk diekspor.');
      return;
    }
    const headers = ['ID Produk', 'Nama Produk', 'Kategori', 'Harga Eceran (Rp)', 'Harga Grosir (Rp)', 'Satuan', 'Stok Gudang', 'Best Seller'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      p.wholesalePrice || p.price,
      `"${p.unit}"`,
      p.stock,
      p.isBestSeller ? 'Ya' : 'Tidak'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Katalog_Sembako_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Katalog Produk berhasil diekspor ke CSV!');
  };

  const handleExportProductsPDF = () => {
    if (products.length === 0) {
      alert('Tidak ada produk untuk diekspor PDF.');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Mohon izinkan popup browser.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daftar Katalog Produk Sembako</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #111; }
          h2 { text-align: center; margin-bottom: 5px; color: #065f46; }
          p.subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
          th { background-color: #065f46; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h2>DAFTAR KATALOG SEMBAKO BERKAH UTAMA</h2>
        <p class="subtitle">Dicetak pada: ${new Date().toLocaleString('id-ID')} | Total Produk: ${products.length}</p>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga Eceran</th>
              <th>Harga Grosir</th>
              <th>Stok Gudang</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${formatRupiah(p.price)} / ${p.unit}</td>
                <td>${formatRupiah(p.wholesalePrice || p.price)}</td>
                <td>${p.stock} ${p.unit}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    showToast('Pratinjau cetak PDF katalog produk siap!');
  };

  const handleExportJSON = () => {
    const data = {
      products: db.getProducts(),
      orders: db.getOrders(),
      storeInfo: db.getStoreInfo(),
      siteSettings: db.getSiteSettings(),
      photos: db.getPhotos(),
      exportDate: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Backup_Database_Sembako_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Seluruh Database berhasil diekspor ke file JSON!');
  };

  // ---------------- TAHFIDZ HANDLERS ----------------
  const handleSaveTahfidzProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveTahfidzProfile(tahfidzProfile);
    showToast("Profil, Visi, Misi & Logo Rumah Tahfidz Nurul A'laa berhasil disimpan!");
  };

  const [isUploadingTahfidzLogo, setIsUploadingTahfidzLogo] = useState(false);
  const handleTahfidzLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingTahfidzLogo(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 400, maxSizeKB: 60 });
      setTahfidzProfile((prev) => ({ ...prev, logoUrl: compressed }));
      showToast('Logo Rumah Tahfidz diunggah! Klik "Simpan Perubahan Profil" untuk menyimpan.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingTahfidzLogo(false);
      e.target.value = '';
    }
  };

  // ---------------- KIOS SEDEKAH HANDLERS ----------------
  const handleSaveKiosSedekahProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveKiosSedekahProfile(kiosSedekahProfile);
    showToast('Profil Kios Sedekah berhasil disimpan!');
  };

  const [isUploadingKiosLogo, setIsUploadingKiosLogo] = useState(false);
  const handleKiosSedekahLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingKiosLogo(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 400, maxSizeKB: 60 });
      setKiosSedekahProfile((prev) => ({ ...prev, logoUrl: compressed }));
      showToast('Logo Kios Sedekah diunggah! Klik "Simpan Perubahan Profil" untuk menyimpan.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingKiosLogo(false);
      e.target.value = '';
    }
  };

  const [newKiosProgram, setNewKiosProgram] = useState('');
  const handleAddKiosProgram = () => {
    if (!newKiosProgram.trim()) return;
    setKiosSedekahProfile((prev) => ({ ...prev, programs: [...prev.programs, newKiosProgram.trim()] }));
    setNewKiosProgram('');
  };
  const handleRemoveKiosProgram = (index: number) => {
    setKiosSedekahProfile((prev) => ({ ...prev, programs: prev.programs.filter((_, i) => i !== index) }));
  };

  const [newKiosPhotoUrl, setNewKiosPhotoUrl] = useState('');
  const [newKiosPhotoCaption, setNewKiosPhotoCaption] = useState('');
  const [isUploadingKiosPhoto, setIsUploadingKiosPhoto] = useState(false);
  const handleKiosPhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingKiosPhoto(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 700, maxSizeKB: 100 });
      setNewKiosPhotoUrl(compressed);
      showToast('Foto diunggah! Isi keterangan lalu klik "Tambah Foto" untuk menyimpan.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingKiosPhoto(false);
      e.target.value = '';
    }
  };
  const handleAddKiosPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKiosPhotoUrl.trim()) return;
    const newPhoto: KiosSedekahPhoto = {
      id: `ksp-${Date.now()}`,
      url: newKiosPhotoUrl,
      caption: newKiosPhotoCaption,
    };
    const updated = { ...kiosSedekahProfile, photos: [...kiosSedekahProfile.photos, newPhoto] };
    setKiosSedekahProfile(updated);
    db.saveKiosSedekahProfile(updated);
    setNewKiosPhotoUrl('');
    setNewKiosPhotoCaption('');
    showToast('Foto dokumentasi Kios Sedekah ditambahkan!');
  };
  const handleDeleteKiosPhoto = (id: string) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;
    const updated = { ...kiosSedekahProfile, photos: kiosSedekahProfile.photos.filter((p) => p.id !== id) };
    setKiosSedekahProfile(updated);
    db.saveKiosSedekahProfile(updated);
    showToast('Foto dokumentasi dihapus.');
  };

  // Santri Handlers
  const handleSaveSantri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!santriForm.name.trim() || !santriForm.nis.trim()) {
      alert('Nama Santri dan NIS wajib diisi!');
      return;
    }

    if (editingSantri) {
      const updated: Santri = {
        ...editingSantri,
        ...santriForm,
      };
      db.updateSantri(updated);
      showToast(`Data santri ${santriForm.name} berhasil diperbarui!`);
    } else {
      db.addSantri(santriForm);
      showToast(`Santri baru ${santriForm.name} berhasil ditambahkan!`);
    }

    // Reset Form
    setEditingSantri(null);
    setSantriForm({
      nis: '',
      name: '',
      gender: 'L',
      age: 12,
      hafalanJuz: 1,
      status: 'Aktif',
      wali: '',
      phoneWali: '',
      photoUrl: '',
      joinedDate: new Date().toISOString().slice(0, 10),
      notes: ''
    });
  };

  const handleStartEditSantri = (santri: Santri) => {
    setEditingSantri(santri);
    setSantriForm({
      nis: santri.nis,
      name: santri.name,
      gender: santri.gender,
      age: santri.age,
      hafalanJuz: santri.hafalanJuz,
      status: santri.status,
      wali: santri.wali,
      phoneWali: santri.phoneWali || '',
      photoUrl: santri.photoUrl,
      joinedDate: santri.joinedDate,
      notes: santri.notes || ''
    });
  };

  const handleDeleteSantri = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data santri "${name}"?`)) {
      db.deleteSantri(id);
      showToast(`Data santri "${name}" telah dihapus.`);
    }
  };

  const [isUploadingSantriPhoto, setIsUploadingSantriPhoto] = useState(false);
  const handleSantriPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSantriPhoto(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 500, maxSizeKB: 70 });
      setSantriForm((prev) => ({ ...prev, photoUrl: compressed }));
      showToast('Foto santri berhasil diunggah!');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingSantriPhoto(false);
      e.target.value = '';
    }
  };

  // ---------------- CUSTOM PAGES HANDLERS ----------------
  const resetPageForm = () => {
    setEditingPage(null);
    setPageForm({ title: '', content: '', icon: '📄' });
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title.trim() || !pageForm.content.trim()) {
      alert('Judul Halaman dan Isi Konten wajib diisi!');
      return;
    }

    if (editingPage) {
      db.updateCustomPage({ ...editingPage, ...pageForm });
      showToast(`Halaman "${pageForm.title}" berhasil diperbarui!`);
    } else {
      db.addCustomPage(pageForm);
      showToast(`Halaman baru "${pageForm.title}" berhasil ditambahkan ke menu navigasi!`);
    }
    resetPageForm();
  };

  const handleStartEditPage = (page: CustomPage) => {
    setEditingPage(page);
    setPageForm({ title: page.title, content: page.content, icon: page.icon || '📄' });
  };

  const handleDeletePage = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus halaman "${title}"? Halaman ini juga akan hilang dari menu navigasi.`)) {
      db.deleteCustomPage(id);
      showToast(`Halaman "${title}" telah dihapus.`);
    }
  };

  // Kegiatan Santri Handlers
  const handleSaveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatanForm.title.trim() || !kegiatanForm.description.trim()) {
      alert('Judul Kegiatan dan Deskripsi wajib diisi!');
      return;
    }

    if (editingKegiatan) {
      const updated: KegiatanSantri = {
        ...editingKegiatan,
        ...kegiatanForm
      };
      db.updateKegiatan(updated);
      showToast(`Kegiatan "${kegiatanForm.title}" berhasil diperbarui!`);
    } else {
      db.addKegiatan(kegiatanForm);
      showToast(`Kegiatan baru "${kegiatanForm.title}" berhasil ditambahkan!`);
    }

    // Reset Form
    setEditingKegiatan(null);
    setKegiatanForm({
      title: '',
      category: 'Setoran Hafalan',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: '08:00 - 10:00 WIB',
      location: "Rumah Tahfidz Nurul A'laa",
      description: '',
      photoUrl: ''
    });
  };

  const handleStartEditKegiatan = (kegiatan: KegiatanSantri) => {
    setEditingKegiatan(kegiatan);
    setKegiatanForm({
      title: kegiatan.title,
      category: kegiatan.category,
      date: kegiatan.date,
      time: kegiatan.time || '',
      location: kegiatan.location || '',
      description: kegiatan.description,
      photoUrl: kegiatan.photoUrl
    });
  };

  const handleDeleteKegiatan = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kegiatan "${title}"?`)) {
      db.deleteKegiatan(id);
      showToast(`Kegiatan "${title}" telah dihapus.`);
    }
  };

  const [isUploadingKegiatanPhoto, setIsUploadingKegiatanPhoto] = useState(false);
  const handleKegiatanPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingKegiatanPhoto(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 700, maxSizeKB: 100 });
      setKegiatanForm((prev) => ({ ...prev, photoUrl: compressed }));
      showToast('Foto kegiatan santri berhasil diunggah!');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingKegiatanPhoto(false);
      e.target.value = '';
    }
  };

  // ---------------- STYLING HANDLERS ----------------
  const handleFontFamilyChange = (font: FontFamilyType) => {
    db.saveSiteSettings({ fontFamily: font });
    showToast(`Jenis Font berhasil diubah ke ${font}! Website tersinkronisasi.`);
  };

  const handleFontSizeChange = (size: FontSizeScale) => {
    db.saveSiteSettings({ fontSize: size });
    showToast(`Ukuran Font berhasil diubah ke skala (${size.toUpperCase()})!`);
  };

  const handleColorChange = (color: PrimaryColorTheme) => {
    db.saveSiteSettings({ primaryColor: color });
    showToast(`Tema Warna Utama diubah ke "${color.toUpperCase()}"!`);
  };

  const [heroTitleInput, setHeroTitleInput] = useState(siteSettings.heroTitle);
  const [heroSubtitleInput, setHeroSubtitleInput] = useState(siteSettings.heroSubtitle);

  const handleSaveHeroText = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSiteSettings({
      heroTitle: heroTitleInput,
      heroSubtitle: heroSubtitleInput,
    });
    showToast('Judul & Subjudul Banner website berhasil disimpan ke database!');
  };

  // ---------------- NAVBAR LABELS HANDLERS ----------------
  const [navLabelsInput, setNavLabelsInput] = useState<NavLabels>(siteSettings.navLabels);

  const handleSaveNavLabels = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSiteSettings({ navLabels: navLabelsInput });
    showToast('Nama menu navbar berhasil disimpan ke seluruh website!');
  };

  // ---------------- NAVBAR ORDER & VISIBILITY HANDLERS ----------------
  const NAV_ITEM_LABELS: Record<string, string> = {
    catalog: 'Katalog Sembako',
    tahfidz: 'Rumah Tahfidz',
    about: 'Tentang Toko',
    kios_sedekah: 'Kios Sedekah',
    packages: 'Paket Hemat & Promo',
  };
  const [navOrderInput, setNavOrderInput] = useState<NavItemConfig[]>(siteSettings.navOrder);
  const [draggedNavIndex, setDraggedNavIndex] = useState<number | null>(null);

  const handleDropNavItem = (targetIndex: number) => {
    if (draggedNavIndex === null || draggedNavIndex === targetIndex) return;
    const updated = [...navOrderInput];
    const [moved] = updated.splice(draggedNavIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setNavOrderInput(updated);
    setDraggedNavIndex(null);
  };

  const handleToggleNavVisible = (index: number) => {
    const updated = navOrderInput.map((item, i) => (i === index ? { ...item, visible: !item.visible } : item));
    setNavOrderInput(updated);
  };

  const handleSaveNavOrder = () => {
    db.saveSiteSettings({ navOrder: navOrderInput });
    showToast('Urutan & visibilitas menu navbar berhasil disimpan!');
  };

  // ---------------- PAGE CONTENT HANDLERS (Hero / Footer / About) ----------------
  const [heroContentInput, setHeroContentInput] = useState<HeroContent>(siteSettings.heroContent);
  const handleSaveHeroContent = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSiteSettings({ heroContent: heroContentInput });
    showToast('Konten halaman depan (Katalog Sembako) berhasil disimpan!');
  };

  const [footerContentInput, setFooterContentInput] = useState<FooterContent>(siteSettings.footerContent);
  const [newCommodityInput, setNewCommodityInput] = useState('');
  const handleAddCommodity = () => {
    if (!newCommodityInput.trim()) return;
    setFooterContentInput((prev) => ({ ...prev, commodities: [...prev.commodities, newCommodityInput.trim()] }));
    setNewCommodityInput('');
  };
  const handleRemoveCommodity = (idx: number) => {
    setFooterContentInput((prev) => ({ ...prev, commodities: prev.commodities.filter((_, i) => i !== idx) }));
  };
  const handleSaveFooterContent = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSiteSettings({ footerContent: footerContentInput });
    showToast('Konten footer website berhasil disimpan!');
  };

  const [aboutContentInput, setAboutContentInput] = useState<AboutPageContent>(siteSettings.aboutPageContent);
  const handleSaveAboutContent = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSiteSettings({ aboutPageContent: aboutContentInput });
    showToast('Konten halaman "Tentang Kios Sedekah" berhasil disimpan!');
  };

  // ---------------- PHOTO MANAGER HANDLERS ----------------
  const [logoUrlInput, setLogoUrlInput] = useState(siteSettings.storeLogoImage || '');
  const [bannerUrlInput, setBannerUrlInput] = useState(siteSettings.heroBannerImage || '');

  const handleSaveImages = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSiteSettings({
      storeLogoImage: logoUrlInput,
      heroBannerImage: bannerUrlInput,
      heroVideoUrl: heroVideoUrlInput,
    });
    showToast('Foto Logo Toko & Hero Banner berhasil diperbarui di seluruh website!');
  };

  // New Custom Photo Form
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCategory] = useState('galeri_toko');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [isUploadingGalleryPhoto, setIsUploadingGalleryPhoto] = useState(false);

  const handleGalleryPhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingGalleryPhoto(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 700, maxSizeKB: 100 });
      setNewPhotoUrl(compressed);
      showToast('Foto diunggah! Isi judul lalu klik "Tambah Foto Ke Galeri" untuk menyimpan.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingGalleryPhoto(false);
      e.target.value = '';
    }
  };

  const [isUploadingStoreLogo, setIsUploadingStoreLogo] = useState(false);
  const handleStoreLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingStoreLogo(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 400, maxSizeKB: 60 });
      setLogoUrlInput(compressed);
      showToast('Logo toko diunggah! Klik "Simpan Logo & Banner" untuk menyimpan.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingStoreLogo(false);
      e.target.value = '';
    }
  };

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const compressed = await compressImageFile(file, { maxDimension: 1200, maxSizeKB: 300 });
      setBannerUrlInput(compressed);
      showToast('Banner utama diunggah! Klik "Simpan Logo & Banner" untuk menyimpan.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingBanner(false);
      e.target.value = '';
    }
  };

  // ---------------- VIDEO BANNER HANDLERS ----------------
  // Video disimpan di Firebase Storage (bukan base64 di database) karena ukurannya
  // jauh lebih besar dari foto — lihat src/utils/videoUpload.ts.
  const [heroVideoUrlInput, setHeroVideoUrlInput] = useState(siteSettings.heroVideoUrl || '');
  const [isUploadingHeroVideo, setIsUploadingHeroVideo] = useState(false);
  const [heroVideoUploadProgress, setHeroVideoUploadProgress] = useState(0);

  const handleHeroVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHeroVideo(true);
    setHeroVideoUploadProgress(0);
    try {
      const url = await uploadVideoFile(file, {
        folder: 'hero-videos',
        maxSizeMB: 40,
        onProgress: setHeroVideoUploadProgress,
      });
      setHeroVideoUrlInput(url);
      db.saveSiteSettings({ heroVideoUrl: url });
      showToast('Video banner berhasil diunggah & disimpan!');
    } catch (err: any) {
      alert(err?.message || 'Gagal mengunggah video.');
    } finally {
      setIsUploadingHeroVideo(false);
      setHeroVideoUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemoveHeroVideo = async () => {
    if (!confirm('Hapus video banner? Banner utama akan kembali memakai gambar.')) return;
    const oldUrl = heroVideoUrlInput;
    setHeroVideoUrlInput('');
    db.saveSiteSettings({ heroVideoUrl: '' });
    showToast('Video banner dihapus.');
    if (oldUrl) deleteVideoByUrl(oldUrl);
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) {
      alert('Mohon isi Judul Foto dan URL Foto.');
      return;
    }

    db.addPhoto({
      title: newPhotoTitle,
      url: newPhotoUrl,
      category: newPhotoCategory,
      description: newPhotoDesc,
    });

    setNewPhotoTitle('');
    setNewPhotoUrl('');
    setNewPhotoDesc('');
    showToast(`Foto "${newPhotoTitle}" berhasil ditambahkan ke database!`);
  };

  const handleDeletePhoto = (id: string, title: string) => {
    if (confirm(`Hapus foto "${title}" dari website?`)) {
      db.deletePhoto(id);
      showToast(`Foto "${title}" berhasil dihapus.`);
    }
  };

  // ---------------- PRODUCT CMS HANDLERS ----------------
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Product['category']>('beras');
  const [prodPrice, setProdPrice] = useState<number>(10000);
  const [prodWholesalePrice, setProdWholesalePrice] = useState<number>(9000);
  const [prodMinWholesaleQty, setProdMinWholesaleQty] = useState<number>(5);
  const [prodUnit, setProdUnit] = useState('Kg');
  const [prodStock, setProdStock] = useState<number>(50);
  const [prodImage, setProdImage] = useState('');
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const handleProductImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProductImage(true);
    try {
      // Ukuran dibatasi kecil karena SEMUA produk tersimpan dalam satu dokumen Firestore.
      const compressed = await compressImageFile(file, { maxDimension: 350, maxSizeKB: 35 });
      setProdImage(compressed);
      showToast('Foto produk diunggah! Klik "Simpan" untuk menyimpan produk.');
    } catch (err: any) {
      alert(err?.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingProductImage(false);
      e.target.value = '';
    }
  };
  const [prodDescription, setProdDescription] = useState('');
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodBadge, setProdBadge] = useState('');

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('beras');
    setProdPrice(15000);
    setProdWholesalePrice(14000);
    setProdMinWholesaleQty(5);
    setProdUnit('Kg');
    setProdStock(50);
    setProdImage('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400');
    setProdDescription('');
    setProdIsBestSeller(false);
    setProdBadge('');
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdWholesalePrice(prod.wholesalePrice || prod.price);
    setProdMinWholesaleQty(prod.minWholesaleQty || 5);
    setProdUnit(prod.unit);
    setProdStock(prod.stock);
    setProdImage(prod.image);
    setProdDescription(prod.description);
    setProdIsBestSeller(prod.isBestSeller || false);
    setProdBadge(prod.badge || '');
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert('Nama produk tidak boleh kosong.');
      return;
    }

    if (editingProductId) {
      db.updateProduct(editingProductId, {
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        wholesalePrice: Number(prodWholesalePrice),
        minWholesaleQty: Number(prodMinWholesaleQty),
        unit: prodUnit,
        stock: Number(prodStock),
        image: prodImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        description: prodDescription,
        isBestSeller: prodIsBestSeller,
        badge: prodBadge || undefined,
      });
      showToast(`Produk "${prodName}" berhasil diperbarui!`);
    } else {
      db.addProduct({
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        wholesalePrice: Number(prodWholesalePrice),
        minWholesaleQty: Number(prodMinWholesaleQty),
        unit: prodUnit,
        stock: Number(prodStock),
        image: prodImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        description: prodDescription,
        isBestSeller: prodIsBestSeller,
        badge: prodBadge || undefined,
      });
      showToast(`Produk baru "${prodName}" berhasil ditambahkan ke katalog toko!`);
    }

    resetProductForm();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Hapus produk "${name}" dari katalog toko?`)) {
      db.deleteProduct(id);
      showToast(`Produk "${name}" dihapus.`);
    }
  };

  const handleQuickAdjustStock = (prod: Product, delta: number) => {
    const newStock = Math.max(0, prod.stock + delta);
    db.updateProduct(prod.id, { stock: newStock });
    showToast(`Stok "${prod.name}" disesuaikan ke ${newStock} ${prod.unit}.`);
  };

  // ---------------- STORE INFO HANDLERS ----------------
  const [infoName, setInfoName] = useState(storeInfo.name);
  const [infoTagline, setInfoTagline] = useState(storeInfo.tagline);
  const [infoDesc, setInfoDesc] = useState(storeInfo.description);
  const [infoEst, setInfoEst] = useState(storeInfo.established);
  const [infoAddress, setInfoAddress] = useState(storeInfo.address);
  const [infoPhone, setInfoPhone] = useState(storeInfo.phone);
  const [infoWa, setInfoWa] = useState(storeInfo.whatsapp);
  const [infoHours, setInfoHours] = useState(storeInfo.operatingHours);
  const [infoStoreStatus, setInfoStoreStatus] = useState<'buka' | 'tutup'>(storeInfo.storeStatus || 'buka');
  const [infoStatusMode, setInfoStatusMode] = useState<'otomatis' | 'manual'>(storeInfo.statusMode || 'otomatis');
  const [infoOpenTime, setInfoOpenTime] = useState(storeInfo.openTime || '06:00');
  const [infoCloseTime, setInfoCloseTime] = useState(storeInfo.closeTime || '21:00');
  const [infoClosedDays, setInfoClosedDays] = useState<number[]>(storeInfo.closedDays || []);

  const toggleClosedDay = (dayIndex: number) => {
    setInfoClosedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleSaveStoreInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveStoreInfo({
      ...storeInfo,
      name: infoName,
      tagline: infoTagline,
      description: infoDesc,
      established: Number(infoEst),
      address: infoAddress,
      phone: infoPhone,
      whatsapp: infoWa,
      operatingHours: infoHours,
      storeStatus: infoStoreStatus,
      statusMode: infoStatusMode,
      openTime: infoOpenTime,
      closeTime: infoCloseTime,
      closedDays: infoClosedDays,
    });
    showToast('Informasi Profil Toko berhasil diperbarui ke database!');
  };

  // ---------------- IF NOT LOGGED IN: SHOW LOGIN FORM ----------------
  if (!adminUser || !adminUser.isLoggedIn) {
    return (
      <div className="py-12 max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-center text-white space-y-2">
            <div className="w-14 h-14 bg-amber-400 text-neutral-900 rounded-2xl mx-auto flex items-center justify-center font-bold shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight pt-2">
              Login Panel Administrator
            </h2>
            <p className="text-emerald-100 text-xs leading-relaxed">
              Masuk dengan akun pengguna / pengelola toko sembako untuk mengubah tampilan, menambah produk, dan melihat laporan pesanan.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Email Aktif Pengguna / Admin
              </label>
              <input
                type="email"
                required
                placeholder="contoh: admin@tokosembako.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 text-sm"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Gunakan email aktif (misal: admin@tokosembako.com atau email Anda).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Kata Sandi / Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoggingIn ? 'Memeriksa...' : 'Masuk Halaman Admin'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------- IF LOGGED IN: SHOW ADMIN DASHBOARD ----------------
  return (
    <div className="py-8 space-y-6 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Peringatan sinkronisasi cloud */}
      {syncWarning && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl px-4 py-3 text-xs font-semibold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{syncWarning}</p>
            <p className="font-normal mt-1 text-amber-800">
              Perubahan tetap tersimpan di perangkat ini, tetapi belum tentu terlihat di perangkat lain.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSyncWarning(null)}
            className="text-amber-700 hover:text-amber-900 cursor-pointer"
            aria-label="Tutup peringatan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Top Banner Info */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-neutral-900">Panel Backend Administrator</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                DATABASE CONNECTED & SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Pengelola Logged In: <strong className="text-emerald-900">{adminUser.email}</strong> • Sesi aktif sejak {adminUser.loginTime || 'Hari ini'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-2 transition-colors self-start md:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Keluar (Logout)
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-neutral-200">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Dashboard & Ringkasan</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'orders'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Kelola Pesanan Masuk ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-400 text-neutral-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingOrdersCount} Baru
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'products'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Package className="w-4 h-4 text-blue-400" />
          <span>Katalog & Stok Sembako ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('photos')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'photos'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-teal-400" />
          <span>Galeri Foto & Logo ({photos.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('page_content')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'page_content'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-500" />
          <span>Konten Halaman Depan, Footer & Tentang</span>
        </button>

        {/* RUMAH TAHFIDZ SUB-TABS */}
        <button
          onClick={() => setAdminTab('tahfidz_profile')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'tahfidz_profile'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Profil & Visi Misi Tahfidz</span>
        </button>

        <button
          onClick={() => setAdminTab('tahfidz_santri')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'tahfidz_santri'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>Kelola Santri ({santriList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('tahfidz_kegiatan')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'tahfidz_kegiatan'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Kegiatan Santri & Upload Foto ({kegiatanList.length})</span>
        </button>

        {/* KIOS SEDEKAH TAB */}
        <button
          onClick={() => setAdminTab('kios_sedekah')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'kios_sedekah'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-amber-600" />
          <span>Kios Sedekah</span>
        </button>

        <button
          onClick={() => setAdminTab('styling')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'styling'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Type className="w-4 h-4 text-purple-400" />
          <span>Font & Tema Tampilan</span>
        </button>

        <button
          onClick={() => setAdminTab('store_info')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'store_info'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Store className="w-4 h-4 text-rose-400" />
          <span>Profil Toko & Jam Buka</span>
        </button>

        <button
          onClick={() => setAdminTab('pages')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'pages'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <FileCode className="w-4 h-4 text-sky-500" />
          <span>Kelola Halaman ({customPages.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            adminTab === 'database'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Database & Reset</span>
        </button>
      </div>

      {/* ---------------- SUB TAB 0: DASHBOARD OVERVIEW ---------------- */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Nilai Pesanan</span>
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-neutral-900">{formatRupiah(totalOmset)}</div>
              <p className="text-[11px] text-neutral-500">Dari {orders.length} total pemesanan tercatat</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pesanan Menunggu</span>
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600">{pendingOrdersCount} Pesanan</div>
              <p className="text-[11px] text-amber-700 font-semibold">Perlu segera dikonfirmasi</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sedang Diproses</span>
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-blue-600">{processingOrdersCount} Pesanan</div>
              <p className="text-[11px] text-neutral-500">Persiapan penimbangan / kurir</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Peringatan Stok Rendah</span>
                <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-600">{lowStockProducts.length} Produk</div>
              <p className="text-[11px] text-neutral-500">Sisa stok kurang dari 10 unit</p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-700" /> Pesanan Masuk Terbaru
                </h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Lihat Semua ({orders.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-6">Belum ada pesanan masuk.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-neutral-900 font-bold">{ord.id}</strong>
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            ord.status === 'Menunggu Konfirmasi'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'Diproses'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'Siap Diantar'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-neutral-600 mt-1">
                          {ord.customerName} ({ord.items.length} jenis sembako)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-neutral-900">{formatRupiah(ord.totalAmount)}</div>
                        <div className="text-[11px] text-neutral-400">{ord.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Critical Low Stock Alert Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-neutral-900">Peringatan Stok Sembako Kritis</h3>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Semua produk sembako memiliki pasokan stok yang aman di atas 10 unit.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-rose-950">{p.name}</div>
                        <div className="text-[11px] text-rose-700">Sisa Stok: <strong>{p.stock} {p.unit}</strong></div>
                      </div>
                      <button
                        onClick={() => {
                          setAdminTab('products');
                          handleStartEditProduct(p);
                        }}
                        className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Tambah Stok
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 1: ORDER MANAGEMENT ---------------- */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-700" /> Manajemen & Kelola Pesanan Masuk
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Ubah status pesanan, lihat detail pesanan pembeli, dan cetak nota transaksi sembako.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export Laporan Pesanan ke Excel CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleExportOrdersPDF}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Cetak/Download PDF Laporan Pesanan"
                  >
                    <Printer className="w-4 h-4 text-rose-600" />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['all', 'Menunggu Konfirmasi', 'Diproses', 'Siap Diantar', 'Selesai'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      orderStatusFilter === status
                        ? 'bg-emerald-800 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {status === 'all' ? 'Semua' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari ID Pesanan (misal: SBK-829104), Nama Pembeli, No HP..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                Tidak ada data pesanan yang sesuai dengan pencarian atau filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">ID & Tanggal</th>
                      <th className="p-3">Pembeli & No. WA</th>
                      <th className="p-3">Metode & Pengiriman</th>
                      <th className="p-3">Total Belanja</th>
                      <th className="p-3">Status Pesanan</th>
                      <th className="p-3 text-right rounded-r-xl">Aksi Backend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="p-3 py-4">
                          <strong className="text-neutral-900 font-bold block">{ord.id}</strong>
                          <span className="text-[11px] text-neutral-400">{ord.date}</span>
                        </td>
                        <td className="p-3 py-4">
                          <div className="font-bold text-neutral-900">{ord.customerName}</div>
                          <div className="text-[11px] text-emerald-700">📱 {ord.phone}</div>
                        </td>
                        <td className="p-3 py-4">
                          <div className="font-semibold text-neutral-800 uppercase">{ord.paymentMethod}</div>
                          <div className="text-[11px] text-neutral-500">
                            {ord.deliveryType === 'delivery' ? '🛵 Diantar ke Rumah' : '🏬 Ambil di Toko'}
                          </div>
                        </td>
                        <td className="p-3 py-4 font-black text-neutral-900">
                          {formatRupiah(ord.totalAmount)}
                        </td>
                        <td className="p-3 py-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                              ord.status === 'Menunggu Konfirmasi'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : ord.status === 'Diproses'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : ord.status === 'Siap Diantar'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            <option value="Menunggu Konfirmasi">⏳ Menunggu Konfirmasi</option>
                            <option value="Diproses">⚙️ Diproses</option>
                            <option value="Siap Diantar">🛵 Siap Diantar / Diambil</option>
                            <option value="Selesai">✅ Selesai</option>
                          </select>
                        </td>
                        <td className="p-3 py-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrderForDetail(ord)}
                            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                            title="Detail Pesanan"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(ord.id, ord.customerName)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                            title="Hapus Pesanan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Order Modal */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-900">Rincian Nota Pesanan {selectedOrderForDetail.id}</h3>
                <span className="text-xs text-neutral-500">{selectedOrderForDetail.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-2xl space-y-1">
                <div><strong>Nama Pembeli:</strong> {selectedOrderForDetail.customerName}</div>
                <div><strong>No WhatsApp:</strong> {selectedOrderForDetail.phone}</div>
                <div><strong>Alamat Tujuan:</strong> {selectedOrderForDetail.address}</div>
                <div><strong>Tipe Pembayaran:</strong> <span className="uppercase font-bold">{selectedOrderForDetail.paymentMethod}</span></div>
                {selectedOrderForDetail.notes && <div><strong>Catatan:</strong> {selectedOrderForDetail.notes}</div>}
              </div>

              <div className="space-y-2">
                <div className="font-bold text-neutral-800">Daftar Sembako Dipesan:</div>
                {selectedOrderForDetail.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-neutral-100/60 rounded-xl">
                    <div>
                      <div className="font-bold text-neutral-900">{item.product.name}</div>
                      <div className="text-[11px] text-neutral-500">
                        {item.quantity} x {formatRupiah(item.selectedUnitType === 'grosir' && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price)} ({item.selectedUnitType})
                      </div>
                    </div>
                    <div className="font-bold text-neutral-900">
                      {formatRupiah((item.selectedUnitType === 'grosir' && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-sm font-black">
                <span>TOTAL BELANJA:</span>
                <span className="text-emerald-800">{formatRupiah(selectedOrderForDetail.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="px-4 py-2 bg-neutral-100 text-neutral-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 2: PRODUCT CMS ---------------- */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          {/* Add / Edit Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  {editingProductId ? 'Edit Data Produk Sembako' : 'Tambah Produk Sembako Baru'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Lengkapi informasi sembako, harga eceran, harga grosir, dan jumlah stok awal.
                </p>
              </div>

              {editingProductId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Produk Sembako *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Beras Ramos Pandan 5kg"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Kategori Sembako *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                  >
                    <option value="beras">🌾 Beras & Padi</option>
                    <option value="minyak">🍶 Minyak Goreng</option>
                    <option value="gula_telur">🥚 Gula & Telur</option>
                    <option value="tepung_bumbu">🧂 Tepung & Bumbu</option>
                    <option value="mie_makanan">🍜 Mie & Makanan</option>
                    <option value="susu_minuman">🥛 Susu & Minuman</option>
                    <option value="paket_hemat">🎁 Paket Hemat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Harga Eceran (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Harga Grosir (Rp)</label>
                  <input
                    type="number"
                    value={prodWholesalePrice}
                    onChange={(e) => setProdWholesalePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Satuan Produk (misal: Kg, Liter, Dus, Pcs)</label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Jumlah Stok Gudang</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">URL Gambar Foto Produk</label>
                {prodImage && (
                  <div className="relative inline-block mb-2 group">
                    <img src={prodImage} alt="Preview Produk" className="w-20 h-20 rounded-xl object-cover border border-neutral-200" />
                    <button
                      type="button"
                      onClick={() => setProdImage('')}
                      title="Hapus Foto"
                      className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingProductImage ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                  <input type="file" accept="image/*" onChange={handleProductImageFileUpload} disabled={isUploadingProductImage} className="hidden" />
                </label>
                <p className="text-[10px] text-neutral-400 mt-1">Foto akan dikompres otomatis ke ukuran kecil (semua produk berbagi satu ruang penyimpanan).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Deskripsi Singkat Sembako</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan keunggulan produk..."
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={prodIsBestSeller}
                    onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tandai Produk Terlaris (Best Seller)</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{editingProductId ? 'Simpan Perubahan Produk' : 'Tambah Produk Ke Katalog'}</span>
              </button>
            </form>
          </div>

          {/* Product List Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-base text-neutral-900">Daftar Katalog Produk Sembako Toko</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportProductsCSV}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export Katalog Produk ke Excel CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportProductsPDF}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cetak/Download PDF Katalog Produk"
                >
                  <Printer className="w-4 h-4 text-rose-600" />
                  <span>Cetak PDF</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-700 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Foto & Produk</th>
                    <th className="p-3">Harga Eceran</th>
                    <th className="p-3">Harga Grosir</th>
                    <th className="p-3">Stok Gudang</th>
                    <th className="p-3 text-right rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-3 py-3 flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-neutral-200" />
                        <div>
                          <div className="font-bold text-neutral-900">{prod.name}</div>
                          <div className="text-[11px] text-neutral-500 capitalize">{prod.category.replace('_', ' ')}</div>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-emerald-800">{formatRupiah(prod.price)} / {prod.unit}</td>
                      <td className="p-3 font-bold text-amber-700">
                        {prod.wholesalePrice ? formatRupiah(prod.wholesalePrice) : '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${prod.stock < 10 ? 'text-rose-600' : 'text-neutral-800'}`}>
                            {prod.stock} {prod.unit}
                          </span>
                          <button
                            onClick={() => handleQuickAdjustStock(prod, 10)}
                            className="px-1.5 py-0.5 bg-neutral-200 hover:bg-neutral-300 rounded-md font-extrabold text-[10px] cursor-pointer"
                            title="+10 Stok"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleStartEditProduct(prod)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 3: PHOTOS & LOGO MANAGER ---------------- */}
      {adminTab === 'photos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
              <Type className="w-5 h-5 text-teal-600" /> Pengaturan Nama Menu Navbar
            </h3>
            <p className="text-xs text-neutral-500 -mt-4">Ubah semua nama menu yang tampil di navigasi atas website. Kosongkan label lencana (badge) jika tidak ingin ditampilkan.</p>

            <form onSubmit={handleSaveNavLabels} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Menu: Katalog Sembako</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.catalog}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, catalog: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Menu: Tentang Toko</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.about}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, about: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Menu: Kios Sedekah</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.kiosSedekah}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, kiosSedekah: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Lencana Menu Kios Sedekah</label>
                  <input
                    type="text"
                    placeholder="kosongkan untuk sembunyikan"
                    value={navLabelsInput.kiosSedekahBadge}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, kiosSedekahBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Menu: Rumah Tahfidz</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.tahfidz}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, tahfidz: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Lencana Menu Rumah Tahfidz</label>
                  <input
                    type="text"
                    placeholder="misal: Baru (kosongkan untuk sembunyikan)"
                    value={navLabelsInput.tahfidzBadge}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, tahfidzBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Menu: Paket Hemat & Promo</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.packages}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, packages: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Lencana Menu Paket Hemat</label>
                  <input
                    type="text"
                    placeholder="misal: Hemat (kosongkan untuk sembunyikan)"
                    value={navLabelsInput.packagesBadge}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, packagesBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tombol: Keranjang</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.cart}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, cart: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tombol: Login / Admin</label>
                  <input
                    type="text"
                    required
                    value={navLabelsInput.admin}
                    onChange={(e) => setNavLabelsInput({ ...navLabelsInput, admin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simpan Nama Menu Navbar
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-teal-600" /> Urutan & Tampilkan Menu Navbar
            </h3>
            <p className="text-xs text-neutral-500 -mt-2">
              Geser (drag) kartu menu ke kiri/kanan untuk mengubah urutan tampil di navbar. Klik ikon mata untuk menyembunyikan menu dari halaman depan tanpa menghapus datanya.
            </p>

            <div className="flex flex-wrap items-stretch gap-3 pt-1">
              {navOrderInput.map((item, idx) => (
                <div
                  key={item.key}
                  draggable
                  onDragStart={() => setDraggedNavIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropNavItem(idx)}
                  onDragEnd={() => setDraggedNavIndex(null)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 select-none cursor-move transition-all ${
                    item.visible
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-neutral-100 border-neutral-200 opacity-60'
                  } ${draggedNavIndex === idx ? 'ring-2 ring-emerald-500 scale-[1.03]' : ''}`}
                >
                  <GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="text-xs font-bold text-neutral-800 whitespace-nowrap">{NAV_ITEM_LABELS[item.key]}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleNavVisible(idx)}
                    title={item.visible ? 'Sembunyikan dari navbar' : 'Tampilkan di navbar'}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors shrink-0 ${
                      item.visible ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-neutral-300 text-neutral-600 hover:bg-neutral-400'
                    }`}
                  >
                    {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveNavOrder}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Simpan Urutan & Visibilitas Menu
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600" /> Pengaturan Foto & Video Logo / Banner
            </h3>

            <form onSubmit={handleSaveImages} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">URL Logo Toko Sembako</label>
                <div className="flex items-center gap-3">
                  {logoUrlInput && (
                    <div className="relative shrink-0 group">
                      <img src={logoUrlInput} alt="Logo Preview" className="w-12 h-12 rounded-lg object-cover border border-neutral-200" />
                      <button
                        type="button"
                        onClick={() => setLogoUrlInput('')}
                        title="Hapus Foto"
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="url"
                    placeholder="https://..."
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingStoreLogo ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                  <input type="file" accept="image/*" onChange={handleStoreLogoFileUpload} disabled={isUploadingStoreLogo} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">URL Gambar Banner Utama (Hero Banner)</label>
                {bannerUrlInput && (
                  <div className="relative mb-2 group">
                    <img src={bannerUrlInput} alt="Banner Preview" className="w-full h-28 rounded-xl object-cover border border-neutral-200" />
                    <button
                      type="button"
                      onClick={() => setBannerUrlInput('')}
                      title="Hapus Foto"
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <input
                  type="url"
                  placeholder="https://..."
                  value={bannerUrlInput}
                  onChange={(e) => setBannerUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingBanner ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                  <input type="file" accept="image/*" onChange={handleBannerFileUpload} disabled={isUploadingBanner} className="hidden" />
                </label>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                  <VideoIcon className="w-3.5 h-3.5 text-teal-600" /> Video Banner Utama (Hero) — opsional
                </label>
                <p className="text-[11px] text-neutral-500 mb-2">
                  Kalau video diisi, banner utama di halaman depan akan menampilkan video ini (otomatis diputar, tanpa suara, berulang) menggantikan gambar statis.
                </p>

                {heroVideoUrlInput && (
                  <div className="relative mb-2 group">
                    <video src={heroVideoUrlInput} controls className="w-full h-40 rounded-xl object-cover border border-neutral-200 bg-black" />
                    <button
                      type="button"
                      onClick={handleRemoveHeroVideo}
                      title="Hapus Video"
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isUploadingHeroVideo
                      ? `Mengunggah... ${heroVideoUploadProgress}%`
                      : heroVideoUrlInput
                      ? 'Ganti Video dari HP / Komputer'
                      : 'Unggah Video dari HP / Komputer'}
                  </span>
                  <input type="file" accept="video/*" onChange={handleHeroVideoFileUpload} disabled={isUploadingHeroVideo} className="hidden" />
                </label>
                <p className="text-[11px] text-neutral-400 mt-1.5">Maksimal 40MB. Format MP4 disarankan. Video langsung tersimpan begitu selesai diunggah.</p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simpan Logo & Banner
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <h3 className="font-bold text-base text-neutral-900">Tambah Foto Dokumentasi / Galeri Baru</h3>
            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Judul Foto *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Stok Beras Padi Segar"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">URL Foto Image *</label>
                  {newPhotoUrl && (
                    <div className="relative mb-2 group">
                      <img src={newPhotoUrl} alt="Preview Foto Baru" className="w-full h-24 rounded-xl object-cover border border-neutral-200" />
                      <button
                        type="button"
                        onClick={() => setNewPhotoUrl('')}
                        title="Hapus Foto"
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingGalleryPhoto ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                    <input type="file" accept="image/*" onChange={handleGalleryPhotoFileUpload} disabled={isUploadingGalleryPhoto} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tambah Foto Ke Galeri
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
              {photos.map((p) => (
                <div key={p.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 relative group">
                  <img src={p.url} alt={p.title} className="w-full h-32 object-cover rounded-xl" />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-xs text-neutral-900">{p.title}</span>
                    <button
                      onClick={() => handleDeletePhoto(p.id, p.title)}
                      className="p-1 bg-rose-100 text-rose-700 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB: TAHFIDZ PROFILE ---------------- */}
      {adminTab === 'tahfidz_profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6 animate-fadeIn">
          <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" /> Profil & Logo Rumah Tahfidz Nurul A'laa
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Kelola visi misi, pengasuh, logo, dan informasi publik Rumah Tahfidz Nurul A'laa.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
                Terhubung Ke Frontend User
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveTahfidzProfile} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-amber-400 shadow-xs flex items-center justify-center shrink-0 overflow-hidden relative group">
                {tahfidzProfile.logoUrl ? (
                  <>
                    <img src={tahfidzProfile.logoUrl} alt="Logo Preview" className="w-full h-full object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setTahfidzProfile({ ...tahfidzProfile, logoUrl: '' })}
                      title="Hapus Foto"
                      className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <BookOpen className="w-10 h-10 text-emerald-700" />
                )}
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <h4 className="font-bold text-sm text-neutral-900">Logo Resmi Rumah Tahfidz</h4>
                <p className="text-xs text-neutral-600">Unggah foto/logo dari perangkat Anda (JPG/PNG, Max 2MB) atau masukkan URL gambar.</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                  <label className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingTahfidzLogo ? 'Memproses...' : 'Upload Logo Foto Baru'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTahfidzLogoUpload}
                      disabled={isUploadingTahfidzLogo}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Lembaga *</label>
                <input
                  type="text"
                  required
                  value={tahfidzProfile.name}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Slogan / Tagline *</label>
                <input
                  type="text"
                  required
                  value={tahfidzProfile.tagline}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Pengasuh Utama / Pimpinan *</label>
                <input
                  type="text"
                  required
                  value={tahfidzProfile.pengasuh}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, pengasuh: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tahun Berdiri</label>
                <input
                  type="number"
                  value={tahfidzProfile.establishedYear}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, establishedYear: Number(e.target.value) || 2020 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">No WhatsApp Pengurus *</label>
                <input
                  type="text"
                  required
                  value={tahfidzProfile.whatsapp}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="6281234567890"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">No Telepon Kantor</label>
                <input
                  type="text"
                  value={tahfidzProfile.phone}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={tahfidzProfile.address}
                onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Deskripsi Profil Rumah Tahfidz</label>
              <textarea
                rows={4}
                value={tahfidzProfile.profilText}
                onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, profilText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Visi Lembaga</label>
                <textarea
                  rows={3}
                  value={tahfidzProfile.visi}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, visi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Misi Lembaga (Tiap baris 1 poin)</label>
                <textarea
                  rows={3}
                  value={tahfidzProfile.misi.join('\n')}
                  onChange={(e) => setTahfidzProfile({ ...tahfidzProfile, misi: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Poin 1&#10;Poin 2&#10;Poin 3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </form>
        </div>
      )}

      {/* ---------------- SUB TAB: TAHFIDZ SANTRI ---------------- */}
      {adminTab === 'tahfidz_santri' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Add / Edit Form */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <span>{editingSantri ? `Edit Data Santri (${editingSantri.name})` : 'Tambah Santri Baru'}</span>
              </h3>
              {editingSantri && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSantri(null);
                    setSantriForm({
                      nis: '',
                      name: '',
                      gender: 'L',
                      age: 12,
                      hafalanJuz: 1,
                      status: 'Aktif',
                      wali: '',
                      phoneWali: '',
                      photoUrl: '',
                      joinedDate: new Date().toISOString().slice(0, 10),
                      notes: ''
                    });
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSantri} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">NIS (Nomor Induk Santri) *</label>
                  <input
                    type="text"
                    required
                    value={santriForm.nis}
                    onChange={(e) => setSantriForm({ ...santriForm, nis: e.target.value })}
                    placeholder="SNT-001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Lengkap Santri *</label>
                  <input
                    type="text"
                    required
                    value={santriForm.name}
                    onChange={(e) => setSantriForm({ ...santriForm, name: e.target.value })}
                    placeholder="Ahmad Zaki"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={santriForm.gender}
                    onChange={(e) => setSantriForm({ ...santriForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="L">Laki-laki (Santriwan)</option>
                    <option value="P">Perempuan (Santriwati)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Umur (Tahun)</label>
                  <input
                    type="number"
                    value={santriForm.age}
                    onChange={(e) => setSantriForm({ ...santriForm, age: Number(e.target.value) || 10 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Jumlah Hafalan (Juz)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={santriForm.hafalanJuz}
                    onChange={(e) => setSantriForm({ ...santriForm, hafalanJuz: Number(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Status Santri</label>
                  <select
                    value={santriForm.status}
                    onChange={(e) => setSantriForm({ ...santriForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Mutqin">Mutqin (Khatam 30 Juz)</option>
                    <option value="Lulus">Lulus / Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={santriForm.wali}
                    onChange={(e) => setSantriForm({ ...santriForm, wali: e.target.value })}
                    placeholder="Bpk. Abdullah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">No HP / WA Wali</label>
                  <input
                    type="text"
                    value={santriForm.phoneWali}
                    onChange={(e) => setSantriForm({ ...santriForm, phoneWali: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Photo Upload for Santri */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-neutral-200 border border-neutral-300 shrink-0 overflow-hidden relative group">
                  {santriForm.photoUrl ? (
                    <>
                      <img src={santriForm.photoUrl} alt="Santri Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setSantriForm({ ...santriForm, photoUrl: '' })}
                        title="Hapus Foto"
                        className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <User className="w-8 h-8 mx-auto mt-4 text-neutral-400" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <label className="block text-xs font-bold text-neutral-700">Foto Profil Santri</label>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-3.5 py-2 bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-900 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingSantriPhoto ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                      <input type="file" accept="image/*" onChange={handleSantriPhotoUpload} disabled={isUploadingSantriPhoto} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{editingSantri ? 'Simpan Perubahan Santri' : 'Tambah Santri Ke Database'}</span>
              </button>
            </form>
          </div>

          {/* List of Santri */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" /> Daftar Seluruh Santri ({santriList.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-100 text-neutral-900 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Foto</th>
                    <th className="p-3">NIS</th>
                    <th className="p-3">Nama Santri</th>
                    <th className="p-3">Hafalan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Wali Santri</th>
                    <th className="p-3 rounded-r-xl text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {santriList.map((santri) => (
                    <tr key={santri.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-3">
                        <img src={santri.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136'} alt={santri.name} className="w-10 h-10 rounded-xl object-cover border" />
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-900">{santri.nis}</td>
                      <td className="p-3 font-bold text-neutral-900">{santri.name} ({santri.gender})</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          {santri.hafalanJuz} Juz
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          santri.status === 'Mutqin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {santri.status}
                        </span>
                      </td>
                      <td className="p-3">{santri.wali} ({santri.phoneWali || '-'})</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStartEditSantri(santri)}
                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg cursor-pointer"
                            title="Edit Data Santri"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSantri(santri.id, santri.name)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                            title="Hapus Santri"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB: TAHFIDZ KEGIATAN & FOTO ---------------- */}
      {adminTab === 'tahfidz_kegiatan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Add / Edit Kegiatan Form */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>{editingKegiatan ? `Edit Kegiatan (${editingKegiatan.title})` : 'Tambah Kegiatan / Dokumentasi Foto Santri'}</span>
              </h3>
              {editingKegiatan && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingKegiatan(null);
                    setKegiatanForm({
                      title: '',
                      category: 'Setoran Hafalan',
                      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                      time: '08:00 - 10:00 WIB',
                      location: "Rumah Tahfidz Nurul A'laa",
                      description: '',
                      photoUrl: ''
                    });
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveKegiatan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Judul Kegiatan / Acara *</label>
                  <input
                    type="text"
                    required
                    value={kegiatanForm.title}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, title: e.target.value })}
                    placeholder="Ujian Munaqasyah Hafalan 5 Juz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Kategori Kegiatan *</label>
                  <select
                    value={kegiatanForm.category}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="Setoran Hafalan">Setoran Hafalan</option>
                    <option value="Munaqasyah">Munaqasyah</option>
                    <option value="Kajian">Kajian & Bimbingan</option>
                    <option value="Rihlah">Rihlah & Outbound</option>
                    <option value="Kegiatan Harian">Kegiatan Harian</option>
                    <option value="Bakti Sosial">Bakti Sosial / Santunan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tanggal Pelaksanaan *</label>
                  <input
                    type="text"
                    required
                    value={kegiatanForm.date}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, date: e.target.value })}
                    placeholder="12 Agustus 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Waktu / Jam</label>
                  <input
                    type="text"
                    value={kegiatanForm.time}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, time: e.target.value })}
                    placeholder="08:00 - 11:30 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={kegiatanForm.location}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, location: e.target.value })}
                    placeholder="Aula Utama Rumah Tahfidz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Deskripsi Kegiatan *</label>
                <textarea
                  rows={3}
                  required
                  value={kegiatanForm.description}
                  onChange={(e) => setKegiatanForm({ ...kegiatanForm, description: e.target.value })}
                  placeholder="Jelaskan detail kegiatan santri yang berlangsung..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Upload Foto Kegiatan */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-16 rounded-xl bg-neutral-200 border border-neutral-300 shrink-0 overflow-hidden relative group">
                  {kegiatanForm.photoUrl ? (
                    <>
                      <img src={kegiatanForm.photoUrl} alt="Kegiatan Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setKegiatanForm({ ...kegiatanForm, photoUrl: '' })}
                        title="Hapus Foto"
                        className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <ImageIcon className="w-6 h-6 mx-auto mt-5 text-neutral-400" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <label className="block text-xs font-bold text-neutral-700">Foto Dokumentasi Kegiatan</label>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-3.5 py-2 bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-900 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingKegiatanPhoto ? 'Memproses...' : 'Upload Foto Kegiatan Baru'}</span>
                      <input type="file" accept="image/*" onChange={handleKegiatanPhotoUpload} disabled={isUploadingKegiatanPhoto} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{editingKegiatan ? 'Simpan Perubahan Kegiatan' : 'Publikasikan Kegiatan Santri'}</span>
              </button>
            </form>
          </div>

          {/* List of Kegiatan */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" /> Daftar Kegiatan Terpublikasi ({kegiatanList.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kegiatanList.map((kgt) => (
                <div key={kgt.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between gap-3">
                  <div className="flex gap-4">
                    <img src={kgt.photoUrl} alt={kgt.title} className="w-24 h-24 rounded-xl object-cover border shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md uppercase">
                        {kgt.category}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{kgt.title}</h4>
                      <p className="text-[11px] text-neutral-500">{kgt.date} {kgt.time ? `• ${kgt.time}` : ''}</p>
                      <p className="text-xs text-neutral-600 line-clamp-2">{kgt.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/60">
                    <button
                      onClick={() => handleStartEditKegiatan(kgt)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteKegiatan(kgt.id, kgt.title)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB: KIOS SEDEKAH ---------------- */}
      {adminTab === 'kios_sedekah' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-700" /> Profil Kios Sedekah
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Kelola logo, deskripsi, program, kontak, dan foto dokumentasi Kios Sedekah yang tampil di navbar website.
              </p>
            </div>

            <form onSubmit={handleSaveKiosSedekahProfile} className="space-y-6">
              {/* Logo Upload */}
              <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-emerald-400 shadow-xs flex items-center justify-center shrink-0 overflow-hidden relative group">
                  {kiosSedekahProfile.logoUrl ? (
                    <>
                      <img src={kiosSedekahProfile.logoUrl} alt="Logo Preview" className="w-full h-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => setKiosSedekahProfile({ ...kiosSedekahProfile, logoUrl: '' })}
                        title="Hapus Foto"
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <HeartHandshake className="w-10 h-10 text-amber-700" />
                  )}
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-neutral-900">Logo Kios Sedekah</h4>
                  <p className="text-xs text-neutral-600">Unggah foto/logo dari perangkat Anda (JPG/PNG, Max 2MB) atau masukkan URL gambar.</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                    <label className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingKiosLogo ? 'Memproses...' : 'Upload Logo Foto Baru'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleKiosSedekahLogoUpload}
                        disabled={isUploadingKiosLogo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* General Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Kios Sedekah *</label>
                  <input
                    type="text"
                    required
                    value={kiosSedekahProfile.name}
                    onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Slogan / Tagline *</label>
                  <input
                    type="text"
                    required
                    value={kiosSedekahProfile.tagline}
                    onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={kiosSedekahProfile.penanggungJawab}
                    onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, penanggungJawab: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Alamat</label>
                  <input
                    type="text"
                    value={kiosSedekahProfile.address}
                    onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">No. Telepon</label>
                  <input
                    type="text"
                    value={kiosSedekahProfile.phone}
                    onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">No. WhatsApp (format: 628xxxx)</label>
                  <input
                    type="text"
                    value={kiosSedekahProfile.whatsapp}
                    onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, whatsapp: e.target.value })}
                    placeholder="6281234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Deskripsi Lengkap Kios Sedekah *</label>
                <textarea
                  rows={5}
                  required
                  value={kiosSedekahProfile.description}
                  onChange={(e) => setKiosSedekahProfile({ ...kiosSedekahProfile, description: e.target.value })}
                  placeholder="Jelaskan latar belakang, tujuan, dan cara kerja program Kios Sedekah..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Program List */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">Daftar Program Kios Sedekah</label>
                <div className="space-y-2 mb-3">
                  {kiosSedekahProfile.programs.map((program, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="flex-1 text-xs text-neutral-800">{program}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKiosProgram(idx)}
                        className="p-1 bg-rose-100 text-rose-700 rounded-md cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {kiosSedekahProfile.programs.length === 0 && (
                    <p className="text-xs text-neutral-400">Belum ada program ditambahkan.</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newKiosProgram}
                    onChange={(e) => setNewKiosProgram(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKiosProgram();
                      }
                    }}
                    placeholder="misal: Paket Sembako Gratis Jum'at Berkah"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddKiosProgram}
                    className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </form>
          </div>

          {/* Photo Gallery Manager */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <h3 className="font-bold text-base text-neutral-900">Tambah Foto Dokumentasi Kios Sedekah</h3>
            <form onSubmit={handleAddKiosPhoto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">URL Foto Image *</label>
                  {newKiosPhotoUrl && (
                    <div className="relative mb-2 group">
                      <img src={newKiosPhotoUrl} alt="Preview Foto Baru" className="w-full h-24 rounded-xl object-cover border border-neutral-200" />
                      <button
                        type="button"
                        onClick={() => setNewKiosPhotoUrl('')}
                        title="Hapus Foto"
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newKiosPhotoUrl}
                    onChange={(e) => setNewKiosPhotoUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingKiosPhoto ? 'Memproses...' : 'Unggah Foto dari HP / Komputer'}</span>
                    <input type="file" accept="image/*" onChange={handleKiosPhotoFileUpload} disabled={isUploadingKiosPhoto} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Keterangan Foto</label>
                  <textarea
                    rows={4}
                    placeholder="misal: Penyaluran sembako Jum'at Berkah untuk warga sekitar"
                    value={newKiosPhotoCaption}
                    onChange={(e) => setNewKiosPhotoCaption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tambah Foto Ke Galeri Kios Sedekah
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
              {kiosSedekahProfile.photos.map((p) => (
                <div key={p.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 relative group">
                  <img src={p.url} alt={p.caption} className="w-full h-32 object-cover rounded-xl" />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-medium text-[11px] text-neutral-700 leading-snug line-clamp-2">{p.caption || 'Tanpa keterangan'}</span>
                    <button
                      onClick={() => handleDeleteKiosPhoto(p.id)}
                      className="p-1 bg-rose-100 text-rose-700 rounded-md cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {kiosSedekahProfile.photos.length === 0 && (
                <p className="text-xs text-neutral-400 col-span-full">Belum ada foto dokumentasi.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB: PAGE CONTENT (Hero / Footer / About) ---------------- */}
      {adminTab === 'page_content' && (
        <div className="space-y-6 animate-fadeIn">
          {/* HERO / HOMEPAGE CONTENT */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-700" /> Konten Halaman Depan (Katalog Sembako)
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Teks badge, 3 kotak keunggulan, dan tombol pada banner utama halaman depan.</p>
            </div>

            <form onSubmit={handleSaveHeroContent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Teks Badge Kecil (di atas judul besar)</label>
                <input
                  type="text"
                  required
                  value={heroContentInput.badgeText}
                  onChange={(e) => setHeroContentInput({ ...heroContentInput, badgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase">Kotak Keunggulan 1</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul kecil (misal: Harga Jujur)"
                    value={heroContentInput.feature1Label}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, feature1Label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Teks tebal (misal: Ecer & Grosir)"
                    value={heroContentInput.feature1Value}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, feature1Value: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase">Kotak Keunggulan 2</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul kecil"
                    value={heroContentInput.feature2Label}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, feature2Label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Teks tebal"
                    value={heroContentInput.feature2Value}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, feature2Value: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase">Kotak Keunggulan 3</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul kecil"
                    value={heroContentInput.feature3Label}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, feature3Label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Teks tebal"
                    value={heroContentInput.feature3Value}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, feature3Value: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Teks Tombol Utama (kuning)</label>
                  <input
                    type="text"
                    required
                    value={heroContentInput.primaryButtonText}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, primaryButtonText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Teks Tombol Kedua (transparan)</label>
                  <input
                    type="text"
                    required
                    value={heroContentInput.secondaryButtonText}
                    onChange={(e) => setHeroContentInput({ ...heroContentInput, secondaryButtonText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simpan Konten Halaman Depan
              </button>
            </form>
          </div>

          {/* ABOUT / KIOS SEDEKAH PAGE STATS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-700" /> Konten Halaman "Tentang Kios Sedekah"
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Badge dan 3 angka statistik pada halaman profil toko (label menu ini mengikuti nama yang Anda atur di "Pengaturan Nama Menu Navbar").
              </p>
            </div>

            <form onSubmit={handleSaveAboutContent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Teks Badge Kecil</label>
                <input
                  type="text"
                  required
                  value={aboutContentInput.badgeText}
                  onChange={(e) => setAboutContentInput({ ...aboutContentInput, badgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase">Statistik 1</label>
                  <input
                    type="text"
                    required
                    placeholder="Angka (misal: 12+ Tahun)"
                    value={aboutContentInput.stat1Value}
                    onChange={(e) => setAboutContentInput({ ...aboutContentInput, stat1Value: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Keterangan"
                    value={aboutContentInput.stat1Label}
                    onChange={(e) => setAboutContentInput({ ...aboutContentInput, stat1Label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase">Statistik 2</label>
                  <input
                    type="text"
                    required
                    placeholder="Angka"
                    value={aboutContentInput.stat2Value}
                    onChange={(e) => setAboutContentInput({ ...aboutContentInput, stat2Value: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Keterangan"
                    value={aboutContentInput.stat2Label}
                    onChange={(e) => setAboutContentInput({ ...aboutContentInput, stat2Label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase">Statistik 3</label>
                  <input
                    type="text"
                    required
                    placeholder="Angka"
                    value={aboutContentInput.stat3Value}
                    onChange={(e) => setAboutContentInput({ ...aboutContentInput, stat3Value: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Keterangan"
                    value={aboutContentInput.stat3Label}
                    onChange={(e) => setAboutContentInput({ ...aboutContentInput, stat3Label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simpan Konten Halaman Tentang
              </button>
            </form>
          </div>

          {/* FOOTER CONTENT */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neutral-700" /> Konten Footer Website
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Teks deskripsi singkat, daftar komoditas pokok, dan tagline paling bawah di footer.</p>
            </div>

            <form onSubmit={handleSaveFooterContent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Kalimat Deskripsi Singkat (setelah tagline toko)</label>
                <textarea
                  rows={2}
                  required
                  value={footerContentInput.aboutText}
                  onChange={(e) => setFooterContentInput({ ...footerContentInput, aboutText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">Daftar "Komoditas Pokok"</label>
                <div className="space-y-2 mb-3">
                  {footerContentInput.commodities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2">
                      <span className="flex-1 text-xs text-neutral-800">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCommodity(idx)}
                        className="p-1 bg-rose-100 text-rose-700 rounded-md cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {footerContentInput.commodities.length === 0 && (
                    <p className="text-xs text-neutral-400">Belum ada item ditambahkan.</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCommodityInput}
                    onChange={(e) => setNewCommodityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCommodity();
                      }
                    }}
                    placeholder="misal: Beras Pandan Wangi & Ramos"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddCommodity}
                    className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tagline Paling Bawah Footer</label>
                <input
                  type="text"
                  required
                  value={footerContentInput.bottomTagline}
                  onChange={(e) => setFooterContentInput({ ...footerContentInput, bottomTagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simpan Konten Footer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 4: STYLING & THEMES ---------------- */}
      {adminTab === 'styling' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" /> Edit Font, Ukuran Font & Warna Website
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Perubahan di bawah ini langsung tersimpan dan mengubah font dan warna tampilan secara otomatis!
            </p>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">Pilih Jenis Font:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'Plus Jakarta Sans' },
                { name: 'Inter' },
                { name: 'Poppins' },
                { name: 'Playfair Display' },
                { name: 'Roboto' },
                { name: 'Comic Neue' },
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => handleFontFamilyChange(f.name as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    siteSettings.fontFamily === f.name
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-xs">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Selection
              Fitur ini sudah didukung mesin tema (utils/theme.ts) dan handler-nya
              sudah ada, tetapi tombol pengaturannya belum pernah dibuat.
              Sekarang admin bisa mengubah ukuran huruf website. */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">Pilih Ukuran Huruf Website:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'sm', label: 'Kecil' },
                { id: 'md', label: 'Normal' },
                { id: 'lg', label: 'Besar' },
                { id: 'xl', label: 'Sangat Besar' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleFontSizeChange(s.id as FontSizeScale)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    siteSettings.fontSize === s.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Themes */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">Pilih Warna Utama Website:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-800' },
                { id: 'teal', label: 'Teal Ocean', bg: 'bg-teal-800' },
                { id: 'amber', label: 'Amber Gold', bg: 'bg-amber-600' },
                { id: 'blue', label: 'Royal Blue', bg: 'bg-blue-800' },
                { id: 'indigo', label: 'Indigo Night', bg: 'bg-indigo-800' },
                { id: 'rose', label: 'Rose Pink', bg: 'bg-rose-700' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleColorChange(c.id as any)}
                  className={`p-3 rounded-2xl border text-center flex items-center gap-2 justify-center transition-all cursor-pointer ${
                    siteSettings.primaryColor === c.id
                      ? 'border-neutral-900 bg-neutral-900 text-white font-extrabold'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`}></span>
                  <span className="text-xs">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero Text Customization */}
          <form onSubmit={handleSaveHeroText} className="space-y-4 pt-4 border-t border-neutral-100">
            <h4 className="font-bold text-sm text-neutral-900">Judul & Subjudul Banner Utama</h4>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Judul Utama Banner</label>
              <input
                type="text"
                value={heroTitleInput}
                onChange={(e) => setHeroTitleInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Subjudul Banner</label>
              <textarea
                rows={2}
                value={heroSubtitleInput}
                onChange={(e) => setHeroSubtitleInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl text-xs hover:bg-emerald-900 cursor-pointer"
            >
              Simpan Teks Banner
            </button>
          </form>
        </div>
      )}

      {/* ---------------- SUB TAB 5: STORE INFO ---------------- */}
      {adminTab === 'store_info' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-rose-600" /> Informasi Profil & Kontak Toko
          </h3>

          <form onSubmit={handleSaveStoreInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nama Toko *</label>
                <input
                  type="text"
                  required
                  value={infoName}
                  onChange={(e) => setInfoName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tahun Berdiri *</label>
                <input
                  type="number"
                  required
                  value={infoEst}
                  onChange={(e) => setInfoEst(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Slogan / Tagline Toko</label>
              <input
                type="text"
                value={infoTagline}
                onChange={(e) => setInfoTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Deskripsi / Tentang Toko (tampil di halaman "Tentang Toko Sembako")</label>
              <textarea
                rows={4}
                placeholder="Ceritakan tentang toko Anda, keunggulan, dan komitmen pelayanan..."
                value={infoDesc}
                onChange={(e) => setInfoDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Alamat Fisik Lengkap Toko</label>
              <textarea
                rows={2}
                value={infoAddress}
                onChange={(e) => setInfoAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">No. Telepon Toko</label>
                <input
                  type="text"
                  value={infoPhone}
                  onChange={(e) => setInfoPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">No. WhatsApp Toko</label>
                <input
                  type="text"
                  value={infoWa}
                  onChange={(e) => setInfoWa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Jam Operasional Toko</label>
                <input
                  type="text"
                  value={infoHours}
                  onChange={(e) => setInfoHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Cara Menentukan Status Toko (badge BUKA/TUTUP)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInfoStatusMode('otomatis')}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                    infoStatusMode === 'otomatis'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Otomatis (sesuai jam)
                </button>
                <button
                  type="button"
                  onClick={() => setInfoStatusMode('manual')}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                    infoStatusMode === 'manual'
                      ? 'bg-neutral-800 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Manual
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                "Otomatis": badge BUKA/TUTUP berubah sendiri, mengikuti jam & hari libur toko di bawah — tidak perlu diklik-klik lagi.
                "Manual": Anda yang memilih sendiri status BUKA/TUTUP, misalnya untuk libur mendadak di luar jadwal biasa.
              </p>

              {infoStatusMode === 'otomatis' ? (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">Jam Buka</label>
                      <input
                        type="time"
                        value={infoOpenTime}
                        onChange={(e) => setInfoOpenTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">Jam Tutup</label>
                      <input
                        type="time"
                        value={infoCloseTime}
                        onChange={(e) => setInfoCloseTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-2">Hari Libur Toko (opsional)</label>
                    <div className="flex flex-wrap gap-2">
                      {DAY_LABELS.map((label, idx) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleClosedDay(idx)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            infoClosedDays.includes(idx)
                              ? 'bg-rose-600 text-white border-rose-700'
                              : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5">Klik hari yang dipilih untuk menandainya sebagai hari libur (toko otomatis TUTUP seharian). Kosongkan jika buka setiap hari.</p>
                  </div>

                  <StoreStatusPreview
                    statusMode={infoStatusMode}
                    storeStatus={infoStoreStatus}
                    openTime={infoOpenTime}
                    closeTime={infoCloseTime}
                    closedDays={infoClosedDays}
                  />
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setInfoStoreStatus('buka')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      infoStoreStatus === 'buka'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-300"></span> BUKA
                  </button>
                  <button
                    type="button"
                    onClick={() => setInfoStoreStatus('tutup')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      infoStoreStatus === 'tutup'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-300"></span> TUTUP
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Simpan Profil Toko
            </button>
          </form>
        </div>
      )}

      {/* ---------------- SUB TAB: KELOLA HALAMAN (CUSTOM PAGES) ---------------- */}
      {adminTab === 'pages' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-sky-600" />
                <span>{editingPage ? `Edit Halaman (${editingPage.title})` : 'Tambah Halaman Baru'}</span>
              </h3>
              {editingPage && (
                <button type="button" onClick={resetPageForm} className="text-xs text-rose-600 font-bold hover:underline">
                  Batal Edit
                </button>
              )}
            </div>

            <p className="text-xs text-neutral-500 -mt-2">
              Halaman baru akan otomatis muncul sebagai menu tambahan di navigasi atas website Anda.
            </p>

            <form onSubmit={handleSavePage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Judul Halaman *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Cara Pemesanan, Kebijakan Pengiriman, Karir"
                    value={pageForm.title}
                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Ikon (emoji)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={pageForm.icon}
                    onChange={(e) => setPageForm({ ...pageForm, icon: e.target.value })}
                    className="w-20 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Isi Konten Halaman *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Tulis isi halaman di sini. Tekan Enter untuk membuat paragraf baru..."
                  value={pageForm.content}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{editingPage ? 'Simpan Perubahan Halaman' : 'Publikasikan Halaman Baru'}</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-sky-600" /> Daftar Halaman ({customPages.length})
            </h3>

            {customPages.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">Belum ada halaman tambahan. Buat halaman pertama Anda di atas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customPages.map((page) => (
                  <div key={page.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <span>{page.icon || '📄'}</span> {page.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-3 whitespace-pre-line">{page.content}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/60">
                      <button
                        onClick={() => handleStartEditPage(page)}
                        className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 font-bold rounded-lg text-[11px] hover:bg-neutral-100 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id, page.title)}
                        className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg text-[11px] hover:bg-rose-100 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 6: DATABASE & EXPORT ---------------- */}
      {adminTab === 'database' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" /> Sinkronisasi Database & Export Laporan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
              <strong className="text-emerald-900 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Firebase Firestore Connected
              </strong>
              <p className="text-emerald-800">
                Data toko otomatis tersinkronkan ke cloud <strong>Firebase Firestore</strong> secara real-time. Anda dapat melihat koleksi <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">store_data</code> di Console Firebase.
              </p>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 space-y-1">
              <strong className="text-indigo-900 font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" /> Local Database Status
              </strong>
              <p className="text-indigo-800">
                Penyimpanan lokal browser aktif sebagai cache offline. Perubahan dari admin langsung dipublikasikan ke semua pengunjung toko secara otomatis.
              </p>
            </div>
          </div>

          {/* Export Options Section */}
          <div className="border-t border-neutral-100 pt-6 space-y-4">
            <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-700" /> Export & Unduh Laporan Database (CSV / PDF / JSON)
            </h4>
            <p className="text-xs text-neutral-500">
              Pilih format ekspor data yang Anda butuhkan untuk pembukuan atau cetak laporan fisik:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={handleExportOrdersCSV}
                className="p-4 bg-neutral-50 hover:bg-emerald-50/60 border border-neutral-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-neutral-900 group-hover:text-emerald-900">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Laporan Pesanan (.CSV)
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Unduh spreadsheet rekap seluruh pesanan masuk untuk Excel.</p>
              </button>

              <button
                onClick={handleExportOrdersPDF}
                className="p-4 bg-neutral-50 hover:bg-rose-50/60 border border-neutral-200 hover:border-rose-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-neutral-900 group-hover:text-rose-900">
                  <Printer className="w-4 h-4 text-rose-600" /> Cetak Laporan Pesanan (.PDF)
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Buka format cetak PDF resmi laporan omset & pesanan.</p>
              </button>

              <button
                onClick={handleExportProductsCSV}
                className="p-4 bg-neutral-50 hover:bg-emerald-50/60 border border-neutral-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-neutral-900 group-hover:text-emerald-900">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Katalog Produk (.CSV)
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Unduh rekap stok gudang, harga eceran & harga grosir sembako.</p>
              </button>

              <button
                onClick={handleExportProductsPDF}
                className="p-4 bg-neutral-50 hover:bg-rose-50/60 border border-neutral-200 hover:border-rose-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-neutral-900 group-hover:text-rose-900">
                  <Printer className="w-4 h-4 text-rose-600" /> Cetak Katalog Produk (.PDF)
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Cetak daftar stok dan daftar harga fisik katalog toko sembako.</p>
              </button>

              <button
                onClick={handleExportJSON}
                className="p-4 bg-neutral-50 hover:bg-indigo-50/60 border border-neutral-200 hover:border-indigo-300 rounded-2xl text-left transition-all cursor-pointer group sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-neutral-900 group-hover:text-indigo-900">
                  <FileCode className="w-4 h-4 text-indigo-600" /> Backup Database (.JSON)
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Unduh seluruh snapshot raw data produk, pesanan, dan pengaturan toko.</p>
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 space-y-3">
            <h4 className="font-bold text-xs text-neutral-700">Zona Bahaya / Reset Data</h4>
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mereset seluruh database produk, foto, dan informasi toko ke data awal?')) {
                  db.resetToDefaults();
                  showToast('Database berhasil direset ke data awal toko sembako!');
                }
              }}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Reset Database Ke Data Default Semula
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
