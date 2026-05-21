export default function BMIChart({ bmi }) {
  // BMI 구간 정의
  const MIN_DISPLAY = 15;
  const MAX_DISPLAY = 35;
  
  const categories = [
    { min: 0, max: 18.5, label: '저체중', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    { min: 18.5, max: 23, label: '정상', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    { min: 23, max: 25, label: '과체중', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    { min: 25, max: 100, label: '비만', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  ];

  // BMI 위치 계산 (표시 범위 내에서의 퍼센트)
  const calculatePosition = (value) => {
    if (value < MIN_DISPLAY) return 0;
    if (value > MAX_DISPLAY) return 100;
    return ((value - MIN_DISPLAY) / (MAX_DISPLAY - MIN_DISPLAY)) * 100;
  };

  // 각 구간의 시작과 끝 위치 계산
  const getCategoryPosition = (categoryMin, categoryMax) => {
    const start = calculatePosition(categoryMin === 0 ? MIN_DISPLAY : categoryMin);
    const end = calculatePosition(categoryMax >= 100 ? MAX_DISPLAY : categoryMax);
    return { start, end };
  };

  // 사용자 BMI 위치
  const userPosition = calculatePosition(bmi);

  // 현재 카테고리 찾기
  const currentCategory = categories.find(
    (cat) => bmi >= cat.min && bmi < cat.max
  ) || categories[categories.length - 1];

  return (
    <div className="bmi-chart-container">
      {/* 그래프 */}
      <div className="bmi-chart-wrapper">
        <div className="bmi-chart">
          {/* 배경 구간 */}
          {categories.map((category, index) => {
            const { start, end } = getCategoryPosition(
              category.min === 0 ? MIN_DISPLAY : category.min,
              category.max >= 100 ? MAX_DISPLAY : category.max
            );
            return (
              <div
                key={index}
                className="bmi-segment"
                style={{
                  left: `${start}%`,
                  right: `${100 - end}%`,
                  backgroundColor: category.bgColor,
                  borderColor: category.color,
                }}
              >
                <span className="segment-label">{category.label}</span>
              </div>
            );
          })}

          {/* 사용자 마커 */}
          <div
            className="bmi-marker"
            style={{
              left: `${userPosition}%`,
              backgroundColor: currentCategory.color,
            }}
          >
            <div className="marker-dot" />
            <div className="marker-label">{bmi.toFixed(1)}</div>
          </div>
        </div>

        {/* 범위 라벨 */}
        <div className="bmi-range-labels">
          <span className="range-label">{MIN_DISPLAY}</span>
          <span className="range-label">{MAX_DISPLAY}</span>
        </div>
      </div>

      {/* 교육용 안내 문구 */}
      <div className="bmi-education-note">
        <p>
          BMI는 키와 체중을 이용한 교육용 자가점검 지표입니다. 근육량, 체지방률, 질병 상태를 직접 반영하지 않으므로 참고용으로 활용해주세요.
        </p>
      </div>
    </div>
  );
}
