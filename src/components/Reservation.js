import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReservationById,
  updateReservationCount,
} from "../api/reservationApi";
import { deleteReservation, deleteAllReservation } from "../api/reservationApi";

const Reservation = () => {
  const { memberId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();
  //페이지 처음 로딩될 때, 모든 상품의 총 결제 금액 표시
  const [totalSelectedPrice, setTotalSelectedPrice] = useState(() =>
    reservations.reduce(
      (sum, reservation) =>
        sum + (reservation.prodPrice || 0) * (reservation.rsvCnt || 1),
      0
    )
  );

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getReservationById(memberId);
        const fetchedReservations = Array.isArray(res) ? res : [res];
        setReservations(
          fetchedReservations.filter((item) => item.rsvType !== 2)
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setReservations([]);
        } else {
          console.error("예약 정보 불러오기 실패:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [memberId]);

  // 체크박스 선택에 따른 총 금액 업데이트
  useEffect(() => {
    const newTotalPrice = reservations.some(
      (reservation) => checkedItems[reservation.rsvId]
    ) //체크박스가 선택되면 선택된 상품만 반영되고, 그렇지 않으면 전체 상품 가격을 유지
      ? reservations.filter((reservation) => checkedItems[reservation.rsvId])
      : reservations;

    setTotalSelectedPrice(
      //가격 업데이트
      newTotalPrice.reduce(
        (sum, reservation) =>
          sum + (reservation.prodPrice || 0) * (reservation.rsvCnt || 1),
        0
      )
    );
  }, [checkedItems, reservations]);

  const handleCheckboxChange = (rsvId, isChecked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [rsvId]: isChecked,
    }));
  };

  const handleSingleDelete = async (rsvId) => {
    if (!checkedItems[rsvId]) {
      alert("삭제할 항목을 체크해주세요.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteReservation(rsvId);
        alert("예약이 삭제되었습니다.");
      } catch (err) {
        if (err.response && err.response.status !== 404) {
          alert("삭제 중 오류가 발생했습니다.");
          console.error("삭제 실패:", err);
          return;
        }
      }
    }

    try {
      const res = await getReservationById(memberId);
      const fetchedReservations = Array.isArray(res) ? res : [res];
      setReservations(fetchedReservations.filter((item) => item.rsvType !== 2));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 404가 발생하면 예약이 없음 → 오류 메시지 없이 목록을 초기화
        setReservations([]);
      } else {
        console.error("예약 정보 갱신 실패", err);
        alert("예약 목록을 불러오는 데 문제가 발생했습니다.");
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("모든 예약을 정말 삭제하시겠습니까?")) {
      try {
        await deleteAllReservation();
        setReservations([]);
        setCheckedItems({});
        alert("모든 예약이 삭제되었습니다.");
      } catch (err) {
        console.error("전체 삭제 실패:", err);
        alert("전체 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDecreaseCount = (rsvId) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.rsvId === rsvId
          ? { ...res, rsvCnt: Math.max(1, res.rsvCnt - 1) }
          : res
      )
    );
  };

  const handleIncreaseCount = (rsvId) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.rsvId === rsvId ? { ...res, rsvCnt: (res.rsvCnt || 1) + 1 } : res
      )
    );
  };

  // total금액 계산
  // const totalPrice = reservations.reduce(
  //   (sum, reservation) =>
  //     sum + (reservation.prodPrice || 0) * (reservation.rsvCnt || 1),
  //   0
  // );

  const handlePayment = async () => {
    // 체크된 예약만 필터링
    const selectedReservations = reservations.filter(
      (r) => checkedItems[r.rsvId]
    );

    if (selectedReservations.length === 0) {
      alert("결제할 예약을 선택해 주세요.");
      return;
    }
    if (!window.confirm("정말 결제를 진행하시겠습니까?")) {
      // 사용자가 결제 취소했을 때
      return;
    }
    try {
      await updateReservationCount(selectedReservations);
      // 결제 페이지로 선택된 예약과 totalPrice 전달 (totalPrice도 선택된 예약 기준으로 다시 계산)
      const totalSelectedPrice = selectedReservations.reduce(
        (sum, Reservation) =>
          sum + (Reservation.prodPrice || 0) * (Reservation.rsvCnt || 1),
        0
      );

      navigate("/payment", {
        state: {
          reservations: selectedReservations,
          totalPrice: totalSelectedPrice,
        },
      });
    } catch (error) {
      alert("수량 업데이트 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>로딩 중...</div>
    );

  if (reservations.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        예약 정보가 없습니다.
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>예약 목록</h2>

      {reservations
        .filter((item) => item.rsvType !== 2)
        .map((reservation) => (
          <div
            key={reservation.rsvId}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            {/* <label
               style={{
                 // display: "flex",
                 alignItems: "center",
                 gap: "10px",
                 marginBottom: "10px",
                 }}
                 > */}
            <input
              type="checkbox"
              checked={!!checkedItems[reservation.rsvId]}
              onChange={(e) =>
                handleCheckboxChange(reservation.rsvId, e.target.checked)
              }
            />
            <div>
              <img
                src={reservation.prodPhoto || "/images/default.png"}
                alt="상품이미지"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
            <div>상품명: {reservation.prodNm}</div>
            {/* </label> */}
            <div>예약 ID: {reservation.rsvId}</div>
            <div>회원 ID: {reservation.memberId}</div>
            <div>상품 ID: {reservation.prodId}</div>
            <div>
              상품 유형:{" "}
              {reservation.prodType === 1
                ? "요양기관"
                : reservation.prodType === 2
                ? "실버타운"
                : reservation.prodType === 3
                ? "요양사"
                : "알 수 없음"}
            </div>
            <div>
              상품 상세:
              <div
                style={{
                  marginLeft: "10px",
                  marginTop: "5px",
                  whiteSpace: "pre-line",
                }}
              >
                {reservation.prodDetail
                  ? reservation.prodDetail
                      .split(" ")
                      .map((word, idx) => <div key={idx}>{word}</div>)
                  : "정보 없음"}
              </div>
            </div>
            <div>
              수량:
              <button onClick={() => handleDecreaseCount(reservation.rsvId)}>
                -
              </button>
              {reservation.rsvCnt || 1}
              <button onClick={() => handleIncreaseCount(reservation.rsvId)}>
                +
              </button>
            </div>
            <div>
              상품 가격:{" "}
              {reservation.prodPrice
                ? reservation.prodPrice.toLocaleString()
                : "정보 없음"}
              원
            </div>
            <div>
              예약 유형: {reservation.rsvType === 1 ? "결제전" : "예약취소"}
            </div>
            <div>
              예약일:{" "}
              {reservation.rsvDate
                ? new Date(reservation.rsvDate).toLocaleString()
                : "예약일 정보 없음"}
            </div>
            <div>
              이용일:{" "}
              {reservation.prodDate
                ? new Date(reservation.prodDate).toLocaleDateString()
                : "미정"}
            </div>
            <button
              onClick={() => handleSingleDelete(reservation.rsvId)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "8px 12px",
              }}
            >
              삭제
            </button>
          </div>
        ))}
      <button
        onClick={handleDeleteAll}
        style={{
          display: "block",
          margin: "20px auto 0",
          padding: "12px 25px",
          fontSize: "16px",
        }}
      >
        전체 삭제
      </button>
      <div>총 결제 금액: {totalSelectedPrice.toLocaleString()} 원</div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => navigate(-1)}>쇼핑 계속하기</button>
        <button onClick={handlePayment}>결제</button>
      </div>
    </div>
  );
};

export default Reservation;
