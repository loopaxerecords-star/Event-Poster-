import { PosterPreset } from '../types';

export const POSTER_PRESETS: PosterPreset[] = [
  {
    id: 'ig-square',
    name: 'Instagram Square',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
    aspectRatioValue: 1,
    iconName: 'Instagram',
    description: 'Optimal for Instagram Feed posts, Carousel slides & Profile grids'
  },
  {
    id: 'ig-story',
    name: 'Instagram Story / Reel',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16',
    aspectRatioValue: 1080 / 1920,
    iconName: 'Smartphone',
    description: 'Full-screen mobile story, TikTok & YouTube Shorts size'
  },
  {
    id: 'ig-portrait',
    name: 'Instagram Portrait',
    platform: 'Instagram',
    width: 1080,
    height: 1350,
    aspectRatioLabel: '4:5',
    aspectRatioValue: 1080 / 1350,
    iconName: 'Smartphone',
    description: 'High-impact tall feed post for max screen real estate'
  },
  {
    id: 'fb-event',
    name: 'Facebook Event Cover',
    platform: 'Facebook',
    width: 1920,
    height: 1080,
    aspectRatioLabel: '16:9',
    aspectRatioValue: 1920 / 1080,
    iconName: 'Facebook',
    description: 'Standard HD Landscape for Facebook Event Banners & Posts'
  },
  {
    id: 'fb-banner',
    name: 'Facebook Shared Link',
    platform: 'Facebook',
    width: 1200,
    height: 630,
    aspectRatioLabel: '1.91:1',
    aspectRatioValue: 1200 / 630,
    iconName: 'Facebook',
    description: 'Facebook feed post, link preview, and page cover format'
  },
  {
    id: 'a4-flyer',
    name: 'A4 Print Flyer / Poster',
    platform: 'Print',
    width: 1200,
    height: 1697,
    aspectRatioLabel: '1:1.41',
    aspectRatioValue: 1200 / 1697,
    iconName: 'Printer',
    description: 'Standard print flyer format for posters, billboards & physical print'
  },
  {
    id: 'x-header',
    name: 'X / Twitter Banner',
    platform: 'Universal',
    width: 1500,
    height: 500,
    aspectRatioLabel: '3:1',
    aspectRatioValue: 1500 / 500,
    iconName: 'Share2',
    description: 'Wide horizontal header banner for event announcements'
  }
];
