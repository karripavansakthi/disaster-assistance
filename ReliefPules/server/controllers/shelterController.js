const Shelter = require('../models/Shelter');

// Haversine distance calculator in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
};

// @desc    Get all shelters with filter & search
// @route   GET /api/shelters
// @access  Public
const getShelters = async (req, res, next) => {
  try {
    const { status, city, search, amenity } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (amenity) filter[`amenities.${amenity}`] = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const shelters = await Shelter.find(filter).sort({ status: 1, currentOccupancy: 1 });

    res.status(200).json({
      success: true,
      count: shelters.length,
      shelters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearest shelters based on GPS coordinates
// @route   GET /api/shelters/nearby?lat=...&lng=...
// @access  Public
const getNearbyShelters = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid numerical lat and lng query parameters.',
      });
    }

    const shelters = await Shelter.find({ status: { $ne: 'closed' } });

    // Calculate distance for each shelter
    const sheltersWithDistance = shelters.map((s) => {
      const distance = calculateDistance(lat, lng, s.location.lat, s.location.lng);
      return {
        ...s.toObject(),
        distanceKm: distance,
      };
    });

    // Sort by proximity
    sheltersWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({
      success: true,
      userLocation: { lat, lng },
      count: sheltersWithDistance.length,
      shelters: sheltersWithDistance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single shelter by ID
// @route   GET /api/shelters/:id
// @access  Public
const getShelterById = async (req, res, next) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found',
      });
    }

    res.status(200).json({
      success: true,
      shelter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new safe shelter
// @route   POST /api/shelters
// @access  Private / Shelter Manager or Admin
const createShelter = async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      district,
      location,
      totalCapacity,
      currentOccupancy,
      contactPerson,
      contactPhone,
      amenities,
      reliefStock,
      notes,
    } = req.body;

    if (!name || !address || !city || !totalCapacity || !contactPerson || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, address, city, capacity, and contact person/phone.',
      });
    }

    const shelter = await Shelter.create({
      name,
      address,
      city,
      district: district || '',
      location: location || { lat: 17.6868, lng: 83.2185 },
      totalCapacity: Number(totalCapacity),
      currentOccupancy: Number(currentOccupancy) || 0,
      contactPerson,
      contactPhone,
      amenities: amenities || {},
      reliefStock: reliefStock || {},
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Shelter registered successfully',
      shelter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shelter occupancy or relief stock
// @route   PATCH /api/shelters/:id/occupancy
// @access  Private / Volunteers / Shelter Managers / Admins
const updateShelterOccupancy = async (req, res, next) => {
  try {
    const { currentOccupancy, status, reliefStock } = req.body;

    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found',
      });
    }

    if (currentOccupancy !== undefined) {
      shelter.currentOccupancy = Math.max(0, Number(currentOccupancy));
      // Auto-update status if not explicitly overridden
      if (!status) {
        if (shelter.currentOccupancy >= shelter.totalCapacity) {
          shelter.status = 'full';
        } else if (shelter.currentOccupancy >= shelter.totalCapacity * 0.85) {
          shelter.status = 'limited';
        } else {
          shelter.status = 'open';
        }
      }
    }

    if (status) shelter.status = status;
    if (reliefStock) shelter.reliefStock = { ...shelter.reliefStock, ...reliefStock };

    await shelter.save();

    res.status(200).json({
      success: true,
      message: 'Shelter updated successfully',
      shelter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-ranked Shelter Recommendations for a Victim
// @route   GET /api/shelters/ai-recommendation?lat=...&lng=...&peopleCount=...&needMedical=...
// @access  Public
const getAiShelterRecommendations = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 17.6868;
    const lng = parseFloat(req.query.lng) || 83.2185;
    const peopleCount = Math.max(1, parseInt(req.query.peopleCount) || 1);
    const needMedical = req.query.needMedical === 'true' || req.query.needMedical === '1';

    const shelters = await Shelter.find({ status: { $ne: 'closed' } });

    const scoredShelters = shelters.map((s) => {
      const distance = calculateDistance(lat, lng, s.location.lat, s.location.lng);
      const capacity = s.totalCapacity || 100;
      const occupied = s.currentOccupancy || 0;
      const availableBeds = Math.max(0, capacity - occupied);
      const availabilityPct = Math.round((availableBeds / capacity) * 100);

      // Score components:
      // 1. Distance Score (0 to 35 pts): 35 if <= 1km, 0 if >= 30km
      let distanceScore = Math.max(0, Math.round(35 * (1 - Math.min(distance, 30) / 30)));

      // 2. Bed Availability Score (0 to 30 pts)
      let capacityScore = Math.round((availabilityPct / 100) * 30);
      if (availableBeds < peopleCount) {
        capacityScore = Math.max(0, capacityScore - 20);
      }

      // 3. Medical Readiness Score (0 to 20 pts)
      let medicalScore = 0;
      const hasMedical = !!(s.medicalStaffAvailable || s.amenities?.hasMedical || s.ambulancesCount > 0);
      if (needMedical) {
        medicalScore = hasMedical ? 20 : 0;
      } else {
        medicalScore = hasMedical ? 15 : 8;
      }

      // 4. Resources & Route Safety (0 to 15 pts)
      let resourceScore = 0;
      if (s.amenities?.hasFood || s.mealsAvailable > 100) resourceScore += 5;
      if (s.amenities?.hasCleanWater || s.waterBottles > 200) resourceScore += 5;
      if (s.routeStatus === 'Open') resourceScore += 5;
      else if (s.routeStatus === 'Caution') resourceScore += 2;

      // Total Match Score clamped to 25..98%
      const totalScore = Math.min(98, Math.max(25, distanceScore + capacityScore + medicalScore + resourceScore));

      const reasons = [];
      if (distance <= 3) reasons.push(`Close proximity (${distance} km)`);
      if (availabilityPct >= 50) reasons.push(`High bed availability (${availabilityPct}%)`);
      if (hasMedical) reasons.push('Medical staff on-site');
      if (s.amenities?.hasFood) reasons.push('Meals & clean water ready');

      return {
        _id: s._id,
        name: s.name,
        address: s.address,
        city: s.city,
        distanceKm: distance,
        totalCapacity: capacity,
        currentOccupancy: occupied,
        availableBeds,
        availabilityPct,
        medicalAvailable: hasMedical,
        foodAvailable: !!(s.amenities?.hasFood || s.mealsAvailable > 0),
        waterAvailable: !!(s.amenities?.hasCleanWater || s.waterBottles > 0),
        routeStatus: s.routeStatus || 'Open',
        recommendedRoute: s.recommendedRoute || 'Main Highway Route',
        score: totalScore,
        aiRationale: `Score ${totalScore}%: ${reasons.slice(0, 3).join(' · ')}`,
        contactPerson: s.contactPerson,
        contactPhone: s.contactPhone,
        location: s.location,
      };
    });

    // Sort by AI Match Score descending
    scoredShelters.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      count: scoredShelters.length,
      recommendations: scoredShelters.slice(0, 5),
      all: scoredShelters,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShelters,
  getNearbyShelters,
  getShelterById,
  createShelter,
  updateShelterOccupancy,
  getAiShelterRecommendations,
};
