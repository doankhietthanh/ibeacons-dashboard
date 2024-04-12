export enum MemberRole {
  HOST = "admin",
  MEMBER = "member",
}

export enum MemberStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Member {
  email: string;
  role: MemberRole;
  status: MemberStatus;
}
