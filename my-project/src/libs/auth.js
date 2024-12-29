import axiosInstance from './axiosInstance';

const isAuthenticated = async () => {
  try {
    const response = await axiosInstance.get('/users/verify');
    return response; // Return the response for further checks
  } catch (error) {
    console.error('Authentication check failed:', error.response?.data?.message || error.message);
    throw new Error('Unauthorized'); // Explicitly throw an error
  }
};

export default isAuthenticated;
