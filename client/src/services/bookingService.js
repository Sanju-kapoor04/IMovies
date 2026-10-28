import api from './api';

export const bookingService = {
  async createBooking(data) {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  async getMyBookings() {
    const res = await api.get('/bookings/my');
    return res.data.bookings;
  },

  async getBookingById(id) {
    const res = await api.get(`/bookings/${id}`);
    return res.data.booking;
  },

  async cancelBooking(id, reason = 'Cancelled by customer') {
    const res = await api.patch(`/bookings/${id}/cancel`, { reason });
    return res.data;
  },
};
