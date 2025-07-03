const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create doctor profile
// @route   POST /api/doctors/profile
// @access  Private (Doctor only)
const createDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualifications,
      experience,
      consultationFee,
      availability,
      hospital,
      about
    } = req.body;

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId: req.user.id });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists'
      });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: req.user.id,
      specialization,
      qualifications,
      experience,
      consultationFee,
      availability,
      hospital,
      about
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: { doctor: populatedDoctor }
    });
  } catch (error) {
    console.error('Create doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating doctor profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const {
      specialization,
      city,
      minFee,
      maxFee,
      rating,
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (city) {
      filter['hospital.city'] = { $regex: city, $options: 'i' };
    }
    
    if (minFee || maxFee) {
      filter.consultationFee = {};
      if (minFee) filter.consultationFee.$gte = Number(minFee);
      if (maxFee) filter.consultationFee.$lte = Number(maxFee);
    }
    
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Search functionality
    let userFilter = {};
    if (search) {
      userFilter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get doctors with user search
    let doctors;
    if (search) {
      const users = await User.find(userFilter).select('_id');
      const userIds = users.map(user => user._id);
      filter.userId = { $in: userIds };
    }

    doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Doctor.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        doctors,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors'
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone profileImage address');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor'
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating doctor profile'
    });
  }
};

// @desc    Get doctor's own profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor only)
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone profileImage address');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor profile'
    });
  }
};

module.exports = {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorProfile
};
