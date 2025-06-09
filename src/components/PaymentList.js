import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaymentsByMemberId } from "../api/paymentApi";
import { getReservationsByPaymentId } from "../api/reservationApi";

function PaymentList() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [reservationsByPaymentId, setReservationsByPaymentId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentsAndReservations = async () => {
      try {
        setLoading(true);
        const paymentsResult = await getPaymentsByMemberId(memberId);
        const paymentsData = paymentsResult?.data || paymentsResult || [];
        setPayments(paymentsData);

        // 결제 건별 예약상품 조회
        const reservationsMap = {};
        await Promise.all(
          paymentsData.map(async (payment) => {
            const resResult = await getReservationsByPaymentId(payment.pymId);
            reservationsMap[payment.pymId] = resResult?.data || resResult || [];
          })
        );
        setReservationsByPaymentId(reservationsMap);
      } catch (err) {
        setError("결제 내역 또는 예약 정보를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchPaymentsAndReservations();
    } else {
      setError("회원 정보를 찾을 수 없습니다.");
      setLoading(false);
    }
  }, [memberId]);

  if (loading) return <div>결제 내역을 불러오는 중...</div>;
  if (error) return <div>{error}</div>;
  if (payments.length === 0) return <div>결제 내역이 없습니다.</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        회원님의 결제 내역
      </h2>

      {payments.map((payment) => (
        <div
          key={payment.pymId}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <div>주문번호: {payment.pymId}</div>
          <div>
            결제 수단:{" "}
            {payment.pymMethod === "card" ? "카드결제" : payment.pymMethod}
          </div>
          <div>주문 일시: {new Date(payment.pymDate).toLocaleString()}</div>
          <div>
            주문 상태:{" "}
            {payment.pymStatus === 1
              ? "결제 완료"
              : payment.pymStatus === 0
              ? "결제 대기"
              : "기타"}
          </div>
          <div>총 결제 금액: {payment.pymPrice?.toLocaleString()} 원</div>

          <h4 style={{ marginTop: "15px" }}>주문 상품 정보</h4>
          {reservationsByPaymentId[payment.pymId]?.length > 0 ? (
            reservationsByPaymentId[payment.pymId].map((reservation, idx) => (
              <div
                key={reservation.rsvId || idx}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <div>상품명: {reservation.prodNm}</div>
                <div>상품상세: {reservation.prodDetail}</div>
                <div>수량: {reservation.rsvCnt || 1}</div>
                <div>
                  상품 금액: {reservation.prodPrice?.toLocaleString()} 원
                </div>
              </div>
            ))
          ) : (
            <div>주문 상품 정보가 없습니다.</div>
          )}

          <button
            style={{ marginTop: "10px" }}
            onClick={() =>
              navigate("/payment-result", {
                state: {
                  pymId: payment.pymId,
                  memberId,
                  reservations: reservationsByPaymentId[payment.pymId],
                },
              })
            }
          >
            상세 보기
          </button>
        </div>
      ))}

      <button onClick={() => navigate(-1)}>뒤로 가기</button>
    </div>
  );
}

export default PaymentList;
