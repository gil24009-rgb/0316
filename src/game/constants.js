export const GAME_WIDTH = 585;
export const GAME_HEIGHT = 270;

export const TILE = 16;

export const PLAYER_W = 32;
export const PLAYER_H = 48;

export const BOX_W = 24;
export const BOX_H = 24;

export const BUBBLE_W = 48;
export const BUBBLE_H = 24;

export const INTERACT_DIST = 24;
export const BUBBLE_DELAY_MS = 300;

export const MOVE_SPEED = 120;

export const WORLD_START_X = 0;

// 오버월드 이벤트 위치
export const BOX1_X = 900;
export const BOX2_X = 1800;
export const BOX3_X = 2700;
export const FALL_TRIGGER_X = 3400;

// 지하 상호작용 트리거 위치
export const UNDERGROUND_INTERACT_X = 800;

// 컷씬 시간
export const CUT_Q_TIME_MS = 800;
export const CUT_SHAKE_MS = 600;
export const CUT_FALL_MS = 1200;

// 아이템 키
export const ITEM_TSHIRT = "tshirt";
export const ITEM_GUITAR = "guitar";
export const ITEM_HAT = "hat";

// 비디오 파일 (public 기준 경로)
export const VIDEO_FILE = "assets/video/birthday_song.mp4";

// UI 텍스트
export const UI_TEXT = {
  title: "Birthday Adventure",
  startHint: "터치해서 시작",
  touchMe: "!",
  wearBtn: "착용하기",
  downloadBtn: "노래 영상 저장하기",
  downloadHint: "새 창에서 열리면 저장을 선택해주세요",
  stageBanner: "생일 축하축하축하해요",
  celebrateBubble: "생일 축하 받기",
  acquired: "획득!",

  items: {
    [ITEM_TSHIRT]: {
      name: "울리히 티셔츠",
      descLines: [
        "그렇다, 멋진 여성이라면,",
        "생일에 이정도 티셔츠는 입어줘야 하는 것이다"
      ]
    },
    [ITEM_GUITAR]: {
      name: "유이 기타",
      descLines: [
        "그렇다, 멋진 여성이라면,",
        "생일에 이 정도 기타는 매줘야 하는 것이다."
      ]
    },
    [ITEM_HAT]: {
      name: "생일 모자",
      descLines: [
        "빰빰 생일 축하합니다 생일 축하합니다",
        "사랑하는 도원의 생일 축하합니다 빰빰"
      ]
    }
  }
};