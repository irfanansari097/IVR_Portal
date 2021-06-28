/**
 * Counter Reducer
 */
import { Reducer, Action } from 'redux';
import { AppState, IvrServiceDto, UserDetail } from './app.state';
import * as UserActions from './app.actions';

const initialState: AppState = {
  IsAuthenticated: true, 
  ivrservices: [],
  ivrcontents: [], 
  currentuserdetail : {
    id : undefined,
    email : undefined,
    firstname : undefined,
    lastname : undefined,
    rolename : ""
  },
  isLoggedIn : false,
  token : "abcd" 
};

// Create our reducer that will handle changes to the state
export const counterReducer: Reducer<AppState> =
  (state: AppState = initialState, action: Action): AppState => {
    switch (action.type) {

      case UserActions.SET_CURRENTUSERDETAILS:
        if((<UserActions.customAction>action).payload !== null)
        {
          const data: UserDetail = (<UserActions.customAction>action).payload.response.userDTO;
          data.rolename = data.rolename.toUpperCase();
          const intoken: string = (<UserActions.customAction>action).payload.response.token;
          return Object.assign({}, state, { currentuserdetail: data , isLoggedIn : true, token : intoken});
        }
        else{
          let userdetail = {
            id : undefined,
            email : undefined,
            firstname : undefined,
            lastname : undefined,
            rolename : ""
          }
          return Object.assign({}, state, { currentuserdetail: userdetail , isLoggedIn : false, token : ""});
        }

        case UserActions.SETIVRSERVICES :
        if((<UserActions.customAction>action).payload !== null){
          const data: IvrServiceDto[] = (<UserActions.customAction>action).payload
          return Object.assign({}, state, { ivrservices: data});
        }
        break;

        case UserActions.SETIVRCONTENTS:
          if((<UserActions.customAction>action).payload !== null){
            const data: IvrServiceDto[] = (<UserActions.customAction>action).payload
            return Object.assign({}, state, { ivrcontents: data});
          }
          break;        

      default:
        return state;
    }
  };
