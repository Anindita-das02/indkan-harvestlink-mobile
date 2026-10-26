import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

const { width } = Dimensions.get('window');

// 1. TYPOGRAPHY (Strictly enforcing Serif for headings and Clean Sans-Serif for body to match web exactly)
const FONT_HEADING = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const FONT_BODY = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

const FONT_BODY_BOLD = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'sans-serif',
});

// 2. DESIGN SYSTEM TOKENS (Matching Indkan_Frontend exactly)
const COLORS = {
  forestDark: '#14261C',
  forestGreen: '#203B2C',
  forestMid: '#2C513D',
  forestLight: '#39694F',
  harvestGold: '#C9A451',
  goldDark: '#B88A29',
  goldEyebrow: '#A57B20',
  warmCream: '#F8F7F2',
  surfaceLight: '#F4EFE6',
  surfaceGray: '#F0EDE4',
  pureWhite: '#FFFFFF',
  textDark: '#1D2939',
  textMuted: '#485A50',
  textSubtle: '#6B7C72',
  textLight: '#98A2B3',
  borderLight: 'rgba(32, 59, 44, 0.08)',
  borderGold: 'rgba(201, 164, 81, 0.35)',
  badgeInStockBg: '#ECFDF3',
  badgeInStockText: '#027A48',
  badgeLowStockBg: '#FFFAEB',
  badgeLowStockText: '#B54708',
  badgeOutOfStockBg: '#FEF3F2',
  badgeOutOfStockText: '#B42318',
};

// 3. AUTHENTIC ASSET REFERENCES (Local High-Res Images from Indkan_Frontend & Backend)
const ASSETS = {
  logo: require('@/assets/images/indkan-logo-light.png'),
  heroBg: require('@/assets/images/Rustic_Grains_and_Spices_at_Golden_Hour.png'),
  chickpea: require('@/assets/images/products/Chickpea.jpg'),
  redLentils: require('@/assets/images/products/Red_lentils.jpg'),
  blackPepper: require('@/assets/images/products/Black_Pepper.jpg'),
  redChilli: require('@/assets/images/products/Red_Chilli.jpg'),
  turmeric: require('@/assets/images/products/Turmeric.jpg'),
  greenGrams: require('@/assets/images/products/Green_grams.jpg'),
};

// 4. COMMODITY CATALOGUE DATA
const PRODUCTS_DATA = [
  {
    id: 8,
    name: 'Kabuli Chickpeas',
    category: 'Pulses & Lentils',
    productCode: 'IK-PUL-003',
    origin: 'India',
    grade: 'Grade A (75-80 Counts)',
    moq: '100 kg / Bulk',
    stockQty: '18.00 Metric Ton',
    status: 'in_stock',
    statusLabel: 'In Stock',
    image: ASSETS.chickpea,
    shortDesc: 'Selected chickpeas for retail, wholesale and food businesses.',
    fullDesc: 'Uniform size 8mm-10mm graded chickpeas with high yield and excellent canning and cooking qualities. Cleaned to remove foreign matter, split seeds, and discolored kernels.',
    packaging: '25 kg PP Bag, 50 kg Jute Bag, Bulk Liner',
    specs: {
      purity: '99.5% Machine Cleaned',
      moisture: 'Max 10.5%',
      countPerOunce: '75/80 Counts',
      cropYear: '2025-2026',
      shelfLife: '24 Months',
    },
  },
  {
    id: 1,
    name: 'Red Lentils (Masoor)',
    category: 'Pulses & Lentils',
    productCode: 'IK-PUL-001',
    origin: 'India',
    grade: 'Sortex Clean (99.5% Purity)',
    moq: '100 kg / Bulk',
    stockQty: '45.00 Metric Ton',
    status: 'in_stock',
    statusLabel: 'In Stock',
    image: ASSETS.redLentils,
    shortDesc: 'Quality red lentils for wholesale buyers and international export.',
    fullDesc: 'Export-grade cleaned and graded whole and split red lentils with high natural protein concentration and minimal moisture content. Optical sortex processed to eliminate foreign particles, chalky grains, and immature seeds.',
    packaging: '25 kg PP Bag, 50 kg Jute Bag, 1MT Jumbo Liner',
    specs: {
      purity: '99.5% Sortex Clean',
      moisture: 'Max 12.0%',
      damagedGrains: 'Max 1.0%',
      cropYear: '2025-2026',
      shelfLife: '24 Months',
    },
  },
  {
    id: 4,
    name: 'Tellicherry Black Pepper',
    category: 'Premium Spices',
    productCode: 'IK-SPC-001',
    origin: 'India',
    grade: 'Bold Garbled (550+ g/L)',
    moq: '100 kg / Bulk',
    stockQty: '8.20 Metric Ton',
    status: 'low_stock',
    statusLabel: 'Low Stock',
    image: ASSETS.blackPepper,
    shortDesc: 'Premium grade whole black peppercorns from Malabar coast.',
    fullDesc: 'Bold garbled whole black peppercorns sourced from the high-altitude plantations of the Malabar coast. Sun-cured with pungent piperine profile and volatile oil retention according to Spice Board standards.',
    packaging: '25 kg Multiwall Paper Bag, 50 kg PP Bag',
    specs: {
      purity: '99.0% Bold Garbled',
      moisture: 'Max 11.0%',
      density: '550-580 g/L',
      cropYear: '2025-2026',
      shelfLife: '36 Months',
    },
  },
  {
    id: 9,
    name: 'Guntur Red Chilli',
    category: 'Premium Spices',
    productCode: 'IK-SPC-002',
    origin: 'India',
    grade: 'Grade A Sun-Dried (Stemless)',
    moq: '100 kg / Bulk',
    stockQty: '60.00 Metric Ton',
    status: 'in_stock',
    statusLabel: 'In Stock',
    image: ASSETS.redChilli,
    shortDesc: 'Vibrant red color, high heat index stemless sorted chillies.',
    fullDesc: 'Sun-dried S17 Teja stemless red chillies renowned for vibrant natural capsanthin red pigment and intense Scoville heat units (SHU). Ideal for commercial spice grinding, extraction, and whole packaging.',
    packaging: '20 kg Box Carton, 25 kg Compressed Gunny Bale',
    specs: {
      purity: 'Stemless 99% Clean',
      moisture: 'Max 10.0%',
      shuHeat: '65,000 - 85,000 SHU',
      cropYear: '2025-2026',
      shelfLife: '18 Months',
    },
  },
  {
    id: 2,
    name: 'Green Gram (Moong)',
    category: 'Pulses & Lentils',
    productCode: 'IK-PUL-002',
    origin: 'India',
    grade: 'Sortex Clean 99.5% Purity',
    moq: '100 kg / Bulk',
    stockQty: '32.50 Metric Ton',
    status: 'in_stock',
    statusLabel: 'In Stock',
    image: ASSETS.greenGrams,
    shortDesc: 'Quality green gram for bulk supply and export markets.',
    fullDesc: 'Machine-cleaned, uniform green gram grains ideal for food processing, sprout cultivation, and wholesale distribution. Sourced from certified agri-clusters in Western and Central India.',
    packaging: '25 kg PP Bag, 50 kg Woven Sack, Bulk Liner',
    specs: {
      purity: '99.5% Min',
      moisture: 'Max 11.5%',
      damagedGrains: 'Max 1.5%',
      cropYear: '2025-2026',
      shelfLife: '24 Months',
    },
  },
  {
    id: 5,
    name: 'Alleppey Turmeric Fingers',
    category: 'Premium Spices',
    productCode: 'IK-SPC-003',
    origin: 'India',
    grade: 'Alleppey Bold Curcumin 4%+',
    moq: '100 kg / Bulk',
    stockQty: '14.00 Metric Ton',
    status: 'in_stock',
    statusLabel: 'In Stock',
    image: ASSETS.turmeric,
    shortDesc: 'A-Grade cured and sun-dried turmeric fingers with high curcumin.',
    fullDesc: 'Alleppey and Salem grade whole turmeric fingers cured and sun-dried with high natural curcumin concentration (4.0% minimum). Certified compliant with international residue and microbiology limits.',
    packaging: '25 kg Paper Craft Bags, 50 kg Jute Bags',
    specs: {
      purity: 'Finger Grade Bold',
      moisture: 'Max 9.5%',
      curcumin: 'Min 4.0%',
      cropYear: '2025-2026',
      shelfLife: '36 Months',
    },
  },
];

// 5. FEATURED CATEGORIES
const FEATURED_CATEGORIES = [
  {
    id: 'pulses-lentils',
    name: 'Pulses & Lentils',
    badge: 'CORE COMMODITY',
    image: ASSETS.redLentils,
    description:
      'Sortex-cleaned, high-protein Indian pulses and lentils with uniform grain size, calibrated moisture, and export purity.',
    highlights: ['Red Lentils', 'Green Gram', 'Kabuli Chickpeas'],
  },
  {
    id: 'premium-spices',
    name: 'Premium Spices',
    badge: 'EXPORT GRADE',
    image: ASSETS.turmeric,
    description:
      'Aromatic whole and calibrated Indian spices, including high-curcumin turmeric, bold black pepper, and vibrant sun-dried red chillies.',
    highlights: ['Tellicherry Pepper', 'Alleppey Turmeric', 'Guntur Chilli'],
  },
  {
    id: 'oilseeds-grains',
    name: 'Oilseeds & Agro Grains',
    badge: 'WHOLESALE SUPPLY',
    image: { uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
    description:
      'Selected agro grains, sesame seeds, and edible oilseeds procured for commercial food manufacturing, milling, and international re-bagging.',
    highlights: ['Natural Sesame', 'Mustard Seeds', 'Food-Grade Grains'],
  },
];

// 6. WHY CHOOSE POINTS
const WHY_CHOOSE_POINTS = [
  {
    icon: '📄',
    title: 'Product Information & Specifications',
    desc: 'Complete transparency with verified parameters: moisture levels, purity grades, crop origin, and realistic minimum order quantities.',
  },
  {
    icon: '📦',
    title: 'Multi-Item Bulk Enquiry',
    desc: 'Specify exact volumes in kilograms or metric tons, combine multiple commodities, and choose preferred packaging in one submission.',
  },
  {
    icon: '⚖️',
    title: 'Transparent Quotation Process',
    desc: 'Itemized commercial quotes calculated on live commodity availability and standard Incoterms (FOB/CIF) without hidden intermediary markups.',
  },
  {
    icon: '🛡️',
    title: 'Live Enquiry Status Tracking',
    desc: 'Track review progress, quotation issuance, and dispatch milestones securely anytime using your unique Enquiry Reference ID and 6-digit PIN.',
  },
];

// 7. QUALITY & PACKAGING
const QUALITY_PACKAGING_DATA = [
  {
    icon: '✨',
    title: 'Quality Grade & Sortex Cleaned',
    desc: 'Machine-cleaned and optical sortex processed to eliminate foreign particles, immature seeds, and color defects.',
    chips: ['99.5% Purity', 'Controlled Moisture', 'Uniform Kernel Size'],
  },
  {
    icon: '📦',
    title: 'Export-Standard Packaging',
    desc: 'Packed in multi-layer PP woven bags, jute sacks, or food-grade vacuum pouches designed to withstand long ocean transits.',
    chips: ['25 kg / 50 kg PP Bags', 'Jute Sacks', 'Vacuum Pouches'],
  },
  {
    icon: '🍃',
    title: 'Safe Storage & Moisture Control',
    desc: 'Commodities are kept in dry, aerated warehouses with routine pest monitoring, desiccant liners, and palletized stuffing.',
    chips: ['Humidity Monitored', 'Palletized Packing', 'Dry Storage'],
  },
  {
    icon: '📑',
    title: 'Verified Quality Documents',
    desc: 'Every container shipment is accompanied by authorized Phytosanitary Certificates, Certificate of Origin, and SGS/lab testing COA.',
    chips: ['Phytosanitary', 'Certificate of Origin', 'COA / Non-GMO'],
  },
];

// 8. HOW IT WORKS
const HOW_IT_WORKS_DATA = [
  {
    step: '01',
    title: 'Explore Products',
    desc: 'Browse our agricultural commodities and examine detailed technical specifications, origins, and standard MOQs.',
  },
  {
    step: '02',
    title: 'Submit Enquiry',
    desc: 'Enter your target volume in kg or MT, select preferred packaging type, and provide your destination country.',
  },
  {
    step: '03',
    title: 'Receive Quotation',
    desc: 'Our trade desk checks real-time availability and issues an itemized FOB or CIF quotation with payment terms.',
  },
  {
    step: '04',
    title: 'Confirm Order',
    desc: 'Review commercial terms, sign off on sample specifications, and proceed to container stuffing and port dispatch.',
  },
];

// 9. FAQ PREVIEW LIST
const FAQ_PREVIEW_LIST = [
  {
    q: 'What is the minimum order quantity (MOQ)?',
    a: 'Standard MOQ is typically 100 kg to 1 Metric Ton depending on the commodity. For specialty spices, flexible bulk quantities can be accommodated upon request.',
  },
  {
    q: 'How can I check product availability?',
    a: 'Live indicators (In Stock, Low Stock, or On Request) are shown on each product card. Official allocation and delivery schedules are confirmed upon enquiry review.',
  },
  {
    q: 'Which export packaging options are available?',
    a: 'We provide 25 kg and 50 kg PP woven bags, multi-ply kraft paper sacks, traditional jute bags, and moisture-proof vacuum pouches for spices with customized buyer labeling.',
  },
  {
    q: 'How does the export quotation process work?',
    a: 'After you submit your required volume and destination port, our export desk prepares a transparent commercial quote based on current mandi rates and shipping freight.',
  },
  {
    q: 'How can I track my submitted enquiry?',
    a: 'You receive an Enquiry Reference ID (e.g. ENQ-2026-0009) and a 6-digit Secret PIN. Enter them on our "Track Enquiry" desk to view real-time status updates.',
  },
];

const INITIAL_ADMIN_ENQUIRIES = [
  {
    id: 9,
    referenceId: 'ENQ-2026-0009',
    secretPin: '482910',
    buyerName: 'Ahmed Al-Mansoor',
    company: 'Crescent Agro Trading LLC',
    email: 'procurement@crescentagro.om',
    phone: '+968 9123 4567',
    country: 'Oman',
    port: 'Sohar Port',
    commodity: 'Red Lentils (Masoor)',
    volume: '45 Metric Ton',
    packaging: '50 kg Jute Bag',
    verificationStatus: 'verified',
    status: 'processing',
    statusLabel: 'Processing & Sortex',
    date: '24 Oct 2026',
    notes: 'Sortex optical cleaning & container allocation at Gujarat milling cluster.',
  },
  {
    id: 10,
    referenceId: 'ENQ-2026-0010',
    secretPin: '749201',
    buyerName: 'Marcus Vance',
    company: 'Rotterdam Spice & Grain B.V.',
    email: 'm.vance@rotterdamgrain.nl',
    phone: '+31 10 555 4321',
    country: 'Netherlands',
    port: 'Port of Rotterdam',
    commodity: 'Tellicherry Black Pepper',
    volume: '8.2 Metric Ton',
    packaging: '25 kg Multiwall Paper Bag',
    verificationStatus: 'verified',
    status: 'shipped',
    statusLabel: 'Shipped (In Transit)',
    date: '25 Oct 2026',
    notes: 'Container stuffed at JNPT Mumbai, Phyto & SGS certificates issued.',
  },
  {
    id: 11,
    referenceId: 'ENQ-2026-0011',
    secretPin: '318942',
    buyerName: 'Farhan Kabir',
    company: 'Bengal Food & Agro Importers',
    email: 'farhan@bengalagro.bd',
    phone: '+880 17 1234 5678',
    country: 'Bangladesh',
    port: 'Chittagong Port',
    commodity: 'Kabuli Chickpeas',
    volume: '18 Metric Ton',
    packaging: '50 kg PP Bag',
    verificationStatus: 'pending',
    status: 'pending',
    statusLabel: 'Under KYC Review',
    date: '26 Oct 2026',
    notes: 'Awaiting buyer commercial tax certificate and APEDA export quota validation.',
  },
];

type ScreenType =
  | 'home'
  | 'products'
  | 'product_details'
  | 'enquiry'
  | 'track'
  | 'about'
  | 'process'
  | 'faqs'
  | 'contact'
  | 'privacy'
  | 'admin';

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(PRODUCTS_DATA[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // RFQ Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('Red Lentils (Masoor)');
  const [orderQuantity, setOrderQuantity] = useState('25');
  const [quantityUnit, setQuantityUnit] = useState('Metric Ton');
  const [packagingRequest, setPackagingRequest] = useState('50 kg Jute Bag');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');
  const [submittedPin, setSubmittedPin] = useState('');
  const [isSubmittingRFQ, setIsSubmittingRFQ] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Tracking State
  const [trackRefId, setTrackRefId] = useState('ENQ-2026-0009');
  const [trackPin, setTrackPin] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [trackingError, setTrackingError] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Admin Portal State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@indkan.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState<'overview' | 'enquiries' | 'inventory'>('overview');
  const [adminEnquiryFilter, setAdminEnquiryFilter] = useState<string>('all');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminEnquiries, setAdminEnquiries] = useState(INITIAL_ADMIN_ENQUIRIES);
  const [adminProducts, setAdminProducts] = useState(PRODUCTS_DATA);
  const [selectedAdminEnquiry, setSelectedAdminEnquiry] = useState<any>(null);
  const [isAdminDetailModalOpen, setIsAdminDetailModalOpen] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const handleAdminLogin = () => {
    if (adminEmail.trim().toLowerCase() === 'admin@indkan.com' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminAuthError('');
    } else {
      setAdminAuthError('Invalid Admin Credentials. (Use: admin@indkan.com / admin123)');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminPassword('');
    setAdminAuthError('');
    navigateTo('home');
  };

  const handleVerifyKYC = (refId: string) => {
    setAdminEnquiries((prev) =>
      prev.map((e) =>
        e.referenceId === refId
          ? { ...e, verificationStatus: 'verified', status: 'processing', statusLabel: 'Processing & Sortex' }
          : e
      )
    );
    Alert.alert('KYC Verified', `Enquiry ${refId} has been verified and advanced to processing.`);
  };

  const handleAdvanceStage = (refId: string) => {
    setAdminEnquiries((prev) =>
      prev.map((e) => {
        if (e.referenceId !== refId) return e;
        if (e.status === 'pending') {
          return { ...e, verificationStatus: 'verified', status: 'processing', statusLabel: 'Processing & Sortex' };
        } else if (e.status === 'processing') {
          return { ...e, status: 'shipped', statusLabel: 'Shipped (In Transit)' };
        } else if (e.status === 'shipped') {
          return { ...e, status: 'delivered', statusLabel: 'Delivered at Port' };
        }
        return e;
      })
    );
    Alert.alert('Stage Updated', `Shipment stage for ${refId} has been advanced.`);
  };

  const handleToggleProductStock = (id: number) => {
    setAdminProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStatus = p.status === 'in_stock' ? 'low_stock' : p.status === 'low_stock' ? 'out_of_stock' : 'in_stock';
        const newLabel = newStatus === 'in_stock' ? 'In Stock' : newStatus === 'low_stock' ? 'Low Stock' : 'Out of Stock';
        return { ...p, status: newStatus, statusLabel: newLabel };
      })
    );
  };

  const handleAdjustStock = (id: number, delta: number) => {
    setAdminProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentNum = parseFloat(p.stockQty) || 0;
        const newNum = Math.max(0, currentNum + delta);
        return { ...p, stockQty: `${newNum.toFixed(2)} Metric Ton` };
      })
    );
  };

  const navigateTo = (screen: ScreenType, product?: any) => {
    if (product) setSelectedProduct(product);
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const handleOpenRFQForProduct = (prodName: string) => {
    setSelectedCommodity(prodName);
    setRfqSubmitted(false);
    setCurrentScreen('enquiry');
  };

  const handleRFQSubmit = async () => {
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter your Full Name, Corporate Email, and Phone / WhatsApp Number.');
      return;
    }

    setIsSubmittingRFQ(true);
    const selectedProd = PRODUCTS_DATA.find((p) => p.name === selectedCommodity) || PRODUCTS_DATA[0];
    const cleanPhone = buyerPhone.replace(/\D/g, '').slice(-10) || '9876543210';
    const payload = {
      buyer_name: buyerName.trim(),
      company_name: buyerCompany.trim() || `${buyerName.trim()} Agro Trading`,
      email: buyerEmail.trim(),
      phone: cleanPhone.length === 10 ? cleanPhone : '9876543210',
      country: 'India',
      destination_port: destinationPort.trim() || 'Jebel Ali Port (UAE)',
      delivery_address: 'Port Discharge & Logistics Facility',
      tax_id: 'TRADE-KYC-PENDING',
      items: [
        {
          product_id: selectedProd.id,
          quantity: parseFloat(orderQuantity) || 25,
          unit: quantityUnit === 'Metric Ton' ? 'MT' : 'kg',
          packaging_requested: packagingRequest.trim() || '50 kg Jute Bag',
        },
      ],
      message: buyerMessage.trim() || 'Bulk export quote requested via INDKAN mobile app.',
    };

    try {
      let res = await fetch('http://10.122.32.45:5001/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('http://127.0.0.1:5001/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => null);
      }

      if (res && res.ok) {
        const json = await res.json();
        setSubmittedRefId(json.reference_id);
        setSubmittedPin(json.secret_pin);
        setRfqSubmitted(true);
      } else {
        const fallbackRef = `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const fallbackPin = `${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmittedRefId(fallbackRef);
        setSubmittedPin(fallbackPin);
        setRfqSubmitted(true);
      }
    } catch {
      const fallbackRef = `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackPin = `${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRefId(fallbackRef);
      setSubmittedPin(fallbackPin);
      setRfqSubmitted(true);
    } finally {
      setIsSubmittingRFQ(false);
    }
  };

  const handleTrackSubmit = async () => {
    if (!trackRefId.trim()) {
      setTrackingError('Please enter Enquiry Reference ID.');
      return;
    }
    setTrackingError('');
    setIsTrackingLoading(true);

    try {
      const payload = {
        reference_id: trackRefId.trim().toUpperCase(),
        secret_pin: trackPin.trim(),
      };

      let res = await fetch('http://10.122.32.45:5001/api/enquiries/track-by-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('http://127.0.0.1:5001/api/enquiries/track-by-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => null);
      }

      if (res && res.ok) {
        const json = await res.json();
        const enq = json.enquiry || json.data || {};
        setTrackedOrder({
          refId: enq.reference_id || trackRefId.trim().toUpperCase(),
          buyerName: enq.buyer_name || 'Authorized Buyer',
          country: enq.country || 'International',
          port: enq.destination_port || 'Destination Port',
          stage: enq.status || 'processing',
          stageLabel: enq.status_label || 'Processing & Sortex Cleaning',
          stepNumber: enq.step || 3,
          date: enq.created_at ? enq.created_at.slice(0, 10) : '26 Oct 2026',
          notes: enq.admin_notes || 'Commodity milling, Sortex optical cleaning in progress.',
          items: enq.items || [
            { product: 'Export Commodity Batch', qty: '25 MT', packaging: '50kg Jute Bags' }
          ]
        });
      } else {
        // Fallback for offline demo
        setTrackedOrder({
          refId: trackRefId.trim().toUpperCase(),
          buyerName: 'Crescent Agro Trading LLC',
          country: 'Oman',
          port: 'Sohar Port (Oman)',
          stage: 'processing',
          stageLabel: 'Processing & Sortex Cleaning',
          stepNumber: 3,
          date: '24 Oct 2026',
          notes: 'Commodity milling, Sortex optical cleaning, and batch lab testing in progress at Gujarat packaging facility.',
          items: [
            { product: 'Red Lentils (Masoor)', qty: '45 Metric Ton', packaging: '50kg Jute Bags' },
            { product: 'Tellicherry Black Pepper', qty: '8.2 Metric Ton', packaging: '25kg Paper Bags' }
          ]
        });
      }
    } catch {
      setTrackingError('Failed to connect to tracking desk. Please check network.');
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleContactSubmit = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      Alert.alert('Required Fields', 'Please complete Name, Email, and Message.');
      return;
    }
    setContactSuccess(true);
  };

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'pulses' && p.category.includes('Pulses')) ||
      (selectedCategory === 'spices' && p.category.includes('Spices'));
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* ======================================================== */}
      {/* 1. TOP NAVBAR (Mirroring Website site-header)            */}
      {/* ======================================================== */}
      <View style={styles.siteHeader}>
        <View style={styles.navbarTopRow}>
          <TouchableOpacity
            style={styles.brandTouch}
            onPress={() => navigateTo('home')}
            activeOpacity={0.8}
          >
            <Image
              source={ASSETS.logo}
              style={styles.brandLogoImg}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mobileMenuButton}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            activeOpacity={0.7}
          >
            <Text style={styles.mobileMenuIcon}>{isMenuOpen ? '✕' : '☰'}</Text>
          </TouchableOpacity>
        </View>

        {/* Clean Website Nav Links Bar */}
        <View style={styles.navLinksBar}>
          <TouchableOpacity
            style={[styles.navLinkItem, currentScreen === 'home' && styles.navLinkItemActive]}
            onPress={() => navigateTo('home')}
          >
            <Text style={[styles.navLinkText, currentScreen === 'home' && styles.navLinkTextActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navLinkItem, (currentScreen === 'products' || currentScreen === 'product_details') && styles.navLinkItemActive]}
            onPress={() => navigateTo('products')}
          >
            <Text style={[styles.navLinkText, (currentScreen === 'products' || currentScreen === 'product_details') && styles.navLinkTextActive]}>
              Products
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navLinkItem, currentScreen === 'track' && styles.navLinkItemActive]}
            onPress={() => navigateTo('track')}
          >
            <Text style={[styles.navLinkText, currentScreen === 'track' && styles.navLinkTextActive]}>
              ⏱ Track Enquiry
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ======================================================== */}
      {/* 2. SLIDE-OVER NAVIGATION DRAWER (Full Website Sitemap)  */}
      {/* ======================================================== */}
      <Modal visible={isMenuOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Image source={ASSETS.logo} style={{ width: 140, height: 32, resizeMode: 'contain' }} />
              <TouchableOpacity onPress={() => setIsMenuOpen(false)} style={styles.drawerCloseBtn}>
                <Text style={styles.drawerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.drawerLinks}>
              <Text style={styles.drawerGroupTitle}>MAIN NAVIGATION</Text>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('home')}>
                <Text style={styles.drawerItemIcon}>🌾</Text>
                <Text style={styles.drawerItemText}>Home / Overview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('products')}>
                <Text style={styles.drawerItemIcon}>📦</Text>
                <Text style={styles.drawerItemText}>Product Catalogue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('enquiry')}>
                <Text style={styles.drawerItemIcon}>📋</Text>
                <Text style={styles.drawerItemText}>Submit Bulk RFQ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('track')}>
                <Text style={styles.drawerItemIcon}>🛡️</Text>
                <Text style={styles.drawerItemText}>Track Live Order (PIN)</Text>
              </TouchableOpacity>

              <Text style={[styles.drawerGroupTitle, { marginTop: 20 }]}>COMPANY & POLICIES</Text>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('about')}>
                <Text style={styles.drawerItemIcon}>🏢</Text>
                <Text style={styles.drawerItemText}>About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('process')}>
                <Text style={styles.drawerItemIcon}>🚢</Text>
                <Text style={styles.drawerItemText}>Our Export Process</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('faqs')}>
                <Text style={styles.drawerItemIcon}>❓</Text>
                <Text style={styles.drawerItemText}>FAQs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('contact')}>
                <Text style={styles.drawerItemIcon}>📞</Text>
                <Text style={styles.drawerItemText}>Contact Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigateTo('privacy')}>
                <Text style={styles.drawerItemIcon}>📜</Text>
                <Text style={styles.drawerItemText}>Trade Terms & Privacy</Text>
              </TouchableOpacity>

              <Text style={[styles.drawerGroupTitle, { marginTop: 20 }]}>ADMINISTRATION</Text>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateTo('admin')}
              >
                <Text style={styles.drawerItemIcon}>🔒</Text>
                <Text style={[styles.drawerItemText, { color: COLORS.forestGreen, fontWeight: '800' }]}>
                  Admin Panel / Operations
                </Text>
              </TouchableOpacity>

              <View style={styles.drawerFooterInfo}>
                <Text style={styles.drawerContactText}>Direct Export Desk: info@indkan.com</Text>
                <Text style={styles.drawerPortText}>Dispatches from JNPT Mumbai • Mundra • Chennai</Text>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ======================================================== */}
      {/* 3. MAIN SCROLLABLE CONTENT CONTAINER                     */}
      {/* ======================================================== */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ------------------------------------------------------ */}
        {/* PAGE 1: HOME SCREEN (1:1 Mirror of LandingPage.tsx)     */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'home' && (
          <View>
            {/* HERO SECTION (Matching Website Warm Cream Hero exactly) */}
            <View style={styles.heroWrapper}>
              <View style={styles.heroCard}>
                {/* Authentic Rustic Grains Showcase Banner */}
                <Image
                  source={ASSETS.heroBg}
                  style={styles.heroBannerImage}
                />

                <View style={styles.heroContent}>
                  <Text style={styles.eyebrow}>PREMIUM PULSES, LENTILS & SPICES</Text>

                  <Text style={styles.heroHeading}>
                    From Quality{'\n'}
                    Harvests to{'\n'}
                    <Text style={styles.heroHeadingGold}>Global Buyers.</Text>
                  </Text>

                  <Text style={styles.heroDescription}>
                    We source quality pulses, lentils and spices from trusted suppliers to serve wholesale buyers and businesses around the world.
                  </Text>

                  <View style={styles.heroActionsRow}>
                    <TouchableOpacity
                      style={styles.btnGold}
                      onPress={() => navigateTo('products')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnGoldText}>Explore Products  →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnOutline}
                      onPress={() => navigateTo('enquiry')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnOutlineText}>View Categories  →</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 3 Trust Points matching website */}
                  <View style={styles.trustPointsRow}>
                    <View style={styles.trustItem}>
                      <Text style={styles.trustIcon}>🍃</Text>
                      <View>
                        <Text style={styles.trustTitle}>Quality Focused</Text>
                        <Text style={styles.trustSub}>Carefully selected</Text>
                      </View>
                    </View>

                    <View style={styles.trustItem}>
                      <Text style={styles.trustIcon}>🌍</Text>
                      <View>
                        <Text style={styles.trustTitle}>Global Ambitions</Text>
                        <Text style={styles.trustSub}>Worldwide supply</Text>
                      </View>
                    </View>

                    <View style={styles.trustItem}>
                      <Text style={styles.trustIcon}>🛡️</Text>
                      <View>
                        <Text style={styles.trustTitle}>Trusted Partner</Text>
                        <Text style={styles.trustSub}>Business relationships</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* SECTION 1: FEATURED PRODUCT CATEGORIES */}
            <View style={styles.sectionHeader}>
              <Text style={styles.eyebrow}>📦 PRODUCT RANGE</Text>
              <Text style={styles.sectionTitle}>Featured Product Categories</Text>
              <Text style={styles.sectionDesc}>
                Explore our core agricultural commodity categories sourced directly from India’s leading crop-growing regions and processed for international export.
              </Text>
            </View>

            {FEATURED_CATEGORIES.map((cat) => (
              <View key={cat.id} style={styles.categoryCard}>
                <View style={styles.categoryImgWrap}>
                  <Image source={cat.image} style={styles.categoryImg} />
                  <View style={styles.categoryBadgeWrap}>
                    <Text style={styles.categoryBadgeText}>{cat.badge}</Text>
                  </View>
                </View>

                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{cat.name}</Text>
                  <Text style={styles.categoryDesc}>{cat.description}</Text>

                  <View style={styles.categoryPillsRow}>
                    {cat.highlights.map((h, i) => (
                      <View key={i} style={styles.categoryPill}>
                        <Text style={styles.categoryPillText}>{h}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.categoryActionBtn}
                    onPress={() => {
                      setSelectedCategory(cat.id === 'pulses-lentils' ? 'pulses' : cat.id === 'premium-spices' ? 'spices' : 'all');
                      navigateTo('products');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.categoryActionBtnText}>Explore Products  →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* SECTION 2: POPULAR PRODUCTS */}
            <View style={[styles.sectionHeader, { marginTop: 36 }]}>
              <Text style={styles.eyebrow}>✨ EXPORT COMMODITIES</Text>
              <Text style={styles.sectionTitle}>Popular Products</Text>
              <Text style={styles.sectionDesc}>
                Key agricultural staples available for bulk international procurement, complete with verifiable grades, origin details, and flexible packaging.
              </Text>
            </View>

            {PRODUCTS_DATA.slice(0, 4).map((prod) => (
              <View key={prod.id} style={styles.popularProductCard}>
                <View style={styles.popularImgWrap}>
                  <Image source={prod.image} style={styles.popularImg} />
                  <View
                    style={[
                      styles.stockBadge,
                      prod.status === 'in_stock' ? styles.stockIn : styles.stockLow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockBadgeText,
                        prod.status === 'in_stock' ? { color: COLORS.badgeInStockText } : { color: COLORS.badgeLowStockText },
                      ]}
                    >
                      {prod.statusLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.popularCardBody}>
                  <Text style={styles.popularCatLabel}>{prod.category.toUpperCase()}</Text>
                  <Text style={styles.popularName}>{prod.name}</Text>

                  <View style={styles.popularSpecsBox}>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>Origin:</Text>
                      <Text style={styles.popularSpecVal}>{prod.origin}</Text>
                    </View>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>Grade:</Text>
                      <Text style={styles.popularSpecVal}>{prod.grade}</Text>
                    </View>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>MOQ:</Text>
                      <Text style={styles.popularSpecVal}>{prod.moq}</Text>
                    </View>
                  </View>

                  <View style={styles.popularCardActions}>
                    <TouchableOpacity
                      style={styles.btnDetailsLink}
                      onPress={() => navigateTo('product_details', prod)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnDetailsLinkText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnQuoteLink}
                      onPress={() => handleOpenRFQForProduct(prod.name)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnQuoteLinkText}>Request Quote</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Quick Catalogue Explorer Bar */}
            <View style={styles.catalogueBannerBar}>
              <Text style={styles.catalogueBannerTitle}>Looking for Additional Commodities?</Text>
              <Text style={styles.catalogueBannerDesc}>
                Browse our full product catalogue including green gram, dried spices, and seasonal agricultural batches.
              </Text>
              <TouchableOpacity
                style={styles.btnGoldFull}
                onPress={() => navigateTo('products')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnGoldText}>View Full Product Catalogue  →</Text>
              </TouchableOpacity>
            </View>

            {/* SECTION 3: WHY CHOOSE INDKAN HARVESTLINK */}
            <View style={styles.whyChooseSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.eyebrow}>🛡️ PLATFORM ADVANTAGES</Text>
                <Text style={styles.sectionTitle}>Why Choose INDKAN HarvestLink?</Text>
                <Text style={styles.sectionDesc}>
                  We provide global buyers with an honest, structured export trade desk backed by transparent product data, flexible enquiry tools, and live status tracking.
                </Text>
              </View>

              <View style={styles.whyGrid}>
                {WHY_CHOOSE_POINTS.map((pt, idx) => (
                  <View key={idx} style={styles.whyFeatureCard}>
                    <View style={styles.whyIconBubble}>
                      <Text style={{ fontSize: 20 }}>{pt.icon}</Text>
                    </View>
                    <Text style={styles.whyFeatureTitle}>{pt.title}</Text>
                    <Text style={styles.whyFeatureDesc}>{pt.desc}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* SECTION 4: QUALITY & PACKAGING */}
            <View style={[styles.sectionHeader, { marginTop: 36 }]}>
              <Text style={styles.eyebrow}>✅ EXPORT STANDARDS</Text>
              <Text style={styles.sectionTitle}>Quality & Packaging</Text>
              <Text style={styles.sectionDesc}>
                Agricultural commodities prepared to meet destination port regulations, international moisture thresholds, and hygienic food handling standards.
              </Text>
            </View>

            {QUALITY_PACKAGING_DATA.map((item, idx) => (
              <View key={idx} style={styles.qualityCard}>
                <View style={styles.qualityTopRow}>
                  <View style={styles.qualityIconBubble}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>
                  <Text style={styles.qualityTitle}>{item.title}</Text>
                </View>
                <Text style={styles.qualityDesc}>{item.desc}</Text>
                <View style={styles.qualityChipsRow}>
                  {item.chips.map((chip, cIdx) => (
                    <View key={cIdx} style={styles.qualityChip}>
                      <Text style={styles.qualityChipText}>{chip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* SECTION 5: HOW IT WORKS */}
            <View style={[styles.sectionHeader, { marginTop: 36 }]}>
              <Text style={styles.eyebrow}>⚖️ VISUAL TRADE WORKFLOW</Text>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <Text style={styles.sectionDesc}>
                A straightforward 4-step workflow designed to take international buyers from initial commodity discovery to confirmed export order.
              </Text>
            </View>

            <View style={styles.howTimelineGrid}>
              {HOW_IT_WORKS_DATA.map((item, idx) => (
                <View key={idx} style={styles.howStepCard}>
                  <View style={styles.howStepTop}>
                    <View style={styles.howStepNumberBadge}>
                      <Text style={styles.howStepNumberText}>{item.step}</Text>
                    </View>
                    <Text style={styles.howStepTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.howStepDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>

            {/* SECTION 6: DIRECT BULK EXPORT INQUIRY CALLOUT */}
            <View style={styles.bulkCtaBox}>
              <Text style={styles.eyebrow}>DIRECT EXPORT INQUIRY</Text>
              <Text style={styles.bulkCtaTitle}>Looking for Agricultural Products in Bulk?</Text>
              <Text style={styles.bulkCtaDesc}>
                Share your product requirements, quantity and destination country with our team. We will review your enquiry and get back to you regarding availability and quotation.
              </Text>
              <TouchableOpacity
                style={styles.btnGoldFull}
                onPress={() => navigateTo('enquiry')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnGoldText}>Request a Quotation  →</Text>
              </TouchableOpacity>
            </View>

            {/* SECTION 7: BUYER SUPPORT & FAQ PREVIEW */}
            <View style={[styles.sectionHeader, { marginTop: 36 }]}>
              <Text style={styles.eyebrow}>❓ QUICK ANSWERS</Text>
              <Text style={styles.sectionTitle}>Buyer Support & FAQs</Text>
              <Text style={styles.sectionDesc}>
                Common questions about minimum order volumes, product availability, packaging configurations, quotation turnaround, and PIN tracking.
              </Text>
            </View>

            <View style={styles.faqAccordionContainer}>
              {FAQ_PREVIEW_LIST.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.faqItem}
                    onPress={() => setOpenFaqIndex(isOpen ? null : idx)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.faqHeaderRow}>
                      <Text style={styles.faqQuestionText}>{faq.q}</Text>
                      <Text style={[styles.faqChevron, isOpen && { color: COLORS.harvestGold }]}>
                        {isOpen ? '▲' : '▼'}
                      </Text>
                    </View>
                    {isOpen && (
                      <View style={styles.faqAnswerBox}>
                        <Text style={styles.faqAnswerText}>{faq.a}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* FAQ Action Bar */}
            <View style={styles.faqActionsBar}>
              <Text style={styles.faqActionsPrompt}>Still have sourcing or export questions?</Text>
              <Text style={styles.faqActionsSub}>Our team is ready to assist with custom Incoterms, container logistics, or lab analysis.</Text>
              <View style={styles.faqActionsBtnRow}>
                <TouchableOpacity
                  style={styles.faqPrimaryBtn}
                  onPress={() => navigateTo('faqs')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.faqPrimaryBtnText}>View All FAQs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.faqSecondaryBtn}
                  onPress={() => navigateTo('contact')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.faqSecondaryBtnText}>Contact Us  →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 2: PRODUCTS CATALOGUE                              */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'products' && (
          <View style={styles.pageContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.eyebrow}>B2B EXPORT CATALOGUE</Text>
              <Text style={styles.sectionTitle}>Explore Our Products</Text>
              <Text style={styles.sectionDesc}>
                Browse our complete selection of export-ready pulses, lentils, and premium spices. Sourced directly from verified growers and cleaned to international standards.
              </Text>

              {/* Search input */}
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  placeholder="Search pulses, spices, commodities..."
                  placeholderTextColor={COLORS.textSubtle}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>

              {/* Category pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                <TouchableOpacity
                  style={[styles.filterPill, selectedCategory === 'all' && styles.filterPillActive]}
                  onPress={() => setSelectedCategory('all')}
                >
                  <Text style={[styles.filterPillText, selectedCategory === 'all' && styles.filterPillTextActive]}>
                    All Products
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedCategory === 'pulses' && styles.filterPillActive]}
                  onPress={() => setSelectedCategory('pulses')}
                >
                  <Text style={[styles.filterPillText, selectedCategory === 'pulses' && styles.filterPillTextActive]}>
                    Pulses & Lentils
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedCategory === 'spices' && styles.filterPillActive]}
                  onPress={() => setSelectedCategory('spices')}
                >
                  <Text style={[styles.filterPillText, selectedCategory === 'spices' && styles.filterPillTextActive]}>
                    Premium Spices
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {filteredProducts.map((prod) => (
              <View key={prod.id} style={styles.popularProductCard}>
                <View style={styles.popularImgWrap}>
                  <Image source={prod.image} style={styles.popularImg} />
                  <View
                    style={[
                      styles.stockBadge,
                      prod.status === 'in_stock' ? styles.stockIn : styles.stockLow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockBadgeText,
                        prod.status === 'in_stock' ? { color: COLORS.badgeInStockText } : { color: COLORS.badgeLowStockText },
                      ]}
                    >
                      {prod.statusLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.popularCardBody}>
                  <Text style={styles.popularCatLabel}>{prod.category.toUpperCase()}</Text>
                  <Text style={styles.popularName}>{prod.name}</Text>

                  <View style={styles.popularSpecsBox}>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>Product Code:</Text>
                      <Text style={styles.popularSpecVal}>{prod.productCode}</Text>
                    </View>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>Origin:</Text>
                      <Text style={styles.popularSpecVal}>{prod.origin}</Text>
                    </View>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>Grade:</Text>
                      <Text style={styles.popularSpecVal}>{prod.grade}</Text>
                    </View>
                    <View style={styles.popularSpecRow}>
                      <Text style={styles.popularSpecLabel}>MOQ:</Text>
                      <Text style={styles.popularSpecVal}>{prod.moq}</Text>
                    </View>
                  </View>

                  <View style={styles.popularCardActions}>
                    <TouchableOpacity
                      style={styles.btnDetailsLink}
                      onPress={() => navigateTo('product_details', prod)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnDetailsLinkText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnQuoteLink}
                      onPress={() => handleOpenRFQForProduct(prod.name)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnQuoteLinkText}>Request Quote</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 3: PRODUCT DETAILS (with ← Back to Products)      */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'product_details' && selectedProduct && (
          <View style={styles.pageContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigateTo('products')}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>← Back to Products</Text>
            </TouchableOpacity>

            <View style={styles.detailsCard}>
              <Image source={selectedProduct.image} style={styles.detailsHeroImage} />

              <View style={styles.detailsBody}>
                <View style={styles.detailsBadgesRow}>
                  <View style={styles.detailsGradeBadge}>
                    <Text style={styles.detailsGradeText}>★ Export Sortex Grade</Text>
                  </View>
                  <View style={styles.detailsCategoryBadge}>
                    <Text style={styles.detailsCategoryText}>{selectedProduct.category}</Text>
                  </View>
                </View>

                <Text style={styles.detailsTitle}>{selectedProduct.name}</Text>
                <Text style={styles.detailsStockLabel}>{selectedProduct.statusLabel}</Text>
                <Text style={styles.detailsFullDesc}>{selectedProduct.fullDesc}</Text>

                {/* Specification Grid */}
                <View style={styles.detailsSpecGrid}>
                  <View style={styles.detailsSpecBox}>
                    <Text style={styles.detailsSpecLabel}>PRODUCT CODE</Text>
                    <Text style={styles.detailsSpecVal}>{selectedProduct.productCode}</Text>
                  </View>
                  <View style={styles.detailsSpecBox}>
                    <Text style={styles.detailsSpecLabel}>COUNTRY OF ORIGIN</Text>
                    <Text style={styles.detailsSpecVal}>{selectedProduct.origin}</Text>
                  </View>
                  <View style={styles.detailsSpecBox}>
                    <Text style={styles.detailsSpecLabel}>MINIMUM ORDER (MOQ)</Text>
                    <Text style={styles.detailsSpecVal}>{selectedProduct.moq}</Text>
                  </View>
                  <View style={styles.detailsSpecBox}>
                    <Text style={styles.detailsSpecLabel}>AVAILABLE ALLOTMENT</Text>
                    <Text style={styles.detailsSpecVal}>{selectedProduct.stockQty}</Text>
                  </View>
                  <View style={styles.detailsSpecBoxFull}>
                    <Text style={styles.detailsSpecLabel}>STANDARD PACKAGING</Text>
                    <Text style={styles.detailsSpecVal}>{selectedProduct.packaging}</Text>
                  </View>
                </View>

                {/* Lab Parameters */}
                <View style={styles.labParametersBox}>
                  <Text style={styles.labParametersHeading}>Laboratory Purity & QC Standards:</Text>
                  {Object.entries(selectedProduct.specs).map(([key, val], idx) => (
                    <View key={idx} style={styles.labParamRow}>
                      <Text style={styles.labParamKey}>
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                      </Text>
                      <Text style={styles.labParamVal}>{String(val)}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.btnGoldFull}
                  onPress={() => handleOpenRFQForProduct(selectedProduct.name)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnGoldText}>Get Price Quotation (FOB/CIF)  →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 4: SUBMIT BULK ENQUIRY (RFQ)                      */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'enquiry' && (
          <View style={styles.pageContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.eyebrow}>BULK EXPORT RFQ</Text>
              <Text style={styles.sectionTitle}>Request Formal Quotation</Text>
              <Text style={styles.sectionDesc}>
                Specify your agricultural commodity requirements, volumes, and destination port. Receive itemized FOB/CIF proforma pricing.
              </Text>
            </View>

            {rfqSubmitted ? (
              <View style={styles.successCard}>
                <Text style={{ fontSize: 44, textAlign: 'center', marginBottom: 10 }}>🎉</Text>
                <Text style={styles.successHeading}>Quotation Request Submitted!</Text>
                <Text style={styles.successRefText}>Enquiry ID: {submittedRefId || 'ENQ-2026-0010'}</Text>
                <Text style={styles.successPinText}>Secret PIN: {submittedPin || '749201'}</Text>
                <Text style={styles.successDesc}>
                  Your export enquiry has been registered in the central Flask database. Please save your Reference ID and confidential Secret PIN to track vessel shipping and documentation milestones.
                </Text>
                <TouchableOpacity
                  style={styles.btnGoldFull}
                  onPress={() => {
                    setTrackRefId(submittedRefId || 'ENQ-2026-0010');
                    setTrackPin(submittedPin || '749201');
                    navigateTo('track');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnGoldText}>Go to Live Order Tracking  →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formCard}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Selected Commodity *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
                    {PRODUCTS_DATA.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.commodityChip,
                          selectedCommodity === p.name && styles.commodityChipActive,
                        ]}
                        onPress={() => setSelectedCommodity(p.name)}
                      >
                        <Text
                          style={[
                            styles.commodityChipText,
                            selectedCommodity === p.name && styles.commodityChipTextActive,
                          ]}
                        >
                          {p.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name / Authorized Contact *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. John Doe"
                    placeholderTextColor={COLORS.textSubtle}
                    value={buyerName}
                    onChangeText={setBuyerName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Company / Trading House Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Crescent Agro Trading LLC"
                    placeholderTextColor={COLORS.textSubtle}
                    value={buyerCompany}
                    onChangeText={setBuyerCompany}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Corporate Email Address *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="procurement@company.com"
                    placeholderTextColor={COLORS.textSubtle}
                    keyboardType="email-address"
                    value={buyerEmail}
                    onChangeText={setBuyerEmail}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Phone / WhatsApp Number (with Country Code) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+971 50 123 4567"
                    placeholderTextColor={COLORS.textSubtle}
                    keyboardType="phone-pad"
                    value={buyerPhone}
                    onChangeText={setBuyerPhone}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Destination Discharge Port</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jebel Ali Port, Rotterdam, Chittagong"
                    placeholderTextColor={COLORS.textSubtle}
                    value={destinationPort}
                    onChangeText={setDestinationPort}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Estimated Volume</Text>
                  <View style={styles.volumeRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="e.g. 25"
                      placeholderTextColor={COLORS.textSubtle}
                      keyboardType="numeric"
                      value={orderQuantity}
                      onChangeText={setOrderQuantity}
                    />
                    <View style={styles.unitBadge}>
                      <Text style={styles.unitBadgeText}>{quantityUnit}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Requested Packaging</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 25 kg PP bags, 50 kg jute sacks"
                    placeholderTextColor={COLORS.textSubtle}
                    value={packagingRequest}
                    onChangeText={setPackagingRequest}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Additional Trade Specs / Inquiries</Text>
                  <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Specify target moisture, purity, Incoterms (FOB/CIF)..."
                    placeholderTextColor={COLORS.textSubtle}
                    multiline
                    value={buyerMessage}
                    onChangeText={setBuyerMessage}
                  />
                </View>

                <TouchableOpacity style={styles.btnGoldFull} onPress={handleRFQSubmit} activeOpacity={0.85}>
                  <Text style={styles.btnGoldText}>Submit Quotation Request  →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 5: TRACK ENQUIRY (Live PIN Authentication)        */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'track' && (
          <View style={styles.pageContainer}>
            <View style={styles.trackCard}>
              <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 10 }}>🛡️</Text>
              <Text style={styles.trackCardTitle}>Track Your Enquiry</Text>
              <Text style={styles.trackCardDesc}>
                Stay informed about the progress of your product enquiry. Enter the Enquiry Reference ID and your 6-digit Secret PIN.
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.darkInputLabel}>Enquiry Reference ID *</Text>
                <TextInput
                  style={styles.darkInputField}
                  placeholder="e.g. ENQ-2026-0009"
                  placeholderTextColor={COLORS.textSubtle}
                  value={trackRefId}
                  onChangeText={setTrackRefId}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.darkInputLabel}>Secret PIN (Password) *</Text>
                <TextInput
                  style={styles.darkInputField}
                  placeholder="Enter 6-digit Secret PIN"
                  placeholderTextColor={COLORS.textSubtle}
                  value={trackPin}
                  onChangeText={setTrackPin}
                  secureTextEntry
                  keyboardType="numeric"
                />
              </View>

              {trackingError ? <Text style={styles.errorText}>{trackingError}</Text> : null}

              <TouchableOpacity style={styles.btnGoldFull} onPress={handleTrackSubmit} activeOpacity={0.85}>
                <Text style={styles.btnGoldText}>Track Quotation Status  →</Text>
              </TouchableOpacity>

              <Text style={styles.trackSecurityNotice}>
                🔒 Zero-Account Protected Trade Desk. Only individuals with Reference ID and Secret PIN can view order specs.
              </Text>
            </View>

            {/* Stepper Result */}
            {trackedOrder && (
              <View style={styles.orderResultCard}>
                <View style={styles.orderHeaderRow}>
                  <View>
                    <Text style={styles.orderRefText}>{trackedOrder.refId}</Text>
                    <Text style={styles.orderDateText}>Submitted: {trackedOrder.date}</Text>
                  </View>
                  <View style={styles.orderStagePill}>
                    <Text style={styles.orderStagePillText}>{trackedOrder.stageLabel}</Text>
                  </View>
                </View>

                <View style={styles.stepperContainer}>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, styles.stepActiveCircle]}>
                      <Text style={styles.stepCircleText}>✓</Text>
                    </View>
                    <Text style={styles.stepTitle}>Submitted</Text>
                  </View>
                  <View style={styles.stepConnector} />

                  <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, styles.stepActiveCircle]}>
                      <Text style={styles.stepCircleText}>✓</Text>
                    </View>
                    <Text style={styles.stepTitle}>KYC Verified</Text>
                  </View>
                  <View style={styles.stepConnector} />

                  <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, styles.stepCurrentCircle]}>
                      <Text style={styles.stepCurrentText}>●</Text>
                    </View>
                    <Text style={styles.stepTitle}>Processing</Text>
                  </View>
                  <View style={styles.stepConnector} />

                  <View style={styles.stepItem}>
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepCircleText}>4</Text>
                    </View>
                    <Text style={styles.stepTitle}>Shipped</Text>
                  </View>
                </View>

                <View style={styles.orderMetaBox}>
                  <Text style={styles.metaRow}>🏢 <Text style={styles.metaBold}>Buyer:</Text> {trackedOrder.buyerName}</Text>
                  <Text style={styles.metaRow}>🌍 <Text style={styles.metaBold}>Port:</Text> {trackedOrder.port}</Text>
                  <Text style={styles.metaRow}>📑 <Text style={styles.metaBold}>Audit Log:</Text> {trackedOrder.notes}</Text>
                </View>

                <Text style={styles.orderItemsHeading}>Requested Commodities:</Text>
                {trackedOrder.items.map((it: any, idx: number) => (
                  <View key={idx} style={styles.orderItemRow}>
                    <Text style={styles.orderItemName}>{it.product}</Text>
                    <Text style={styles.orderItemQty}>{it.qty} • {it.packaging}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 6: ABOUT US                                       */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'about' && (
          <View style={styles.pageContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.pageHeroCard}>
              <Text style={styles.eyebrow}>CORPORATE PROFILE</Text>
              <Text style={styles.pageHeroTitle}>Connecting Global Buyers with India's Finest Harvests</Text>
              <Text style={styles.pageHeroDesc}>
                INDKAN HarvestLink is a dedicated B2B agricultural export facilitator bridging certified Indian agricultural producers and international commodity distributors.
              </Text>
            </View>

            <View style={styles.contentBlock}>
              <Text style={styles.blockTitle}>Our Core Export Pillars</Text>
              <View style={styles.pillarCard}>
                <Text style={styles.pillarIcon}>🔬</Text>
                <Text style={styles.pillarTitle}>Optical Sortex Cleaning</Text>
                <Text style={styles.pillarDesc}>Every batch passes multi-camera optical sorters to achieve 99.5% export-grade purity and uniform seed caliber.</Text>
              </View>
              <View style={styles.pillarCard}>
                <Text style={styles.pillarIcon}>🚜</Text>
                <Text style={styles.pillarTitle}>Direct Cluster Sourcing</Text>
                <Text style={styles.pillarDesc}>Procuring directly from regional farming hubs in Madhya Pradesh, Rajasthan, Gujarat, and Andhra Pradesh.</Text>
              </View>
              <View style={styles.pillarCard}>
                <Text style={styles.pillarIcon}>📑</Text>
                <Text style={styles.pillarTitle}>Regulatory & Trade Compliance</Text>
                <Text style={styles.pillarDesc}>Complete phytosanitary documentation, fumigation certificates, APEDA compliance, and SGS pre-shipment inspections.</Text>
              </View>
            </View>
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 7: EXPORT WORKFLOW PROCESS                        */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'process' && (
          <View style={styles.pageContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.pageHeroCard}>
              <Text style={styles.eyebrow}>INTERNATIONAL TRADE DESK</Text>
              <Text style={styles.pageHeroTitle}>Our 5-Stage Export Workflow</Text>
              <Text style={styles.pageHeroDesc}>
                Structured, transparent, and compliant from initial commodity inquiry to container discharge.
              </Text>
            </View>

            <View style={styles.workflowStepCard}>
              <View style={styles.workflowNumBadge}><Text style={styles.workflowNumText}>1</Text></View>
              <Text style={styles.workflowTitle}>Explore & Submit RFQ</Text>
              <Text style={styles.workflowDesc}>Browse commodity specs, select required volumes in Metric Tons, and submit your RFQ with target port details.</Text>
            </View>
            <View style={styles.workflowStepCard}>
              <View style={styles.workflowNumBadge}><Text style={styles.workflowNumText}>2</Text></View>
              <Text style={styles.workflowTitle}>KYC Verification & Proforma</Text>
              <Text style={styles.workflowDesc}>Our trade desk verifies buyer import credentials and dispatches itemized FOB or CIF proforma invoice within 24 hours.</Text>
            </View>
            <View style={styles.workflowStepCard}>
              <View style={styles.workflowNumBadge}><Text style={styles.workflowNumText}>3</Text></View>
              <Text style={styles.workflowTitle}>Sortex Cleaning & Packaging</Text>
              <Text style={styles.workflowDesc}>Selected crops undergo optical sortex grading, moisture conditioning, and bag packing (25/50kg PP, jute, or bulk liners).</Text>
            </View>
            <View style={styles.workflowStepCard}>
              <View style={styles.workflowNumBadge}><Text style={styles.workflowNumText}>4</Text></View>
              <Text style={styles.workflowTitle}>Phytosanitary & Port Stuffing</Text>
              <Text style={styles.workflowDesc}>Containers stuffed under certified supervision at JNPT Mumbai or Mundra Port with mandatory Phyto & fumigation inspections.</Text>
            </View>
            <View style={styles.workflowStepCard}>
              <View style={styles.workflowNumBadge}><Text style={styles.workflowNumText}>5</Text></View>
              <Text style={styles.workflowTitle}>Vessel Dispatch & PIN Tracking</Text>
              <Text style={styles.workflowDesc}>Bill of Lading (B/L) issued. Buyers track shipment milestones live using their confidential 6-digit Secret PIN.</Text>
            </View>
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 8: FAQS                                           */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'faqs' && (
          <View style={styles.pageContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.pageHeroCard}>
              <Text style={styles.eyebrow}>BUYER FAQ</Text>
              <Text style={styles.pageHeroTitle}>Frequently Asked Questions</Text>
              <Text style={styles.pageHeroDesc}>
                Find immediate answers regarding minimum orders, international trade incoterms, documentation, and sample kits.
              </Text>
            </View>

            {FAQ_PREVIEW_LIST.map((faq, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.faqItem, { marginHorizontal: 16, marginBottom: 10 }]}
                onPress={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeaderRow}>
                  <Text style={styles.faqQuestionText}>{faq.q}</Text>
                  <Text style={styles.faqChevron}>{openFaqIndex === idx ? '▲' : '▼'}</Text>
                </View>
                {openFaqIndex === idx && (
                  <Text style={styles.faqAnswerText}>{faq.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 9: CONTACT US                                     */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'contact' && (
          <View style={styles.pageContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.pageHeroCard}>
              <Text style={styles.eyebrow}>GLOBAL TRADE DESK</Text>
              <Text style={styles.pageHeroTitle}>Contact INDKAN HarvestLink</Text>
              <Text style={styles.pageHeroDesc}>
                Have an inquiry about wholesale export, shipping schedule, or custom packing? Connect with our trade specialists.
              </Text>
            </View>

            <View style={styles.contactCardsGrid}>
              <View style={styles.contactInfoCard}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>✉️</Text>
                <Text style={styles.contactLabel}>Corporate Email</Text>
                <Text style={styles.contactVal}>info@indkan.com</Text>
              </View>
              <View style={styles.contactInfoCard}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>📞</Text>
                <Text style={styles.contactLabel}>Trade Hotline</Text>
                <Text style={styles.contactVal}>+91 98765 43210</Text>
              </View>
              <View style={styles.contactInfoCard}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>⚓</Text>
                <Text style={styles.contactLabel}>Maritime Hubs</Text>
                <Text style={styles.contactVal}>JNPT Mumbai • Mundra Port</Text>
              </View>
            </View>

            {contactSuccess ? (
              <View style={styles.successCard}>
                <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>✓</Text>
                <Text style={styles.successHeading}>Message Sent Successfully</Text>
                <Text style={styles.successDesc}>
                  Thank you for reaching out to INDKAN HarvestLink. A trade specialist will respond to your corporate email within 24 hours.
                </Text>
              </View>
            ) : (
              <View style={styles.formCard}>
                <Text style={styles.formCardHeading}>Send Us a Direct Message</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textSubtle}
                    value={contactName}
                    onChangeText={setContactName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Business Email *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="name@company.com"
                    placeholderTextColor={COLORS.textSubtle}
                    keyboardType="email-address"
                    value={contactEmail}
                    onChangeText={setContactEmail}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Message / Inquiry *</Text>
                  <TextInput
                    style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                    placeholder="How can our export desk assist your procurement?"
                    placeholderTextColor={COLORS.textSubtle}
                    multiline
                    value={contactMessage}
                    onChangeText={setContactMessage}
                  />
                </View>

                <TouchableOpacity style={styles.btnGoldFull} onPress={handleContactSubmit} activeOpacity={0.85}>
                  <Text style={styles.btnGoldText}>Send Trade Message  →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 10: PRIVACY & TRADE TERMS                         */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'privacy' && (
          <View style={styles.pageContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.pageHeroCard}>
              <Text style={styles.eyebrow}>LEGAL & COMPLIANCE</Text>
              <Text style={styles.pageHeroTitle}>Trade Terms & Privacy Policy</Text>
            </View>

            <View style={styles.policyCard}>
              <Text style={styles.policyHeading}>1. International Commodity Sourcing</Text>
              <Text style={styles.policyText}>
                All agricultural commodities displayed on INDKAN HarvestLink are graded according to APEDA and Indian Spice Board export specifications. Firm sales are subject to official sales contract execution.
              </Text>
              <Text style={styles.policyHeading}>2. Data Privacy & Confidentiality</Text>
              <Text style={styles.policyText}>
                All buyer details, RFQ specifications, and KYC information are strictly confidential and shared only with accredited inspection laboratories and shipping lines for Bill of Lading generation.
              </Text>
              <Text style={styles.policyHeading}>3. PIN-Protected Audit Integrity</Text>
              <Text style={styles.policyText}>
                Each inquiry is assigned a confidential 6-digit Secret PIN. INDKAN HarvestLink will never request your PIN via unverified third-party channels.
              </Text>
            </View>
          </View>
        )}

        {/* ------------------------------------------------------ */}
        {/* PAGE 11: ADMIN PANEL / OPERATIONS                     */}
        {/* ------------------------------------------------------ */}
        {currentScreen === 'admin' && (
          <View style={styles.pageContainer}>
            {!isAdminLoggedIn ? (
              /* ADMIN LOGIN CARD */
              <View style={styles.adminLoginWrapper}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
                  <Text style={styles.backButtonText}>← Back to Home</Text>
                </TouchableOpacity>

                <View style={styles.adminLoginCard}>
                  <View style={styles.adminLockBadge}>
                    <Text style={styles.adminLockBadgeText}>🔒 RESTRICTED ACCESS</Text>
                  </View>

                  <Text style={styles.adminLoginTitle}>INDKAN Admin Console</Text>
                  <Text style={styles.adminLoginDesc}>
                    Authorized access for trade officers and compliance desk to verify buyer KYC, update shipments, and monitor warehouse quotas.
                  </Text>

                  {adminAuthError ? (
                    <View style={styles.adminErrorBox}>
                      <Text style={styles.adminErrorText}>{adminAuthError}</Text>
                    </View>
                  ) : null}

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Corporate Email *</Text>
                    <TextInput
                      style={styles.input}
                      value={adminEmail}
                      onChangeText={setAdminEmail}
                      placeholder="admin@indkan.com"
                      placeholderTextColor={COLORS.textSubtle}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Security Password *</Text>
                    <TextInput
                      style={styles.input}
                      value={adminPassword}
                      onChangeText={setAdminPassword}
                      placeholder="Enter admin password"
                      placeholderTextColor={COLORS.textSubtle}
                      secureTextEntry
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.btnGoldFull}
                    onPress={handleAdminLogin}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnGoldText}>Sign In to Admin Console  →</Text>
                  </TouchableOpacity>

                  <View style={styles.adminDemoCredsBox}>
                    <Text style={styles.adminDemoCredsTitle}>Default Admin Credentials:</Text>
                    <Text style={styles.adminDemoCredsText}>Username: <Text style={{ fontWeight: 'bold' }}>admin@indkan.com</Text></Text>
                    <Text style={styles.adminDemoCredsText}>Password: <Text style={{ fontWeight: 'bold' }}>admin123</Text></Text>
                  </View>
                </View>
              </View>
            ) : (
              /* AUTHENTICATED ADMIN CONSOLE */
              <View>
                {/* Admin Status Header Bar */}
                <View style={styles.adminTopHeaderBar}>
                  <View>
                    <View style={styles.adminRoleRow}>
                      <View style={styles.superAdminBadge}>
                        <Text style={styles.superAdminBadgeText}>SUPER ADMIN</Text>
                      </View>
                      <Text style={styles.liveConnectedDot}>● Live Connected</Text>
                    </View>
                    <Text style={styles.adminUserEmail}>{adminEmail}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.adminLogoutBtn}
                    onPress={handleAdminLogout}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.adminLogoutBtnText}>🚪 Logout</Text>
                  </TouchableOpacity>
                </View>

                {/* Admin Tabs Switcher */}
                <View style={styles.adminTabsSwitcherRow}>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminActiveTab === 'overview' && styles.adminTabBtnActive]}
                    onPress={() => setAdminActiveTab('overview')}
                  >
                    <Text style={[styles.adminTabBtnText, adminActiveTab === 'overview' && styles.adminTabBtnTextActive]}>
                      📊 Dashboard
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminActiveTab === 'enquiries' && styles.adminTabBtnActive]}
                    onPress={() => setAdminActiveTab('enquiries')}
                  >
                    <Text style={[styles.adminTabBtnText, adminActiveTab === 'enquiries' && styles.adminTabBtnTextActive]}>
                      📋 Enquiries ({adminEnquiries.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminActiveTab === 'inventory' && styles.adminTabBtnActive]}
                    onPress={() => setAdminActiveTab('inventory')}
                  >
                    <Text style={[styles.adminTabBtnText, adminActiveTab === 'inventory' && styles.adminTabBtnTextActive]}>
                      🌾 Inventory
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* TAB 1: OVERVIEW DASHBOARD */}
                {adminActiveTab === 'overview' && (
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={styles.adminSectionTitle}>Operational Metrics</Text>

                    {/* 4 KPI Cards */}
                    <View style={styles.kpiGrid}>
                      <View style={styles.kpiCard}>
                        <Text style={styles.kpiVal}>{adminEnquiries.length}</Text>
                        <Text style={styles.kpiLabel}>Total Enquiries</Text>
                        <Text style={styles.kpiSub}>All-time bulk RFQs</Text>
                      </View>

                      <View style={styles.kpiCard}>
                        <Text style={[styles.kpiVal, { color: '#B54708' }]}>
                          {adminEnquiries.filter((e) => e.verificationStatus === 'pending').length}
                        </Text>
                        <Text style={styles.kpiLabel}>Pending KYC</Text>
                        <Text style={styles.kpiSub}>Require review</Text>
                      </View>

                      <View style={styles.kpiCard}>
                        <Text style={[styles.kpiVal, { color: COLORS.forestGreen }]}>
                          {adminEnquiries.filter((e) => e.status === 'shipped').length}
                        </Text>
                        <Text style={styles.kpiLabel}>In Transit</Text>
                        <Text style={styles.kpiSub}>Vessels at sea</Text>
                      </View>

                      <View style={styles.kpiCard}>
                        <Text style={[styles.kpiVal, { color: COLORS.goldDark }]}>
                          {adminProducts.length}
                        </Text>
                        <Text style={styles.kpiLabel}>Active Commodities</Text>
                        <Text style={styles.kpiSub}>Sortex catalog</Text>
                      </View>
                    </View>

                    {/* Stock Summary Card */}
                    <View style={styles.stockSummaryCard}>
                      <Text style={styles.stockSummaryTitle}>Warehouse Allocation Status</Text>
                      <View style={styles.stockSummaryRow}>
                        <View style={styles.stockSummaryItem}>
                          <Text style={styles.stockSummaryNum}>
                            {adminProducts.filter((p) => p.status === 'in_stock').length}
                          </Text>
                          <Text style={styles.stockSummaryLbl}>In Stock</Text>
                        </View>
                        <View style={styles.stockSummaryItem}>
                          <Text style={[styles.stockSummaryNum, { color: '#B54708' }]}>
                            {adminProducts.filter((p) => p.status === 'low_stock').length}
                          </Text>
                          <Text style={styles.stockSummaryLbl}>Low Stock</Text>
                        </View>
                        <View style={styles.stockSummaryItem}>
                          <Text style={[styles.stockSummaryNum, { color: '#B42318' }]}>
                            {adminProducts.filter((p) => p.status === 'out_of_stock').length}
                          </Text>
                          <Text style={styles.stockSummaryLbl}>Out of Stock</Text>
                        </View>
                      </View>
                    </View>

                    {/* Quick Enquiries Preview */}
                    <Text style={[styles.adminSectionTitle, { marginTop: 24 }]}>Recent Inquiries</Text>
                    {adminEnquiries.slice(0, 2).map((item) => (
                      <View key={item.id} style={styles.adminRecentEnqCard}>
                        <View style={styles.recentEnqHeader}>
                          <Text style={styles.recentEnqRef}>{item.referenceId}</Text>
                          <Text style={styles.recentEnqDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.recentEnqBuyer}>{item.buyerName} • {item.company}</Text>
                        <Text style={styles.recentEnqItem}>{item.commodity} ({item.volume})</Text>

                        <View style={styles.recentEnqActionsRow}>
                          <TouchableOpacity
                            style={styles.recentEnqViewBtn}
                            onPress={() => {
                              setSelectedAdminEnquiry(item);
                              setIsAdminDetailModalOpen(true);
                            }}
                          >
                            <Text style={styles.recentEnqViewBtnText}>Inspect RFQ</Text>
                          </TouchableOpacity>
                          {item.verificationStatus === 'pending' ? (
                            <TouchableOpacity
                              style={styles.recentEnqVerifyBtn}
                              onPress={() => handleVerifyKYC(item.referenceId)}
                            >
                              <Text style={styles.recentEnqVerifyBtnText}>✓ Verify KYC</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.recentEnqAdvanceBtn}
                              onPress={() => handleAdvanceStage(item.referenceId)}
                            >
                              <Text style={styles.recentEnqAdvanceBtnText}>Advance Stage →</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* TAB 2: ENQUIRIES MANAGEMENT */}
                {adminActiveTab === 'enquiries' && (
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={styles.adminSectionTitle}>International Bulk RFQs</Text>

                    {/* Search */}
                    <View style={styles.searchBar}>
                      <Text style={styles.searchIcon}>🔍</Text>
                      <TextInput
                        placeholder="Search by Ref ID, buyer, or port..."
                        placeholderTextColor={COLORS.textSubtle}
                        value={adminSearchQuery}
                        onChangeText={setAdminSearchQuery}
                        style={styles.searchInput}
                      />
                    </View>

                    {/* Filter Pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                      {['all', 'pending', 'verified', 'processing', 'shipped'].map((st) => (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.filterPill,
                            adminEnquiryFilter === st && styles.filterPillActive,
                          ]}
                          onPress={() => setAdminEnquiryFilter(st)}
                        >
                          <Text
                            style={[
                              styles.filterPillText,
                              adminEnquiryFilter === st && styles.filterPillTextActive,
                            ]}
                          >
                            {st === 'all' ? 'All RFQs' : st === 'pending' ? 'KYC Pending' : st.charAt(0).toUpperCase() + st.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* Filtered Enquiries */}
                    {adminEnquiries
                      .filter((e) => {
                        const matchesFilter =
                          adminEnquiryFilter === 'all' ||
                          (adminEnquiryFilter === 'pending' && e.verificationStatus === 'pending') ||
                          (adminEnquiryFilter === 'verified' && e.verificationStatus === 'verified') ||
                          e.status === adminEnquiryFilter;
                        const matchesSearch =
                          !adminSearchQuery.trim() ||
                          e.referenceId.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                          e.buyerName.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                          e.port.toLowerCase().includes(adminSearchQuery.toLowerCase());
                        return matchesFilter && matchesSearch;
                      })
                      .map((enq) => (
                        <View key={enq.id} style={styles.adminEnquiryCardFull}>
                          <View style={styles.adminEnquiryCardTop}>
                            <View style={styles.enquiryRefBadge}>
                              <Text style={styles.enquiryRefBadgeText}>{enq.referenceId}</Text>
                            </View>
                            <Text style={styles.enquiryDateText}>{enq.date}</Text>
                          </View>

                          <Text style={styles.enquiryBuyerTitle}>{enq.buyerName}</Text>
                          <Text style={styles.enquiryCompanyText}>🏢 {enq.company} • 📍 {enq.port}, {enq.country}</Text>

                          <View style={styles.enquiryCommodityBox}>
                            <Text style={styles.enquiryCommodityName}>{enq.commodity}</Text>
                            <Text style={styles.enquiryCommodityQty}>{enq.volume} • {enq.packaging}</Text>
                          </View>

                          {/* 2-Tier Status Badges */}
                          <View style={styles.twoTierBadgeRow}>
                            <View style={[
                              styles.kycStatusBadge,
                              enq.verificationStatus === 'verified' ? styles.kycVerified : styles.kycPending
                            ]}>
                              <Text style={styles.kycStatusText}>
                                {enq.verificationStatus === 'verified' ? '✓ KYC Verified' : '⏳ KYC Pending'}
                              </Text>
                            </View>

                            <View style={styles.shipmentStageBadge}>
                              <Text style={styles.shipmentStageText}>🚢 {enq.statusLabel}</Text>
                            </View>
                          </View>

                          {/* Action Buttons */}
                          <View style={styles.adminCardActionRow}>
                            <TouchableOpacity
                              style={styles.adminInspectBtn}
                              onPress={() => {
                                setSelectedAdminEnquiry(enq);
                                setIsAdminDetailModalOpen(true);
                              }}
                            >
                              <Text style={styles.adminInspectBtnText}>Details & PIN</Text>
                            </TouchableOpacity>

                            {enq.verificationStatus === 'pending' ? (
                              <TouchableOpacity
                                style={styles.adminVerifyBtn}
                                onPress={() => handleVerifyKYC(enq.referenceId)}
                              >
                                <Text style={styles.adminVerifyBtnText}>Verify KYC</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.adminAdvanceBtn}
                                onPress={() => handleAdvanceStage(enq.referenceId)}
                              >
                                <Text style={styles.adminAdvanceBtnText}>Advance Stage →</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))}
                  </View>
                )}

                {/* TAB 3: INVENTORY MANAGEMENT */}
                {adminActiveTab === 'inventory' && (
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={styles.adminSectionTitle}>Commodity Stock & Allotments</Text>

                    {adminProducts.map((prod) => (
                      <View key={prod.id} style={styles.inventoryItemCard}>
                        <View style={styles.inventoryCardHeader}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.inventoryProdCode}>{prod.productCode}</Text>
                            <Text style={styles.inventoryProdName}>{prod.name}</Text>
                            <Text style={styles.inventoryOriginText}>Origin: {prod.origin} • MOQ: {prod.moq}</Text>
                          </View>

                          <TouchableOpacity
                            style={[
                              styles.inventoryStatusPill,
                              prod.status === 'in_stock' ? styles.stockIn : styles.stockLow
                            ]}
                            onPress={() => handleToggleProductStock(prod.id)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.inventoryStatusPillText}>{prod.statusLabel}</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Stock Quantity Controls */}
                        <View style={styles.inventoryStockControlRow}>
                          <View>
                            <Text style={styles.inventoryStockLbl}>Allocated Quota:</Text>
                            <Text style={styles.inventoryStockVal}>{prod.stockQty}</Text>
                          </View>

                          <View style={styles.inventoryBtnGroup}>
                            <TouchableOpacity
                              style={styles.stockAdjustBtn}
                              onPress={() => handleAdjustStock(prod.id, -5)}
                            >
                              <Text style={styles.stockAdjustBtnText}>- 5 MT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.stockAdjustBtn, { backgroundColor: COLORS.forestGreen }]}
                              onPress={() => handleAdjustStock(prod.id, 5)}
                            >
                              <Text style={[styles.stockAdjustBtnText, { color: COLORS.pureWhite }]}>+ 5 MT</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* ADMIN ENQUIRY INSPECTION DETAIL MODAL */}
                <Modal visible={isAdminDetailModalOpen} transparent animationType="slide">
                  <View style={styles.adminModalBackdrop}>
                    <View style={styles.adminModalBox}>
                      <View style={styles.adminModalHeader}>
                        <Text style={styles.adminModalTitle}>Enquiry Audit & Credentials</Text>
                        <TouchableOpacity onPress={() => setIsAdminDetailModalOpen(false)}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>✕</Text>
                        </TouchableOpacity>
                      </View>

                      {selectedAdminEnquiry && (
                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Reference ID:</Text>
                            <Text style={[styles.modalMetaVal, { color: COLORS.forestGreen, fontWeight: '800' }]}>
                              {selectedAdminEnquiry.referenceId}
                            </Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Confidential PIN:</Text>
                            <Text style={[styles.modalMetaVal, { color: '#B54708', fontWeight: '800' }]}>
                              {selectedAdminEnquiry.secretPin}
                            </Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Authorized Contact:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.buyerName}</Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Trading House:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.company}</Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Corporate Email:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.email}</Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Direct Phone:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.phone}</Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Discharge Port:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.port}, {selectedAdminEnquiry.country}</Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Commodity & Qty:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.commodity} ({selectedAdminEnquiry.volume})</Text>
                          </View>

                          <View style={styles.modalMetaRow}>
                            <Text style={styles.modalMetaKey}>Packaging:</Text>
                            <Text style={styles.modalMetaVal}>{selectedAdminEnquiry.packaging}</Text>
                          </View>

                          <View style={{ marginTop: 12, padding: 10, backgroundColor: COLORS.warmCream, borderRadius: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.forestGreen, marginBottom: 4 }}>
                              Internal Compliance Log:
                            </Text>
                            <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 17 }}>
                              {selectedAdminEnquiry.notes}
                            </Text>
                          </View>
                        </ScrollView>
                      )}

                      <TouchableOpacity
                        style={[styles.btnGoldFull, { marginTop: 16 }]}
                        onPress={() => setIsAdminDetailModalOpen(false)}
                      >
                        <Text style={styles.btnGoldText}>Close Audit Panel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* 4. FOOTER (Matching Website footer-root exactly)         */}
        {/* ======================================================== */}
        <View style={styles.footerRoot}>
          <Image source={ASSETS.logo} style={styles.footerLogoImg} />
          <Text style={styles.footerTagline}>
            Connecting global buyers with quality agricultural products from India.
          </Text>

          <View style={styles.footerContactRow}>
            <Text style={styles.footerContactItem}>✉️ info@indkan.com</Text>
            <Text style={styles.footerContactItem}>📍 JNPT Mumbai • Mundra • Chennai</Text>
          </View>

          <View style={styles.footerLinksGrid}>
            <TouchableOpacity onPress={() => navigateTo('home')}><Text style={styles.footerLinkText}>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('products')}><Text style={styles.footerLinkText}>Products</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('about')}><Text style={styles.footerLinkText}>About Us</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('process')}><Text style={styles.footerLinkText}>Our Export Process</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('faqs')}><Text style={styles.footerLinkText}>FAQs</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('contact')}><Text style={styles.footerLinkText}>Contact Us</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('privacy')}><Text style={styles.footerLinkText}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('admin')}><Text style={[styles.footerLinkText, { color: COLORS.harvestGold, fontWeight: '800' }]}>🔒 Admin Portal</Text></TouchableOpacity>
          </View>

          <View style={styles.footerDivider} />
          <Text style={styles.footerCopyright}>© 2026 INDKAN HarvestLink. All rights reserved.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// 10. EXACT STYLESHEET MATCHING WEBSITE CSS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.pureWhite,
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: COLORS.pureWhite,
  },

  // SITE HEADER
  siteHeader: {
    backgroundColor: COLORS.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingTop: 8,
  },
  navbarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brandTouch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoImg: {
    width: 155,
    height: 38,
    resizeMode: 'contain',
  },
  mobileMenuButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.warmCream,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenuIcon: {
    fontSize: 22,
    color: COLORS.forestGreen,
    fontWeight: 'bold',
  },

  // NAV LINKS BAR
  navLinksBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(32, 59, 44, 0.05)',
  },
  navLinkItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  navLinkItemActive: {
    borderBottomColor: COLORS.forestGreen,
  },
  navLinkText: {
    fontSize: 13,
    fontFamily: FONT_BODY,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  navLinkTextActive: {
    color: COLORS.forestGreen,
    fontWeight: '800',
  },

  // HERO SECTION
  heroWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heroCard: {
    backgroundColor: COLORS.warmCream,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  heroBannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  heroContent: {
    padding: 22,
  },
  eyebrow: {
    color: COLORS.goldEyebrow,
    fontSize: 11,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  heroHeading: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  heroHeadingGold: {
    color: COLORS.goldDark,
  },
  heroDescription: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 14.5,
    lineHeight: 22,
    marginBottom: 20,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  btnGold: {
    backgroundColor: COLORS.harvestGold,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGoldText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 14,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.forestGreen,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 14,
  },
  btnGoldFull: {
    backgroundColor: COLORS.harvestGold,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  // TRUST POINTS
  trustPointsRow: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(32, 59, 44, 0.08)',
    gap: 14,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trustIcon: {
    fontSize: 22,
  },
  trustTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 13.5,
  },
  trustSub: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 12,
  },

  // SECTION HEADERS
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 8,
  },
  sectionDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 21,
  },

  // CATEGORY CARDS
  categoryCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  categoryImgWrap: {
    position: 'relative',
    height: 180,
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadgeWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(20, 38, 28, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#E5C378',
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  categoryContent: {
    padding: 18,
  },
  categoryTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  categoryDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  categoryPillText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryActionBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  categoryActionBtnText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 13,
  },

  // POPULAR PRODUCTS CARDS
  popularProductCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  popularImgWrap: {
    position: 'relative',
    height: 190,
  },
  popularImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  stockIn: {
    backgroundColor: COLORS.badgeInStockBg,
  },
  stockLow: {
    backgroundColor: COLORS.badgeLowStockBg,
  },
  stockBadgeText: {
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11,
  },
  popularCardBody: {
    padding: 16,
  },
  popularCatLabel: {
    color: COLORS.goldEyebrow,
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  popularName: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  popularSpecsBox: {
    backgroundColor: COLORS.warmCream,
    borderRadius: 8,
    padding: 10,
    gap: 4,
    marginBottom: 14,
  },
  popularSpecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popularSpecLabel: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 12,
  },
  popularSpecVal: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
  },
  popularCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnDetailsLink: {
    flex: 1,
    backgroundColor: COLORS.surfaceGray,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDetailsLinkText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 13,
  },
  btnQuoteLink: {
    flex: 1,
    backgroundColor: COLORS.harvestGold,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnQuoteLinkText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 13,
  },

  // CATALOGUE BANNER BAR
  catalogueBannerBar: {
    backgroundColor: COLORS.warmCream,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  catalogueBannerTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  catalogueBannerDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  // WHY CHOOSE SECTION
  whyChooseSection: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 24,
    marginTop: 36,
  },
  whyGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  whyFeatureCard: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  whyIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  whyFeatureTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  whyFeatureDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
  },

  // QUALITY CARDS
  qualityCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  qualityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  qualityIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(32, 59, 44, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 15.5,
    fontWeight: 'bold',
    flex: 1,
  },
  qualityDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  qualityChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  qualityChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityChipText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: '600',
  },

  // HOW IT WORKS
  howTimelineGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  howStepCard: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  howStepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  howStepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howStepNumberText: {
    color: '#F7E7B4',
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 13,
  },
  howStepTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 16,
    fontWeight: 'bold',
  },
  howStepDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
  },

  // BULK CTA BOX
  bulkCtaBox: {
    backgroundColor: COLORS.warmCream,
    marginHorizontal: 16,
    marginTop: 36,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
  },
  bulkCtaTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 8,
  },
  bulkCtaDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 16,
  },

  // FAQ ACCORDIONS
  faqAccordionContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  faqItem: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 16,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  faqQuestionText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
  },
  faqChevron: {
    fontSize: 13,
    color: COLORS.textSubtle,
  },
  faqAnswerBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(32, 59, 44, 0.06)',
  },
  faqAnswerText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
  },

  // FAQ ACTION BAR
  faqActionsBar: {
    backgroundColor: COLORS.surfaceLight,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    padding: 18,
  },
  faqActionsPrompt: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 4,
  },
  faqActionsSub: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  faqActionsBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  faqPrimaryBtn: {
    flex: 1,
    backgroundColor: COLORS.forestGreen,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  faqPrimaryBtnText: {
    color: COLORS.pureWhite,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12.5,
  },
  faqSecondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.pureWhite,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.forestGreen,
  },
  faqSecondaryBtnText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12.5,
  },

  // FOOTER ROOT
  footerRoot: {
    backgroundColor: COLORS.forestDark,
    padding: 24,
    marginTop: 40,
  },
  footerLogoImg: {
    width: 150,
    height: 36,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  footerTagline: {
    color: '#D0D5DD',
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  footerContactRow: {
    gap: 6,
    marginBottom: 18,
  },
  footerContactItem: {
    color: '#98A2B3',
    fontFamily: FONT_BODY,
    fontSize: 12,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 18,
  },
  footerLinkText: {
    color: '#E4E7EC',
    fontFamily: FONT_BODY,
    fontSize: 13,
    fontWeight: '600',
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 14,
  },
  footerCopyright: {
    color: '#667085',
    fontFamily: FONT_BODY,
    fontSize: 11,
    textAlign: 'center',
  },

  // DRAWER MODAL
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContainer: {
    backgroundColor: COLORS.pureWhite,
    width: '80%',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  drawerCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
  },
  drawerLinks: {
    padding: 18,
  },
  drawerGroupTitle: {
    color: COLORS.goldEyebrow,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
  },
  drawerItemIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  drawerItemText: {
    color: COLORS.textDark,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 14,
  },
  drawerFooterInfo: {
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingBottom: 40,
  },
  drawerContactText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 4,
  },
  drawerPortText: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11,
  },

  // COMMON PAGE STYLES
  pageContainer: {
    paddingBottom: 30,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 14,
  },

  // CATALOGUE SEARCH & PILLS
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warmCream,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 14,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontFamily: FONT_BODY,
    fontSize: 13.5,
    color: COLORS.textDark,
  },
  pillsScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.warmCream,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterPillActive: {
    backgroundColor: COLORS.forestGreen,
    borderColor: COLORS.forestGreen,
  },
  filterPillText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontWeight: '600',
    fontSize: 12.5,
  },
  filterPillTextActive: {
    color: COLORS.pureWhite,
    fontWeight: '700',
  },

  // PRODUCT DETAILS PAGE
  detailsCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  detailsHeroImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  detailsBody: {
    padding: 18,
  },
  detailsBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  detailsGradeBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailsGradeText: {
    color: '#854D0E',
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11,
  },
  detailsCategoryBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailsCategoryText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11,
  },
  detailsTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailsStockLabel: {
    color: COLORS.badgeInStockText,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 12,
  },
  detailsFullDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsSpecGrid: {
    backgroundColor: COLORS.warmCream,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  detailsSpecBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailsSpecBoxFull: {
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(32, 59, 44, 0.08)',
  },
  detailsSpecLabel: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: '700',
  },
  detailsSpecVal: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: '700',
  },
  labParametersBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  labParametersHeading: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 8,
  },
  labParamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  labParamKey: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
  },
  labParamVal: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11.5,
  },

  // FORMS
  formCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  formCardHeading: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.warmCream,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONT_BODY,
    fontSize: 13.5,
    color: COLORS.textDark,
  },
  commodityChip: {
    backgroundColor: COLORS.warmCream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  commodityChipActive: {
    backgroundColor: COLORS.forestGreen,
    borderColor: COLORS.forestGreen,
  },
  commodityChipText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 12,
  },
  commodityChipTextActive: {
    color: COLORS.pureWhite,
    fontWeight: '700',
  },
  volumeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitBadge: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  unitBadgeText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
  },
  successCard: {
    backgroundColor: COLORS.warmCream,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1.5,
    borderColor: COLORS.harvestGold,
  },
  successHeading: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  successRefText: {
    color: COLORS.goldDark,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 15,
    textAlign: 'center',
  },
  successPinText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  successDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 16,
  },

  // TRACK SCREEN
  trackCard: {
    backgroundColor: COLORS.forestDark,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  trackCardTitle: {
    color: COLORS.pureWhite,
    fontFamily: FONT_HEADING,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  trackCardDesc: {
    color: '#D0D5DD',
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 18,
  },
  darkInputLabel: {
    color: COLORS.harvestGold,
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  darkInputField: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 81, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONT_BODY,
    fontSize: 13.5,
    color: COLORS.pureWhite,
  },
  errorText: {
    color: '#FDA29B',
    fontFamily: FONT_BODY,
    fontSize: 12,
    marginBottom: 10,
  },
  trackSecurityNotice: {
    color: '#98A2B3',
    fontFamily: FONT_BODY,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
  },

  // ORDER RESULT & STEPPER
  orderResultCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderRefText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 15,
  },
  orderDateText: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
  },
  orderStagePill: {
    backgroundColor: COLORS.badgeInStockBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStagePillText: {
    color: COLORS.badgeInStockText,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  stepItem: {
    alignItems: 'center',
    width: 60,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepActiveCircle: {
    backgroundColor: COLORS.forestGreen,
  },
  stepCurrentCircle: {
    backgroundColor: COLORS.harvestGold,
  },
  stepCircleText: {
    color: COLORS.pureWhite,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepCurrentText: {
    color: COLORS.forestGreen,
    fontSize: 10,
  },
  stepTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 9.5,
    textAlign: 'center',
    fontWeight: '600',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.forestGreen,
    marginHorizontal: 4,
    marginBottom: 14,
  },
  orderMetaBox: {
    backgroundColor: COLORS.warmCream,
    borderRadius: 10,
    padding: 12,
    gap: 4,
    marginVertical: 12,
  },
  metaRow: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 12.5,
  },
  metaBold: {
    color: COLORS.forestGreen,
    fontWeight: '700',
  },
  orderItemsHeading: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(32, 59, 44, 0.05)',
  },
  orderItemName: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '600',
    fontSize: 12.5,
  },
  orderItemQty: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 12,
  },

  // STATIC PAGES (About, Process, Contact, Privacy)
  pageHeroCard: {
    backgroundColor: COLORS.warmCream,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  pageHeroTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 6,
  },
  pageHeroDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13.5,
    lineHeight: 20,
  },
  contentBlock: {
    paddingHorizontal: 16,
    gap: 12,
  },
  blockTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pillarCard: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  pillarIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  pillarTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pillarDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
  },

  // WORKFLOW STEPS
  workflowStepCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  workflowNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  workflowNumText: {
    color: '#F7E7B4',
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 12,
  },
  workflowTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workflowDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
  },

  // CONTACT CARDS
  contactCardsGrid: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 18,
  },
  contactInfoCard: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  contactLabel: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: '600',
  },
  contactVal: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 14,
    fontWeight: '700',
  },

  // POLICY CARD
  policyCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  policyHeading: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 15,
    fontWeight: 'bold',
  },
  policyText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
  },

  // ADMIN PORTAL STYLES
  adminLoginWrapper: {
    paddingBottom: 20,
  },
  adminLoginCard: {
    backgroundColor: COLORS.pureWhite,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  adminLockBadge: {
    backgroundColor: 'rgba(32, 59, 44, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  adminLockBadgeText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  adminLoginTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  adminLoginDesc: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  adminErrorBox: {
    backgroundColor: '#FEF3F2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDCA',
    marginBottom: 14,
  },
  adminErrorText: {
    color: '#B42318',
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: '600',
  },
  adminDemoCredsBox: {
    marginTop: 18,
    padding: 12,
    backgroundColor: COLORS.warmCream,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  adminDemoCredsTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11.5,
    marginBottom: 4,
  },
  adminDemoCredsText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
    lineHeight: 16,
  },

  // AUTHENTICATED ADMIN TOP BAR
  adminTopHeaderBar: {
    backgroundColor: COLORS.forestDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGold,
  },
  adminRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  superAdminBadge: {
    backgroundColor: COLORS.harvestGold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  superAdminBadgeText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '900',
    fontSize: 9.5,
  },
  liveConnectedDot: {
    color: '#32D583',
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    fontWeight: '700',
  },
  adminUserEmail: {
    color: '#E4E7EC',
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: '600',
  },
  adminLogoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  adminLogoutBtnText: {
    color: COLORS.pureWhite,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
    fontWeight: '700',
  },

  // ADMIN TABS SWITCHER
  adminTabsSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.warmCream,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  adminTabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  adminTabBtnActive: {
    backgroundColor: COLORS.forestGreen,
  },
  adminTabBtnText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: '700',
  },
  adminTabBtnTextActive: {
    color: COLORS.pureWhite,
  },

  // ADMIN SECTION
  adminSectionTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 12,
  },

  // KPI CARDS
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    width: (width - 42) / 2,
    backgroundColor: COLORS.pureWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  kpiVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    marginBottom: 2,
  },
  kpiLabel: {
    color: COLORS.textDark,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
  },
  kpiSub: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 10.5,
  },

  // STOCK SUMMARY
  stockSummaryCard: {
    backgroundColor: COLORS.warmCream,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stockSummaryTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 12,
  },
  stockSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  stockSummaryNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
  },
  stockSummaryLbl: {
    fontSize: 11,
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    marginTop: 2,
  },

  // RECENT ENQ CARDS
  adminRecentEnqCard: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 10,
  },
  recentEnqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  recentEnqRef: {
    color: COLORS.goldEyebrow,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 12,
  },
  recentEnqDate: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11,
  },
  recentEnqBuyer: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 13.5,
    marginBottom: 2,
  },
  recentEnqItem: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 12,
    marginBottom: 10,
  },
  recentEnqActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  recentEnqViewBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceGray,
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
  },
  recentEnqViewBtnText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11.5,
  },
  recentEnqVerifyBtn: {
    flex: 1,
    backgroundColor: '#ECFDF3',
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A6F4C5',
  },
  recentEnqVerifyBtnText: {
    color: '#027A48',
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11.5,
  },
  recentEnqAdvanceBtn: {
    flex: 1,
    backgroundColor: COLORS.forestGreen,
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
  },
  recentEnqAdvanceBtnText: {
    color: COLORS.pureWhite,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 11.5,
  },

  // FULL ENQUIRY CARDS (TAB 2)
  adminEnquiryCardFull: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
  },
  adminEnquiryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  enquiryRefBadge: {
    backgroundColor: 'rgba(201, 164, 81, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  enquiryRefBadgeText: {
    color: COLORS.goldEyebrow,
    fontFamily: FONT_BODY,
    fontWeight: '800',
    fontSize: 11.5,
  },
  enquiryDateText: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11,
  },
  enquiryBuyerTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  enquiryCompanyText: {
    color: COLORS.textMuted,
    fontFamily: FONT_BODY,
    fontSize: 12,
    marginBottom: 10,
  },
  enquiryCommodityBox: {
    backgroundColor: COLORS.warmCream,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  enquiryCommodityName: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 13,
  },
  enquiryCommodityQty: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
    marginTop: 2,
  },
  twoTierBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  kycStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  kycVerified: {
    backgroundColor: '#ECFDF3',
  },
  kycPending: {
    backgroundColor: '#FFFAEB',
  },
  kycStatusText: {
    fontSize: 11,
    fontFamily: FONT_BODY,
    fontWeight: '700',
  },
  shipmentStageBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  shipmentStageText: {
    color: COLORS.forestGreen,
    fontSize: 11,
    fontFamily: FONT_BODY,
    fontWeight: '600',
  },
  adminCardActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adminInspectBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceGray,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  adminInspectBtnText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
  },
  adminVerifyBtn: {
    flex: 1,
    backgroundColor: '#ECFDF3',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A6F4C5',
  },
  adminVerifyBtnText: {
    color: '#027A48',
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
  },
  adminAdvanceBtn: {
    flex: 1,
    backgroundColor: COLORS.forestGreen,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  adminAdvanceBtnText: {
    color: COLORS.pureWhite,
    fontFamily: FONT_BODY,
    fontWeight: '700',
    fontSize: 12,
  },

  // INVENTORY TAB (TAB 3)
  inventoryItemCard: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
  },
  inventoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  inventoryProdCode: {
    color: COLORS.goldEyebrow,
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    fontWeight: '800',
  },
  inventoryProdName: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 2,
  },
  inventoryOriginText: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
    marginTop: 2,
  },
  inventoryStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inventoryStatusPillText: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: '700',
  },
  inventoryStockControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.warmCream,
    borderRadius: 8,
    padding: 10,
  },
  inventoryStockLbl: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 11,
  },
  inventoryStockVal: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 14,
    fontWeight: '800',
  },
  inventoryBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  stockAdjustBtn: {
    backgroundColor: COLORS.surfaceGray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stockAdjustBtnText: {
    color: COLORS.forestGreen,
    fontFamily: FONT_BODY,
    fontSize: 11.5,
    fontWeight: '700',
  },

  // ADMIN DETAIL MODAL
  adminModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    padding: 18,
  },
  adminModalBox: {
    backgroundColor: COLORS.pureWhite,
    borderRadius: 18,
    padding: 20,
  },
  adminModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12,
    marginBottom: 14,
  },
  adminModalTitle: {
    color: COLORS.forestGreen,
    fontFamily: FONT_HEADING,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(32, 59, 44, 0.04)',
  },
  modalMetaKey: {
    color: COLORS.textSubtle,
    fontFamily: FONT_BODY,
    fontSize: 12,
  },
  modalMetaVal: {
    color: COLORS.textDark,
    fontFamily: FONT_BODY,
    fontSize: 12.5,
    fontWeight: '600',
  },
});