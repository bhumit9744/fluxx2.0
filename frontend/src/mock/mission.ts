export interface MissionProfile {
  missionId: string;
  surveyArea: string;
  totalWaypoints: number;
  completedWaypoints: number;
  samplingIntervalSeconds: number;
  startTime: string;
}

export const mockMissionData: MissionProfile = {
  missionId: 'MSN-KHARGHAR-2026-08',
  surveyArea: 'Kharghar Sector A-4 Grid',
  totalWaypoints: 50,
  completedWaypoints: 50,
  samplingIntervalSeconds: 3,
  startTime: '2026-08-08 06:00:00 UTC'
};
