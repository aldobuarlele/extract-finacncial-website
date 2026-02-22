export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface DailyTrend {
  date: string;
  total: number;
}

export interface CategoryDistribution {
  [key: string]: number;
}

export interface AnalyticsSummary {
  report_id: string;
  filename: string;
  summary: {
    total_spent: number;
    transaction_count: number;
    currency: string;
  };
  category_distribution: CategoryDistribution;
  daily_trends: DailyTrend[];
  ai_usage: {
    total_tokens: number;
    status: ReportStatus;
  };
}

export interface UploadResponse {
  message: string;
  report_id: string;
  status: ReportStatus;
}