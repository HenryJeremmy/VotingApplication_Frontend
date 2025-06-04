
// API Response Types
export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  roles?: string[];
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface VoteResponse {
  id: string;
  voterId: string;
  candidateId: string;
  timestamp: string;
}

export interface VoteStatusResponse {
  hasVoted: boolean;
  candidateId?: string;
}
