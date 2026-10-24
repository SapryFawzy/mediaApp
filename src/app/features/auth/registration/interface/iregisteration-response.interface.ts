export interface IregisterationResponse {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
}
