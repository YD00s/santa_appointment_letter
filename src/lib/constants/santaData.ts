// lib/constants/santaData.ts

/**
 * 산타 타입 ID (1~8)
 * 1: 내향적/ 감정적/ 무계획/ 상상적/ INFP => 따뜻함, 느긋함, 귀여움
 * 2: 내향적/ 감정적/ 계획적/ 현실적/ ISFJ => 내향적임, 소확행, 감정적임
 * 3: 내향적/ 이성적/ 계획적/ 현실적/ ISTJ=> 묵묵함, 든든함, 조용함, 사려깊음
 * 4: 외향적/ 이성적/ 무계획/ 상상적/ ENTJ => 모험적, 과감함, 장난꾸러기
 * 5: 외향적/ 감정적/ 무계획/ 상상적/ ENFP => 밝음, 즉흥적임, 감정기복있음
 * 6: 외향적/ 감정적/ 계획적/ 상상적/ ENFJ => 포근함, 섬세함, 낭만있음, 감정적임
 * 7: 내향적/ 이성적/ 무계획/ 현실적/ ISTP => 할말은 함, 침착함, 관찰력있음
 * 8: 외향적/ 이성적/ 계획적/ 현실적/ ESTJ => 계획적임, 꼼꼼함, 책임감있음
 */
export type SantaId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SantaData {
  miniTitle: string;
  title: string;
  image: string;
  description: string;
}

export const SANTA_DATA: Record<SantaId, SantaData> = {
  1: {
    miniTitle: '난로 앞에서 한잔',
    title: '☕ 코코아 산타 ☕',
    image: '/assets/images/santa-1.png',
    description:
      '따뜻한 온기와 잔잔한 상상력을 품은 산타. 천천히 그러나 가장 깊게 마음을 어루만지며, 새벽녘 난로 앞에서 차분히 선물을 준비한다. 폭신한 담요와 작은 온기 마법이 그의 주무기다.',
  },
  2: {
    miniTitle: '🍪 기분이 저기압일 땐 쿠키앞으로 🍪',
    title: '쿠키 산타',
    image: '/assets/images/santa-2.png',
    description:
      '감정의 결을 누구보다 잘 읽는 조용한 배려형 산타. 리본 하나도 허투루 매지 않고, 아이가 깰까 조심조심 걸음을 고르는 세심함이 특징이다. 작은 행복을 정확히 짚어 선물로 남긴다.',
  },
  3: {
    miniTitle: '🎄 흔들림 없는 든든함 🎄',
    title: '근육 산타',
    image: '/assets/images/santa-3.png',
    description:
      '어떤 눈보라도 묵묵히 뚫고 나아가는 책임형 산타. 체크리스트와 가죽 장갑은 그의 상징이며, 계획된 루트를 단 한 번도 어기지 않는다. 조용한 존재감으로 깊은 믿음을 남긴다.',
  },
  4: {
    miniTitle: '🦌 누구보다 빠르게 달려가는 🦌',
    title: '루돌프 산타',
    image: '/assets/images/santa-4.png',
    description:
      '새로운 경로가 보이면 반드시 시도해보는 개척자 산타. 창문, 지붕, 얼음 협곡 등 어디든 활기차게 돌파한다. 그는 크리스마스를 하나의 거대한 모험으로 만들어낸다.',
  },
  5: {
    miniTitle: '🌟 반짝반짝 빛나는 🌟',
    title: '오너먼트 산타',
    image: '/assets/images/santa-5.png',
    description:
      '떠오르는 아이디어로 순식간에 현장을 파티로 바꿔버리는 에너지 산타. 반짝이는 눈송이와 즉석 이벤트로 모두를 활짝 웃게 만든다. 예측 불가능한 기쁨 그 자체다.',
  },
  6: {
    miniTitle: '🧣 따뜻~한 온기를 전하는 🧣',
    title: '목도리 산타',
    image: '/assets/images/santa-6.png',
    description:
      '한 사람의 마음이라도 더 따뜻하게 만들기 위해 움직이는 배려형 산타. 손뜨개 스카프, 따뜻한 차, 감사 카드 등 마음이 담긴 선물 전문. 그의 미션은 언제나 "온기 전달"이다.',
  },
  7: {
    miniTitle: '🧦 최고의 선물을 챙겨주는 🧦',
    title: '양말 산타',
    image: '/assets/images/santa-7.png',
    description:
      '발소리조차 남기지 않고 완벽하게 임무를 수행하는 조용한 실력자 산타. 깊은 밤 별빛 아래, 관찰과 분석 끝에 최적의 장소에 선물을 남긴다. 말보다 행동이 먼저다.',
  },
  8: {
    miniTitle: '🎅 나만 믿고 따라와! 🎅',
    title: '레드 산타',
    image: '/assets/images/santa-8.png',
    description:
      '계획·정확·속도 모두를 잡은 리더형 산타. 루돌프와 호흡을 맞추며 가장 효율적인 배달 루트를 만들어낸다. 흔들림 없는 추진력으로 크리스마스를 지휘한다.',
  },
};

/**
 * ID로 산타 데이터 가져오기
 */
export function getSantaById(id: number): SantaData {
  const santaId = id as SantaId;
  return SANTA_DATA[santaId] || SANTA_DATA[1];
}
