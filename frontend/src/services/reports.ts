import { apiService } from './api';

export const reportService = {
  async fetchCurrentAudit() {
    return apiService.getReportData();
  },

  async triggerGeneration() {
    return apiService.generateReport();
  },

  downloadPdf() {
    window.open(apiService.getDownloadPdfUrl(), '_blank');
  }
};
