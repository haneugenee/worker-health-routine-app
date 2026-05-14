import { useEffect, useState } from 'react'
import './App.css'

const tabs = [
  { id: 'home', label: '홈' },
  { id: 'diagnosis', label: '진단' },
  { id: 'meal', label: '식사' },
  { id: 'mission', label: '미션' },
  { id: 'record', label: '기록' },
  { id: 'ranking', label: '랭킹' },
]

const missionStorageKey = 'dailyMissionRecords'

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
  waist: '',
  alcohol: '거의 없음',
  lateSnack: '거의 없음',
  breakfast: '거의 안 함',
  exercise: '주 3회 이상',
  sugarDrink: '거의 없음',
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
  {
    emoji: '🍲',
    title: '한식 백반',
    description: '균형 있는 한 끼를 직장인 점심에 쉽게 선택하는 방법입니다.',
    badge: '균형식 · 채소 섭취 · 나트륨 조절',
    tips: ['밥은 2/3공기 정도로 조절하기', '채소 반찬을 먼저 먹기', '국/찌개 국물은 절반 이하로 줄이기'],
    caution: '짠 국물과 김치류를 많이 먹는 것',
    action: '적당한 반찬과 국물 조절로 든든하고 가벼운 식사를 실천해 보세요.',
  },
  {
    emoji: '🥣',
    title: '국밥',
    description: '바쁜 점심에 포만감은 있지만 나트륨과 포화지방을 조절해야 합니다.',
    badge: '나트륨 조절 · 포화지방 조절',
    tips: ['국물은 절반 정도 남기기', '밥은 따로 받아 양 조절하기', '김치와 깍두기 양 줄이기'],
    caution: '국물까지 모두 먹기',
    action: '국물과 밥 양을 스스로 조절해 부담을 낮춰 보세요.',
  },
  {
    emoji: '🍽️',
    title: '돈가스',
    description: '기분 전환 메뉴로 좋지만 튀김과 소스 선택에 주의가 필요합니다.',
    badge: '튀김류 · 포화지방 조절',
    tips: ['소스는 따로 받아 찍어 먹기', '샐러드를 먼저 먹기', '밥은 일부 남기기'],
    caution: '소스를 전부 붓고 튀김과 밥을 많이 먹기',
    action: '소스를 적당히 찍어 먹고 채소와 함께 즐겨 보세요.',
  },
  {
    emoji: '🥘',
    title: '제육볶음',
    description: '고단백 메뉴로 좋아도 양념과 밥 선택을 신경 쓰는 것이 좋습니다.',
    badge: '단백질 · 나트륨 조절',
    tips: ['쌈 채소와 함께 먹기', '밥 양 줄이기', '양념에 밥 비벼 먹기 줄이기'],
    caution: '밥 추가와 양념 과다 섭취',
    action: '고기와 채소를 함께 먹어 포만감과 영양을 조절해 보세요.',
  },
  {
    emoji: '🥪',
    title: '편의점 식사',
    description: '빠르게 먹을 때도 단백질과 채소 보충을 중심에 두세요.',
    badge: '단백질 보충 · 채소 보충 · 당류 줄이기',
    tips: ['삼각김밥 단독보다 달걀/닭가슴살 추가', '샐러드나 채소류 함께 구매', '음료는 물이나 무가당 차 선택'],
    caution: '컵라면+삼각김밥+단 음료 조합',
    action: '편의점에서도 단백질과 채소를 함께 선택해 보세요.',
  },
  {
    emoji: '🥡',
    title: '중국집',
    description: '중식 메뉴는 맛있지만 나트륨과 탄수화물을 함께 조절하는 것이 중요합니다.',
    badge: '나트륨 · 정제 탄수화물 · 튀김류 조절',
    tips: ['면 양을 조금 남기기', '짬뽕 국물을 적게 먹기', '탕수육은 소스에 찍어 먹기'],
    caution: '면+밥+튀김을 모두 많이 먹기',
    action: '메뉴를 조금씩 조절해 가볍게 즐겨 보세요.',
  },
  {
    emoji: '🥂',
    title: '회식',
    description: '회식 자리에서는 음주와 안주 선택을 부드럽게 조절하는 것이 중요합니다.',
    badge: '음주 절제 · 고열량 안주 · 수분 섭취',
    tips: ['공복으로 가지 않기', '술 한 잔 후 물 한 컵', '튀김보다 구이/찜/회/채소 안주 선택'],
    caution: '2차에서 라면, 치킨, 탄수화물 야식 추가하기',
    action: '술과 안주를 조금씩 신경 써서 다음 날 부담을 줄여보세요.',
  },
  {
    emoji: '🌙',
    title: '야근/야식',
    description: '늦은 시간에는 소화 부담을 줄이고 과식을 피하는 것이 좋습니다.',
    badge: '과식 예방 · 수면 전 부담 줄이기',
    tips: ['야식 전 물 한 컵 마시기', '라면 대신 두부/달걀/요거트/샐러드+단백질', '잠들기 2시간 전 마무리하기'],
    caution: '잠들기 직전 맵고 짠 음식 과식',
    action: '가벼운 선택으로 다음 날 컨디션을 지켜보세요.',
  },
  {
    emoji: '☕',
    title: '카페 음료',
    description: '카페 메뉴는 당류를 줄이는 선택이 건강한 습관입니다.',
    badge: '당류 줄이기',
    tips: ['시럽 없는 아메리카노/무가당 차 선택', '라떼는 작은 사이즈로', '달달한 음료는 가끔 선택'],
    caution: '휘핑크림, 시럽, 당류 높은 음료 자주 마시기',
    action: '당류 선택을 줄여 하루 수분과 에너지 균형을 지켜보세요.',
  },
]

const foodMissions = [
  { title: '오늘 점심에 채소 반찬 2가지 이상 먹기', why: '채소를 충분히 먹으면 포만감과 영양이 좋아집니다.', duration: '10분', difficulty: '쉬움' },
  { title: '국물 음식은 국물 절반 남기기', why: '나트륨과 칼로리 부담을 줄이는 데 도움이 됩니다.', duration: '5분', difficulty: '쉬움' },
  { title: '단 음료 대신 물 또는 무가당 차 마시기', why: '당류 섭취를 줄여 건강한 수분 섭취를 돕습니다.', duration: '하루종일', difficulty: '쉬움' },
  { title: '밥을 평소보다 1/3 덜어내고 먹기', why: '정제 탄수화물을 조절하는 작은 습관입니다.', duration: '5분', difficulty: '쉬움' },
  { title: '튀김 대신 구이, 찜, 삶은 메뉴 선택하기', why: '포화지방과 기름 섭취를 줄이는 데 도움이 됩니다.', duration: '5분', difficulty: '보통' },
  { title: '커피믹스 대신 아메리카노 또는 무가당 음료 선택하기', why: '당류와 칼로리 섭취를 줄이는 선택입니다.', duration: '하루종일', difficulty: '쉬움' },
  { title: '야식 먹기 전 물 한 컵 마시고 10분 기다리기', why: '소화를 돕고 과식을 줄이는 습관입니다.', duration: '15분', difficulty: '쉬움' },
  { title: '식사 속도를 늦추고 15분 이상 천천히 먹기', why: '천천히 먹으면 포만감을 더 잘 느낄 수 있습니다.', duration: '15분', difficulty: '보통' },
]

const activityMissions = [
  { title: '점심 식사 후 10분 걷기', why: '식사 후 가벼운 걷기는 소화를 돕습니다.', duration: '10분', difficulty: '쉬움' },
  { title: '엘리베이터 대신 계단 3층 오르기', why: '짧은 활동이 일상 운동량을 늘려줍니다.', duration: '5분', difficulty: '쉬움' },
  { title: '퇴근 후 15분 산책하기', why: '퇴근 후 산책이 스트레스 완화와 활동량에 도움이 됩니다.', duration: '15분', difficulty: '쉬움' },
  { title: '1시간마다 자리에서 일어나 스트레칭하기', why: '자주 움직이면 피로감과 긴장감을 줄일 수 있습니다.', duration: '하루종일', difficulty: '보통' },
  { title: '스쿼트 10회 하기', why: '간단한 근력 운동이 활동량을 높입니다.', duration: '5분', difficulty: '쉬움' },
  { title: '하루 7,000보 도전하기', why: '걷기는 꾸준한 건강 습관을 만드는 좋은 방법입니다.', duration: '하루종일', difficulty: '보통' },
  { title: '출퇴근길 한 정거장 먼저 내려 걷기', why: '이동 중 작은 걸음이 활동량을 더해줍니다.', duration: '10분', difficulty: '쉬움' },
]

const efficacyMissions = [
  { title: '오늘 성공한 건강 행동 1개 적기', why: '성공을 기록하면 자신감을 키우는 데 도움이 됩니다.', duration: '5분', difficulty: '쉬움' },
  { title: '내일 점심 메뉴를 미리 정하기', why: '미리 계획하면 보다 건강한 선택에 도움이 됩니다.', duration: '5분', difficulty: '쉬움' },
  { title: '회식 자리에서 내가 지킬 행동 1개 정하기', why: '미리 정하면 실천 행동이 더 쉬워집니다.', duration: '5분', difficulty: '쉬움' },
  { title: '실패했어도 다시 시작 버튼 누르기', why: '다시 시작하는 마음이 꾸준함을 만드는 힘입니다.', duration: '3분', difficulty: '쉬움' },
  { title: '이번 주 가장 쉬웠던 건강 행동 고르기', why: '작은 성공을 되돌아보면 자기효능감이 높아집니다.', duration: '5분', difficulty: '쉬움' },
  { title: '오늘 나에게 칭찬 한 문장 남기기', why: '스스로를 격려하는 습관이 지속성을 높입니다.', duration: '5분', difficulty: '쉬움' },
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

const dateStringToSeed = (dateString) => Number(dateString.split('-').join(''))

const getMissionForDate = (dateString) => {
  const seed = dateStringToSeed(dateString)
  const index = Number.isFinite(seed) ? seed % allMissions.length : 0
  return allMissions[index]
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [missionRecords, setMissionRecords] = useState({})
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()))

  const today = formatDateString(new Date())
  const todayMission = getMissionForDate(today)
  const todayRecord = missionRecords[today]

  useEffect(() => {
    const storedResult = localStorage.getItem('healthDiagnosisResult')
    const storedMission = localStorage.getItem(missionStorageKey)

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const height = Number(form.height)
    const weight = Number(form.weight)
    const waist = Number(form.waist)
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
    const waistRisk = Number.isFinite(waist) && waist >= 90
      ? '허리둘레 90cm 이상으로 복부비만 위험이 있으니 복부 중심 생활습관을 점검해 보세요.'
      : '현재 허리둘레는 기준 범위입니다. 복부 건강을 위해 꾸준한 관리가 좋습니다.'

    const riskFactors = buildRiskFactors(form)
    const recommendation = buildRecommendation(form)

    setErrorMessage('')
    setResult({
      nickname: form.nickname || '사용자',
      bmi,
      bmiCategory,
      waistRisk,
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
      cells.push({
        empty: false,
        day,
        dateString,
        status: record?.status,
        score: record?.score,
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
    const totalScore = entries.reduce((sum, [, record]) => sum + (record.score || 0), 0)
    const completedCount = entries.filter(([, record]) => record.status === 'completed').length
    const halfCount = entries.filter(([, record]) => record.status === 'half').length
    const logCount = entries.filter(([, record]) => record.status === 'log').length
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
    if (!missionRecords[cursor]) {
      cursor = getPreviousDate(cursor)
    }

    while (missionRecords[cursor]) {
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
        total += record.score || 0
      }
    })
    return total
  }

  const getBadges = () => {
    const badges = []
    const missionCounts = {}

    Object.values(missionRecords).forEach(record => {
      const key = `${record.missionType}-${record.missionTitle}`
      missionCounts[key] = (missionCounts[key] || 0) + (record.status === 'completed' ? 1 : 0)
    })

    if (streakCount >= 7) badges.push('꾸준왕')
    if (missionCounts['활동량-점심 식사 후 10분 걷기'] >= 3) badges.push('점심산책왕')
    if (missionCounts['식습관-단 음료 대신 물 또는 무가당 차 마시기'] >= 5) badges.push('물마시기왕')
    if (missionCounts['식습관-오늘 점심에 채소 반찬 2가지 이상 먹기'] >= 3) badges.push('채소추가왕')
    if (missionCounts['식습관-회식 자리에서는 음주와 안주 선택을 부드럽게 조절하는 것이 중요합니다.'] >= 2) badges.push('회식방어왕')
    if (missionCounts['자기효능감-실패했어도 다시 시작 버튼 누르기'] >= 3) badges.push('다시시작왕')

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

  const renderHome = () => (
    <>
      <section className="card intro-card">
        <h1>직장인 건강 루틴 챌린지</h1>
        <p>30-40대 직장인을 위한 하루 건강 루틴을 쉽고 친근하게 안내합니다.</p>
      </section>

      <section className="card summary-card">
        <div className="card-header">
          <span>오늘의 미션 요약</span>
          <strong>스트레칭 + 물 1잔 + 균형 식사</strong>
        </div>
        <p>작은 습관으로 하루를 활기차고 건강하게 시작해 보세요.</p>
      </section>

      <button className="big-button" type="button" onClick={() => setActiveTab('diagnosis')}>
        건강 진단 시작하기
      </button>
    </>
  )

  const renderDiagnosis = () => (
    <>
      <section className="card placeholder-card">
        <h2>건강 진단</h2>
        <p className="disclaimer">
          이 앱은 의료 진단이 아니라 교육용 자가진단입니다. 입력값은 학습 목적으로만 사용됩니다.
        </p>

        <form className="diagnosis-form" onSubmit={handleSubmit}>
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
            <label>
              허리둘레 (cm)
              <input
                type="number"
                name="waist"
                placeholder="85"
                value={form.waist}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="field-row">
            <label>
              음주 빈도
              <select name="alcohol" value={form.alcohol} onChange={handleChange}>
                <option>거의 없음</option>
                <option>주 1-2회</option>
                <option>주 3회 이상</option>
              </select>
            </label>
            <label>
              야식 빈도
              <select name="lateSnack" value={form.lateSnack} onChange={handleChange}>
                <option>거의 없음</option>
                <option>주 1-2회</option>
                <option>주 3회 이상</option>
              </select>
            </label>
          </div>

          <div className="field-row">
            <label>
              아침 결식
              <select name="breakfast" value={form.breakfast} onChange={handleChange}>
                <option>거의 안 함</option>
                <option>가끔</option>
                <option>자주</option>
              </select>
            </label>
            <label>
              운동 빈도
              <select name="exercise" value={form.exercise} onChange={handleChange}>
                <option>주 3회 이상</option>
                <option>주 1-2회</option>
                <option>거의 안 함</option>
              </select>
            </label>
          </div>

          <div className="field-group">
            <label>
              단 음료 섭취
              <select name="sugarDrink" value={form.sugarDrink} onChange={handleChange}>
                <option>거의 없음</option>
                <option>주 1-2회</option>
                <option>주 3회 이상</option>
              </select>
            </label>
          </div>

          <button className="big-button" type="submit">
            결과 보기
          </button>
        </form>

        {errorMessage && (
          <div className="validation-message">{errorMessage}</div>
        )}
      </section>

      {result && (
        <section className="card result-card">
          <h2>진단 결과</h2>
          <p className="summary-text">{result.nickname}님의 생활습관을 부드럽게 확인해 보세요.</p>
          <div className="result-grid">
            <div>
              <strong>BMI</strong>
              <p>{result.bmi}</p>
            </div>
            <div>
              <strong>BMI 분류</strong>
              <p>{result.bmiCategory}</p>
            </div>
          </div>
          <div className="result-grid">
            <div>
              <strong>허리둘레 위험</strong>
              <p>{result.waistRisk}</p>
            </div>
          </div>

          <div className="risk-list">
            <strong>주요 생활습관 위험 요인 TOP 3</strong>
            <ol>
              {result.riskFactors.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="recommendation">
            <strong>오늘 추천 행동</strong>
            <p>{result.recommendation}</p>
          </div>
        </section>
      )}
    </>
  )

  const renderMeal = () => (
    <>
      <section className="card meal-header">
        <h2>식사 추천</h2>
        <p className="meal-note">정확한 영양 기준을 바탕으로 한 실천 팁</p>
      </section>
      <div className="meal-grid">
        {mealCards.map((item) => (
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

  const renderMission = () => (
    <>
      <section className="card meal-header">
        <h2>오늘의 미션</h2>
        <p className="meal-note">작은 건강 행동을 기록하고 자기효능감을 높이는 미션입니다.</p>
      </section>

      <section className="card mission-card">
        <div className="mission-top">
          <span className={`mission-badge mission-${todayMission.type}`}>{todayMission.type}</span>
          <div>
            <h3>{todayMission.title}</h3>
            <p>{todayMission.why}</p>
          </div>
        </div>
        <div className="mission-meta">
          <span>예상 소요 시간: {todayMission.duration}</span>
          <span>난이도: {todayMission.difficulty}</span>
        </div>
        <div className="mission-buttons">
          <button
            type="button"
            className={`mission-action complete ${todayRecord?.status === 'completed' ? 'active' : ''}`}
            onClick={() => handleMissionSubmit('완료')}
          >
            완료 (10점)
          </button>
          <button
            type="button"
            className={`mission-action half ${todayRecord?.status === 'half' ? 'active' : ''}`}
            onClick={() => handleMissionSubmit('절반 성공')}
          >
            절반 성공 (5점)
          </button>
          <button
            type="button"
            className={`mission-action log ${todayRecord?.status === 'log' ? 'active' : ''}`}
            onClick={() => handleMissionSubmit('기록만 하기')}
          >
            기록만 하기 (2점)
          </button>
        </div>
      </section>

      {todayRecord && (
        <section className="card mission-result-card">
          <h3>오늘 기록</h3>
          <p className="mission-result-status">현재 상태: {todayRecord.statusLabel || statusLabels[todayRecord.status]}</p>
          <p>점수: {todayRecord.score}점</p>
          <p>{praiseMessage(todayRecord.status)}</p>
          <p className="mission-record-info">기록 시간: {new Date(todayRecord.completedAt).toLocaleString()}</p>
          <p className="mission-record-info">미션: {todayRecord.missionTitle}</p>
          <p className="mission-record-info">유형: {todayRecord.missionType}</p>
        </section>
      )}
    </>
  )

  const renderRecord = () => {
    const current = new Date(today)
    const year = current.getFullYear()
    const month = current.getMonth()
    const monthName = `${year}년 ${month + 1}월`
    const calendarCells = buildMonthMatrix(year, month)
    const selectedRecord = missionRecords[selectedDate]
    const details = selectedRecord
      ? {
          date: selectedDate,
          title: selectedRecord.missionTitle,
          type: selectedRecord.missionType,
          status: selectedRecord.statusLabel || statusLabels[selectedRecord.status],
          score: selectedRecord.score,
          completedAt: new Date(selectedRecord.completedAt).toLocaleString(),
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
              return (
                <button
                  key={cell.dateString}
                  type="button"
                  className={`calendar-cell ${cell.status ? `status-${cell.status}` : 'status-none'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(cell.dateString)}
                >
                  <span className="calendar-day">{cell.day}</span>
                  {cell.status && <span className="calendar-badge">{statusLabels[cell.status]}</span>}
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
                <p>{details.date}</p>
              </div>
              <div>
                <strong>미션 제목</strong>
                <p>{details.title}</p>
              </div>
              <div>
                <strong>미션 유형</strong>
                <p>{details.type}</p>
              </div>
              <div>
                <strong>상태</strong>
                <p>{details.status}</p>
              </div>
              <div>
                <strong>점수</strong>
                <p>{details.score}점</p>
              </div>
              <div>
                <strong>기록 시간</strong>
                <p>{details.completedAt}</p>
              </div>
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
      case 'home':
        return renderHome()
      case 'diagnosis':
        return renderDiagnosis()
      case 'meal':
        return renderMeal()
      case 'mission':
        return renderMission()
      case 'record':
        return renderRecord()
      case 'ranking':
        return renderRanking()
      default:
        return renderHome()
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
