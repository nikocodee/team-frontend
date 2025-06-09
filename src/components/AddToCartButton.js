import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/reservationApi";
import { v4 as uuidv4 } from "uuid";

function AddToCartButton({ data, productType }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rsvCnt, setRsvCnt] = useState(1); // 수량 상태 추가

  const handleReservation = () => {
    setIsModalOpen(true);
  };

  const handleProceedToConfirm = () => {
    setIsConfirmOpen(true);
    setIsModalOpen(false);
  };

  const handleConfirmReservation = async () => {
    try {
      const memberId = localStorage.getItem("memberId") || 1;
      const generatedUuid = uuidv4();

      const reservationData =
        productType === "caregiver"
          ? {
              rsvId: generatedUuid,
              memberId,
              prodType: 3, // 요양사
              prodId: data.caregiverId,
              prodNm: data.introduction,
              prodDetail: [
                data.username,
                data.certificates,
                data.educationLevel,
                data.hopeEmploymentType,
                data.hopeWorkAreaLocation,
                data.hopeWorkAreaCity,
                data.hopeWorkPlace,
                data.hopeWorkType,
              ]
                .filter(Boolean)
                .join(" "),
              prodPrice: data.hopeWorkAmount,
              rsvType: 1, // 결제전
              rsvCnt,
            }
          : {
              rsvId: generatedUuid,
              memberId,
              prodType: productType === "silvertown" ? 2 : 1, // 실버타운:2, 요양원:1
              prodId: data.facilityId,
              prodNm: data.facilityName,
              prodDetail: [
                data.facilityTheme,
                data.facilityPhone,
                data.facilityAddressLocation,
                data.facilityAddressCity,
                data.facilityDetailAddress,
                data.facilityHomepage,
              ]
                .filter(Boolean)
                .join(" "),
              prodPrice: data.facilityCharge,
              rsvType: 1, // 결제전
              rsvCnt,
            };

      await createReservation(reservationData);

      alert("예약이 완료되었습니다!");

      navigate(`/reservation/member/${memberId}`);

      setIsConfirmOpen(false);
    } catch (err) {
      alert("예약에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <button onClick={handleReservation}>예약하기</button>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>예약할 수량을 선택하세요</h3>
            <button onClick={() => setRsvCnt(Math.max(1, rsvCnt - 1))}>
              -
            </button>
            <span>{rsvCnt}</span>
            <button onClick={() => setRsvCnt(rsvCnt + 1)}>+</button>
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleProceedToConfirm}>확인</button>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              minWidth: "300px",
            }}
          >
            <h3>예약을 진행하시겠습니까?</h3>
            <button onClick={handleConfirmReservation}>확인</button>
            <button onClick={() => setIsConfirmOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddToCartButton;
