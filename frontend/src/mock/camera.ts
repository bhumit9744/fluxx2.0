export interface CameraFeedState {
  isStreaming: boolean;
  resolution: string;
  fps: number;
  mode: 'RGB_OPTICAL' | 'THERMAL_INFRARED' | 'MULTISPECTRAL';
  gimbalPitch: number;
}

export const mockCameraState: CameraFeedState = {
  isStreaming: true,
  resolution: '4K Ultra HD',
  fps: 60,
  mode: 'RGB_OPTICAL',
  gimbalPitch: -45.0
};
