import axios from "axios";

// export const updateReservationCount = async (reservations) => {
//   const response = await axios.put(`/api/reservation/update`, reservations)
//   return response.data
// }

// const API_BASE_URL = "http://localhost:8080";

export const createPayment = async (paymentData) => {
  const response = await axios.post(`/api/payment`, paymentData);
  return response.data;
};


// 결제 정보 조회 (GET)
export const getPaymentById = async (pymId) => {
  // try {
    const response = await axios.get(`/api/payment/${pymId}`);
    return response.data; // PaymentDTO 객체
  // } catch (error) {
  //   throw error.response?.data || error.message;
  // }
};