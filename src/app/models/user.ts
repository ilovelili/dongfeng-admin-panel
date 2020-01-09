export class User {
  newuser: boolean;  
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export class Login {
  user: User;
}

export class ImageUpload {
  uri: string;
}