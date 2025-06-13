import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewById, updateReview } from "../api/reviewApi";

function ReviewUpdate() {
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
        console.error("후기 조회 실패: ", error);
      }
    };
    fetchReview();
  }, [revId]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReview(revId, review);
      alert("후기 수정 완료!");
      navigate(`/review/${revId}`);
    } catch (error) {
      console.error("후기 수정 실패: ", error);
      alert("후기 수정 실패");
    }
  };

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
      <h2>후기 수정</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>상품명</label>
          <input
            type="text"
            name="facilityName"
            placeholder="상품명을 입력하세요"
            value={review.facilityName}
            onChange={handleChange}
            style={{ flex: "1", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>제목</label>
          <input
            type="text"
            name="revTtl"
            placeholder="후기 제목을 입력하세요"
            value={review.revTtl}
            onChange={handleChange}
            style={{ flex: "1", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>내용</label>
          <textarea
            name="revCont"
            placeholder="후기 내용을 입력하세요"
            value={review.revCont}
            onChange={handleChange}
            style={{
              flex: "1",
              padding: "10px",
              fontSize: "16px",
              height: "120px",
              resize: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ width: "50px" }}>별점</label>
          <input
            type="number"
            name="revStars"
            placeholder="1~5 사이의 별점을 입력하세요"
            value={review.revStars}
            onChange={handleChange}
            min="1"
            max="5"
            style={{ flex: "1", padding: "10px", fontSize: "16px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={() => navigate("/review-board")}
            style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
          >
            이전
          </button>
          <button
            type="submit"
            style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
          >
            후기 수정
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewUpdate;
