
import { Language, Difficulty, AspectRatioOption, ImageSizeOption } from './types';

export const DEFAULT_TIME_LIMIT = 90;
export const DEFAULT_MAX_POINTS = 10;

export const LANGUAGES = [
  { code: Language.ENGLISH, name: 'English', flag: '🇺🇸' },
  { code: Language.FINNISH, name: 'Finnish', flag: '🇫🇮' },
  { code: Language.VIETNAMESE, name: 'Vietnamese', flag: '🇻🇳' },
];

export const DIFFICULTIES = [
  { level: Difficulty.EASY, name: 'Easy', color: 'bg-green-100 text-green-700' },
  { level: Difficulty.MEDIUM, name: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { level: Difficulty.HARD, name: 'Hard', color: 'bg-red-100 text-red-700' },
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: "1:1 (Square)", value: "1:1" },
  { label: "16:9 (Cinema)", value: "16:9" },
  { label: "9:16 (Phone)", value: "9:16" },
  { label: "4:3 (Classic)", value: "4:3" },
  { label: "3:2 (Photo)", value: "3:2" },
  { label: "21:9 (Ultrawide)", value: "21:9" },
];

export const IMAGE_SIZES: ImageSizeOption[] = [
  { label: "Standard (1K)", value: "1K" },
  { label: "High Def (2K)", value: "2K" },
  { label: "Ultra HD (4K)", value: "4K" },
];

export const FALLBACK_TOPICS = {
  [Language.ENGLISH]: [
    { secret: 'Apple', category: 'Fruit', forbidden: ['Fruit', 'Red', 'Eat', 'Crunchy', 'Pie'] },
    { secret: 'Pencil', category: 'Stationery', forbidden: ['Write', 'Lead', 'Eraser', 'Draw', 'Wood'] },
  ],
  [Language.FINNISH]: [
    { secret: 'Omena', category: 'Hedelmä', forbidden: ['Hedelmä', 'Punainen', 'Syödä', 'Rapea', 'Piirakka'] },
    { secret: 'Kynä', category: 'Toimistotarvike', forbidden: ['Kirjoittaa', 'Lyijy', 'Kumi', 'Piirtää', 'Puu'] },
  ],
  [Language.VIETNAMESE]: [
    { secret: 'Quả táo', category: 'Trái cây', forbidden: ['Trái cây', 'Đỏ', 'Ăn', 'Giòn', 'Bánh'] },
    { secret: 'Bút chì', category: 'Văn phòng phẩm', forbidden: ['Viết', 'Chì', 'Tẩy', 'Vẽ', 'Gỗ'] },
  ],
};
