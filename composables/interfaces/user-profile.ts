export interface IUserProfile {
  _id?: string;
  userCode?: string;
  employeeCode?: string;
  citizenId?: string;
  prefixId?: number;
  firstName?: string;
  lastName?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  birthDate?: string;
  positionId?: number;
  email?: string;
  phoneNumber?: string;
  deviceId?: string;
  imageProfileId?: number;
  issuedate?: string;
  expirationDate?: string;
  isCentrallyAffiliated?: number;
  isActive?: number;
  avatarUrl?: string;
  roles?: IRole[];
  data?: IUserProfileData;
  menus?: IMenu[];
  fullName?: string;
  baacAccountNumber?: string;
  baacAccountName?: string;
  ocsbNumber?: string;
  associationNumber?: string;
  lineId?: string;
  agriculturalistCode?: string;
  marriedStatusId?: string;
  createdBy?: string;
  workStartDate?: string;
}

export interface IUserProfileData {
  isAdmin?: number;
}

export interface IMenu {
  _id?: string;
  parentId?: string;
  name?: string;
  code?: string;
  detail?: string;
  isActive?: number;
  createdAt?: string;
  updatedAt?: string;
  path?: string;
  icon?: string;
  sort?: number;
  permissions?: string[];
  childrens?: IMenu[];
}

export interface IRole {
  _id?: string;
  menus?: any[];
  name?: string;
  detail?: string;
  code?: string;
  isActive?: boolean;
  createdAt?: string;
  permissions?: IPermission[];
  updatedAt?: string;
}

export interface IPermission {
  permission?: string;
  menu?: IMenu;
  details?: string;
  name?: string;
}
