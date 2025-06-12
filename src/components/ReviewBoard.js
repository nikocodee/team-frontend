import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getAllReviews } from "../api/reviewApi";
import { getReviewsByPage, getTotalReviewCount } from "../api/reviewApi";

function ReviewBoard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 3; // 페이지당 리뷰 개수
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // 페이징된 리뷰 가져오기
        // const data = await getAllReviews();
        const data = await getReviewsByPage(page, reviewsPerPage);
        setReviews(data);

        // 전체 리뷰 개수 가져와서 페이지 수 자동 설정
        const totalResponse = await getTotalReviewCount();
        setTotalPages(Math.ceil(totalResponse / reviewsPerPage));
      } catch (error) {
        console.error("후기 가져오기 실패:", error);
      }
    };
    fetchReviews();
  }, [page]); // 페이지 변경 시 자동 호출

  return (
    <div
      style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>후기 게시판</h2>
      <div style={{ textAlign: "right" }}>
        <button onClick={() => navigate("/review-write")}>후기 작성</button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>번호</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>제목</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              작성자
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>별점</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              작성일자
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              조회수
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.revId} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <button
                  onClick={() => navigate(`/review/${review.revId}`)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {review.revTtl}
                </button>
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.memberId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.revStars}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {new Date(review.revRegDate).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {review.revViews}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*페이지 버튼*/}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: "10px" }}
        >
          이전
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              border: page === i + 1 ? "2px solid green" : "1px solid #ddd",
              backgroundColor: page === i + 1 ? "#f1ffee" : "white",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={{ marginLeft: "10px" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default ReviewBoard;
