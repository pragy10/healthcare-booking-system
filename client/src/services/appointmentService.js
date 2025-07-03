import api from './api';

class AppointmentService {
  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create appointment'
      };
    }
  }

  // Get patient appointments
  async getPatientAppointments(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/appointments/patient/my-appointments?${params.toString()}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointments'
      };
    }
  }

  // Get doctor appointments
  async getDoctorAppointments(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/appointments/doctor/my-appointments?${params.toString()}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointments'
      };
    }
  }

  // Get appointment by ID
  async getAppointmentById(id) {
    try {
      const response = await api.get(`/appointments/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointment'
      };
    }
  }

  // Update appointment status (Doctor only)
  async updateAppointmentStatus(id, statusData) {
    try {
      const response = await api.put(`/appointments/${id}/status`, statusData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update appointment'
      };
    }
  }

  // Cancel appointment
  async cancelAppointment(id, reason) {
    try {
      const response = await api.put(`/appointments/${id}/cancel`, {
        cancellationReason: reason
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel appointment'
      };
    }
  }
}

export default new AppointmentService();
