import api from './api';

export const movieService = {
  async getMovies(params = {}) {
    const res = await api.get('/movies', { params });
    return res.data;
  },

  async getMovieById(id) {
    const res = await api.get(`/movies/${id}`);
    return res.data.movie;
  },

  async searchMovies(q) {
    const res = await api.get('/movies/search', { params: { q } });
    return res.data.movies;
  },

  async getFilters() {
    const res = await api.get('/movies/meta/filters');
    return res.data;
  },

  async getCinemas(params = {}) {
    const res = await api.get('/cinemas', { params });
    return res.data.cinemas;
  },

  async getShows(params = {}) {
    const res = await api.get('/shows', { params });
    return res.data.shows;
  },

  async getShowSeats(showId) {
    const res = await api.get(`/shows/${showId}/seats`);
    return res.data;
  },
};
