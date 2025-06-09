import React from "react";
import { createPayment } from "../api/paymentApi";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const PayButton = ({ reservations, totalPrice, userInfo, memberId }) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.consultDate) {
      alert("이름, 연락처, 상담 예정일은 필수 입력입니다.");
      return;
    }

    // const { IMP } = window;
    // IMP.init("잠시 가림"); // ← 실제 아임포트 식별코드 입력

    // IMP.request_pay(
    //   {
    //     pg: "html5_inicis",
    //     pay_method: "card",
    //     merchant_uid: `mid_${new Date().getTime()}`,
    //     name: reservations.map(r => r.prodNm).join(", "),
    //     amount: totalPrice,
    //     buyer_email: "test@example.com", // 필요한 경우 userInfo.email 추가 가능
    //     buyer_name: userInfo.name,
    //     buyer_tel: userInfo.phone,
    //     buyer_addr: "주소입력가능",
    //     buyer_postcode: "12345",
    //   },
    //   async function (rsp) {
    //     if (rsp.success) {
    //       try {
    //         const result = await createPayment({
    //           pymId: rsp.imp_uid,
    //           impUid: rsp.imp_uid,
    //           merchantUid: rsp.merchant_uid,
    //           rsvId: reservations[0]?.rsvId,
    //           prodId: reservations[0]?.prodId,
    //           memberId: memberId,
    //           custNm: rsp.buyer_name,
    //           custTel: rsp.buyer_tel,
    //           custEmTel: userInfo.emergencyPhone,
    //           custDate: userInfo.consultDate,
    //           custMemo: userInfo.message,
    //           pymPrice: rsp.paid_amount,
    //           pymStatus: 1,
    //           pymMethod: rsp.pay_method,
    //           pymNum: rsp.apply_num,
    //           pymDate: new Date().toISOString().slice(0, 19).replace("T", " ")
    //         });
    //         alert("결제 완료 및 저장 성공");
    //         console.log(result);
    //         window.location.href = "/payment-success";
    //       } catch (error) {
    //         alert("서버 저장 중 오류 발생: " + error);
    //       }
    //     } else {
    //       alert("결제 실패: " + rsp.error_msg);
    //     }
    //   }
    // );

    // ====== 하드코딩 테스트용 결제 성공 처리 예시 =======
    (async () => {
      try {
        const generatedUuid = uuidv4();
        const result = await createPayment({
          pymId: generatedUuid,
          impUid: "imp_test_123456789",
          merchantUid: `mid_${new Date().getTime()}`,
          rsvId: reservations[0]?.rsvId,
          prodId: reservations[0]?.prodId,
          memberId: memberId,
          custNm: userInfo.name,
          custTel: userInfo.phone,
          custEmTel: userInfo.emergencyPhone,
          custDate: userInfo.consultDate,
          custMemo: userInfo.message,
          pymPrice: totalPrice,
          pymStatus: 1,
          pymMethod: "card",
          pymNum: "1234-5678-9012"
          // pymDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        });
        alert("결제 완료 및 저장 성공 (테스트용 하드코딩)");
        // console.log(result);
        // window.location.href = "/payment-result";
        navigate("/payment-result", {
          state: {
            reservations,
            totalPrice,
            userInfo,
            pymId: generatedUuid
          },
        });
      } catch (error) {
        alert("서버 저장 중 오류 발생: " + error);
      }
    })();
  };

  return (
    <button onClick={handlePayment}>
      결제하기
    </button>
  );
};

export default PayButton;
