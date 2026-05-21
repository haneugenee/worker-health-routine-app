import { useEffect, useState } from 'react'
import './App.css'
import BMIChart from './BMIChart'

const tabs = [
  { id: 'healthcheck', label: '건강체크' },
  { id: 'meal', label: '식사' },
  { id: 'mission', label: '미션' },
  { id: 'record', label: '기록' },
  { id: 'ranking', label: '랭킹' },
]

const missionStorageKey = 'dailyMissionRecords'

const surveyQuestions = [
  {
    id: 'breakfast',
    question: '아침식사를 얼마나 자주 하나요?',
    options: ['거의 매일', '주 3–5회', '주 1–2회', '거의 안 먹음'],
  },
  {
    id: 'lateMeal',
    question: '야식 또는 늦은 저녁식사를 얼마나 자주 하나요?',
    options: ['거의 없음', '주 1–2회', '주 3–4회', '주 5회 이상'],
  },
  {
    id: 'vegetableFruit',
    question: '채소 또는 과일을 하루에 얼마나 자주 섭취하나요?',
    description: '예: 나물, 샐러드, 쌈채소, 과일 등',
    options: ['거의 먹지 않음', '하루 1회 정도', '하루 2회 정도', '하루 3회 이상'],
  },
  {
    id: 'protein',
    question: '생선, 살코기, 달걀, 두부, 콩류 같은 단백질 식품을 매 끼니 챙겨 먹나요?',
    options: ['거의 아니다', '하루 1끼 정도', '하루 2끼 정도', '거의 매 끼니'],
  },
  {
    id: 'processedFood',
    question: '라면, 햄·소시지, 편의점 도시락, 패스트푸드 등 가공식품/인스턴트식품을 얼마나 자주 먹나요?',
    options: ['거의 없음', '주 1–2회', '주 3–4회', '주 5회 이상'],
  },
  {
    id: 'sweetDrink',
    question: '단 음료를 얼마나 자주 마시나요?',
    description: '예: 탄산음료, 달달한 커피, 에너지드링크, 가당 주스',
    options: ['거의 안 마심', '주 1–2회', '주 3–5회', '거의 매일'],
  },
  {
    id: 'eatingOut',
    question: '외식, 배달, 편의점 음식으로 식사를 해결하는 빈도는 어느 정도인가요?',
    options: ['주 1회 이하', '주 2–3회', '주 4–5회', '거의 매일'],
  },
  {
    id: 'alcohol',
    question: '음주 빈도와 음주량은 어느 정도인가요?',
    options: ['마시지 않음', '월 1–2회, 1–2잔 정도', '주 1회, 소주 반 병 정도', '주 2회 이상 또는 한 번에 소주 1병 이상'],
  },
  {
    id: 'aerobicExercise',
    question: '최근 1주일 동안 숨이 약간 차는 유산소 운동을 총 몇 분 정도 했나요?',
    description: '예: 빠르게 걷기, 자전거, 조깅, 등산',
    options: ['없음', '30분 미만', '30–149분', '150분 이상'],
    section: '운동 및 신체활동 문항',
  },
  {
    id: 'strengthExercise',
    question: '근력운동은 주 몇 회 하나요?',
    description: '예: 웨이트, 팔굽혀펴기, 스쿼트, 기구운동',
    options: ['안 함', '주 1회', '주 2회', '주 3회 이상'],
  },
  {
    id: 'sittingTime',
    question: '하루 평균 앉아 있는 시간은 어느 정도인가요?',
    options: ['4시간 미만', '4–6시간', '7–9시간', '10시간 이상'],
  },
  {
    id: 'dailyActivity',
    question: '일상생활에서 신체활동을 얼마나 하는 편인가요?',
    description: '예: 계단 이용, 출퇴근 걷기, 점심시간 산책, 업무 중 이동',
    options: ['거의 하지 않음', '가끔 함', '자주 함', '매우 자주 함'],
  },
  {
    id: 'steps',
    question: '평소 하루 평균 걸음 수는 어느 정도인가요?',
    options: ['3,000보 미만', '3,000–5,999보', '6,000–7,999보', '8,000보 이상', '잘 모름'],
  },
  {
    id: 'exerciseDuration',
    question: '평소 운동을 한 번 할 때 평균 지속시간은 어느 정도인가요?',
    options: ['10분 미만', '10–29분', '30–59분', '60분 이상'],
  },
  {
    id: 'exerciseIntensity',
    question: '운동 강도는 보통 어느 정도인가요?',
    options: ['거의 움직이지 않음', '가벼운 활동 중심: 천천히 걷기, 스트레칭', '중간 강도 활동 중심: 빠르게 걷기, 자전거, 가벼운 조깅', '고강도 활동 중심: 달리기, 인터벌 운동, 구기종목'],
  },
  {
    id: 'regularExercise',
    question: '최근 1개월 동안 규칙적으로 운동을 실천한 편인가요?',
    options: ['거의 하지 않음', '가끔 생각날 때만 함', '주 1–2회 정도 실천함', '주 3회 이상 꾸준히 실천함'],
  },
]

const exampleUsers = [
  { name: '김철수', weeklyScore: 45, monthlyScore: 180, practiceDays: 18, streakDays: 5, badges: ['꾸준왕', '물마시기왕'] },
  { name: '이영희', weeklyScore: 50, monthlyScore: 200, practiceDays: 20, streakDays: 7, badges: ['점심산책왕', '채소추가왕'] },
  { name: '박민수', weeklyScore: 40, monthlyScore: 160, practiceDays: 16, streakDays: 3, badges: ['회식방어왕'] },
  { name: '정수진', weeklyScore: 55, monthlyScore: 220, practiceDays: 22, streakDays: 10, badges: ['꾸준왕', '다시시작왕', '채소추가왕'] },
  { name: '홍길동', weeklyScore: 35, monthlyScore: 140, practiceDays: 14, streakDays: 2, badges: [] },
  { name: '최영자', weeklyScore: 60, monthlyScore: 240, practiceDays: 24, streakDays: 12, badges: ['꾸준왕', '점심산책왕', '물마시기왕', '채소추가왕'] },
]

const defaultForm = {
  nickname: '',
  age: '30대',
  height: '',
  weight: '',
}

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return '저체중'
  if (bmi < 23) return '정상'
  if (bmi < 25) return '과체중'
  return '비만'
}

const buildRiskFactors = (form) => {
  const risks = []

  if (form.alcohol === '주 3회 이상') {
    risks.push('음주 빈도가 높으면 체중과 간 건강에 부담이 될 수 있어요.')
  }
  if (form.lateSnack === '주 3회 이상') {
    risks.push('야식이 잦으면 소화와 수면 리듬에 영향을 줄 수 있어요.')
  }
  if (form.breakfast === '가끔') {
    risks.push('가끔 아침을 거르면 하루 에너지 관리가 어려워질 수 있어요.')
  }
  if (form.breakfast === '자주') {
    risks.push('아침 결식이 자주 발생하면 대사 리듬을 깨트릴 수 있어요.')
  }
  if (form.exercise === '주 1-2회') {
    risks.push('운동 빈도가 낮다면 근력과 컨디션 관리에 도움이 필요합니다.')
  }
  if (form.exercise === '거의 안 함') {
    risks.push('운동을 거의 하지 않으면 체중과 피로 회복에 부담이 될 수 있어요.')
  }
  if (form.sugarDrink === '주 3회 이상') {
    risks.push('단 음료가 잦으면 혈당 관리에 부담이 될 수 있어요.')
  }

  return risks.slice(0, 3)
}

const buildRecommendation = (form) => {
  if (form.exercise === '거의 안 함') {
    return '오늘은 가벼운 10분 스트레칭이나 산책으로 시작해 보세요.'
  }
  if (form.lateSnack === '주 3회 이상') {
    return '저녁 식사는 잠들기 2시간 전까지 마무리해 보세요.'
  }
  if (form.breakfast !== '거의 안 함') {
    return '간단한 단백질과 채소로 아침을 챙겨 꾸준히 드셔 보세요.'
  }
  if (form.sugarDrink === '주 3회 이상') {
    return '단 음료 대신 물이나 무가당 차를 한 잔 더 드셔 보세요.'
  }
  if (form.alcohol === '주 3회 이상') {
    return '이번 주는 물이나 무카페인 차를 함께 마셔 보세요.'
  }
  return '오늘은 충분한 수분 섭취와 가벼운 걷기를 권해드립니다.'
}

const mealCards = [
  // 아침 카테고리
  {
    category: '아침',
    emoji: '🥣',
    title: '간단한 단백질 아침',
    description: '바쁜 아침에도 기본이 되는 단백질과 탄수화물을 빠르게 챙기는 방법입니다.',
    badge: '단백질 식품 보충',
    tips: ['삶은 달걀 또는 요거트 추가하기', '토스트나 시리얼과 함께 먹기', '우유나 두유로 수분 섭취하기'],
    caution: '밀가루 제품만 먹고 단백질 없이 넘어가기',
    action: '단백질 한 가지와 탄수화물을 함께 챙겨 활력 있는 아침을 만들어보세요.',
  },
  {
    category: '아침',
    emoji: '🍶',
    title: '그릭요거트 + 견과류',
    description: '포만감 있고 영양 균형이 맞는 직장인 아침 조합입니다.',
    badge: '단백질 식품 보충 · 영양 균형',
    tips: ['무가당 그릭요거트 선택하기', '견과류는 한 줌 정도(약 30g)', '신선한 과일 토핑 추가하기'],
    caution: '가당 요거트로 당류 과다 섭취하기',
    action: '그릭요거트의 포만감으로 오전 중 스트레스 없는 아침을 시작해보세요.',
  },
  {
    category: '아침',
    emoji: '🥚',
    title: '삶은 달걀 + 바나나',
    description: '준비하기 쉽고 영양가 높은 직장인 아침의 정석입니다.',
    badge: '단백질 식품 보충 · 포만감',
    tips: ['달걀 1~2개 삶아두기', '바나나는 중간 크기 1개', '통곡물 빵과 함께 먹으면 더 좋음'],
    caution: '달걀을 튀기거나 기름 많은 조리법으로 준비하기',
    action: '간단한 조합으로 든든하고 포만감 있는 아침을 만들어보세요.',
  },
  {
    category: '아침',
    emoji: '🥛',
    title: '두유 + 통밀빵',
    description: '부드럽고 소화하기 좋으면서 영양균형이 맞는 아침입니다.',
    badge: '단백질 식품 보충 · 전곡 탄수화물',
    tips: ['무가당 두유 200ml 정도', '통밀빵 2~3조각', '견과류 버터나 치즈로 맛내기'],
    caution: '가당 두유 또는 흰 식빵 선택하기',
    action: '가볍지만 든든한 조합으로 오전 중 에너지를 채워보세요.',
  },

  // 점심 카테고리
  {
    category: '점심',
    emoji: '🍱',
    title: '한식 백반',
    description: '균형 있는 한 끼를 직장인 점심에 쉽게 선택하는 방법입니다.',
    badge: '채소 섭취 늘리기',
    tips: ['밥은 2/3공기 정도로 조절하기', '채소 반찬을 먼저 먹기', '국/찌개 국물은 절반 이하로 줄이기'],
    caution: '짠 국물과 김치류를 많이 먹는 것',
    action: '적당한 반찬과 국물 조절로 든든하고 가벼운 식사를 실천해 보세요.',
  },
  {
    category: '점심',
    emoji: '🍲',
    title: '국밥',
    description: '바쁜 점심에 포만감은 있지만 나트륨과 포화지방을 조절해야 합니다.',
    badge: '국물과 소스 줄이기',
    tips: ['국물은 절반 정도 남기기', '밥은 따로 받아 양 조절하기', '김치와 깍두기 양 줄이기'],
    caution: '국물까지 모두 먹기',
    action: '국물과 밥 양을 스스로 조절해 부담을 낮춰 보세요.',
  },
  {
    category: '점심',
    emoji: '🍖',
    title: '돈가스',
    description: '기분 전환 메뉴로 좋지만 튀김과 소스 선택에 주의가 필요합니다.',
    badge: '덜 기름지게 먹기',
    tips: ['소스는 따로 받아 찍어 먹기', '샐러드를 먼저 먹기', '밥은 일부 남기기'],
    caution: '소스를 전부 붓고 튀김과 밥을 많이 먹기',
    action: '소스를 적당히 찍어 먹고 채소와 함께 즐겨 보세요.',
  },
  {
    category: '점심',
    emoji: '🥘',
    title: '제육볶음',
    description: '고단백 메뉴로 좋아도 양념과 밥 선택을 신경 쓰는 것이 좋습니다.',
    badge: '단백질 식품 보충',
    tips: ['쌈 채소와 함께 먹기', '밥 양 줄이기', '양념에 밥 비벼 먹기 줄이기'],
    caution: '밥 추가와 양념 과다 섭취',
    action: '고기와 채소를 함께 먹어 포만감과 영양을 조절해 보세요.',
  },
  {
    category: '점심',
    emoji: '🥡',
    title: '중국집',
    description: '중식 메뉴는 맛있지만 나트륨과 탄수화물을 함께 조절하는 것이 중요합니다.',
    badge: '덜 짜게 먹기',
    tips: ['면 양을 조금 남기기', '짬뽕 국물을 적게 먹기', '탕수육은 소스에 찍어 먹기'],
    caution: '면+밥+튀김을 모두 많이 먹기',
    action: '메뉴를 조금씩 조절해 가볍게 즐겨 보세요.',
  },

  // 저녁 카테고리
  {
    category: '저녁',
    emoji: '🍜',
    title: '두부참치 채소 비빔밥',
    description: '가볍고 영양 균형 좋으며 소화하기 쉬운 저녁 한끼입니다.',
    badge: '채소 섭취 늘리기',
    tips: ['두부와 참치 단백질 풍부하게 얹기', '채소를 밥 절반 정도 섞기', '고추장은 1스푼 정도로 조절하기'],
    caution: '고추장을 많이 넣고 밥을 많이 담기',
    action: '영양 가득하고 소화 부담 없는 저녁으로 숙면을 취해보세요.',
  },
  {
    category: '저녁',
    emoji: '🌯',
    title: '닭가슴살 채소 또띠아',
    description: '단백질과 채소를 한 번에 챙기는 건강한 저녁 식사입니다.',
    badge: '단백질 식품 보충',
    tips: ['저지방 닭가슴살 사용하기', '다양한 채소 곁들이기', '소스는 가볍게 사용하기'],
    caution: '마요네즈 소스를 듬뿍 바르기',
    action: '포만감 있으면서 가벼운 저녁으로 다음 날 컨디션을 지켜보세요.',
  },
  {
    category: '저녁',
    emoji: '🐟',
    title: '생선구이 정식',
    description: '오메가3과 고단백을 한 번에 섭취하는 건강한 저녁입니다.',
    badge: '단백질 식품 보충',
    tips: ['생선은 흰살 생선(흰살 도미, 명태 등) 추천', '채소 반찬 충분히 섭취하기', '국물은 적게 마시기'],
    caution: '생선을 튀기거나 짠 국물을 많이 마시기',
    action: '영양 풍부한 생선으로 저녁을 든든하게 마무리해보세요.',
  },
  {
    category: '저녁',
    emoji: '🥗',
    title: '샐러드 + 단백질 식품',
    description: '가볍지만 충분한 영양을 담은 직장인 저녁의 정석입니다.',
    badge: '채소 섭취 늘리기',
    tips: ['삶은 달걀이나 닭가슴살 추가', '견과류나 치즈로 단백질 보충', '드레싱은 2스푼 정도로 조절하기'],
    caution: '마요네즈 기반 드레싱을 듬뿍 사용하기',
    action: '신선한 채소로 소화 부담 없는 저녁을 즐겨보세요.',
  },
  {
    category: '저녁',
    emoji: '🍚',
    title: '현미밥 + 나물 + 달걀',
    description: '소화하기 좋으면서 영양이 풍부한 전통적인 건강 저녁입니다.',
    badge: '채소 섭취 늘리기',
    tips: ['현미밥은 일반 밥의 2/3 정도', '다양한 나물 곁들이기', '계란말이나 계란국로 단백질 보충'],
    caution: '밥을 많이 담고 나물에 기름이 많이 들어가기',
    action: '정갈한 한 끼로 편안하고 건강한 저녁을 보내보세요.',
  },

  // 야식·회식 카테고리
  {
    category: '야식·회식',
    emoji: '🥂',
    title: '회식',
    description: '회식 자리에서는 음주와 안주 선택을 부드럽게 조절하는 것이 중요합니다.',
    badge: '덜 짜게 먹기',
    tips: ['공복으로 가지 않기', '술 한 잔 후 물 한 컵', '튀김보다 구이/찜/회/채소 안주 선택'],
    caution: '2차에서 라면, 치킨, 탄수화물 야식 추가하기',
    action: '술과 안주를 조금씩 신경 써서 다음 날 부담을 줄여보세요.',
  },
  {
    category: '야식·회식',
    emoji: '🌙',
    title: '야근/야식',
    description: '늦은 시간에는 소화 부담을 줄이고 과식을 피하는 것이 좋습니다.',
    badge: '과식 예방',
    tips: ['야식 전 물 한 컵 마시기', '라면 대신 두부/달걀/요거트/샐러드+단백질', '잠들기 2시간 전 마무리하기'],
    caution: '잠들기 직전 맵고 짠 음식 과식',
    action: '가벼운 선택으로 다음 날 컨디션을 지켜보세요.',
  },
  {
    category: '야식·회식',
    emoji: '🍢',
    title: '술자리 안주 선택',
    description: '회식과 술자리에서 똑똑한 안주 선택으로 건강을 지키는 방법입니다.',
    badge: '덜 기름지게 먹기',
    tips: ['생채소나 나물 안주 우선 선택', '구이나 찜 안주 고르기', '튀김 안주는 1~2개만 제한하기'],
    caution: '튀김과 기름진 안주만 계속 먹기',
    action: '안주 선택에 신경 써서 즐거운 자리도 건강하게 즐겨보세요.',
  },
  {
    category: '야식·회식',
    emoji: '🍜',
    title: '늦은 저녁 식사 조절',
    description: '늦은 저녁에도 적절하게 식사하되 수면 방해를 최소화하는 방법입니다.',
    badge: '과식 예방',
    tips: ['야식 전 가스 제거된 물이나 미온수 마시기', '국물 음식은 따뜻하게', '자극적인 양념은 피하고 담백하게'],
    caution: '맵고 짠 음식이나 카페인 음료 마시기',
    action: '가볍고 담백한 야식으로 편안한 밤과 좋은 숙면을 만들어보세요.',
  },

  // 편의점·카페 카테고리
  {
    category: '편의점·카페',
    emoji: '🥪',
    title: '편의점 식사',
    description: '빠르게 먹을 때도 단백질과 채소 보충을 중심에 두세요.',
    badge: '채소 섭취 늘리기',
    tips: ['삼각김밥 단독보다 달걀/닭가슴살 추가', '샐러드나 채소류 함께 구매', '음료는 물이나 무가당 차 선택'],
    caution: '컵라면+삼각김밥+단 음료 조합',
    action: '편의점에서도 단백질과 채소를 함께 선택해 보세요.',
  },
  {
    category: '편의점·카페',
    emoji: '☕',
    title: '카페 음료',
    description: '카페 메뉴는 당류를 줄이는 선택이 건강한 습관입니다.',
    badge: '덜 달게 먹기',
    tips: ['시럽 없는 아메리카노/무가당 차 선택', '라떼는 작은 사이즈로', '달달한 음료는 가끔 선택'],
    caution: '휘핑크림, 시럽, 당류 높은 음료 자주 마시기',
    action: '당류 선택을 줄여 하루 수분과 에너지 균형을 지켜보세요.',
  },
  {
    category: '편의점·카페',
    emoji: '🍜',
    title: '컵라면 대체 조합',
    description: '컵라면보다 영양 높은 편의점 조합으로 건강하게 끼니를 해결하는 방법입니다.',
    badge: '단백질 식품 보충',
    tips: ['그릭요거트나 계란로 단백질 추가', '김자반이나 미역국으로 나트륨 조절', '물이나 무가당 음료 선택하기'],
    caution: '컵라면에 계란을 넣고 단 음료 마시기',
    action: '조금 더 신경 쓴 선택으로 바쁜 날도 건강하게 보내보세요.',
  },
  {
    category: '편의점·카페',
    emoji: '🍙',
    title: '삼각김밥 보완 조합',
    description: '삼각김밥만으로는 부족한 영양을 보완하는 편의점 조합입니다.',
    badge: '채소 섭취 늘리기',
    tips: ['삼각김밥과 요거트/계란 함께 구매', '샐러드나 채소 요리 추가', '우유나 무가당 두유로 포만감 높이기'],
    caution: '삼각김밥만 먹고 다른 반찬 없이 넘어가기',
    action: '작은 추가로 영양 균형을 맞춰 충분한 끼니를 만들어보세요.',
  },
]

const foodMissions = [
  { emoji: '🥗', title: '오늘 점심에 채소 반찬 2가지 이상 먹기', why: '채소를 충분히 먹으면 포만감과 영양이 좋아집니다.', duration: '10분', difficulty: '쉬움' },
  { emoji: '🍲', title: '국물 음식은 국물 절반 남기기', why: '나트륨과 칼로리 부담을 줄이는 데 도움이 됩니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '💧', title: '단 음료 대신 물 또는 무가당 차 마시기', why: '당류 섭취를 줄여 건강한 수분 섭취를 돕습니다.', duration: '하루종일', difficulty: '쉬움' },
  { emoji: '🍚', title: '밥을 평소보다 1/3 덜어내고 먹기', why: '정제 탄수화물을 조절하는 작은 습관입니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '🍖', title: '튀김 대신 구이, 찜, 삶은 메뉴 선택하기', why: '포화지방과 기름 섭취를 줄이는 데 도움이 됩니다.', duration: '5분', difficulty: '보통' },
  { emoji: '☕', title: '커피믹스 대신 아메리카노 또는 무가당 음료 선택하기', why: '당류와 칼로리 섭취를 줄이는 선택입니다.', duration: '하루종일', difficulty: '쉬움' },
  { emoji: '🌙', title: '야식 먹기 전 물 한 컵 마시고 10분 기다리기', why: '소화를 돕고 과식을 줄이는 습관입니다.', duration: '15분', difficulty: '쉬움' },
  { emoji: '🍽️', title: '식사 속도를 늦추고 15분 이상 천천히 먹기', why: '천천히 먹으면 포만감을 더 잘 느낄 수 있습니다.', duration: '15분', difficulty: '보통' },
  { emoji: '💧', title: '회식 전 물 한 컵 마시고 공복 피하기', why: '충분한 영양 상태에서 회식에 참여하면 과식을 줄일 수 있습니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '🕐', title: '저녁 식사는 잠들기 2시간 전까지 마무리하기', why: '늦은 식사는 소화와 숙면에 방해가 될 수 있습니다.', duration: '5분', difficulty: '쉬움' },
]

const activityMissions = [
  { emoji: '🚶', title: '점심 식사 후 10분 걷기', why: '식사 후 가벼운 걷기는 소화를 돕습니다.', duration: '10분', difficulty: '쉬움' },
  { emoji: '🪜', title: '엘리베이터 대신 계단 3층 오르기', why: '짧은 활동이 일상 운동량을 늘려줍니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '🚶', title: '퇴근 후 15분 산책하기', why: '퇴근 후 산책이 스트레스 완화와 활동량에 도움이 됩니다.', duration: '15분', difficulty: '쉬움' },
  { emoji: '🙆', title: '1시간마다 자리에서 일어나 스트레칭하기', why: '자주 움직이면 피로감과 긴장감을 줄일 수 있습니다.', duration: '하루종일', difficulty: '보통' },
  { emoji: '🏋️', title: '스쿼트 10회 하기', why: '간단한 근력 운동이 활동량을 높입니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '🚶', title: '하루 7,000보 도전하기', why: '걷기는 꾸준한 건강 습관을 만드는 좋은 방법입니다.', duration: '하루종일', difficulty: '보통' },
  { emoji: '🚶', title: '출퇴근길 한 정거장 먼저 내려 걷기', why: '이동 중 작은 걸음이 활동량을 더해줍니다.', duration: '10분', difficulty: '쉬움' },
  { emoji: '🏋️', title: '팔굽혀펴기 또는 벽 짚고 팔굽혀펴기 10회 하기', why: '상체 근력을 강화하는 효과적인 운동입니다.', duration: '5분', difficulty: '보통' },
  { emoji: '🙆', title: '목과 어깨 스트레칭 3분 하기', why: '오래 앉아있을 때 경직된 근육을 이완시킵니다.', duration: '3분', difficulty: '쉬움' },
  { emoji: '🏋️', title: '의자에 앉았다 일어나기 10회 하기', why: '하체 근력과 일상 활동 능력을 향상시킵니다.', duration: '5분', difficulty: '쉬움' },
]

const efficacyMissions = [
  { emoji: '✍️', title: '오늘 성공한 건강 행동 1개 적기', why: '성공을 기록하면 자신감을 키우는 데 도움이 됩니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '📋', title: '내일 점심 메뉴를 미리 정하기', why: '미리 계획하면 보다 건강한 선택에 도움이 됩니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '🎯', title: '회식 자리에서 내가 지킬 행동 1개 정하기', why: '미리 정하면 실천 행동이 더 쉬워집니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '🔄', title: '실패했어도 다시 시작 버튼 누르기', why: '다시 시작하는 마음이 꾸준함을 만드는 힘입니다.', duration: '3분', difficulty: '쉬움' },
  { emoji: '⭐', title: '이번 주 가장 쉬웠던 건강 행동 고르기', why: '작은 성공을 되돌아보면 자기효능감이 높아집니다.', duration: '5분', difficulty: '쉬움' },
  { emoji: '💪', title: '오늘 나에게 칭찬 한 문장 남기기', why: '스스로를 격려하는 습관이 지속성을 높입니다.', duration: '5분', difficulty: '쉬움' },
]

const allMissions = [
  ...foodMissions.map((item) => ({ ...item, type: '식습관' })),
  ...activityMissions.map((item) => ({ ...item, type: '활동량' })),
  ...efficacyMissions.map((item) => ({ ...item, type: '자기효능감' })),
]

const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-')
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

const dateStringToSeed = (dateString) => Number(dateString.split('-').join(''))

// 날짜 기반 식단 미션 선택
const getDietMissionForDate = (dateString) => {
  const seed = dateStringToSeed(dateString)
  const index = Number.isFinite(seed) ? seed % foodMissions.length : 0
  return foodMissions[index]
}

// 날짜 기반 운동 미션 선택
const getExerciseMissionForDate = (dateString) => {
  const seed = dateStringToSeed(dateString)
  // 식단 미션과 다르게 하기 위해 다른 modulo 사용
  const index = Number.isFinite(seed) ? Math.floor(seed / 100) % activityMissions.length : 0
  return activityMissions[index]
}

const getMissionForDate = (dateString) => {
  const seed = dateStringToSeed(dateString)
  const index = Number.isFinite(seed) ? seed % allMissions.length : 0
  return allMissions[index]
}

function App() {
  const [activeTab, setActiveTab] = useState('healthcheck')
  const [healthCheckStage, setHealthCheckStage] = useState('basicInfo') // 'basicInfo', 'survey', 'result'
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [missionRecords, setMissionRecords] = useState({})
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()))
  const [surveyResponses, setSurveyResponses] = useState({})
  const [preSurveyScores, setPreSurveyScores] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [activeMealCategory, setActiveMealCategory] = useState('아침')

  const today = formatDateString(new Date())
  const todayMission = getMissionForDate(today)
  const todayRecord = missionRecords[today]

  useEffect(() => {
    const storedResult = localStorage.getItem('healthDiagnosisResult')
    const storedMission = localStorage.getItem(missionStorageKey)
    const storedSurvey = localStorage.getItem('preSurveyResponses')
    const storedProfile = localStorage.getItem('healthProfile')

    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult))
      } catch {
        setResult(null)
      }
    }

    if (storedMission) {
      try {
        const parsed = JSON.parse(storedMission)
        setMissionRecords(typeof parsed === 'object' && parsed !== null ? parsed : {})
      } catch {
        setMissionRecords({})
      }
    }

    if (storedSurvey) {
      try {
        const parsed = JSON.parse(storedSurvey)
        if (parsed.responses) {
          setSurveyResponses(parsed.responses)
        }
      } catch {
        setSurveyResponses({})
      }
    }

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile)
        setProfileData(parsed)
        setForm(parsed)
        // 프로필이 있으면 결과 화면으로 가도록 설정
        if (parsed.nickname && parsed.height && parsed.weight) {
          setHealthCheckStage('result')
        }
      } catch {
        setProfileData(null)
      }
    }

    const storedScores = localStorage.getItem('preSurveyScores')
    if (storedScores) {
      try {
        setPreSurveyScores(JSON.parse(storedScores))
      } catch {
        setPreSurveyScores(null)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('healthDiagnosisForm', JSON.stringify(form))
  }, [form])

  useEffect(() => {
    if (result) {
      localStorage.setItem('healthDiagnosisResult', JSON.stringify(result))
    } else {
      localStorage.removeItem('healthDiagnosisResult')
    }
  }, [result])

  useEffect(() => {
    if (Object.keys(missionRecords).length > 0) {
      localStorage.setItem(missionStorageKey, JSON.stringify(missionRecords))
    } else {
      localStorage.removeItem(missionStorageKey)
    }
  }, [missionRecords])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSurveyChange = (questionId, value) => {
    setSurveyResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleHealthCheckBasicInfoSubmit = (event) => {
    event.preventDefault()
    
    const height = Number(form.height)
    const weight = Number(form.weight)
    const heightM = height / 100
    const heightIsValid = heightM > 0 && Number.isFinite(heightM)
    const weightIsValid = weight > 0 && Number.isFinite(weight)
    
    if (!form.nickname || !form.nickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요.')
      return
    }
    
    if (!heightIsValid || !weightIsValid) {
      setErrorMessage('키와 체중을 올바르게 입력해주세요.')
      return
    }
    
    setErrorMessage('')
    // 기본 정보 저장
    localStorage.setItem('healthProfile', JSON.stringify(form))
    setProfileData(form)
    // 설문 단계로 이동
    setHealthCheckStage('survey')
    // 설문 응답 초기화 (새로 시작)
    setSurveyResponses({})
  }

  const handleHealthCheckSurveySubmit = () => {
    const allAnswered = surveyQuestions.every((q) => surveyResponses[q.id])
    if (!allAnswered) {
      alert('모든 문항에 응답해주세요.')
      return
    }

    const surveyData = {
      completed: true,
      submittedAt: new Date().toISOString(),
      responses: surveyResponses,
    }
    localStorage.setItem('preSurveyResponses', JSON.stringify(surveyData))

    const scores = computePreSurveyScores(surveyResponses)
    const payload = {
      dietScore: scores.dietScore,
      activityScore: scores.activityScore,
      totalScore: scores.totalScore,
      dietStatus: scores.dietStatus,
      activityStatus: scores.activityStatus,
      totalStatus: scores.totalStatus,
      improvementPoints: scores.improvementPoints,
      recommendation: scores.recommendation,
      calculatedAt: new Date().toISOString(),
    }
    localStorage.setItem('preSurveyScores', JSON.stringify(payload))
    setPreSurveyScores(payload)

    // 기본 정보의 BMI도 계산
    const height = Number(form.height)
    const weight = Number(form.weight)
    const heightM = height / 100
    const bmi = Number((weight / (heightM * heightM)).toFixed(1))
    const bmiCategory = getBmiCategory(bmi)

    setResult({
      nickname: form.nickname || '사용자',
      bmi,
      bmiCategory,
      riskFactors: [],
      recommendation: '',
    })

    setErrorMessage('')
    setHealthCheckStage('result')
  }

  const handleEditResponse = () => {
    setHealthCheckStage('survey')
  }

  // --- Scoring logic ---
  const optionScores = {
    breakfast: {
      '거의 매일': 5,
      '주 3–5회': 3,
      '주 1–2회': 1,
      '거의 안 먹음': 0,
    },
    lateMeal: {
      '거의 없음': 5,
      '주 1–2회': 3,
      '주 3–4회': 1,
      '주 5회 이상': 0,
    },
    vegetableFruit: {
      '하루 3회 이상': 5,
      '하루 2회 정도': 3,
      '하루 1회 정도': 1,
      '거의 먹지 않음': 0,
    },
    protein: {
      '거의 매 끼니': 5,
      '하루 2끼 정도': 3,
      '하루 1끼 정도': 1,
      '거의 아니다': 0,
    },
    processedFood: {
      '거의 없음': 5,
      '주 1–2회': 3,
      '주 3–4회': 1,
      '주 5회 이상': 0,
    },
    sweetDrink: {
      '거의 안 마심': 5,
      '주 1–2회': 3,
      '주 3–5회': 1,
      '거의 매일': 0,
    },
    eatingOut: {
      '주 1회 이하': 5,
      '주 2–3회': 3,
      '주 4–5회': 1,
      '거의 매일': 0,
    },
    alcohol: {
      '마시지 않음': 5,
      '월 1–2회, 1–2잔 정도': 3,
      '주 1회, 소주 반 병 정도': 1,
      '주 2회 이상 또는 한 번에 소주 1병 이상': 0,
    },
    aerobicExercise: {
      '150분 이상': 5,
      '30–149분': 3,
      '30분 미만': 1,
      '없음': 0,
    },
    strengthExercise: {
      '주 3회 이상': 5,
      '주 2회': 3,
      '주 1회': 1,
      '안 함': 0,
    },
    sittingTime: {
      '4시간 미만': 5,
      '4–6시간': 3,
      '7–9시간': 1,
      '10시간 이상': 0,
    },
    dailyActivity: {
      '매우 자주 함': 5,
      '자주 함': 3,
      '가끔 함': 1,
      '거의 하지 않음': 0,
    },
    steps: {
      '8,000보 이상': 5,
      '6,000–7,999보': 3,
      '3,000–5,999보': 1,
      '3,000보 미만': 0,
      '잘 모름': 1,
    },
    exerciseDuration: {
      '60분 이상': 5,
      '30–59분': 3,
      '10–29분': 1,
      '10분 미만': 0,
    },
    exerciseIntensity: {
      '거의 움직이지 않음': 0,
      '가벼운 활동 중심: 천천히 걷기, 스트레칭': 1,
      '중간 강도 활동 중심: 빠르게 걷기, 자전거, 가벼운 조깅': 3,
      '고강도 활동 중심: 달리기, 인터벌 운동, 구기종목': 5,
    },
    regularExercise: {
      '주 3회 이상 꾸준히 실천함': 5,
      '주 1–2회 정도 실천함': 3,
      '가끔 생각날 때만 함': 1,
      '거의 하지 않음': 0,
    },
  }

  const idToLabel = {
    breakfast: '아침식사 부족',
    lateMeal: '야식 빈도 높음',
    vegetableFruit: '채소·과일 섭취 부족',
    protein: '단백질 식품 섭취 부족',
    processedFood: '가공식품 섭취 빈도 높음',
    sweetDrink: '단 음료 섭취 주의',
    eatingOut: '외식·배달 의존도 높음',
    alcohol: '음주 관리 필요',
    aerobicExercise: '유산소 활동 부족',
    strengthExercise: '근력운동 부족',
    sittingTime: '좌식시간 김',
    dailyActivity: '일상 신체활동 부족',
    steps: '걸음 수 부족',
    exerciseDuration: '운동 지속시간 부족',
    exerciseIntensity: '운동 강도 낮음',
    regularExercise: '규칙적 운동 부족',
  }

  const getDietStatus = (score) => {
    if (score >= 32) return '양호한 식습관'
    if (score >= 24) return '보통, 일부 개선 필요'
    if (score >= 16) return '관리가 필요한 식습관'
    return '집중 개선이 필요한 식습관'
  }

  const getActivityStatus = (score) => {
    if (score >= 32) return '활동적인 생활습관'
    if (score >= 24) return '보통, 활동량 보완 필요'
    if (score >= 16) return '신체활동 관리 필요'
    return '운동습관 집중 개선 필요'
  }

  const getTotalStatus = (score) => {
    if (score >= 64) return '건강 루틴이 잘 형성된 상태'
    if (score >= 48) return '기본 습관은 있으나 보완 필요'
    if (score >= 32) return '생활습관 개선이 필요한 상태'
    return '작은 실천부터 시작이 필요한 상태'
  }

  function computePreSurveyScores(responses) {
    // compute diet (1-8) and activity (9-16) scores
    let dietScore = 0
    let activityScore = 0
    const lowItems = []

    const dietKeys = ['breakfast','lateMeal','vegetableFruit','protein','processedFood','sweetDrink','eatingOut','alcohol']
    const activityKeys = ['aerobicExercise','strengthExercise','sittingTime','dailyActivity','steps','exerciseDuration','exerciseIntensity','regularExercise']

    dietKeys.forEach((k) => {
      const val = responses[k]
      const pts = optionScores[k] && optionScores[k][val] !== undefined ? optionScores[k][val] : 0
      dietScore += pts
      if (pts <= 1) lowItems.push(k)
    })

    activityKeys.forEach((k) => {
      const val = responses[k]
      const pts = optionScores[k] && optionScores[k][val] !== undefined ? optionScores[k][val] : 0
      activityScore += pts
      if (pts <= 1) lowItems.push(k)
    })

    // ensure bounds
    dietScore = Math.max(0, Math.min(40, dietScore))
    activityScore = Math.max(0, Math.min(40, activityScore))
    const totalScore = dietScore + activityScore

    const improvementPoints = lowItems.slice(0, 3).map((id) => idToLabel[id] || id)

    const recommendation = (function () {
      const top = improvementPoints[0]
      if (!top) return '오늘은 가벼운 걷기나 수분 섭취로 시작해 보세요.'
      if (top.includes('야식')) return '오늘은 야식 전 물 한 컵 마시고 10분 기다려 보세요.'
      if (top.includes('채소')) return '오늘 점심에 채소 반찬을 2가지 이상 추가해보세요.'
      if (top.includes('단 음료')) return '단 음료 대신 물이나 무가당 차를 선택해보세요.'
      if (top.includes('유산소')) return '점심 후 10분 걷기부터 시작해 보세요.'
      if (top.includes('근력')) return '오늘 스쿼트 10회만 실천해보세요.'
      if (top.includes('좌식')) return '1시간마다 자리에서 일어나 2분 스트레칭해보세요.'
      if (top.includes('걸음')) return '점심 후 짧은 산책으로 1,000보를 추가해보세요.'
      if (top.includes('규칙적')) return '오늘 10분이라도 규칙적으로 움직이는 시간을 만들어보세요.'
      if (top.includes('가공')) return '가공식품 대신 채소나 달걀 같은 간단한 단백질을 선택해보세요.'
      if (top.includes('음주')) return '오늘은 물 한 잔을 더 곁들여 음주량을 조절해보세요.'
      return '작은 실천 한 가지를 오늘의 목표로 정해보세요.'
    }())

    return {
      dietScore,
      activityScore,
      totalScore,
      dietStatus: getDietStatus(dietScore),
      activityStatus: getActivityStatus(activityScore),
      totalStatus: getTotalStatus(totalScore),
      improvementPoints,
      recommendation,
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const height = Number(form.height)
    const weight = Number(form.weight)
    const heightM = height / 100
    const heightIsValid = heightM > 0 && Number.isFinite(heightM)
    const weightIsValid = weight > 0 && Number.isFinite(weight)

    if (!heightIsValid || !weightIsValid) {
      setResult(null)
      setErrorMessage('키와 체중을 올바르게 입력해주세요.')
      return
    }

    const bmi = Number((weight / (heightM * heightM)).toFixed(1))
    const bmiCategory = getBmiCategory(bmi)

    const riskFactors = buildRiskFactors(form)
    const recommendation = buildRecommendation(form)

    setErrorMessage('')
    setResult({
      nickname: form.nickname || '사용자',
      bmi,
      bmiCategory,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['생활습관이 비교적 안정적입니다. 현재 상태를 조금 더 지켜보세요.'],
      recommendation,
    })
  }

  const praiseMessage = (status) => {
    if (status === 'completed') return '오늘의 실천이 쌓이면 건강 루틴이 됩니다.'
    if (status === 'half') return '절반의 성공도 중요한 변화입니다.'
    return '기록한 것만으로도 다시 시작할 수 있습니다.'
  }

  const getStatusCode = (label) => {
    if (label === '완료') return 'completed'
    if (label === '절반 성공') return 'half'
    return 'log'
  }

  const statusLabels = {
    completed: '완료',
    half: '절반 성공',
    log: '기록만 하기',
  }

  const handleMissionSubmit = (statusLabel) => {
    const score = statusLabel === '완료' ? 10 : statusLabel === '절반 성공' ? 5 : 2
    const status = getStatusCode(statusLabel)
    const record = {
      status,
      statusLabel,
      score,
      missionTitle: todayMission.title,
      missionType: todayMission.type,
      completedAt: new Date().toISOString(),
    }
    setMissionRecords((prev) => ({ ...prev, [today]: record }))
  }

  const padDate = (value) => String(value).padStart(2, '0')

  const buildMonthMatrix = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const start = (firstDay.getDay() + 6) % 7
    const days = new Date(year, month + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < start; i += 1) {
      cells.push({ empty: true })
    }

    for (let day = 1; day <= days; day += 1) {
      const dateString = `${year}-${padDate(month + 1)}-${padDate(day)}`
      const record = missionRecords[dateString]
      
      // 새 구조와 기존 구조 모두 지원
      let totalScore = 0
      let dietScore = 0
      let exerciseScore = 0
      let status = undefined
      
      if (record?.totalScore !== undefined) {
        totalScore = record.totalScore
        dietScore = record.dietMission?.score || 0
        exerciseScore = record.exerciseMission?.score || 0
        // 새 구조에서 상태 결정
        if (record.dietMission || record.exerciseMission) {
          status = 'recorded'
        }
      } else if (record?.score !== undefined) {
        // 기존 구조
        totalScore = record.score
        status = record.status
      }
      
      cells.push({
        empty: false,
        day,
        dateString,
        totalScore,
        dietScore,
        exerciseScore,
        status,
      })
    }

    while (cells.length % 7 !== 0) {
      cells.push({ empty: true })
    }

    return cells
  }

  const getMonthKey = (year, month) => `${year}-${padDate(month + 1)}`

  const getMonthSummary = () => {
    const date = new Date(today)
    const year = date.getFullYear()
    const month = date.getMonth()
    const prefix = getMonthKey(year, month)
    const entries = Object.entries(missionRecords).filter(([key]) => key.startsWith(prefix))
    const totalDays = entries.length
    
    // 새 구조와 기존 구조 모두 지원
    const totalScore = entries.reduce((sum, [, record]) => {
      // 새 구조: totalScore
      if (record.totalScore !== undefined) {
        return sum + record.totalScore
      }
      // 기존 구조: score
      return sum + (record.score || 0)
    }, 0)
    
    const completedCount = entries.filter(([, record]) => {
      // 새 구조: dietMission과 exerciseMission 중 하나 이상이 completed
      if (record.dietMission?.status === 'completed' || record.exerciseMission?.status === 'completed') {
        return true
      }
      // 기존 구조: status가 completed
      return record.status === 'completed'
    }).length
    
    const halfCount = entries.filter(([, record]) => {
      if (record.dietMission?.status === 'half' || record.exerciseMission?.status === 'half') {
        return true
      }
      return record.status === 'half'
    }).length
    
    const logCount = entries.filter(([, record]) => {
      if (record.dietMission?.status === 'log' || record.exerciseMission?.status === 'log') {
        return true
      }
      return record.status === 'log'
    }).length
    
    return { totalDays, totalScore, completedCount, halfCount, logCount }
  }

  const getPreviousDate = (dateString) => {
    const date = new Date(dateString)
    date.setDate(date.getDate() - 1)
    return date.toISOString().slice(0, 10)
  }

  const getStreakCount = () => {
    let count = 0
    let cursor = today
    
    // 기록이 있는지 확인 (새 구조와 기존 구조 모두)
    const hasRecord = (record) => record && (record.totalScore > 0 || record.score > 0)
    
    if (!hasRecord(missionRecords[cursor])) {
      cursor = getPreviousDate(cursor)
    }

    while (hasRecord(missionRecords[cursor])) {
      count += 1
      cursor = getPreviousDate(cursor)
    }

    return count
  }

  const getWeeklyScore = () => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0: 일, 1: 월, ..., 6: 토
    const monday = new Date(now)
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)) // 이번 주 월요일
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6) // 이번 주 일요일

    const mondayStr = formatDateString(monday)
    const sundayStr = formatDateString(sunday)

    let total = 0
    Object.entries(missionRecords).forEach(([date, record]) => {
      if (date >= mondayStr && date <= sundayStr) {
        // 새 구조: totalScore
        if (record.totalScore !== undefined) {
          total += record.totalScore
        } else {
          // 기존 구조: score
          total += record.score || 0
        }
      }
    })
    return total
  }

  const getBadges = () => {
    const badges = []
    const completedMissions = {}

    Object.values(missionRecords).forEach(record => {
      // 기존 구조: missionType과 missionTitle 사용
      if (record.missionType && record.missionTitle) {
        const key = `${record.missionType}-${record.missionTitle}`
        completedMissions[key] = (completedMissions[key] || 0) + (record.status === 'completed' ? 1 : 0)
      }
      
      // 새 구조: dietMission과 exerciseMission에서 completed 카운트
      if (record.dietMission?.status === 'completed') {
        const key = `diet-${record.dietMission.missionTitle}`
        completedMissions[key] = (completedMissions[key] || 0) + 1
      }
      if (record.exerciseMission?.status === 'completed') {
        const key = `exercise-${record.exerciseMission.missionTitle}`
        completedMissions[key] = (completedMissions[key] || 0) + 1
      }
    })

    if (streakCount >= 7) badges.push('꾸준왕')
    if (completedMissions['activity-점심 식사 후 10분 걷기'] >= 3 || completedMissions['exercise-점심 식사 후 10분 걷기'] >= 3) badges.push('점심산책왕')
    if (completedMissions['habit-단 음료 대신 물 또는 무가당 차 마시기'] >= 5 || completedMissions['diet-단 음료 대신 물 또는 무가당 차 마시기'] >= 5) badges.push('물마시기왕')
    if (completedMissions['habit-오늘 점심에 채소 반찬 2가지 이상 먹기'] >= 3 || completedMissions['diet-오늘 점심에 채소 반찬 2가지 이상 먹기'] >= 3) badges.push('채소추가왕')
    if (streakCount >= 10) badges.push('회식방어왕')
    if (completedMissions['efficacy-실패했어도 다시 시작 버튼 누르기'] >= 3) badges.push('다시시작왕')

    return badges
  }

  const recordSummary = getMonthSummary()
  const streakCount = getStreakCount()
  const weeklyScore = getWeeklyScore()
  const monthlyScore = recordSummary.totalScore
  const practiceDays = recordSummary.totalDays
  const badges = getBadges()

  const myStats = {
    name: form.nickname || '나',
    weeklyScore,
    monthlyScore,
    practiceDays,
    streakDays: streakCount,
    badges,
    isMe: true,
  }

  const allUsers = [...exampleUsers, myStats].sort((a, b) => b.monthlyScore - a.monthlyScore)
  const myRank = allUsers.findIndex(user => user.isMe) + 1

  const renderHealthCheck = () => {
    if (healthCheckStage === 'basicInfo') {
      return (
        <>
          <section className="card intro-card">
            <h2>30–40대 직장인 건강체크</h2>
            <p>30–40대 직장인 남성을 위한 건강 루틴 체크입니다. 기본 정보와 생활습관 설문을 입력하면 BMI와 식습관·운동습관 점수를 확인할 수 있습니다.</p>
            <p className="disclaimer">이 앱은 의료 진단이 아니라 영양교육 실습용 자가진단입니다.</p>
          </section>

          <section className="card placeholder-card">
            <h3>1단계: 기본 정보 입력</h3>
            <form className="diagnosis-form" onSubmit={handleHealthCheckBasicInfoSubmit}>
              <div className="field-group">
                <label>
                  닉네임
                  <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임을 입력하세요"
                    value={form.nickname}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="field-row">
                <label>
                  나이대
                  <select name="age" value={form.age} onChange={handleChange}>
                    <option>30대</option>
                    <option>40대</option>
                  </select>
                </label>
                <label>
                  키 (cm)
                  <input
                    type="number"
                    name="height"
                    placeholder="170"
                    value={form.height}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="field-row">
                <label>
                  체중 (kg)
                  <input
                    type="number"
                    name="weight"
                    placeholder="70"
                    value={form.weight}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <button className="big-button" type="submit">
                다음: 설문 입력
              </button>
            </form>

            {errorMessage && (
              <div className="validation-message">{errorMessage}</div>
            )}
          </section>
        </>
      )
    }

    if (healthCheckStage === 'survey') {
      return (
        <>
          <section className="card survey-header">
            <h2>2단계: 생활습관 설문</h2>
            <p className="survey-notice">
              응답 기준: 최근 1개월 동안의 평소 생활습관을 기준으로 답해주세요.<br />
              이 설문은 영양교육 및 상담 실습을 위한 교육용 사전 설문이며, 의료 진단이 아닙니다.
            </p>
          </section>

          {surveyQuestions.map((question, index) => {
            let currentSection = null
            const showSection = question.section && question.section !== currentSection
            if (showSection) {
              currentSection = question.section
            }
            return (
              <section key={question.id} className="card survey-question">
                {showSection && (
                  <h3 className="survey-section">{question.section}</h3>
                )}
                <div className="question-number">{index + 1}.</div>
                <div className="question-text">{question.question}</div>
                {question.description && (
                  <div className="question-description">{question.description}</div>
                )}
                <div className="question-options">
                  {question.options.map((option) => (
                    <label key={option} className="option-label">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={surveyResponses[question.id] === option}
                        onChange={(e) => handleSurveyChange(question.id, e.target.value)}
                      />
                      <span className="option-text">{option}</span>
                    </label>
                  ))}
                </div>
              </section>
            )
          })}

          <section className="card survey-actions">
            <button className="big-button" type="button" onClick={handleHealthCheckSurveySubmit}>
              3단계: 결과 보기
            </button>
            <button className="big-button" type="button" onClick={() => setHealthCheckStage('basicInfo')} style={{ marginTop: '8px', background: '#ccc' }}>
              이전: 기본 정보 수정
            </button>
          </section>
        </>
      )
    }

    if (healthCheckStage === 'result') {
      return (
        <>
          <section className="card intro-card">
            <h2>3단계: 결과 확인</h2>
            <p>당신의 건강 상태를 한눈에 확인하세요.</p>
          </section>

          <section className="card result-card">
            <h3>{profileData?.nickname}님의 건강 체크 결과</h3>
            
            <div className="result-grid">
              <div className="score-card">
                <strong>BMI</strong>
                <div className="score-value" style={{ fontSize: '24px', color: '#2563eb' }}>{result?.bmi}</div>
                <div className="score-status">{result?.bmiCategory}</div>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>기준상 해당</p>
              </div>
              {preSurveyScores && (
                <>
                  <div className="score-card diet">
                    <strong>식습관 점수</strong>
                    <div className="score-value">{preSurveyScores.dietScore} / 40</div>
                    <div className="score-status">{preSurveyScores.dietStatus}</div>
                    <div className="progress">
                      <div className="progress-bar diet-bar" style={{ width: `${(preSurveyScores.dietScore / 40) * 100}%` }} />
                    </div>
                  </div>
                  <div className="score-card activity">
                    <strong>운동습관 점수</strong>
                    <div className="score-value">{preSurveyScores.activityScore} / 40</div>
                    <div className="score-status">{preSurveyScores.activityStatus}</div>
                    <div className="progress">
                      <div className="progress-bar activity-bar" style={{ width: `${(preSurveyScores.activityScore / 40) * 100}%` }} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <BMIChart bmi={result?.bmi} />

            {preSurveyScores && (
              <>
                <div className="total-card">
                  <strong>종합 점수</strong>
                  <div className="total-value">{preSurveyScores.totalScore} / 80</div>
                  <div className="total-status">{preSurveyScores.totalStatus}</div>
                </div>

                <div className="improvement-list">
                  <strong>주요 개선 포인트 TOP 3</strong>
                  <ol>
                    {preSurveyScores.improvementPoints && preSurveyScores.improvementPoints.length > 0 ? (
                      preSurveyScores.improvementPoints.map((p, i) => <li key={i}>{p}</li>)
                    ) : (
                      <li>특별히 개선이 필요한 항목이 적습니다. 작은 실천부터 시작해보세요.</li>
                    )}
                  </ol>
                </div>

                <div className="recommendation">
                  <strong>오늘의 추천 실천</strong>
                  <p>{preSurveyScores.recommendation}</p>
                </div>
              </>
            )}

            <div className="result-actions">
              <button className="big-button" type="button" onClick={handleEditResponse}>응답 수정하기</button>
              <button className="big-button" type="button" onClick={() => setActiveTab('meal')} style={{ background: '#10b981', marginTop: '8px' }}>식사 추천 보기</button>
              <button className="big-button" type="button" onClick={() => setActiveTab('mission')} style={{ background: '#f59e0b', marginTop: '8px' }}>미션 시작하기</button>
            </div>
          </section>
        </>
      )
    }

    return <>오류: 알 수 없는 단계</>
  }

  const renderMeal = () => {
    const mealCategories = ['아침', '점심', '저녁', '야식·회식', '편의점·카페']
    const filteredCards = mealCards.filter((card) => card.category === activeMealCategory)

    return (
      <>
        <section className="card meal-header">
          <h2>식사 추천</h2>
          <p className="meal-note">정확한 영양 기준을 바탕으로 한 실천 팁</p>
        </section>

        <div className="meal-category-buttons">
          {mealCategories.map((category) => (
            <button
              key={category}
              className={`meal-category-btn ${activeMealCategory === category ? 'active' : ''}`}
              onClick={() => setActiveMealCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="meal-grid">
          {filteredCards.map((item) => (
            <section key={item.title} className="card meal-card">
              <div className="meal-card-title">
                <span className="meal-emoji" aria-hidden="true">{item.emoji}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
              <span className="meal-badge">{item.badge}</span>
              <div className="meal-section">
                <strong>건강하게 선택하는 팁</strong>
                <ul>
                  {item.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="meal-section">
                <strong>조절이 필요한 선택</strong>
                <p>{item.caution}</p>
              </div>
              <p className="meal-action">{item.action}</p>
            </section>
          ))}
        </div>
      </>
    )
  }

  const renderMission = () => {
    const dietMission = getDietMissionForDate(today)
    const exerciseMission = getExerciseMissionForDate(today)
    const todayData = missionRecords[today]

    const handleMissionSubmit = (missionType, statusLabel) => {
      const score = statusLabel === '완료' ? 10 : statusLabel === '절반 성공' ? 5 : 2
      const status = getStatusCode(statusLabel)

      const newRecord = {
        ...todayData,
      }

      if (missionType === 'diet') {
        newRecord.dietMission = {
          missionTitle: dietMission.title,
          status,
          score,
          completedAt: new Date().toISOString(),
        }
      } else if (missionType === 'exercise') {
        newRecord.exerciseMission = {
          missionTitle: exerciseMission.title,
          status,
          score,
          completedAt: new Date().toISOString(),
        }
      }

      // 총점 계산
      const dietScore = newRecord.dietMission?.score || 0
      const exerciseScore = newRecord.exerciseMission?.score || 0
      newRecord.totalScore = dietScore + exerciseScore

      setMissionRecords((prev) => ({ ...prev, [today]: newRecord }))
    }

    const renderMissionCard = (mission, missionType, record) => {
      const statusLabel = statusLabels[record?.status] || '미기록'
      const badgeType = missionType === 'diet' ? 'diet' : 'exercise'
      const badgeText = missionType === 'diet' ? '🍽️ 식단 미션' : '💪 운동 미션'

      return (
        <section className="card mission-card" key={missionType}>
          <div className="mission-top">
            <span className={`mission-emoji`}>{mission.emoji}</span>
            <div>
              <span className={`mission-badge mission-${badgeType}`}>
                {badgeText}
              </span>
              <h3>{mission.title}</h3>
              <p>{mission.why}</p>
            </div>
          </div>
          <div className="mission-meta">
            <span>예상 소요 시간: {mission.duration}</span>
            <span>난이도: {mission.difficulty}</span>
          </div>
          <div className="mission-buttons">
            <button
              type="button"
              className={`mission-action complete ${record?.status === 'completed' ? 'active' : ''}`}
              onClick={() => handleMissionSubmit(missionType, '완료')}
            >
              완료 (10점)
            </button>
            <button
              type="button"
              className={`mission-action half ${record?.status === 'half' ? 'active' : ''}`}
              onClick={() => handleMissionSubmit(missionType, '절반 성공')}
            >
              절반 성공 (5점)
            </button>
            <button
              type="button"
              className={`mission-action log ${record?.status === 'log' ? 'active' : ''}`}
              onClick={() => handleMissionSubmit(missionType, '기록만 하기')}
            >
              기록만 하기 (2점)
            </button>
          </div>
          {record && (
            <div className="mission-status">
              <p className="mission-status-text">
                현재 선택: {statusLabel} / 점수: {record.score}점
              </p>
              <p className="mission-praise">{praiseMessage(record.status)}</p>
            </div>
          )}
        </section>
      )
    }

    return (
      <>
        <section className="card mission-intro-card">
          <h2>오늘의 건강 미션</h2>
          <p className="mission-intro-date">{formatDateForDisplay(today)}</p>
          <p className="mission-intro-note">식단과 운동을 하루에 하나씩 실천해보세요.</p>
        </section>

        {renderMissionCard(dietMission, 'diet', todayData?.dietMission)}
        {renderMissionCard(exerciseMission, 'exercise', todayData?.exerciseMission)}

        {todayData && (
          <section className="card mission-summary-card">
            <h3>오늘 기록 - {formatDateForDisplay(today)}</h3>
            <div className="mission-summary-grid">
              <div className="summary-item">
                <span className="summary-label">식단 점수</span>
                <span className="summary-score">{todayData.dietMission?.score || 0}점</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">운동 점수</span>
                <span className="summary-score">{todayData.exerciseMission?.score || 0}점</span>
              </div>
              <div className="summary-item total">
                <span className="summary-label">하루 총점</span>
                <span className="summary-score total-score">{todayData.totalScore}점</span>
              </div>
            </div>
          </section>
        )}
      </>
    )
  }

  const renderRecord = () => {
    const current = new Date(today)
    const year = current.getFullYear()
    const month = current.getMonth()
    const monthName = `${year}년 ${month + 1}월`
    const calendarCells = buildMonthMatrix(year, month)
    const selectedRecord = missionRecords[selectedDate]
    
    // 새 구조와 기존 구조 모두 지원
    const details = selectedRecord
      ? {
          date: selectedDate,
          displayDate: formatDateForDisplay(selectedDate),
          // 새 구조 지원
          dietMission: selectedRecord.dietMission,
          exerciseMission: selectedRecord.exerciseMission,
          totalScore: selectedRecord.totalScore,
          // 기존 구조 지원
          title: selectedRecord.missionTitle,
          type: selectedRecord.missionType,
          status: selectedRecord.statusLabel || statusLabels[selectedRecord.status],
          score: selectedRecord.score,
          completedAt: selectedRecord.completedAt ? new Date(selectedRecord.completedAt).toLocaleString() : null,
        }
      : null

    return (
      <>
        <section className="card record-header">
          <div>
            <h2>나의 실천 기록</h2>
            <p>이번 달 달력과 요약 통계로 실천이 쌓이는 느낌을 확인해 보세요.</p>
          </div>
        </section>

        <section className="card calendar-card">
          <div className="calendar-title">
            <strong>{monthName}</strong>
            <span>오늘: {today}</span>
          </div>
          <div className="calendar-grid calendar-weekdays">
            {['월', '화', '수', '목', '금', '토', '일'].map((label) => (
              <div key={label} className="calendar-weekday">
                {label}
              </div>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarCells.map((cell, index) => {
              if (cell.empty) {
                return <div key={index} className="calendar-cell empty" />
              }
              const isToday = cell.dateString === today
              const isSelected = cell.dateString === selectedDate
              
              // 총점 기반 색상 결정
              let scoreClass = 'score-none'
              if (cell.totalScore >= 20) {
                scoreClass = 'score-high'
              } else if (cell.totalScore >= 10) {
                scoreClass = 'score-mid'
              } else if (cell.totalScore >= 1) {
                scoreClass = 'score-low'
              }
              
              return (
                <button
                  key={cell.dateString}
                  type="button"
                  className={`calendar-cell ${scoreClass} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(cell.dateString)}
                  title={`${cell.day}일 - 총점: ${cell.totalScore}점`}
                >
                  <span className="calendar-day">{cell.day}</span>
                  {cell.totalScore > 0 && (
                    <span className="calendar-score">{cell.totalScore}점</span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section className="card stats-grid">
          <div className="stat-card">
            <strong>총 실천일</strong>
            <p>{recordSummary.totalDays}일</p>
          </div>
          <div className="stat-card">
            <strong>총 점수</strong>
            <p>{recordSummary.totalScore}점</p>
          </div>
          <div className="stat-card">
            <strong>완료한 날</strong>
            <p>{recordSummary.completedCount}일</p>
          </div>
          <div className="stat-card">
            <strong>절반 성공</strong>
            <p>{recordSummary.halfCount}일</p>
          </div>
          <div className="stat-card">
            <strong>기록만 한 날</strong>
            <p>{recordSummary.logCount}일</p>
          </div>
          <div className="stat-card">
            <strong>연속 실천</strong>
            <p>{streakCount}일</p>
          </div>
        </section>

        <section className="card encouragement-card">
          <p>이번 달 {recordSummary.totalDays}일 실천했어요. 작은 습관이 쌓이고 있어요.</p>
          <p>{streakCount}일 연속 실천 중이에요. 꾸준함이 가장 큰 변화입니다.</p>
          <p>기록만 한 날도 다시 시작한 날입니다.</p>
          <p>순위보다 중요한 것은 어제보다 나아지는 것입니다.</p>
        </section>

        <section className="card record-detail-card">
          <h3>선택한 날짜 기록</h3>
          {details ? (
            <div className="record-detail-list">
              <div>
                <strong>날짜</strong>
                <p>{details.displayDate || details.date}</p>
              </div>
              
              {details.dietMission || details.exerciseMission ? (
                <>
                  {details.dietMission && (
                    <div className="record-mission-detail">
                      <strong>식단 미션</strong>
                      <p>{details.dietMission.missionTitle}</p>
                      <p className="record-mission-status">
                        상태: {statusLabels[details.dietMission.status]} / 점수: {details.dietMission.score}점
                      </p>
                    </div>
                  )}
                  {!details.dietMission && (
                    <div className="record-mission-detail">
                      <strong>식단 미션</strong>
                      <p className="record-mission-empty">아직 기록 없음</p>
                    </div>
                  )}
                  
                  {details.exerciseMission && (
                    <div className="record-mission-detail">
                      <strong>운동 미션</strong>
                      <p>{details.exerciseMission.missionTitle}</p>
                      <p className="record-mission-status">
                        상태: {statusLabels[details.exerciseMission.status]} / 점수: {details.exerciseMission.score}점
                      </p>
                    </div>
                  )}
                  {!details.exerciseMission && (
                    <div className="record-mission-detail">
                      <strong>운동 미션</strong>
                      <p className="record-mission-empty">아직 기록 없음</p>
                    </div>
                  )}
                  
                  <div className="record-total-score">
                    <strong>하루 총점</strong>
                    <p>{details.totalScore}점</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>미션 제목</strong>
                    <p>{details.title || '없음'}</p>
                  </div>
                  <div>
                    <strong>미션 유형</strong>
                    <p>{details.type || '없음'}</p>
                  </div>
                  <div>
                    <strong>상태</strong>
                    <p>{details.status || '없음'}</p>
                  </div>
                  <div>
                    <strong>점수</strong>
                    <p>{details.score}점</p>
                  </div>
                  {details.completedAt && (
                    <div>
                      <strong>기록 시간</strong>
                      <p>{details.completedAt}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="empty-record-message">이 날은 아직 기록이 없어요. 오늘부터 다시 시작할 수 있습니다.</p>
          )}
        </section>
      </>
    )
  }

  const renderRanking = () => (
    <>
      <section className="card ranking-header">
        <h2>실천 점수 랭킹</h2>
        <p className="ranking-note">체중이 아니라 실천을 비교합니다. 작은 습관이 큰 변화를 만듭니다.</p>
      </section>

      <section className="card my-stats">
        <h3>내 실천 통계</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <strong>이번 주 점수</strong>
            <p>{weeklyScore}점</p>
          </div>
          <div className="stat-card">
            <strong>이번 달 점수</strong>
            <p>{monthlyScore}점</p>
          </div>
          <div className="stat-card">
            <strong>실천일 수</strong>
            <p>{practiceDays}일</p>
          </div>
          <div className="stat-card">
            <strong>연속 실천일</strong>
            <p>{streakCount}일</p>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="badges">
            <strong>내 배지</strong>
            <div className="badge-list">
              {badges.map(badge => (
                <span key={badge} className="badge">{badge}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="card ranking-list">
        <h3>월간 랭킹</h3>
        <ol className="ranking-ol">
          {allUsers.map((user, index) => (
            <li key={user.name} className={`ranking-item ${user.isMe ? 'me' : ''}`}>
              <span className="rank">{index + 1}위</span>
              <span className="name">{user.name}</span>
              <span className="score">{user.monthlyScore}점</span>
              <div className="user-badges">
                {user.badges.map(badge => (
                  <span key={badge} className="badge small">{badge}</span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card encouragement-card">
        {myRank <= 3 ? (
          <p>축하합니다! 상위권이에요. 꾸준함이 빛을 발하고 있어요.</p>
        ) : myRank <= 5 ? (
          <p>좋아요! 중간 그룹이에요. 조금만 더 노력하면 상위로 올라갈 수 있어요.</p>
        ) : (
          <p>괜찮아요. 시작이 반이에요. 매일 조금씩 실천하다 보면 순위가 올라갈 거예요.</p>
        )}
        <p>건강은 경쟁이 아니라 자기 관리입니다. 오늘도 한 걸음 더 나아가 보세요!</p>
      </section>
    </>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'healthcheck':
        return renderHealthCheck()
      case 'meal':
        return renderMeal()
      case 'mission':
        return renderMission()
      case 'record':
        return renderRecord()
      case 'ranking':
        return renderRanking()
      default:
        return renderHealthCheck()
    }
  }

  return (
    <div className="app-shell">
      <main className="screen">{renderContent()}</main>

      <nav className="bottom-nav" aria-label="하단 메뉴">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
