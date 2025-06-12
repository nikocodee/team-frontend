import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/reservationApi";
import { v4 as uuidv4 } from "uuid";

function CartButton({ data, productType }) {
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
              prodPhoto:
                Array.isArray(data.photos) && data.photos.length > 0
                  ? data.photos[0]
                  : "/images/default.png",
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
              // prodPhoto: data.photos?.[0] || null,
              prodPhoto:
                Array.isArray(data.photos) && data.photos.length > 0
                  ? data.photos[0]
                  : "/images/default.png",
            };

      await createReservation(reservationData);

      alert("예약이 완료되었습니다.");

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
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
              width: "320px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>예약할 수량을 선택하세요</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center", // 버튼과 숫자를 세로 가운데 정렬
                justifyContent: "center", // 가로 정렬
                gap: "20px", // 버튼과 숫자 사이 간격 증가
                padding: "10px",
                borderRadius: "8px", // 둥근 모서리 추가
                width: "180px", // 네모칸 크기 설정
                margin: "auto", // 가운데 정렬
              }}
            >
              <button
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setRsvCnt(Math.max(1, rsvCnt - 1))}
              >
                -
              </button>
              <span
                style={{
                  fontSize: "22px",
                }}
              >
                {rsvCnt}
              </span>
              <button
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setRsvCnt(rsvCnt + 1)}
              >
                +
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <button
                style={{
                  border: "none",
                  padding: "12px 18px",
                  cursor: "pointer",
                  // fontWeight: "bold",
                }}
                onClick={handleProceedToConfirm}
              >
                확인
              </button>
              <button
                style={{
                  border: "none",
                  padding: "12px 18px",
                  cursor: "pointer",
                  // fontWeight: "bold",
                }}
                onClick={() => {
                  setIsModalOpen(false);
                  alert("예약이 취소되었습니다.");
                }}
              >
                취소
              </button>
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
            <button
              onClick={() => {
                setIsConfirmOpen(false);
                alert("예약이 취소되었습니다.");
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CartButton;
