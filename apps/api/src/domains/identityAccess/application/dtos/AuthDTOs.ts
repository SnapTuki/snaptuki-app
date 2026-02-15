import { UserView } from "./userDTOs";

export type AuthResult = {
  token: string;
  user: UserView;
};
``