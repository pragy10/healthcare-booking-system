import api from './api';

class DoctorService {
  // Get all doctors with filters
  async getAllDoctors(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/doctors?${params.toString()}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch doctors'
      };
    }
  }

  // Get doctor by ID
  async getDoctorById(id) {
    try {
      const response = await api.get(`/doctors/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch doctor'
      };
    }
  }

  // Create doctor profile
  async createDoctorProfile(profileData) {
    try {
      const response = await api.post('/doctors/profile', profileData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create doctor profile'
      };
    }
  }

  // Get doctor's own profile
  async getDoctorProfile() {
    try {
      const response = await api.get('/doctors/profile');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch doctor profile'
      };
    }
  }

  // Update doctor profile
  async updateDoctorProfile(profileData) {
    try {
      const response = await api.put('/doctors/profile', profileData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update doctor profile'
      };
    }
  }
}

export default new DoctorService();
