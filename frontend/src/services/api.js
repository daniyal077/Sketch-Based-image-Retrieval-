import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const imageService = {
  findSimilar: async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    return api.post('/find_similar', formData);
  },

  generateSketch: async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    return api.post('/sketch', formData);
  },

  generateText: async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    return api.post('/generate_text', formData);
  }
};