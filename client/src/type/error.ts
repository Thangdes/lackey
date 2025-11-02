export type DomainErrorCode =
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN";

export type DomainError = {
  code: DomainErrorCode;
  message: string;
  cause?: unknown;
  isRetryable?: boolean;
};
