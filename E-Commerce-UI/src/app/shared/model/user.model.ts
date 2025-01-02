export interface Address {
  street?: string;
  houseNumber?: string;
  zipCode?: string;
}

export interface BaseUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  address?: Address | null;


}

export interface ConnectedUser extends BaseUser {
  authorities?: string[];
}
