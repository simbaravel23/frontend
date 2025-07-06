import axios from 'axios';

// A URL base da sua API backend.
// Certifique-se de que o backend esteja rodando em http://localhost:3000
const API_BASE_URL = 'http://localhost:3000/api/movies';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getYearsWithMultipleWinners = () => api.get('/yearsWithMultipleWinners');
export const getStudiosWithWinCount = () => api.get('/studiosWithWinCount');
export const getMaxMinWinIntervalForProducers = () => api.get('/maxMinWinIntervalForProducers');
export const getWinnersByYear = (year) => api.get(`/winnersByYear?year=${year}`);
export const getAllMovies = (page = 0, size = 10, year = '', winner = '') => {
  return api.get('/', {
    params: {
      page,
      size,
      year: year || undefined, // Envia undefined se vazio para não filtrar
      winner: winner !== '' ? winner : undefined, // Envia undefined se vazio para não filtrar
    }
  });
};