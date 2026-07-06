export const mockClients = [
  { id: 1, name: 'محمد الأحمد', email: 'mohammed@email.com', phone: '+966501234567', country: '🇸🇦', city: 'الرياض', advisor: 'أحمد العمري', portfolio: 125400, status: 'active', category: 'VIP', joined: '2022-01-15', lastActive: 'اليوم' },
  { id: 2, name: 'سارة العمري', email: 'sara@email.com', phone: '+971501234567', country: '🇦🇪', city: 'دبي', advisor: 'خالد محمد', portfolio: 87200, status: 'active', category: 'standard', joined: '2022-03-20', lastActive: 'اليوم' },
  { id: 3, name: 'طارق القحطاني', email: 'tariq@email.com', phone: '+966501234568', country: '🇸🇦', city: 'جدة', advisor: 'أحمد العمري', portfolio: 234000, status: 'pending', category: 'premium', joined: '2021-11-05', lastActive: 'أمس' },
  { id: 4, name: 'نورة الشمري', email: 'noura@email.com', phone: '+974501234567', country: '🇶🇦', city: 'الدوحة', advisor: 'خالد محمد', portfolio: 56800, status: 'active', category: 'standard', joined: '2023-02-10', lastActive: 'منذ 3 أيام' },
  { id: 5, name: 'خالد التميمي', email: 'khalid@email.com', phone: '+96550123456', country: '🇰🇼', city: 'الكويت', advisor: 'أحمد العمري', portfolio: 189300, status: 'frozen', category: 'VIP', joined: '2020-08-22', lastActive: 'منذ أسبوع' },
  { id: 6, name: 'فاطمة الزهراني', email: 'fatima@email.com', phone: '+966501234569', country: '🇸🇦', city: 'الرياض', advisor: 'خالد محمد', portfolio: 43200, status: 'active', category: 'standard', joined: '2023-05-18', lastActive: 'اليوم' },
  { id: 7, name: 'عبدالله السالم', email: 'abdullah@email.com', phone: '+966501234570', country: '🇸🇦', city: 'الدمام', advisor: 'أحمد العمري', portfolio: 312000, status: 'active', category: 'VIP', joined: '2019-12-01', lastActive: 'اليوم' },
  { id: 8, name: 'ريم المطيري', email: 'reem@email.com', phone: '+965501234567', country: '🇰🇼', city: 'الكويت', advisor: 'خالد محمد', portfolio: 78900, status: 'pending', category: 'standard', joined: '2023-08-14', lastActive: 'أمس' },
]

export const mockPortfolios = [
  { clientId: 1, clientName: 'محمد الأحمد', total: 125400, return: 18.7, advisor: 'أحمد العمري', assets: [
    { name: 'أرامكو', type: 'stocks', qty: 100, price: 124, value: 12400, change: 2.1 },
    { name: 'BTC', type: 'crypto', qty: 0.5, price: 67240, value: 33620, change: 3.4 },
    { name: 'ذهب', type: 'metals', qty: 5, price: 2340, value: 11700, change: 0.9 },
    { name: 'Apple', type: 'stocks', qty: 50, price: 189.5, value: 9475, change: -1.2 },
  ]},
  { clientId: 2, clientName: 'سارة العمري', total: 87200, return: 14.3, advisor: 'خالد محمد', assets: [
    { name: 'Microsoft', type: 'stocks', qty: 30, price: 415, value: 12450, change: 1.8 },
    { name: 'ETH', type: 'crypto', qty: 5, price: 3820, value: 19100, change: 5.2 },
    { name: 'نفط برنت', type: 'oil', qty: 50, price: 87.3, value: 4365, change: -0.4 },
  ]},
  { clientId: 3, clientName: 'طارق القحطاني', total: 234000, return: 21.2, advisor: 'أحمد العمري', assets: [
    { name: 'Tesla', type: 'stocks', qty: 80, price: 245, value: 19600, change: -2.3 },
    { name: 'BTC', type: 'crypto', qty: 1.2, price: 67240, value: 80688, change: 3.4 },
    { name: 'ذهب', type: 'metals', qty: 20, price: 2340, value: 46800, change: 0.9 },
  ]},
]

export const mockTransactions = [
  { id: 5234, type: 'buy', client: 'محمد الأحمد', asset: 'أرامكو', qty: 100, price: 124, total: 12400, status: 'completed', date: '2025-01-09 10:45' },
  { id: 5233, type: 'sell', client: 'سارة العمري', asset: 'BTC', qty: 0.1, price: 67240, total: 6724, status: 'completed', date: '2025-01-09 10:32' },
  { id: 5232, type: 'buy', client: 'خالد التميمي', asset: 'ذهب', qty: 2, price: 2340, total: 4680, status: 'pending', date: '2025-01-09 10:15' },
  { id: 5231, type: 'buy', client: 'نورة الشمري', asset: 'Apple', qty: 50, price: 189.5, total: 9475, status: 'completed', date: '2025-01-09 09:50' },
  { id: 5230, type: 'sell', client: 'عبدالله السالم', asset: 'Microsoft', qty: 20, price: 415, total: 8300, status: 'completed', date: '2025-01-08 16:30' },
  { id: 5229, type: 'buy', client: 'فاطمة الزهراني', asset: 'ETH', qty: 2, price: 3820, total: 7640, status: 'pending', date: '2025-01-08 14:20' },
  { id: 5228, type: 'transfer', client: 'ريم المطيري', asset: 'USD', qty: 10000, price: 1, total: 10000, status: 'pending', date: '2025-01-08 11:00' },
]

export const mockMessages = [
  { id: 1, client: 'محمد الأحمد', avatar: '', preview: 'كيف أداء محفظتي هذا الشهر؟', time: '10:45 ص', unread: 2, online: true, messages: [
    { id: 1, from: 'client', text: 'السلام عليكم، كيف أداء محفظتي هذا الشهر؟', time: '10:32 ص' },
    { id: 2, from: 'admin', text: 'وعليكم السلام، أداءها ممتاز! ارتفعت بنسبة 18.7% هذا الشهر', time: '10:35 ص' },
    { id: 3, from: 'client', text: 'شكراً جزيلاً 🙏', time: '10:36 ص' },
    { id: 4, from: 'client', text: 'كيف أداء محفظتي هذا الشهر؟', time: '10:45 ص' },
  ]},
  { id: 2, client: 'سارة العمري', avatar: '', preview: 'شكراً جزيلاً على المتابعة', time: 'أمس', unread: 0, online: false, messages: [
    { id: 1, from: 'client', text: 'شكراً جزيلاً على المتابعة المستمرة', time: 'أمس 14:00' },
    { id: 2, from: 'admin', text: 'دائماً في الخدمة. هل تحتاجين لأي شيء آخر؟', time: 'أمس 14:05' },
  ]},
  { id: 3, client: 'خالد التميمي', avatar: '', preview: 'متى سيصدر التقرير الشهري؟', time: 'منذ 3 أيام', unread: 1, online: false, messages: [
    { id: 1, from: 'client', text: 'متى سيصدر التقرير الشهري؟', time: 'منذ 3 أيام' },
  ]},
]

export const mockArticles = [
  { id: 1, title: 'توقعات أسواق الخليج لعام 2025', category: 'تحليل', status: 'published', author: 'أحمد المشرف', views: 1234, comments: 12, date: '2025-01-09', thumbnail: '' },
  { id: 2, title: 'تحليل أداء أرامكو بعد نتائج الربع الرابع', category: 'أسهم', status: 'draft', author: 'سارة المشرفة', views: 876, comments: 5, date: '2025-01-08', thumbnail: '' },
  { id: 3, title: 'البيتكوين يكسر حاجز 70 ألف دولار', category: 'رقمي', status: 'published', author: 'أحمد المشرف', views: 3421, comments: 28, date: '2025-01-07', thumbnail: '' },
  { id: 4, title: 'الذهب يسجل أعلى مستوياته في 3 سنوات', category: 'معادن', status: 'published', author: 'خالد المحرر', views: 987, comments: 8, date: '2025-01-06', thumbnail: '' },
]

export const mockTeam = [
  { id: 1, name: 'أحمد المشرف', email: 'admin@company.com', role: 'SUPER_ADMIN', clients: 0, lastActive: 'اليوم', status: 'active', joined: '2019-01-01' },
  { id: 2, name: 'خالد محمد', email: 'khalid@company.com', role: 'ADMIN', clients: 0, lastActive: 'اليوم', status: 'active', joined: '2020-03-15' },
  { id: 3, name: 'أحمد العمري', email: 'advisor1@company.com', role: 'ADVISOR', clients: 234, lastActive: 'منذ ساعة', status: 'active', joined: '2021-06-01' },
  { id: 4, name: 'سارة الزهراني', email: 'advisor2@company.com', role: 'ADVISOR', clients: 87, lastActive: 'أمس', status: 'active', joined: '2022-01-20' },
  { id: 5, name: 'نورة السالم', email: 'content@company.com', role: 'CONTENT_MANAGER', clients: 0, lastActive: 'اليوم', status: 'active', joined: '2023-03-10' },
]

export const mockNotifications = [
  { id: 1, type: 'critical', icon: '🔴', title: 'طلب تسجيل جديد', desc: 'محمد السالم يطلب الانضمام للمنصة', time: '10:45', read: false, actions: ['موافقة', 'رفض'] },
  { id: 2, type: 'warning', icon: '🟡', title: 'تقرير منتهي الصلاحية', desc: 'تقرير سارة العمري انتهت صلاحيته', time: '10:32', read: false, actions: ['تجديد'] },
  { id: 3, type: 'info', icon: '🔵', title: 'رسالة جديدة', desc: 'خالد التميمي: متى التقرير؟', time: '09:15', read: false, actions: ['رد'] },
  { id: 4, type: 'success', icon: '🟢', title: 'تم إرسال التقارير', desc: 'تم إرسال 45 تقرير شهري بنجاح', time: '08:00', read: true, actions: [] },
  { id: 5, type: 'info', icon: '💸', title: 'صفقة شراء ناجحة', desc: 'محمد الأحمد — أرامكو ($12,400)', time: 'أمس 15:20', read: true, actions: [] },
  { id: 6, type: 'info', icon: '👤', title: 'تعيين مستشار جديد', desc: 'تم تعيين مستشار جديد للعميل سارة', time: 'أمس 11:00', read: true, actions: [] },
]

export const mockLogs = [
  { id: 1, time: '10:45:23', user: 'أحمد المشرف', event: 'تسجيل دخول', ip: '197.48.12.55', status: 'success' },
  { id: 2, time: '10:30:11', user: 'خالد محمد', event: 'تعديل بيانات عميل', ip: '197.48.12.60', status: 'success' },
  { id: 3, time: '09:15:44', user: 'غير معروف', event: 'محاولة دخول فاشلة', ip: '45.227.115.8', status: 'failed' },
  { id: 4, time: '09:00:00', user: 'نورة السالم', event: 'نشر مقال جديد', ip: '197.48.12.72', status: 'success' },
  { id: 5, time: '08:45:30', user: 'أحمد العمري', event: 'إضافة صفقة شراء', ip: '197.48.12.55', status: 'success' },
  { id: 6, time: '08:20:15', user: 'غير معروف', event: 'محاولة دخول فاشلة', ip: '45.227.115.8', status: 'failed' },
  { id: 7, time: '08:00:00', user: 'النظام', event: 'إرسال التقارير الشهرية', ip: 'localhost', status: 'success' },
]

export const chartAUM = [
  { month: 'يناير', aum: 1800 }, { month: 'فبراير', aum: 1920 }, { month: 'مارس', aum: 1850 },
  { month: 'أبريل', aum: 2100 }, { month: 'مايو', aum: 2050 }, { month: 'يونيو', aum: 2200 },
  { month: 'يوليو', aum: 2150 }, { month: 'أغسطس', aum: 2300 }, { month: 'سبتمبر', aum: 2250 },
  { month: 'أكتوبر', aum: 2350 }, { month: 'نوفمبر', aum: 2380 }, { month: 'ديسمبر', aum: 2400 },
]

export const chartRevenue = [
  { month: 'يناير', revenue: 45, profit: 28 }, { month: 'فبراير', revenue: 52, profit: 33 },
  { month: 'مارس', revenue: 48, profit: 30 }, { month: 'أبريل', revenue: 61, profit: 40 },
  { month: 'مايو', revenue: 58, profit: 38 }, { month: 'يونيو', revenue: 67, profit: 44 },
  { month: 'يوليو', revenue: 72, profit: 48 }, { month: 'أغسطس', revenue: 69, profit: 46 },
  { month: 'سبتمبر', revenue: 78, profit: 52 }, { month: 'أكتوبر', revenue: 84, profit: 56 },
  { month: 'نوفمبر', revenue: 88, profit: 59 }, { month: 'ديسمبر', revenue: 94, profit: 63 },
]

export const chartPortfolioAlloc = [
  { name: 'خليجي', value: 38, color: '#3B82F6' },
  { name: 'عالمي', value: 27, color: '#C9A84C' },
  { name: 'رقمي', value: 18, color: '#F59E0B' },
  { name: 'معادن', value: 12, color: '#9CA3AF' },
  { name: 'نفط', value: 5, color: '#EF4444' },
]

export const chartNewClients = [
  { month: 'يوليو', clients: 45 }, { month: 'أغسطس', clients: 52 },
  { month: 'سبتمبر', clients: 38 }, { month: 'أكتوبر', clients: 61 },
  { month: 'نوفمبر', clients: 55 }, { month: 'ديسمبر', clients: 48 },
  { month: 'يناير', clients: 67 },
]

export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: '👑 Super Admin',
  ADMIN: '🔵 مشرف',
  ADVISOR: '🟡 مستشار',
  CONTENT_MANAGER: '🟢 محرر محتوى',
}

export const statusLabels: Record<string, string> = {
  active: 'نشط',
  pending: 'معلق',
  frozen: 'مجمد',
  inactive: 'غير نشط',
}

// ==================== CMS DATA ====================

export const mockHeroData = {
  badge: 'شركة استثمارية مرخصة • منذ 2010',
  typewriterText: 'استثماراتك',
  line2: 'بأيدي خبراء',
  line3: 'نحو مستقبل مالي أكثر ثباتاً',
  description: 'ندير استثماراتك في أسواق الأسهم العربية والعالمية، العملات الرقمية، المعادن النفيسة والنفط، بخبرة احترافية تمتد لأكثر من خمسة عشر عاماً.',
  btn1Text: 'تواصل مع مستشار',
  btn1Link: '/contact',
  btn2Text: 'اكتشف خدماتنا',
  btn2Link: '/services',
  portfolioValue: '$1,284,920',
  portfolioChange: '▲ +12.4%',
  floatingCard1Symbol: 'BTC',
  floatingCard1Change: '+2.4%',
  floatingCard2Symbol: 'الذهب',
  floatingCard2Change: '+0.9%',
}

export const mockTrustBadges = [
  { id: 1, icon: '🛡️', text: 'ترخيص رسمي معتمد', visible: true, order: 1 },
  { id: 2, icon: '🏆', text: 'جائزة أفضل شركة 2024', visible: true, order: 2 },
  { id: 3, icon: '👥', text: '+5,000 عميل موثوق', visible: true, order: 3 },
  { id: 4, icon: '📈', text: 'عائد سنوي +22%', visible: true, order: 4 },
]

export const mockSiteStats = [
  { id: 1, prefix: '+', value: 5000, suffix: '', label: 'عميل حول العالم', duration: 2000, visible: true, order: 1 },
  { id: 2, prefix: '+$', value: 2, suffix: 'B', label: 'أصول تحت الإدارة', duration: 2000, visible: true, order: 2 },
  { id: 3, prefix: '+', value: 15, suffix: 'سنة', label: 'خبرة في الأسواق', duration: 2000, visible: true, order: 3 },
  { id: 4, prefix: '', value: 98, suffix: '%', label: 'نسبة رضا العملاء', duration: 2000, visible: true, order: 4 },
]

export const mockServices = [
  { id: 1, slug: 'gulf-stocks', emoji: '📈', icon: 'TrendingUp', title: 'الأسهم الخليجية والعربية', subtitle: 'استثمر في القلب الاقتصادي للمنطقة', description: 'إدارة استثماراتك في أسواق تداول السعودية وأبوظبي ودبي والكويت ومصر والبحرين.', features: ['تحليل يومي للأسهم', 'محافظ مخصصة', 'تقارير شهرية مفصّلة', 'دعم مباشر 24/7', 'أسهم نمو + أسهم قيمة', 'REIT عقارية خليجية'], returns: '+18.5%', risk: 'متوسط', minInvest: '50,000 ريال', visible: true, order: 1 },
  { id: 2, slug: 'global-stocks', emoji: '🌍', icon: 'Globe', title: 'الأسهم العالمية', subtitle: 'استثمر في عمالقة الاقتصاد العالمي', description: 'وصول مباشر إلى وول ستريت وناسداك ولندن وطوكيو وهونغ كونغ.', features: ['15+ سوق عالمي', 'تحليل AI معتمد', 'تحوط العملات', 'تقارير ربعية', 'أسهم S&P 500', 'ETF القطاعية'], returns: '+22.3%', risk: 'متوسط–مرتفع', minInvest: '100,000 ريال', visible: true, order: 2 },
  { id: 3, slug: 'crypto', emoji: '₿', icon: 'Bitcoin', title: 'العملات الرقمية', subtitle: 'الأصول الرقمية بأمان مؤسسي', description: 'محافظ منوّعة من Bitcoin وEthereum والأصول الرقمية الواعدة.', features: ['Bitcoin & Ethereum', 'حفظ Cold Storage', 'تنويع ذكي', 'إدارة مخاطر', 'تقارير ضريبية', 'DeFi متاح'], returns: '+45.8%', risk: 'مرتفع', minInvest: '25,000 ريال', visible: true, order: 3 },
  { id: 4, slug: 'funds', emoji: '🏛', icon: 'Building2', title: 'صناديق الاستثمار', subtitle: 'تنويع ذكي بإدارة احترافية', description: 'صناديق متخصصة بمستويات مخاطر متعددة.', features: ['صناديق دخل ثابت', 'صناديق نمو', 'صناديق متوازنة', 'ETF عالمية', 'صناديق إسلامية', 'صناديق عقارية'], returns: '+14.2%', risk: 'منخفض–متوسط', minInvest: '10,000 ريال', visible: true, order: 4 },
  { id: 5, slug: 'metals', emoji: '💎', icon: 'Gem', title: 'المعادن والذهب', subtitle: 'الملاذ الآمن ضد التضخم', description: 'استثمارات في الذهب والفضة والبلاتين عبر عقود آجلة وETF.', features: ['ذهب فيزيائي', 'ETF معادن', 'عقود آجلة', 'تحوط تضخم', 'البلاتين والفضة', 'تقارير ضريبية'], returns: '+11.7%', risk: 'منخفض–متوسط', minInvest: '20,000 ريال', visible: true, order: 5 },
  { id: 6, slug: 'energy', emoji: '⛽', icon: 'Fuel', title: 'النفط والطاقة', subtitle: 'استثمر في شريان الاقتصاد العالمي', description: 'استثمارات في عقود النفط الخام WTI وبرنت وأسهم الطاقة.', features: ['نفط WTI & برنت', 'غاز طبيعي', 'طاقة متجددة', 'أسهم طاقة', 'عقود آجلة', 'تحوط نفطي'], returns: '+16.9%', risk: 'متوسط–مرتفع', minInvest: '50,000 ريال', visible: true, order: 6 },
]

export const mockMarketCategories = [
  { id: 1, name: 'الأسهم', visible: true, order: 1 },
  { id: 2, name: 'العملات الرقمية', visible: true, order: 2 },
  { id: 3, name: 'المعادن', visible: true, order: 3 },
  { id: 4, name: 'الطاقة', visible: true, order: 4 },
]

export const mockMarketAssets = [
  { id: 1, category: 'الأسهم', name: 'أرامكو السعودية', symbol: '2222.SR', price: '35.20 ر.س', change: 1.4, volume: '12.3M', marketCap: '7.5T', visible: true, order: 1 },
  { id: 2, category: 'الأسهم', name: 'بنك الراجحي', symbol: '1120.SR', price: '91.80 ر.س', change: -0.8, volume: '4.1M', marketCap: '345B', visible: true, order: 2 },
  { id: 3, category: 'الأسهم', name: 'NVIDIA', symbol: 'NVDA', price: '$875.40', change: 3.2, volume: '45.7M', marketCap: '2.1T', visible: true, order: 3 },
  { id: 4, category: 'الأسهم', name: 'أبل', symbol: 'AAPL', price: '$192.53', change: 0.6, volume: '55.2M', marketCap: '3.0T', visible: true, order: 4 },
  { id: 5, category: 'الأسهم', name: 'مصرف أبوظبي', symbol: 'ADCB', price: '9.42 د.إ', change: 2.1, volume: '8.6M', marketCap: '84B', visible: true, order: 5 },
  { id: 6, category: 'الأسهم', name: 'مايكروسوفت', symbol: 'MSFT', price: '$418.20', change: -0.3, volume: '22.1M', marketCap: '3.1T', visible: true, order: 6 },
  { id: 7, category: 'العملات الرقمية', name: 'Bitcoin', symbol: 'BTC/USD', price: '$67,320', change: 2.4, volume: '28.4B', marketCap: '1.32T', visible: true, order: 1 },
  { id: 8, category: 'العملات الرقمية', name: 'Ethereum', symbol: 'ETH/USD', price: '$3,512', change: -1.2, volume: '12.1B', marketCap: '422B', visible: true, order: 2 },
  { id: 9, category: 'العملات الرقمية', name: 'Solana', symbol: 'SOL/USD', price: '$175', change: 4.1, volume: '3.5B', marketCap: '80B', visible: true, order: 3 },
  { id: 10, category: 'العملات الرقمية', name: 'Ripple', symbol: 'XRP/USD', price: '$0.52', change: -0.4, volume: '1.8B', marketCap: '29B', visible: true, order: 4 },
  { id: 11, category: 'المعادن', name: 'الذهب', symbol: 'XAU/USD', price: '$2,325/oz', change: 0.5, volume: 'N/A', marketCap: 'N/A', visible: true, order: 1 },
  { id: 12, category: 'المعادن', name: 'الفضة', symbol: 'XAG/USD', price: '$29.80/oz', change: -0.3, volume: 'N/A', marketCap: 'N/A', visible: true, order: 2 },
  { id: 13, category: 'المعادن', name: 'البلاتين', symbol: 'XPT/USD', price: '$993/oz', change: 1.1, volume: 'N/A', marketCap: 'N/A', visible: true, order: 3 },
  { id: 14, category: 'الطاقة', name: 'النفط WTI', symbol: 'CL', price: '$79.40/bbl', change: 1.2, volume: 'N/A', marketCap: 'N/A', visible: true, order: 1 },
  { id: 15, category: 'الطاقة', name: 'برنت الخام', symbol: 'BZ', price: '$83.10/bbl', change: 0.9, volume: 'N/A', marketCap: 'N/A', visible: true, order: 2 },
  { id: 16, category: 'الطاقة', name: 'الغاز الطبيعي', symbol: 'NG', price: '$2.18/MMBtu', change: -2.1, volume: 'N/A', marketCap: 'N/A', visible: true, order: 3 },
]

export const mockTickerItems = [
  { id: 1, symbol: 'BTC/USD', price: '67,240', change: 2.4, dir: 'up', visible: true, order: 1 },
  { id: 2, symbol: 'ETH/USD', price: '3,180', change: 1.8, dir: 'up', visible: true, order: 2 },
  { id: 3, symbol: 'أرامكو', price: '27.45', change: -0.3, dir: 'down', visible: true, order: 3 },
  { id: 4, symbol: 'الذهب', price: '2,340', change: 0.9, dir: 'up', visible: true, order: 4 },
  { id: 5, symbol: 'برنت', price: '82.40', change: -0.4, dir: 'down', visible: true, order: 5 },
  { id: 6, symbol: 'AAPL', price: '189.50', change: 0.8, dir: 'up', visible: true, order: 6 },
  { id: 7, symbol: 'NVDA', price: '875.40', change: 3.2, dir: 'up', visible: true, order: 7 },
  { id: 8, symbol: 'الفضة', price: '29.80', change: 1.4, dir: 'up', visible: true, order: 8 },
]

export const mockFAQCategories = [
  { id: 1, name: 'البداية', order: 1, visible: true },
  { id: 2, name: 'المحفظة', order: 2, visible: true },
  { id: 3, name: 'الرسوم', order: 3, visible: true },
  { id: 4, name: 'المخاطر', order: 4, visible: true },
  { id: 5, name: 'السحب', order: 5, visible: true },
]

export const mockFAQs = [
  { id: 1, categoryId: 1, question: 'كيف أبدأ الاستثمار مع الثروة كابيتال؟', answer: 'ابدأ بحجز استشارة مجانية عبر صفحة التواصل. سيتواصل معك مستشارنا خلال 24 ساعة.', order: 1, visible: true },
  { id: 2, categoryId: 1, question: 'ما الحد الأدنى للاستثمار؟', answer: 'يختلف الحد الأدنى حسب نوع الخدمة. تبدأ خدمات إدارة المحافظ من 50,000 ريال.', order: 2, visible: true },
  { id: 3, categoryId: 1, question: 'هل أنتم شركة مرخصة؟', answer: 'نعم، مرخصون من هيئة الأوراق المالية في الإمارات ومن الجهات الرقابية الخليجية.', order: 3, visible: true },
  { id: 4, categoryId: 2, question: 'كيف يتم اختيار الأصول في محفظتي؟', answer: 'يعتمد على خوارزميات الذكاء الاصطناعي وخبرة أكثر من 30 محللاً ماليًا معتمداً.', order: 1, visible: true },
  { id: 5, categoryId: 2, question: 'كم مرة تُراجع المحفظة؟', answer: 'نراجع المحفظة يومياً تلقائياً، والمراجعة الاستراتيجية شهرياً مع خبيرك المعين.', order: 2, visible: true },
  { id: 6, categoryId: 2, question: 'هل يمكنني الوصول لمحفظتي في أي وقت؟', answer: 'نعم، يمكنك الوصول الكامل 24/7 عبر بوابة العملاء والتطبيق.', order: 3, visible: true },
  { id: 7, categoryId: 3, question: 'ما هيكل الرسوم لديكم؟', answer: 'رسوم إدارة سنوية 0.5%-1.5% ورسوم أداء 10% على الأرباح فوق المعدل المرجعي.', order: 1, visible: true },
  { id: 8, categoryId: 3, question: 'هل هناك رسوم إضافية على المعاملات؟', answer: 'لا. رسوم التداول مدمجة في رسوم الإدارة السنوية.', order: 2, visible: true },
  { id: 9, categoryId: 4, question: 'هل استثماراتي مؤمنة؟', answer: 'أصولك محفوظة في حسابات منفصلة ومؤمنة حتى $500,000.', order: 1, visible: true },
  { id: 10, categoryId: 4, question: 'كيف تتعاملون مع تقلبات السوق؟', answer: 'نستخدم stop-loss تلقائي وتنويع جغرافي واستراتيجيات التحوط.', order: 2, visible: true },
  { id: 11, categoryId: 5, question: 'متى يمكنني سحب أموالي؟', answer: 'أموالك متاحة خلال 3-5 أيام عمل. العملات الرقمية خلال 24-48 ساعة.', order: 1, visible: true },
  { id: 12, categoryId: 5, question: 'هل يوجد غرامة على السحب المبكر؟', answer: 'لا توجد غرامات على معظم الخدمات. بعض الصناديق لها فترة إلزامية 6 أشهر.', order: 2, visible: true },
]

export const mockTestimonials = [
  { id: 1, name: 'محمد أحمد الراشد', role: 'رجل أعمال', city: 'الرياض', text: 'تجربتي مع الثروة كابيتال كانت استثنائية. حقق فريقهم عائداً فاق توقعاتي بنسبة 22% خلال العام الأول.', rating: 5, visible: true, order: 1 },
  { id: 2, name: 'د. سارة المنصوري', role: 'طبيبة استشارية', city: 'دبي', text: 'كنت أبحث عن جهة موثوقة لإدارة مدخراتي. وجدت في الثروة كابيتال الشريك المثالي.', rating: 5, visible: true, order: 2 },
  { id: 3, name: 'خالد بن سلمان', role: 'مهندس بترول', city: 'الكويت', text: 'احترافية في العمل وشفافية تامة. المستشار المعين لحسابي كان دائماً متوفراً للإجابة على أسئلتي.', rating: 5, visible: true, order: 3 },
  { id: 4, name: 'نورة الزهراني', role: 'مديرة مالية', city: 'جدة', text: 'خدمة عملاء راقية جداً وتقارير شهرية مفصلة تجعلني دائماً على اطلاع كامل باستثماراتي.', rating: 5, visible: true, order: 4 },
]

export const mockTimelineEvents = [
  { id: 1, year: '2010', title: 'التأسيس', description: 'تأسست الشركة في دبي برأس مال أولي 50 مليون دولار وفريق من 12 خبيراً.', order: 1, visible: true },
  { id: 2, year: '2013', title: 'التوسع الإقليمي', description: 'افتتاح فروع في الرياض والكويت والقاهرة وأصول تجاوزت 500 مليون دولار.', order: 2, visible: true },
  { id: 3, year: '2016', title: 'الاعتراف الدولي', description: 'جائزة أفضل شركة استثمار في الشرق الأوسط من Bloomberg Markets.', order: 3, visible: true },
  { id: 4, year: '2019', title: 'الذكاء الاصطناعي', description: 'إطلاق منصة التحليل الذكي التي تخدم أكثر من 2000 عميل مؤسسي.', order: 4, visible: true },
  { id: 5, year: '2022', title: 'التوسع العالمي', description: 'مكاتب في لندن وسنغافورة والوصول إلى 15 سوقاً مالياً عالمياً.', order: 5, visible: true },
  { id: 6, year: '2024', title: 'رقمي أولاً', description: 'إطلاق منصة الاستثمار الرقمي ومحافظ العملات المشفرة المؤسسية.', order: 6, visible: true },
]

export const mockCoreValues = [
  { id: 1, icon: '🛡️', title: 'الثقة والشفافية', description: 'نلتزم بأعلى معايير الشفافية في جميع تعاملاتنا مع عملائنا.', order: 1, visible: true },
  { id: 2, icon: '🏆', title: 'التميز المهني', description: 'فريق معتمد من أفضل الجامعات والمؤسسات المالية العالمية.', order: 2, visible: true },
  { id: 3, icon: '👥', title: 'خدمة شخصية', description: 'خطة استثمارية مخصصة تناسب أهدافك وتحملك للمخاطر.', order: 3, visible: true },
  { id: 4, icon: '🌐', title: 'وصول عالمي', description: 'شراكات مع أبرز البنوك والمؤسسات في أكثر من 30 دولة.', order: 4, visible: true },
]

export const mockWhyChooseUs = [
  { id: 1, icon: '🛡️', title: 'ترخيص رسمي', description: 'مرخصون من هيئات رقابية معتمدة في الإمارات والسعودية.', order: 1, visible: true },
  { id: 2, icon: '🏆', title: 'خبرة 15+ سنة', description: 'فريق محترف من المحللين والمستشارين الماليين الدوليين.', order: 2, visible: true },
  { id: 3, icon: '👤', title: 'إدارة شخصية', description: 'مستشار مالي مخصص لكل عميل بمتابعة دائمة وشخصية.', order: 3, visible: true },
  { id: 4, icon: '⏰', title: 'دعم 24/7', description: 'خدمة عملاء على مدار الساعة بالعربية والإنجليزية.', order: 4, visible: true },
  { id: 5, icon: '🔒', title: 'أمان مؤسسي', description: 'تشفير بنكي وحماية متعددة الطبقات لأصولك ومعلوماتك.', order: 5, visible: true },
  { id: 6, icon: '⚡', title: 'تنفيذ فوري', description: 'منصة تداول متقدمة بتنفيذ لحظي للصفقات في الأسواق العالمية.', order: 6, visible: true },
]

export const mockHowItWorks = [
  { id: 1, step: '01', icon: '📞', title: 'تواصل معنا', description: 'حدد موعد استشارة مجانية مع أحد مستشارينا الماليين.', order: 1, visible: true },
  { id: 2, step: '02', icon: '📋', title: 'دراسة احتياجاتك', description: 'نحلل أهدافك المالية وقدرتك على تحمل المخاطر بدقة.', order: 2, visible: true },
  { id: 3, step: '03', icon: '💼', title: 'وضع الخطة', description: 'نصمم محفظة استثمارية مخصصة تلائم تطلعاتك بالضبط.', order: 3, visible: true },
  { id: 4, step: '04', icon: '📊', title: 'متابعة وتقارير', description: 'تقارير دورية مفصلة ومتابعة لحظية لأداء استثماراتك.', order: 4, visible: true },
]

export const mockNavLinks = [
  { id: 1, label: 'الرئيسية', url: '/', type: 'internal', target: '_self', hasMega: false, visible: true, order: 1 },
  { id: 2, label: 'من نحن', url: '/about', type: 'internal', target: '_self', hasMega: false, visible: true, order: 2 },
  { id: 3, label: 'خدماتنا', url: '/services', type: 'internal', target: '_self', hasMega: true, visible: true, order: 3 },
  { id: 4, label: 'الأسواق', url: '/markets', type: 'internal', target: '_self', hasMega: false, visible: true, order: 4 },
  { id: 5, label: 'الأخبار', url: '/news', type: 'internal', target: '_self', hasMega: false, visible: true, order: 5 },
  { id: 6, label: 'الأسئلة الشائعة', url: '/faq', type: 'internal', target: '_self', hasMega: false, visible: true, order: 6 },
  { id: 7, label: 'تواصل معنا', url: '/contact', type: 'internal', target: '_self', hasMega: false, visible: true, order: 7 },
]

export const mockFooterData = {
  companyName: 'الثروة كابيتال كابيتال',
  companyNameEn: 'Rasekhoon Capital',
  description: 'شركة استثمارية رائدة متخصصة في إدارة الثروات وتقديم الحلول الاستثمارية المتكاملة للأفراد والمؤسسات.',
  badge1: 'مرخص رسمياً',
  badge2: 'ISO 27001',
  address: 'برج المركز المالي، شارع الشيخ زايد، دبي، الإمارات العربية المتحدة',
  phone: '+971 4 123 4567',
  email: 'info@rasekhoon.com',
  workHours: 'الأحد – الخميس: 9ص – 6م\nالجمعة: 9ص – 12م',
  linkedin: '#',
  twitter: '#',
  instagram: '#',
  youtube: '#',
  privacyLink: '#',
  termsLink: '#',
  disclosuresLink: '#',
  copyright: '© {year} الثروة كابيتال كابيتال. جميع الحقوق محفوظة.',
  whatsapp: '97141234567',
  whatsappText: 'تحدث معنا',
  cookieBannerText: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك.',
  newsletterTitle: 'اشترك في نشرتنا الأسبوعية',
  ctaTitle: 'ابدأ رحلتك الاستثمارية اليوم',
  ctaDesc: 'تواصل مع فريق خبرائنا المتخصصين، وسنضع لك خطة استثمارية متكاملة.',
  ctaBtn1: 'تواصل مع مستشار الآن',
  ctaBtn1Link: '/contact',
  ctaBtn2: 'استشارة عبر واتساب',
  ctaBtn2Link: 'https://wa.me/971000000000',
}

export const mockContactMessages = [
  { id: 1, name: 'أحمد السالم', email: 'ahmed@email.com', phone: '+966501234567', service: 'الأسهم الخليجية', message: 'أريد معرفة المزيد عن خدمات إدارة محافظ الأسهم الخليجية.', status: 'new', date: '2025-06-15 10:30' },
  { id: 2, name: 'سارة المحمد', email: 'sara@email.com', phone: '+971501234567', service: 'العملات الرقمية', message: 'هل تقدمون خدمة تداول العملات الرقمية للمبتدئين؟', status: 'reviewing', date: '2025-06-14 14:20' },
  { id: 3, name: 'خالد الرشيد', email: 'khalid@email.com', phone: '+96550123456', service: 'استشارة عامة', message: 'أريد استشارة عامة حول توزيع المحفظة الاستثمارية.', status: 'resolved', date: '2025-06-13 09:15' },
  { id: 4, name: 'نورة العتيبي', email: 'noura@email.com', phone: '+966501234568', service: 'صناديق الاستثمار', message: 'ما هي الصناديق الإسلامية المتاحة لديكم؟', status: 'new', date: '2025-06-12 16:45' },
]

export const mockNewsletterSubs = [
  { id: 1, email: 'subscriber1@email.com', status: 'active', date: '2025-06-10' },
  { id: 2, email: 'subscriber2@email.com', status: 'active', date: '2025-06-09' },
  { id: 3, email: 'subscriber3@email.com', status: 'unsubscribed', date: '2025-06-08' },
  { id: 4, email: 'subscriber4@email.com', status: 'active', date: '2025-06-07' },
  { id: 5, email: 'subscriber5@email.com', status: 'active', date: '2025-06-06' },
]

export const mockAboutHeroStats = [
  { id: 1, icon: '📈', value: '$2B+', label: 'أصول مدارة', order: 1, visible: true },
  { id: 2, icon: '👥', value: '5,000+', label: 'عميل موثوق', order: 2, visible: true },
  { id: 3, icon: '⭐', value: '98.5%', label: 'نسبة رضا', order: 3, visible: true },
  { id: 4, icon: '🌐', value: '15+', label: 'سوق عالمي', order: 4, visible: true },
]

// ==================== CLIENT LOGIN ACCOUNTS ====================

export const mockClientAccounts = [
  { id: 1, clientId: 1, name: 'محمد الأحمد', email: 'mohammed@tharwah.com', password: 'Tharwah@2024', phone: '+966501234567', status: 'active', portfolioCode: 'PF-001', createdAt: '2024-01-15', createdBy: 'أحمد المشرف', lastLogin: 'اليوم 10:32' },
  { id: 2, clientId: 2, name: 'سارة العمري', email: 'sara@tharwah.com', password: 'Sara@2024!', phone: '+971501234567', status: 'active', portfolioCode: 'PF-002', createdAt: '2024-03-20', createdBy: 'خالد محمد', lastLogin: 'اليوم 09:15' },
  { id: 3, clientId: 3, name: 'طارق القحطاني', email: 'tariq@tharwah.com', password: 'Tariq@2024!', phone: '+966501234568', status: 'suspended', portfolioCode: 'PF-003', createdAt: '2024-11-05', createdBy: 'أحمد المشرف', lastLogin: 'منذ أسبوع' },
  { id: 4, clientId: 4, name: 'نورة الشمري', email: 'noura@tharwah.com', password: 'Noura@2024!', phone: '+974501234567', status: 'active', portfolioCode: 'PF-004', createdAt: '2024-02-10', createdBy: 'خالد محمد', lastLogin: 'أمس' },
  { id: 5, clientId: 7, name: 'عبدالله السالم', email: 'abdullah@tharwah.com', password: 'Abdullah@2024', phone: '+966501234570', status: 'active', portfolioCode: 'PF-005', createdAt: '2024-12-01', createdBy: 'أحمد المشرف', lastLogin: 'اليوم 08:00' },
  { id: 6, clientId: 6, name: 'فاطمة الزهراني', email: 'fatima@tharwah.com', password: 'Fatima@2024', phone: '+966501234569', status: 'active', portfolioCode: 'PF-006', createdAt: '2025-01-10', createdBy: 'خالد محمد', lastLogin: 'منذ 3 أيام' },
]

export const INVESTMENT_TYPES_LIST = [
  'أسهم سعودية','أسهم خليجية','أسهم عالمية',
  'عملات رقمية','فوركس (العملات)','معادن (ذهب/فضة/بلاتين)',
  'نفط وطاقة','صناديق استثمارية','سندات وصكوك','عقارات',
]

export const BANKS_SA_LIST = [
  'مصرف الراجحي','البنك الأهلي السعودي','بنك الرياض',
  'بنك سامبا','بنك البلاد','بنك الجزيرة','بنك الإنماء',
  'البنك السعودي الفرنسي','بنك العربي','بنك الخليج الدولي',
  'بنك اليمامة','بنك الاتحاد',
]

export const STOCKS_SA_LIST = [
  {code:'2222',name:'أرامكو السعودية'},{code:'1120',name:'مصرف الراجحي'},
  {code:'2010',name:'سابك'},{code:'1050',name:'مصرف الإنماء'},
  {code:'7010',name:'الاتصالات السعودية'},{code:'2350',name:'شركة الكهرباء'},
  {code:'4280',name:'شركة المملكة'},{code:'1180',name:'بنك الرياض'},
  {code:'3030',name:'سابك الأساسية'},{code:'2020',name:'صافولا'},
]

export const STOCKS_GLOBAL_LIST = [
  {code:'AAPL',name:'Apple',exchange:'NASDAQ'},{code:'MSFT',name:'Microsoft',exchange:'NASDAQ'},
  {code:'GOOGL',name:'Alphabet',exchange:'NASDAQ'},{code:'AMZN',name:'Amazon',exchange:'NASDAQ'},
  {code:'TSLA',name:'Tesla',exchange:'NASDAQ'},{code:'NVDA',name:'NVIDIA',exchange:'NASDAQ'},
  {code:'META',name:'Meta',exchange:'NASDAQ'},{code:'BRK.B',name:'Berkshire',exchange:'NYSE'},
]

export const CRYPTO_LIST = [
  'BTC - Bitcoin','ETH - Ethereum','BNB - Binance Coin',
  'XRP - Ripple','SOL - Solana','ADA - Cardano',
  'AVAX - Avalanche','MATIC - Polygon','DOT - Polkadot','LINK - Chainlink',
]

export const FOREX_PAIRS_LIST = [
  'EUR/USD','GBP/USD','USD/JPY','USD/SAR',
  'EUR/SAR','GBP/SAR','XAU/USD','XAG/USD','USD/AED',
]

export const METALS_LIST = ['ذهب (Gold)','فضة (Silver)','بلاتين (Platinum)','بلاديوم (Palladium)']

export const OIL_TYPES_LIST = ['خام برنت (Brent Crude)','خام WTI','غاز طبيعي','LNG - غاز مسال']
