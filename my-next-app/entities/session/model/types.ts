import { User } from "@/entities/user";

export type GetMeResponse = {
  user: User | null;
};
