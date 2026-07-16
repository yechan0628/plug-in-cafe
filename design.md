---
name: Espresso Minimalist
colors:
  background: '#FAF8F6'
  on-background: '#3E2723'
  surface: '#FFFFFF'
  surface-dim: '#FAF8F6'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#FBF9F7'
  surface-container: '#F5F2EE'
  surface-container-high: '#EFECE9'
  surface-container-highest: '#E4DFDA'
  on-surface: '#3E2723'
  on-surface-variant: '#8D6E63'
  inverse-surface: '#3E2723'
  inverse-on-surface: '#FAF8F6'
  outline: '#D7CCC8'
  outline-variant: '#BCAAA4'
  surface-tint: '#4E342E'
  primary: '#4E342E'
  on-primary: '#FFFFFF'
  primary-container: '#D7CCC8'
  on-primary-container: '#3E2723'
  inverse-primary: '#8D6E63'
  secondary: '#8D6E63'
  on-secondary: '#FFFFFF'
  secondary-container: '#F5F2EE'
  on-secondary-container: '#4E342E'
  tertiary: '#5D4037'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#D7CCC8'
  on-tertiary-container: '#3E2723'
  error: '#D84315'
  on-error: '#FFFFFF'
  error-container: '#FFCCBC'
  on-error-container: '#D84315'
  primary-fixed: '#D7CCC8'
  primary-fixed-dim: '#BCAAA4'
  on-primary-fixed: '#3E2723'
  on-primary-fixed-variant: '#4E342E'
  secondary-fixed: '#EFECE9'
  secondary-fixed-dim: '#D7CCC8'
  on-secondary-fixed: '#4E342E'
  on-secondary-fixed-variant: '#8D6E63'
  tertiary-fixed: '#E4DFDA'
  tertiary-fixed-dim: '#BCAAA4'
  on-tertiary-fixed: '#3E2723'
  on-tertiary-fixed-variant: '#5D4037'
  surface-variant: '#F5F2EE'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 38px
    fontWeight: '800'
    lineHeight: 46px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

# ☕ Plug-In Cafe 브랜드 & 디자인 시스템 가이드

본 가이드는 사용자님이 제공하신 **데이트립 감성 카페 레퍼런스 이미지(원목 가구, 따뜻한 톤, 미니멀리즘 레이아웃)**를 기반으로 설계된 **Espresso Minimalist** 디자인 시스템 명세입니다.

---

## 1. 디자인 철학 및 감성 (Brand Vibe)
제공된 데이트립 레퍼런스는 **원목의 질감, 은은하게 퍼지는 전구색 조명, 그리고 여백의 미가 돋보이는 모던 미니멀리즘**을 보여주고 있습니다. 
* **감성적 가치**: 집중하기 좋은 아늑함(Cozy focus), 프리미엄 디자이너 아지트(Premium retreat), 시각적 편안함(Visual comfort)
* **방향성**: 어둡고 칙칙한 검정색이 아닌 따뜻한 크림빛이 도는 오프화이트(#FAF8F6)를 기본 배경으로 삼고, 에스프레소 브라운(#4E342E)과 중후한 월넛 목재톤(#8D6E63)을 주조색 및 보조색으로 배치합니다.

---

## 2. 컬러 스키마 (Colors)
레퍼런스 이미지의 따뜻한 조명색과 원목 고유의 가구 색채를 추출하여 구성한 컬러 팔레트입니다.

* **Primary Brown (#4E342E - Deep Espresso)**:
  * 앱의 가장 강조되는 핵심 브랜딩 컬러입니다. 로고, 주요 텍스트, 활성화 단추 등에 사용하여 견고한 원목 가구의 중심을 형상화합니다.
* **Secondary Timber (#8D6E63 - Medium Walnut)**:
  * 서브 정보, 덜 강조되는 버튼 보더, 카테고리 필터 등의 톤을 조율합니다.
* **Warm Base Off-White (#FAF8F6 - Cream Parchment)**:
  * 눈의 피로를 최소화하기 위한 은은한 배경색입니다.
* **Matcha Green (#4CAF50 - Available Seat)**:
  * 사용 가능한 좌석의 활성 뱃지로 자연에서 온 편안한 녹색 톤을 차용했습니다.
* **Terracotta Red (#D84315 - Occupied Seat)**:
  * 사용 중이거나 선점된 좌석을 표시하기 위한 흙빛의 차분한 주황색 계열입니다.

---

## 3. 타이포그래피 (Typography)
기하학적이면서도 세련된 인상을 주는 **Outfit**을 타이틀에 사용하여 감성적인 매거진 레이아웃 느낌을 주고, 본문에는 가독성이 입증된 **Inter** 폰트를 크기와 자간을 조절해 적용합니다.

* **대형 제목 (display-lg)**: 38px (두께 800) - 카페 로고 텍스트 및 상세페이지 헤더에 활용
* **본문 텍스트 (body-lg / body-sm)**: 15px / 13px (두께 400) - 설명글 및 실시간 현황 수치
* **레이블 텍스트 (label-bold)**: 12px (두께 700) - 버튼명, 상태 표시창

---

## 4. 형태 및 라운드 (Shapes & Border Radius)
레퍼런스에서 볼 수 있는 정갈하고 정돈된 가구와 건물 기하 구조를 반영하여, 너무 뾰족하거나 둥글지 않은 최적의 모서리 곡률을 유지합니다.

* **일반 요소 (0.5rem - 8px)**: 카드 컴포넌트, 입력 창, 챗봇 입력 박스
* **좌석 아이콘 (0.25rem - 4px)**: 직관적인 형태 유지를 위해 모서리를 살짝만 라운딩 처리
* **대형 배너 및 바텀시트 (1.0rem - 16px)**: 소프트한 공간 분할감을 위한 곡선감 적용

---

## 5. rhythm (Spacing)
* **8px 그리드 시스템**: 모든 내부 패딩과 마진은 8px 단위를 기준으로 배수 적용하여 일관된 조형적 비례를 유지합니다. (xs: 8px, sm: 12px, md: 16px, lg: 24px)
* **여백의 미**: 컴포넌트 간 충분한 여백(gutter 16px)을 두어 정보의 과부하를 막고, 데이트립 특유의 차분하고 고급스러운 공간 연출을 구현합니다.
