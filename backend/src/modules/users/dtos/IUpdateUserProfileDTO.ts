export default interface IUpdateUserProfileDTO {
  user_id: string;
  name: string;
  email: string;
  current_password?: string;
  new_password?: string;
}
