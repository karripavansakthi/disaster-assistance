const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const Shelter = require('../models/Shelter');
const DisasterAlert = require('../models/DisasterAlert');
const Hospital = require('../models/Hospital');
const RescueTeam = require('../models/RescueTeam');
const Resource = require('../models/Resource');
const MissingPerson = require('../models/MissingPerson');
const Feedback = require('../models/Feedback');
const IncidentReport = require('../models/IncidentReport');
const DisasterStatus = require('../models/DisasterStatus');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'disaster_platform' });
  console.log('✅ Connected to MongoDB');
};

const hashPwd = async (pw) => bcrypt.hash(pw, 12);

const seed = async () => {
  await connectDB();

  // Clear all collections
  await Promise.all([
    User.deleteMany(), EmergencyRequest.deleteMany(), Shelter.deleteMany(),
    DisasterAlert.deleteMany(), Hospital.deleteMany(), RescueTeam.deleteMany(),
    Resource.deleteMany(), MissingPerson.deleteMany(), Feedback.deleteMany(),
    IncidentReport.deleteMany(), DisasterStatus.deleteMany(),
  ]);
  console.log('🗑️  Cleared all collections');

  // ── Users ─────────────────────────────────────────────────────────────────
  const users = await User.create([
    { name: 'Command Admin', email: 'admin@reliefpulse.in', password: 'admin123', role: 'admin', phone: '9000000001' },
    { name: 'Volunteer Priya', email: 'priya@reliefpulse.in', password: 'Volunteer@1', role: 'volunteer', phone: '9000000002' },
    { name: 'Rescue Lead Raju', email: 'raju@reliefpulse.in', password: 'Rescue@1234', role: 'rescue', phone: '9000000003' },
    { name: 'Dr. Anitha', email: 'anitha@reliefpulse.in', password: 'Doctor@1234', role: 'medical', phone: '9000000004' },
    { name: 'Shelter Mgr Suresh', email: 'suresh@reliefpulse.in', password: 'Shelter@123', role: 'shelter_admin', phone: '9000000005' },
    { name: 'Coordinator Kavya', email: 'kavya@reliefpulse.in', password: 'Relief@1234', role: 'coordinator', phone: '9000000006' },
    { name: 'Citizen Ramesh', email: 'ramesh@gmail.com', password: 'Citizen@123', role: 'citizen', phone: '9000000007' },
  ]);
  console.log(`👥 Created ${users.length} users`);

  // ── Disaster Status ────────────────────────────────────────────────────────
  await DisasterStatus.create({
    disasterName: 'Cyclone Michaung Impact & Storm Surge',
    riskLevel: 'High Risk',
    affectedDistricts: ['Visakhapatnam', 'Kakinada', 'East Godavari'],
    rainfallMm: 142,
    windSpeedKmh: 86,
    floodRisk: 'High',
    evacuatedCount: 12480,
    activeSosCount: 38,
    sheltersOpenCount: 17,
    bedsAvailableCount: 4280,
    ambulancesAvailableCount: 26,
  });
  console.log('🌊 Disaster status seeded');

  // ── Shelters ───────────────────────────────────────────────────────────────
  await Shelter.create([
    {
      name: 'St. Mary Disaster Evacuation Hub',
      address: 'St. Mary High School, MVP Colony, Visakhapatnam',
      city: 'Visakhapatnam',
      district: 'Visakhapatnam',
      location: { lat: 17.7231, lng: 83.3012 },
      totalCapacity: 600,
      currentOccupancy: 295,
      status: 'open',
      contactPerson: 'Suresh Sharma',
      contactPhone: '+91-8912345601',
      mealsAvailable: 850,
      waterBottles: 1600,
      medicalStaffAvailable: true,
      ambulancesCount: 3,
      routeStatus: 'Open',
      roadWarnings: ['Minor waterlogging on Sector 7 Road — use Route B High Ground Bypass'],
      recommendedRoute: 'Route B (High Ground Bypass via NH-16)',
      amenities: { hasFood: true, hasMedical: true, hasPowerBackup: true, hasCleanWater: true, hasBedding: true, hasWheelchairAccess: true, hasChildcare: true },
    },
    {
      name: 'NDRF Temporary Relief Camp — Gajuwaka',
      address: 'Gajuwaka Community Ground, Visakhapatnam',
      city: 'Visakhapatnam',
      district: 'Visakhapatnam',
      location: { lat: 17.6828, lng: 83.2186 },
      totalCapacity: 800,
      currentOccupancy: 560,
      status: 'limited',
      contactPerson: 'Ramesh Naidu',
      contactPhone: '+91-8912345602',
      mealsAvailable: 1100,
      waterBottles: 2000,
      medicalStaffAvailable: true,
      ambulancesCount: 4,
      routeStatus: 'Caution',
      roadWarnings: ['Gajuwaka Main Road flooded near Ward 14 — approach via Steel Plant Road'],
      recommendedRoute: 'Route A (Steel Plant Road)',
      amenities: { hasFood: true, hasMedical: true, hasPowerBackup: true, hasCleanWater: true, hasBedding: true, hasWheelchairAccess: false, hasChildcare: true },
    },
    {
      name: 'Kakinada Port Trust Community Hall',
      address: 'Port Trust Road, Kakinada',
      city: 'Kakinada',
      district: 'Kakinada',
      location: { lat: 16.9941, lng: 82.2475 },
      totalCapacity: 450,
      currentOccupancy: 310,
      status: 'open',
      contactPerson: 'Lakshmi Rao',
      contactPhone: '+91-8912345603',
      mealsAvailable: 600,
      waterBottles: 900,
      medicalStaffAvailable: true,
      ambulancesCount: 2,
      routeStatus: 'Open',
      roadWarnings: [],
      recommendedRoute: 'Direct Route via Beach Road',
      amenities: { hasFood: true, hasMedical: true, hasPowerBackup: false, hasCleanWater: true, hasBedding: true, hasWheelchairAccess: true, hasChildcare: false },
    },
    {
      name: 'Bheemunipatnam Cyclone Shelter',
      address: 'Beach Road, Bheemunipatnam, Visakhapatnam District',
      city: 'Bheemunipatnam',
      district: 'Visakhapatnam',
      location: { lat: 17.8947, lng: 83.4562 },
      totalCapacity: 350,
      currentOccupancy: 180,
      status: 'open',
      contactPerson: 'Venkat Reddy',
      contactPhone: '+91-8912345604',
      mealsAvailable: 500,
      waterBottles: 700,
      medicalStaffAvailable: false,
      ambulancesCount: 1,
      routeStatus: 'Open',
      roadWarnings: ['Coastal Road - watch for fallen trees'],
      recommendedRoute: 'Inland Route via Anakapalle Road',
      amenities: { hasFood: true, hasMedical: false, hasPowerBackup: true, hasCleanWater: true, hasBedding: true, hasWheelchairAccess: false, hasChildcare: false },
    },
    {
      name: 'East Godavari District Emergency Camp',
      address: 'Collectorate Grounds, Rajahmundry',
      city: 'Rajahmundry',
      district: 'East Godavari',
      location: { lat: 17.0005, lng: 81.8040 },
      totalCapacity: 1000,
      currentOccupancy: 720,
      status: 'limited',
      contactPerson: 'Anand Kumar',
      contactPhone: '+91-8912345605',
      mealsAvailable: 1500,
      waterBottles: 2500,
      medicalStaffAvailable: true,
      ambulancesCount: 5,
      routeStatus: 'Caution',
      roadWarnings: ['River Road flooded — use Highway 214 bypass', 'Godavari bridge weight restrictions in effect'],
      recommendedRoute: 'Highway 214 Inland Bypass',
      amenities: { hasFood: true, hasMedical: true, hasPowerBackup: true, hasCleanWater: true, hasBedding: true, hasWheelchairAccess: true, hasChildcare: true },
    },
  ]);
  console.log('🏠 Shelters seeded');

  // ── Hospitals ──────────────────────────────────────────────────────────────
  await Hospital.create([
    {
      name: 'King George Hospital (KGH)',
      address: 'Hospital Road, Maharanipeta, Visakhapatnam',
      district: 'Visakhapatnam',
      location: { lat: 17.7133, lng: 83.3089 },
      totalBeds: 1200,
      availableBeds: 87,
      icuBeds: 18,
      ambulances: 8,
      doctorsCount: 42,
      nursesCount: 96,
      bloodUnits: 120,
      essentialMedicineStatus: 'Available',
      status: 'Available',
      contactPhone: '+91-891-2564727',
    },
    {
      name: 'VIMS Visakhapatnam',
      address: 'Asilmetta, Visakhapatnam',
      district: 'Visakhapatnam',
      location: { lat: 17.7183, lng: 83.3180 },
      totalBeds: 600,
      availableBeds: 34,
      icuBeds: 8,
      ambulances: 5,
      doctorsCount: 28,
      nursesCount: 65,
      bloodUnits: 80,
      essentialMedicineStatus: 'Limited',
      status: 'Limited',
      contactPhone: '+91-891-2564991',
    },
    {
      name: 'Kakinada Government Hospital',
      address: 'Hospital Road, Kakinada',
      district: 'Kakinada',
      location: { lat: 16.9938, lng: 82.2483 },
      totalBeds: 400,
      availableBeds: 45,
      icuBeds: 10,
      ambulances: 6,
      doctorsCount: 22,
      nursesCount: 48,
      bloodUnits: 60,
      essentialMedicineStatus: 'Available',
      status: 'Available',
      contactPhone: '+91-884-2362323',
    },
    {
      name: 'Rajahmundry Government Hospital',
      address: 'T Nagar, Rajahmundry, East Godavari',
      district: 'East Godavari',
      location: { lat: 17.0050, lng: 81.8047 },
      totalBeds: 500,
      availableBeds: 28,
      icuBeds: 6,
      ambulances: 7,
      doctorsCount: 24,
      nursesCount: 55,
      bloodUnits: 45,
      essentialMedicineStatus: 'Critical',
      status: 'Critical',
      contactPhone: '+91-883-2431234',
    },
  ]);
  console.log('🏥 Hospitals seeded');

  // ── Rescue Teams ───────────────────────────────────────────────────────────
  await RescueTeam.create([
    {
      teamId: 'NDRF-7',
      leaderName: 'Suresh Raju',
      contactPhone: '+91-8912345670',
      rescuersCount: 12,
      specialization: 'Flood & Boat Rescue',
      status: 'En Route',
      currentAssignment: 'SOS RP-2026-00038 — Sector 14 Gajuwaka trapped family',
      assignedSosId: 'RP-2026-00038',
      currentLocation: { name: 'NH-16 Junction near Gajuwaka', lat: 17.6890, lng: 83.2250 },
      etaMinutes: 8,
    },
    {
      teamId: 'SDRF-VZG-3',
      leaderName: 'Priya Nair',
      contactPhone: '+91-8912345671',
      rescuersCount: 8,
      specialization: 'Structural Collapse',
      status: 'Available',
      currentAssignment: 'Standby at Marine Base Camp Sector 4',
      currentLocation: { name: 'Marine Base Camp', lat: 17.7100, lng: 83.2900 },
      etaMinutes: 0,
    },
    {
      teamId: 'NDRF-12',
      leaderName: 'Vikram Singh',
      contactPhone: '+91-8912345672',
      rescuersCount: 10,
      specialization: 'Medical Evacuation',
      status: 'On Scene',
      currentAssignment: 'Medical evacuation — Bheemunipatnam coastal village',
      assignedSosId: 'RP-2026-00022',
      currentLocation: { name: 'Bheemunipatnam Coastal Village', lat: 17.8900, lng: 83.4530 },
      etaMinutes: 0,
    },
    {
      teamId: 'SDRF-KKD-1',
      leaderName: 'Anand Verma',
      contactPhone: '+91-8912345673',
      rescuersCount: 6,
      specialization: 'Flood & Boat Rescue',
      status: 'Assigned',
      currentAssignment: 'SOS RP-2026-00051 — Kakinada Fisherman colony water rescue',
      assignedSosId: 'RP-2026-00051',
      currentLocation: { name: 'Kakinada Staging Point', lat: 16.9970, lng: 82.2420 },
      etaMinutes: 14,
    },
    {
      teamId: 'NDRF-RAAJ-5',
      leaderName: 'Meera Krishnan',
      contactPhone: '+91-8912345674',
      rescuersCount: 8,
      specialization: 'Flood & Boat Rescue',
      status: 'Available',
      currentAssignment: 'Standby at Rajahmundry Collectorate',
      currentLocation: { name: 'Rajahmundry Staging Point', lat: 17.0020, lng: 81.8010 },
      etaMinutes: 0,
    },
  ]);
  console.log('🚑 Rescue teams seeded');

  // ── Resources / Relief Inventory ───────────────────────────────────────────
  await Resource.create([
    { category: 'Meals', itemName: 'Hot Cooked Meals', availableQuantity: 8200, requiredQuantity: 12000, unit: 'servings', warehouseName: 'Visakhapatnam Central Depot', warehouseLocation: { lat: 17.7150, lng: 83.2980 } },
    { category: 'Drinking Water', itemName: '1L Water Bottles', availableQuantity: 14000, requiredQuantity: 20000, unit: 'bottles', warehouseName: 'Visakhapatnam Central Depot', warehouseLocation: { lat: 17.7150, lng: 83.2980 } },
    { category: 'Ready-to-Eat Food', itemName: 'Ready-to-Eat Meal Packs', availableQuantity: 3800, requiredQuantity: 8000, unit: 'packs', warehouseName: 'Kakinada Forward Supply Base', warehouseLocation: { lat: 16.9960, lng: 82.2460 } },
    { category: 'Baby Food', itemName: 'Infant Formula & Baby Food', availableQuantity: 420, requiredQuantity: 800, unit: 'kits', warehouseName: 'Kakinada Forward Supply Base', warehouseLocation: { lat: 16.9960, lng: 82.2460 } },
    { category: 'Blankets', itemName: 'Thermal Blankets', availableQuantity: 5600, requiredQuantity: 8000, unit: 'pieces', warehouseName: 'Rajahmundry Regional Depot', warehouseLocation: { lat: 17.0030, lng: 81.8020 } },
    { category: 'First-Aid Kits', itemName: 'Emergency First-Aid Kit', availableQuantity: 310, requiredQuantity: 600, unit: 'kits', warehouseName: 'Visakhapatnam Central Depot', warehouseLocation: { lat: 17.7150, lng: 83.2980 } },
    { category: 'Medicines', itemName: 'Essential Medicines Pack', availableQuantity: 180, requiredQuantity: 500, unit: 'packs', warehouseName: 'KGH Hospital Store', warehouseLocation: { lat: 17.7133, lng: 83.3089 } },
    { category: 'Hygiene Kits', itemName: 'Hygiene & Sanitation Kit', availableQuantity: 2200, requiredQuantity: 4000, unit: 'kits', warehouseName: 'Visakhapatnam Central Depot', warehouseLocation: { lat: 17.7150, lng: 83.2980 } },
  ]);
  console.log('📦 Resources seeded');

  // ── Emergency Requests (SOS) ───────────────────────────────────────────────
  await EmergencyRequest.create([
    {
      sosId: 'REQ1024',
      victimName: 'K. Ramesh',
      phone: '9876543210',
      disasterType: 'flood',
      assistanceType: 'rescue',
      assistanceRequired: ['food', 'medical', 'shelter', 'rescue'],
      severity: 'critical',
      priorityScore: 94,
      triageReason: 'Flood waters rising, 8 people stranded with 1 injured person and 2 children. Immediate boat rescue and medical attention required.',
      medicalEmergency: true,
      location: { address: 'Plot 18, Low-Lying Sector 4, MVP Colony', city: 'Visakhapatnam', district: 'Visakhapatnam', coordinates: { lat: 17.7265, lng: 83.3080 } },
      peopleCount: 8,
      vulnerablePeople: { children: 2, elderly: 1, injured: 1, disabled: 0, pregnant: 0 },
      description: 'Flood water reached first floor. 8 people including 2 children and 1 injured elderly grandfather. No food or clean water.',
      status: 'assigned',
      assignedTeam: { teamId: 'ALPHA-RESCUE-1', leader: 'Suresh Raju', contact: '+91-8912345670', etaMinutes: 6 },
      recommendedShelter: { name: 'St. Mary Disaster Evacuation Hub', distance: '1.2 km', availableBeds: 305 },
      rescueTimeline: [
        { stage: 'Request Received', notes: 'Emergency distress registered in Platform Command Center.', completed: true },
        { stage: 'Volunteer Assigned', notes: 'Alpha Rapid Response & Volunteer Suresh Raju assigned.', completed: true },
        { stage: 'Assistance Arriving', notes: 'Rescue boat and paramedic team en route. ETA 6 mins.', completed: true },
        { stage: 'Completed', notes: 'Evacuation to Safe Shelter in progress.', completed: false },
      ],
    },
    {
      sosId: 'REQ1023',
      victimName: 'Anitha Sharma',
      phone: '9876543211',
      disasterType: 'other',
      assistanceType: 'medical',
      assistanceRequired: ['medical', 'food'],
      severity: 'high',
      priorityScore: 78,
      triageReason: 'Diabetic patient requiring insulin and trauma care following building wall collapse.',
      medicalEmergency: true,
      location: { address: 'Flat 302, Gajuwaka Main Road', city: 'Visakhapatnam', district: 'Visakhapatnam', coordinates: { lat: 17.6890, lng: 83.2190 } },
      peopleCount: 3,
      vulnerablePeople: { children: 0, elderly: 1, injured: 1, disabled: 0, pregnant: 0 },
      description: 'Grandmother sustained deep cut from broken glass during gale. Need urgent first aid and dressing.',
      status: 'pending',
      recommendedShelter: { name: 'NDRF Temporary Relief Camp — Gajuwaka', distance: '0.8 km', availableBeds: 240 },
      rescueTimeline: [
        { stage: 'Request Received', notes: 'Request received and queued for medical response unit.', completed: true },
        { stage: 'Volunteer Assigned', notes: 'Medical volunteer dispatch pending.', completed: false },
        { stage: 'Assistance Arriving', notes: 'Ambulance dispatch awaiting confirmation.', completed: false },
        { stage: 'Completed', notes: 'Care delivery pending.', completed: false },
      ],
    },
    {
      sosId: 'REQ1022',
      victimName: 'M. Venkat',
      phone: '9876543212',
      disasterType: 'cyclone',
      assistanceType: 'shelter',
      assistanceRequired: ['shelter', 'food'],
      severity: 'moderate',
      priorityScore: 52,
      triageReason: 'Temporary tin roof blown off by cyclone winds. Family of 4 safe but requiring dry shelter and food.',
      medicalEmergency: false,
      location: { address: 'Near Bheemili Beach Road', city: 'Bheemunipatnam', district: 'Visakhapatnam', coordinates: { lat: 17.8930, lng: 83.4540 } },
      peopleCount: 4,
      vulnerablePeople: { children: 1, elderly: 0, injured: 0, disabled: 0, pregnant: 0 },
      description: 'Roof damaged by falling tree branch. No injuries, seeking nearest shelter with available beds.',
      status: 'resolved',
      assignedTeam: { teamId: 'VOLUNTEER-PRIYA', leader: 'Priya Volunteer', contact: '+91-8912345602', etaMinutes: 0 },
      recommendedShelter: { name: 'Bheemunipatnam Cyclone Shelter', distance: '1.5 km', availableBeds: 170 },
      rescueTimeline: [
        { stage: 'Request Received', notes: 'Distress call registered.', completed: true },
        { stage: 'Volunteer Assigned', notes: 'Volunteer Priya arrived.', completed: true },
        { stage: 'Assistance Arriving', notes: 'Transport provided to Bheemili Shelter.', completed: true },
        { stage: 'Completed', notes: 'Family safely relocated to Bheemili Shelter.', completed: true },
      ],
    },
    {
      sosId: 'RP-2026-00038',
      victimName: 'Ramesh Yadav',
      phone: '9876543201',
      disasterType: 'cyclone',
      assistanceType: 'rescue',
      severity: 'critical',
      priorityScore: 92,
      triageReason: 'Elderly persons and infant trapped. Rising water on ground floor. Immediate rescue required. (AI-assisted triage — requires human verification.)',
      medicalEmergency: false,
      location: { address: 'H.No. 4-15, Sector 14, Gajuwaka', city: 'Visakhapatnam', district: 'Visakhapatnam', coordinates: { lat: 17.6870, lng: 83.2234 } },
      peopleCount: 5,
      vulnerablePeople: { children: 1, elderly: 2, injured: 0, disabled: 0, pregnant: 0 },
      description: 'Water has reached chest level on ground floor. Elderly mother and grandfather unable to climb stairs. Baby present.',
      status: 'en_route',
      assignedTeam: { teamId: 'NDRF-7', leader: 'Suresh Raju', contact: '+91-8912345670', etaMinutes: 8 },
      rescueTimeline: [
        { stage: 'SOS Received', notes: 'SOS logged at command center.', completed: true },
        { stage: 'GPS Captured', notes: 'Location pinned: H.No. 4-15, Sector 14, Gajuwaka.', completed: true },
        { stage: 'AI Triage Completed', notes: 'Priority Score: 92/100 — CRITICAL.', completed: true },
        { stage: 'Rescue Team Assigned', notes: 'NDRF-7 Alpha Squad dispatched.', completed: true },
        { stage: 'Ambulance En Route', notes: 'AMB-VZG-03. ETA ~8 mins.', completed: true },
        { stage: 'Estimated Arrival', notes: 'ETA 8 minutes. Signal with torch or phone light.', completed: false },
      ],
    },
    {
      sosId: 'RP-2026-00022',
      victimName: 'Sravani Devi',
      phone: '9876543202',
      disasterType: 'cyclone',
      assistanceType: 'medical',
      severity: 'critical',
      priorityScore: 88,
      medicalEmergency: true,
      triageReason: 'Pregnant woman in labour during cyclone. Immediate medical evacuation required. (AI-assisted triage — requires human verification.)',
      location: { address: 'Beach Colony, Bheemunipatnam', city: 'Bheemunipatnam', district: 'Visakhapatnam', coordinates: { lat: 17.8920, lng: 83.4550 } },
      peopleCount: 2,
      vulnerablePeople: { children: 0, elderly: 0, injured: 0, disabled: 0, pregnant: 1 },
      description: 'Pregnant woman in labour, husband cannot drive in storm conditions. Need ambulance immediately.',
      status: 'on_scene',
      assignedTeam: { teamId: 'NDRF-12', leader: 'Vikram Singh', contact: '+91-8912345672', etaMinutes: 0 },
    },
    {
      sosId: 'RP-2026-00051',
      victimName: 'Fisherman Colony Kakinada',
      phone: '9876543203',
      disasterType: 'cyclone',
      assistanceType: 'evacuation',
      severity: 'high',
      priorityScore: 75,
      medicalEmergency: false,
      triageReason: 'Multiple families stranded in low-lying fisherman colony. (AI-assisted triage — requires human verification.)',
      location: { address: 'Fisherman Colony, North Beach Road, Kakinada', city: 'Kakinada', district: 'Kakinada', coordinates: { lat: 16.9920, lng: 82.2520 } },
      peopleCount: 28,
      vulnerablePeople: { children: 7, elderly: 4, injured: 1, disabled: 1, pregnant: 0 },
      description: '28 people stranded including children and elderly. Water 3 feet deep. Boats needed for evacuation.',
      status: 'assigned',
      assignedTeam: { teamId: 'SDRF-KKD-1', leader: 'Anand Verma', contact: '+91-8912345673', etaMinutes: 14 },
    },
  ]);
  console.log('🆘 Emergency SOS requests seeded');

  // ── Disaster Alerts ────────────────────────────────────────────────────────
  await DisasterAlert.create([
    {
      title: 'CYCLONE ALERT — HIGH RISK',
      disasterType: 'cyclone',
      severity: 'critical',
      affectedAreas: ['Visakhapatnam', 'Kakinada', 'East Godavari'],
      message: 'Cyclone Michaung is making landfall near Visakhapatnam coast. Wind speeds 86 km/h. All coastal areas must evacuate immediately to designated shelters.',
      evacuationRequired: true,
      emergencyHelpline: '1070',
      isActive: true,
    },
    {
      title: 'FLOOD WARNING — KAKINADA',
      disasterType: 'flood',
      severity: 'critical',
      affectedAreas: ['Kakinada', 'East Godavari'],
      message: 'River Godavari water level at DANGER MARK. Low-lying areas of Kakinada and East Godavari must evacuate within 2 hours.',
      evacuationRequired: true,
      emergencyHelpline: '1070',
      isActive: true,
    },
    {
      title: 'ROAD CLOSURE — NH-16 BYPASS',
      disasterType: 'cyclone',
      severity: 'warning',
      affectedAreas: ['Visakhapatnam'],
      message: 'NH-16 near Gajuwaka flooded. Use Steel Plant Road as alternate route. Do not attempt crossing on foot.',
      evacuationRequired: false,
      emergencyHelpline: '112',
      isActive: true,
    },
    {
      title: 'SHELTER CAPACITY ALERT',
      disasterType: 'cyclone',
      severity: 'warning',
      affectedAreas: ['Visakhapatnam'],
      message: 'Gajuwaka NDRF Camp at 70% capacity. Redirecting new evacuees to St. Mary Evacuation Hub (305 beds available).',
      evacuationRequired: false,
      emergencyHelpline: '1070',
      isActive: true,
    },
    {
      title: 'ELECTRICITY RESTORATION UPDATE',
      disasterType: 'weather_warning',
      severity: 'advisory',
      affectedAreas: ['Visakhapatnam'],
      message: 'Power restored to Sectors 1–6, MVP Colony. Sectors 7–14 still without power. Estimated restoration: 6 hours.',
      evacuationRequired: false,
      emergencyHelpline: '112',
      isActive: true,
    },
  ]);
  console.log('🚨 Disaster alerts seeded');

  // ── Missing Persons ────────────────────────────────────────────────────────
  await MissingPerson.create([
    { name: 'Krishnamurthy B.', age: 68, gender: 'Male', lastKnownLocation: 'Gajuwaka Ward 14, Visakhapatnam', district: 'Visakhapatnam', clothingDescription: 'White dhoti, blue checked shirt', status: 'Missing', matchConfidence: 0, contactPersonName: 'Sita Rao', contactPhone: '9876501001' },
    { name: 'Baby Lakshmi (infant)', age: 0, gender: 'Female', lastKnownLocation: 'Fisherman Colony, Kakinada', district: 'Kakinada', clothingDescription: 'Yellow frock, pink blanket', status: 'Possible Match', matchConfidence: 87, lastSeenShelter: 'Kakinada Port Trust Community Hall', contactPersonName: 'Venkat S.', contactPhone: '9876501002' },
    { name: 'Mohammed Salim', age: 34, gender: 'Male', lastKnownLocation: 'Bheemunipatnam Beach Road', district: 'Visakhapatnam', clothingDescription: 'Red T-shirt, jeans', status: 'Missing', matchConfidence: 0, contactPersonName: 'Fatima Salim', contactPhone: '9876501003' },
  ]);
  console.log('👨‍👩‍👧 Missing persons seeded');

  // ── Incident Reports ───────────────────────────────────────────────────────
  await IncidentReport.create([
    { category: 'Flooded Road', description: 'NH-16 near Gajuwaka flyover: 4 feet of water. No vehicles possible.', location: { address: 'NH-16 near Gajuwaka Flyover', district: 'Visakhapatnam', lat: 17.6910, lng: 83.2200 }, severity: 'Critical', reportedBy: { name: 'Traffic Officer Reddy', phone: '9876500101' }, status: 'Verified', roadStatusNote: 'Flooded — use Steel Plant Road diversion' },
    { category: 'Damaged Building', description: 'Old 3-storey apartment partially collapsed near Kakinada Beach Road. Residents evacuated.', location: { address: 'Kakinada Beach Road, Ward 7', district: 'Kakinada', lat: 16.9930, lng: 82.2510 }, severity: 'High', reportedBy: { name: 'SDRF Observer', phone: '9876500102' }, status: 'In Progress' },
    { category: 'Blocked Road', description: 'Fallen tree blocking Bheemunipatnam road near temple junction.', location: { address: 'Temple Junction, Bheemunipatnam', district: 'Visakhapatnam', lat: 17.8940, lng: 83.4540 }, severity: 'Moderate', reportedBy: { name: 'Citizen Report', phone: '' }, status: 'Open' },
  ]);
  console.log('⚠️  Incident reports seeded');

  // ── Feedback ───────────────────────────────────────────────────────────────
  await Feedback.create([
    { shelterName: 'St. Mary Disaster Evacuation Hub', survivorName: 'Padma Rao', cleanlinessRating: 4, foodRating: 5, medicalRating: 4, staffResponseRating: 5, comments: 'Staff are very helpful. Food is good, three meals per day.', wasResolved: true },
    { shelterName: 'NDRF Temporary Relief Camp — Gajuwaka', survivorName: 'Anon Survivor', cleanlinessRating: 3, foodRating: 3, medicalRating: 4, staffResponseRating: 4, comments: 'Needs more toilets. Medical team very quick to help. Blankets distributed.', wasResolved: true },
    { shelterName: 'Kakinada Port Trust Community Hall', survivorName: 'Ravi Kumar', cleanlinessRating: 4, foodRating: 4, medicalRating: 3, staffResponseRating: 4, comments: 'Power was out for 4 hours but generator came on. Appreciate the effort.', wasResolved: true },
  ]);
  console.log('⭐ Feedback seeded');

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ✅ ReliefPulse Database Seed Complete!                ');
  console.log('  📧 Admin Login: admin@reliefpulse.in / Admin@1234     ');
  console.log('  👤 Citizen Login: ramesh@gmail.com / Citizen@123      ');
  console.log('  🌊 Cyclone Michaung scenario: 5 shelters, 4 hospitals  ');
  console.log('  🚑 5 rescue teams, 8 resource types, 3 active SOS     ');
  console.log('═══════════════════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
