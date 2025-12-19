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
  badge: string;
  description: string;
}

export const SANTA_DATA: Record<SantaId, SantaData> = {
  1: {
    miniTitle: '난로 앞에서 한잔',
    title: '☕ 코코아 산타 ☕',
    image: '/assets/images/santas/santa-1.webp',
    badge: '/assets/images/badges/santa-1.webp',
    description: `
        너는 따뜻한 온기와 잔잔한 상상력을 품은 코코아 산타야.
        따뜻한 코코아 한 잔과 함께 새벽녘 난로 앞에서 차분히 선물을 준비하지.
        코코아 위에 얹은 달달한 생크림처럼 부드러운 매력을 가지고 있어.\n
        네가 올해 내게 준 선물은 정말 마음 깊은 곳까지 감동을 주었어.
        내 생각을 많이 해주었구나?
        너의 배려 덕분에 올 한 해가 더욱 특별해졌어.\n
      메리크리스마스! ☕
      `,
  },
  2: {
    miniTitle: '🍪 기분이 저기압일 땐 쿠키앞으로 🍪',
    title: '쿠키 산타',
    image: '/assets/images/santas/santa-2.webp',
    badge: '/assets/images/badges/santa-2.webp',
    description: `
        너는 섬세하게 계량해서 만들어진 쿠키 산타야.
        마지막 아이싱까지 신경써서 마무리한 티가 나지.
        그런 눈길로 사람들의 작은 행복을 정확히 짚어 선물로 남겨.\n
        너의 세심한 마음이 담긴 선물에 진심으로 감동했어.
        늘 나를 생각해줘서 항상 고마워.
        올 한 해 너의 배려는 나에게 큰 힘이 되어주었어.\n
      메리크리스마스! 🍪
      `,
  },
  3: {
    miniTitle: '💪 흔들림 없는 든든함 💪',
    title: '근육 산타',
    image: '/assets/images/santas/santa-3.webp',
    badge: '/assets/images/badges/santa-3.webp',
    description: `
        너는 어떤 눈보라도 묵묵히 뚫고 나아가는 든든한 근육 산타야.
        체크리스트와 가죽벨트는 너의 상징이며, 운동 루틴처럼 계획된 루트를 절대 어기지 않아.
        조용한 존재감으로 깊은 믿음을 남기지.
        나에게 실용적이고 원하던 선물을 주어서 고마워.
        네가 신경써준 디테일 하나하나가 너무 소중해.
        덕분에 정말 든든하고 편안해.\n
      메리크리스마스! 💪
      `,
  },
  4: {
    miniTitle: '🦌 누구보다 빠르게 달려가는 🦌',
    title: '루돌프 산타',
    image: '/assets/images/santas/santa-4.webp',
    badge: '/assets/images/badges/santa-4.webp',
    description: `
      너는 매일매일 새로운 시도를 해보는 루돌프 산타야.
      창문, 지붕, 얼음 협곡 등 어디든 활기차게 돌파하고 개척하지.
      크리스마스를 거대한 모험이라는 선물로 만들어.\n
      너의 튼튼한 계획과 실행력은 항상 큰 도움이 되어주었어.
      항상 의미있는 선물을 받아온 것 같아서 정말 만족스러워.
      넌 언제나 뛰어난 산타야.\n
      메리크리스마스! 🦌
    `,
  },
  5: {
    miniTitle: '🌟 반짝반짝 빛나는 🌟',
    title: '오너먼트 산타',
    image: '/assets/images/santas/santa-5.webp',
    badge: '/assets/images/badges/santa-5.webp',
    description: `
      너는 반짝거리는 성격으로 순식간에 어디든 파티로 바꿔버리는 오너먼트 산타야.
      빛나는 눈송이와 즉석 이벤트로 모두를 활짝 웃게 만들어주지.
      예측 불가능한 기쁨 그 자체가 되어줘.\n
      항상 밝은 매력이 넘치는 특별한 선물을 주어서 고마워.
      네 덕분에 즐거운 한 해를 보낼 수 있었어.
      늘 나를 웃게 해주어서 고마워.\n
      메리크리스마스! 🌟
    `,
  },
  6: {
    miniTitle: '🧣 따뜻~한 온기를 전하는 🧣',
    title: '목도리 산타',
    image: '/assets/images/santas/santa-6.webp',
    badge: '/assets/images/badges/santa-6.webp',
    description: `
      너는 한 사람의 마음이라도 더 따뜻하게 만들기 위해 움직이는 목도리 산타야.
      손뜨개 스카프, 따뜻한 차, 감사 카드 등 마음이 담긴 선물 전문이지.
      온기를 전달하는 너는 정말 따스한 산타야.\n
      너의 따뜻한 마음이 가득 담긴 선물에 항상 진심으로 고마워.
      네가 나를 많이 이해하고 배려해준다는 걸 느낄 수 있어.
      덕분에 올 한 해 여러가지로 도움을 많이 받았어.\n
      메리크리스마스! 🧣
    `,
  },
  7: {
    miniTitle: '🧦 최고의 선물을 챙겨주는 🧦',
    title: '양말 산타',
    image: '/assets/images/santas/santa-7.webp',
    badge: '/assets/images/badges/santa-7.webp',
    description: `
      너는 양말 속에 숨어 발소리조차 남기지 않고 완벽하게 임무를 수행하는 양말 산타야.
      깊은 밤 별빛 아래, 관찰과 분석 끝에 최적의 장소에 최고의 선물을 남기지.
      여러번의 말보다 완벽한 하나의 행동을 할 줄 알아.\n
      항상 센스있게 최고의 선물을 해주어서 멋져.
      네가 나를 잘 이해해준 게 느껴져서 항상 고마웠어.
      덕분에 많은 문제들을 해결할 수 있었어.\n
      메리크리스마스! 🧦
    `,
  },
  8: {
    miniTitle: '🎅 나만 믿고 따라와! 🎅',
    title: '레드 산타',
    image: '/assets/images/santas/santa-8.webp',
    badge: '/assets/images/badges/santa-8.webp',
    description: `
      너는 계획·정확·속도 모두를 잡은 리더, 레드 산타야.
      루돌프와 호흡을 맞추며 가장 효율적인 배달 루트를 만들어내고 모두를 이끌어주지.
      흔들림 없는 추진력으로 크리스마스를 지휘하는 멋진 모습을 보여줘.\n
      너의 결단력과 실행력은 항상 나에게 큰 선물이었어.
      항상 믿음직스럽고 강단있는 모습에 나도 자극을 많이 받았어.
      올해같이 앞으로도 잘 부탁해\n
      메리크리스마스! 🎅
    `,
  },
};

/**
 * ID로 산타 데이터 가져오기
 */
export function getSantaById(id: number): SantaData {
  const santaId = id as SantaId;
  return SANTA_DATA[santaId] || SANTA_DATA[1];
}
