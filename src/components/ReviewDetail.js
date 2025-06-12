import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewById } from "../api/reviewApi";

function ReviewDetail() {
  const { revId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (!revId) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewById(revId);
        setReview(data);
      } catch (error) {
        console.error("리뷰 조회 실패: ", error);
      }
    };
    fetchReview();
  }, [revId]);

  if (!review) return <p>리뷰를 불러오는 중...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid",
        textAlign: "center",
      }}
    >
      <h2>후기 상세</h2>
      <div style={{ textAlign: "left" }}>
        <p>작성자: {review?.memberId}</p>
        <p>상품명: {review?.facilityName}</p>
        <p>제목: {review?.revTtl}</p>
        <p>별점: {review?.revStars}</p>
        <p>
          작성일:{" "}
          {review ? new Date(review.revRegDate).toLocaleDateString() : "-"}
        </p>
        <p>조회수: {review?.revViews}</p>
        <p style={{ textAlign: "justify" }}>{review?.revCont}</p>

        <hr />
        <p style={{ textAlign: "justify" }}>{review.revCont}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/review-board")}
          style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
        >
          목록으로
        </button>
        <button>후기 수정</button>
      </div>
    </div>
  );
}

export default ReviewDetail;
