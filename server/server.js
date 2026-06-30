import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TbdJ0-x52E-oR-c5rVIfpBv0',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-jJ2nJ5Q9yP1M-zU8'
});

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak ada.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'kasir') {
    return res.status(403).json({ error: 'Akses ditolak. Hanya untuk Admin/Kasir.' });
  }
  next();
};

// --- Authentication Routes ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone, role: role || 'customer' }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Kredensial tidak valid' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Kredensial tidak valid' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== req.user.userId) {
        return res.status(400).json({ error: 'Email sudah digunakan oleh akun lain' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined
      }
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengupdate profil' });
  }
});
// --- Admin User Routes ---
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil daftar pengguna' });
  }
});

app.put('/api/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'kasir', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengupdate role pengguna' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.userId) {
      return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri' });
    }
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pengguna (mungkin ada data terkait)' });
  }
});

// --- Report Routes ---
app.get('/api/reports/sales', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      const end = new Date(endDate);
      end.setHours(23,59,59,999);
      
      dateFilter = {
        createdAt: {
          gte: start,
          lte: end
        }
      };
    }
    
    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        status: { not: 'Dibatalkan' }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    
    let totalRevenue = 0;
    let totalItemsSold = 0;
    const productSales = {};
    
    orders.forEach(order => {
      totalRevenue += order.total;
      order.items.forEach(item => {
        totalItemsSold += item.qty;
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            name: item.product.name,
            qty: 0,
            revenue: 0
          };
        }
        productSales[item.productId].qty += item.qty;
        productSales[item.productId].revenue += (item.qty * item.price);
      });
    });
    
    const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 10);
    
    res.json({
      totalRevenue,
      totalOrders: orders.length,
      totalItemsSold,
      topProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil laporan' });
  }
});

app.get('/api/notifications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const newOrders = await prisma.order.findMany({
      where: {
        channel: 'online',
        status: { in: ['Menunggu Pembayaran', 'Diproses'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    res.json(newOrders);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil notifikasi' });
  }
});

// --- Product Routes ---

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { 
        category: true,
        orderItems: {
          where: {
            order: {
              status: { not: 'Dibatalkan' }
            }
          },
          select: { qty: true }
        }
      }
    });
    
    // Compute total sales count for each product
    const productsWithSales = products.map(p => {
      const salesCount = p.orderItems.reduce((acc, item) => acc + item.qty, 0);
      const { orderItems, ...rest } = p;
      return { ...rest, salesCount };
    });
    
    res.json(productsWithSales);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

app.post('/api/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan produk' });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengupdate produk' });
  }
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil kategori' });
  }
});

app.post('/api/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan kategori' });
  }
});

// --- Order Routes ---

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customerName, customerPhone, shippingAddress, channel, userId } = req.body;
    
    // Create the order and items atomically, and update product stock
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: 'ORD-' + Date.now(),
          userId: userId || null,
          customerName: customerName || 'Pesanan Offline',
          customerPhone: customerPhone || null,
          shippingAddress: shippingAddress || null,
          total,
          status: channel === 'online' ? 'Menunggu Pembayaran' : 'Selesai',
          channel: channel || 'offline',
          items: {
            create: items.map(item => ({
              productId: item.id,
              qty: item.quantity,
              price: item.price
            }))
          }
        }
      });
      
      // Reduce stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
      
      return newOrder;
    });
    
    res.status(201).json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Gagal membuat pesanan', details: error.message || String(error) });
    }
});

app.get('/api/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil pesanan' });
  }
});

app.put('/api/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengupdate status pesanan' });
  }
});

app.get('/api/orders/user/:id', authenticateToken, async (req, res) => {
  try {
    // Only allow users to fetch their own orders, or admin to fetch any
    if (req.user.role !== 'admin' && req.user.role !== 'kasir' && req.user.userId !== Number(req.params.id)) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }
    
    const orders = await prisma.order.findMany({
      where: { userId: Number(req.params.id) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil riwayat pesanan' });
  }
});

app.get('/api/orders/track/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order track:', error);
    res.status(500).json({ error: 'Gagal mengambil detail pesanan' });
  }
});

app.post('/api/orders/track/:orderNumber/pay', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { orderNumber: req.params.orderNumber },
      data: { status: 'Diproses' } // Move to processing after dummy QRIS payment
    });
    res.json(order);
  } catch (error) {
    console.error('Mock payment error:', error);
    res.status(500).json({ error: 'Gagal memproses pembayaran' });
  }
});

app.get('/api/dashboard/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get the most recent Sunday as the start of the week
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday...
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const [revenueAgg, newOrders, totalProducts, lowStock, recentSalesOrders] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: firstDayOfMonth }, status: { not: 'Dibatalkan' } }
      }),
      prisma.order.count({
        where: { createdAt: { gte: firstDayOfMonth } }
      }),
      prisma.product.count(),
      prisma.product.count({
        where: { stock: { lte: 10 } }
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfWeek }, status: { not: 'Dibatalkan' } },
        select: { createdAt: true, total: true }
      })
    ]);

    // Build the current week's chart array (Sunday to Saturday)
    const dailyMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      const label = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);
      dailyMap[dayStr] = { date: dayStr, label, revenue: 0 };
    }

    recentSalesOrders.forEach(order => {
      const d = new Date(order.createdAt);
      const dayStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (dailyMap[dayStr]) {
        dailyMap[dayStr].revenue += order.total;
      }
    });

    const salesChart = Object.values(dailyMap);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true, status: true, total: true, id: true }
    });

    res.json({
      revenue: revenueAgg._sum.total || 0,
      newOrders,
      totalProducts,
      lowStock,
      recentOrders,
      salesChart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil statistik dashboard' });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}

export default app;
