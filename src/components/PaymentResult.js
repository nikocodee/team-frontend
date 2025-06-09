import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPaymentById } from "../api/paymentApi";

function PaymentResult() {
  const location = useLocation();
  const { pymId } = location.state || {};
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        if (!pymId) return;
        const result = await getPaymentById(pymId);
        setPaymentData(result);
      } catch (error) {
        console.error("결제 정보 조회 실패:", error);
      }
    };

    fetchPaymentData();
  }, [pymId]);

  if (!paymentData) return <div>결제 정보를 불러오는 중...</div>;

  const { pymId: id, pymMethod, pymDate, pymStatus, pymPrice, reservations } = paymentData;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        주문이 완료되었습니다
      </h2>

      <h3>결제 정보</h3>
      <div>주문번호: {id}</div>
      <div>결제 수단: {pymMethod === "card" ? "카드결제" : pymMethod}</div>
      <div>주문 일시: {new Date(pymDate).toLocaleString()}</div>
      <div>
        주문 상태:{" "}
        {pymStatus === 1
          ? "결제 완료"
          : pymStatus === 0
          ? "결제 대기"
          : "기타"}
      </div>
      <strong>총 결제 금액: {pymPrice?.toLocaleString()} 원</strong>

      <h3 style={{ marginTop: "30px" }}>주문 정보</h3>
      {reservations?.map((r, index) => (
        <div
          key={r.rsvId || index}
          style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
        >
          <div>상품명: {r.prodNm}</div>
          <div>수량: {r.rsvCnt ?? 1}</div>
          <div>상품 금액: {r.prodPrice?.toLocaleString()} 원</div>
        </div>
      ))}
    </div>
  );
}

export default PaymentResult;
