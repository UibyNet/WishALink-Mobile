export class LocalUser {
  id?: number;
  userName?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  roles?: string | string[] | undefined;

  init(_data?: any) {
    if (_data) {
      this.id = _data['id'];
      this.userName = _data['userName'];
      this.fullName = _data['fullName'];
      this.email = _data['email'];
      this.roles = _data['roles'];
    }
  }

  static fromJS(data: any): LocalUser {
    data = typeof data === 'object' ? data : {};
    let result = new LocalUser();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['id'] = this.id;
    data['userName'] = this.userName;
    data['fullName'] = this.fullName;
    data['email'] = this.email;
    data['phoneNumber'] = this.phoneNumber;
    data['roles'] = this.roles;
    return data;
  }
}
