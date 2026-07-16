---
name: Espresso Minimalist (Reference Matched)
colors:
  background: '#FCFFFE'
  on-background: '#5B5B5B'
  surface: '#FFFFFF'
  surface-dim: '#FCFFFE'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#FDFEFE'
  surface-container: '#F5F2EE'
  surface-container-high: '#EFECE9'
  surface-container-highest: '#E4DFDA'
  on-surface: '#5B5B5B'
  on-surface-variant: '#928E88'
  inverse-surface: '#5B5B5B'
  inverse-on-surface: '#FCFFFE'
  outline: '#EFECE9'
  outline-variant: '#D7CCC8'
  surface-tint: '#5B5B5B'
  primary: '#5B5B5B'
  on-primary: '#FFFFFF'
  primary-container: '#EFECE9'
  on-primary-container: '#5B5B5B'
  inverse-primary: '#928E88'
  secondary: '#928E88'
  on-secondary: '#FFFFFF'
  secondary-container: '#F5F2EE'
  on-secondary-container: '#5B5B5B'
  tertiary: '#848178'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#EFECE9'
  on-tertiary-container: '#5B5B5B'
  error: '#C77D67'
  on-error: '#FFFFFF'
  error-container: '#FFEBEE'
  on-error-container: '#C77D67'
  primary-fixed: '#EFECE9'
  primary-fixed-dim: '#D7CCC8'
  on-primary-fixed: '#5B5B5B'
  on-primary-fixed-variant: '#848178'
  secondary-fixed: '#F5F2EE'
  secondary-fixed-dim: '#EFECE9'
  on-secondary-fixed: '#5B5B5B'
  on-secondary-fixed-variant: '#928E88'
  tertiary-fixed: '#E4DFDA'
  tertiary-fixed-dim: '#D7CCC8'
  on-tertiary-fixed: '#5B5B5B'
  on-tertiary-fixed-variant: '#848178'
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

# ☕ Plug-In Cafe 브랜드 & 디자인 시스템 가이드 (레퍼런스 정밀 연동)

본 가이드는 사용자님이 제공하신 **데이트립 감성 카페 레퍼런스 이미지**에서 추출한 **실제 지배적 색채 스키마**를 기반으로 설계된 디자인 시스템 명세입니다.

---

## 1. 레퍼런스 컬러 추출 분석 결과
Pillow 라이브러리를 통해 데이트립 웹피 레퍼런스 이미지에서 추출된 실제 주요 색상 값들은 다음과 같습니다:

1. **배경색 (Background - #FCFFFE)**:
   * 이미지들의 전체 배경을 채우는 소프트하고 밝은 톤의 **크림 오프화이트**
2. **주조 텍스트 및 프레임 (Primary - #5B5B5B)**:
   * 레퍼런스 이미지 `imgi_22`에서 매칭되는 차분한 **차콜 월넛**톤
3. **가구 및 중간 계열 색상 (Secondary - #928E88)**:
   * 이미지 `imgi_34` 등 가구 가림막과 벽면에 칠해진 따뜻한 **스톤 샌드**톤
4. **사용 가능 좌석 상태 색상 (Matcha - #D6E2D8)**:
   * 이미지 `imgi_102`에서 추출한 식물/그리너리 소품 톤의 **소프트 세이지 그린**
5. **사용 불가/점유 좌석 상태 색상 (Terracotta - #C77D67)**:
   * 따뜻한 전구색 불빛이 닿은 목재 구석과 토기 소품에서 추출된 **테라코타 클레이**톤

---

## 2. 디자인 적용 규격

* **텍스트**: 주조색 `#5B5B5B`를 베이스로 하여 부드러운 검정 느낌을 주며, 메타 데이터 정보는 보조색 `#928E88`로 구성해 시각적 피로도를 최대한 낮춥니다.
* **좌석 및 그리드 상태**: 기존의 자극적인 원색(빨강, 녹색) 대신, 레퍼런스 조화에 맞추어 점유 가능 좌석은 `#D6E2D8`, 이미 사용 중인 좌석은 `#C77D67`로 파스텔 톤온톤 스타일을 유지합니다.
