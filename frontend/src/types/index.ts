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

export interface DocumentHistory {
  id: string;
  filename: string;
  status: ReportStatus;
  created_at: string;
}

export interface Transaction {
  id: string;
  date: string | null;
  merchant: string;
  amount: number;
  category: string;
}

export interface TransactionUpdatePayload {
  category_name?: string;
  merchant_name?: string;
  transaction_date?: string;
  amount?: number;
}

export interface TransactionCreatePayload {
  report_id: string;
  category_name: string;
  merchant_name: string;
  transaction_date: string;
  amount: number;
}