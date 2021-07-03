/*
 * minimal counter app state
 * 
 * In this case, our app state is simply a single number (the counter). But we
 * put it here because in the future, when our state is more complicated 
 * 
 */

export interface AppState {
  IsAuthenticated : boolean; 
  ivrservices: string[]; //this store distinct services
  ivrcontents :  IvrServiceDto[];
  currentuserdetail: UserDetail,
  isLoggedIn : boolean,
  token : string;  
};

export interface UserDetail{
  id : string,
  email : string,
  firstname : string,
  lastname : string,
  isLoggedIn? : boolean,
  rolename : string,
  password? : string,
  phonenumber?: string,
  status?: string,
  associateduserid?: string
}


export interface IvrServiceDto {
  id?: string;
  // name: string;
  // flag: string;
  // area: number;
  // population: number;
  servicedesc?: string;
  serviceid?: string;
  categoryid?: string;
  lessonid?: string; 
  activedate?: string;
  status?: string;
  contentname?: string;
  modifydate?: string; 
  path?: string; 
}

export interface DashboardDto{
   totalbasecount : number;
   yesterdayactivationcount : number;
   yesterdaydeactivationcount : number;
   todayactivationcount : number;
   todaydeactivationcount : number;
   totalbasiccategoryContents : number;
   totaladvancecategoryContents : number;
}





