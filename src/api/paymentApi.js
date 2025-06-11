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
// export const getPaymentsByMemberId = async (memberId) => {
//   // try {
//   const response = await axios.get(`/api/payment/member/${memberId}`);
//   return response.data; // PaymentDTO 객체
//   // } catch (error) {
//   //   throw error.response?.data || error.message;
//   // }
// };

// 여러 건의 결제-예약 매핑을 한꺼번에 서버에 전달하는 함수
export const mapReservationsToPayment = async (mappingList) => {
  // mappingList: [{pymId: '결제id', rsvId: '예약id'}, ...]
  try {
    const response = await axios.post(`/api/payment/map`, mappingList);
    return response.data; // 예: "3건 매핑 완료"
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPaymentById = async (pymId) => {
  const response = await axios.get(`/api/payment/${pymId}`);
  return response.data;
};

export const getPaymentsByMemberId = async (memberId) => {
  const response = await axios.get(`/api/payment/payments/member/${memberId}`);
  return response.data;
};
