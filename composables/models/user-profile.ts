export class UserProfile implements IUserProfile {
  constructor(params: Partial<IUserProfile>) {
    Object.assign(this, params);
  }
}
