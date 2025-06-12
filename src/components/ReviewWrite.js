import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReview } from "../api/reviewApi";

function ReviewWrite() {
  const [review, setReview] = useState({
    memberId: 1,
    facilityName: "",
    revTtl: "",
    revCont: "",
    revStars: 3,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(review);
      alert("후기가 작성되었습니다.");
      navigate("/review-board");
    } catch (error) {
      console.error("후기 작성 실패: ", error);
      alert("후기 작성 실패");
    }
  };

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
      <h2>후기 작성</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="text"
          name="facilityName"
          placeholder="상품명"
          value={review.facilityName}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
          }}
        />
        <input
          type="text"
          name="revTtl"
          placeholder="제목"
          value={review.revTtl}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
          }}
        />
        <textarea
          name="revCont"
          placeholder="후기 내용"
          value={review.revCont}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            height: "120px",
            resize: "none",
          }}
        />
        <input
          type="number"
          name="revStars"
          placeholder="별점"
          value={review.revStars}
          onChange={handleChange}
          min="1"
          max="5"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/review-board")}
            style={{
              padding: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            이전
          </button>
          <button
            type="submit"
            style={{
              padding: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            후기 작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewWrite;
