export interface TeamsLikeMessage {
  id: string;
  body: string;
  fromName: string;
  fromInitials: string;
  fromMe: boolean;
  created: string;    // formatted datetime
  avatarUrl?: string; // optional
}
