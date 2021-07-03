import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStore } from './store/app.store';
import { AppState, IvrServiceDto, UserDetail } from './store/app.state';
import { Store } from 'redux';
import * as UserActions from './store/app.actions';
import * as CONSTANTS from './helpers/constants'

import { LOCAL_STORAGE_KEYS } from './helpers/Enums';
import { AppConfig } from './app.config';

interface Response {
    result: string,
    error: string
}

@Injectable()
export class AppService {

    private BASEURL: string = "http://localhost:9000";//TODO: temporary code please remove this

    constructor(private http: HttpClient, @Inject(AppStore) public store: Store<AppState>, private appconfig: AppConfig) {
        try {
            this.store.subscribe(() => this.updateState());

            this.store.dispatch(UserActions.setCurrentUserDetails(null));

        } catch (error) {
            throw new Error("Authguard::contructor Exception :" + error);

        }
    }

    updateState() {
        try {
            //this.currentuserdetail = this.store.getState().currentuserdetail;
        } catch (error) {
            throw new Error("Authguard::updateState Exception :" + error);
        }
    }

    autoSignIn(callback) {
        this.BASEURL = this.appconfig.getConfig("service").baseurl;

        this.http.post(this.BASEURL + CONSTANTS.API.REAUTHENTICATE, localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)).subscribe(response => {
            let res = true;
            let responseObj: any = response;
            if (responseObj.error === '') {
                //set token in local storage
                localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, responseObj.token);
                this.store.dispatch(UserActions.setCurrentUserDetails({ response }));
            }
            else {
                res = false;
            }

            return callback && callback(res);
        },
            (error) => {
                console.log(error);
                return callback && callback(false);
            });
    }

    authenticate(credentials, callback) {

        this.BASEURL = this.appconfig.getConfig("service").baseurl;

        this.http.post(this.BASEURL + CONSTANTS.API.AUTHENTICATE, credentials).subscribe(response => {
            let res = true;
            let responseObj: any = response;
            if (responseObj.error === '') {
                //set token in local storage
                localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, responseObj.token);
                this.store.dispatch(UserActions.setCurrentUserDetails({ response }));
            }
            else {
                res = false;
            }

            return callback && callback(res);
        },
            (error) => {
                console.log(error);
                return callback && callback(false);
            });

    }

    endActiveSession() {
        try {
            //clear token from local storage
            //localStorage.clear();
            localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
            //remove user authnetication in app state
            this.store.dispatch(UserActions.setCurrentUserDetails(false));
        } catch (error) {
            throw new Error("AppService::endActiveSession exception: " + error);
        }
    }


    getRoles() {
        this.http.get(this.BASEURL + CONSTANTS.API.ROLES).subscribe(response => {
            this.store.dispatch(UserActions.setRoles(response));
        },
            (error) => {
                console.log(error);
            });
    }

    getUsers() {
        this.http.post(this.BASEURL + CONSTANTS.API.USERS, this.store.getState().currentuserdetail.id).subscribe(response => {
            this.store.dispatch(UserActions.setUsers(response));
        },
            (error) => {
                console.log(error);
            });
    }

    logout(callback) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        this.store.dispatch(UserActions.setCurrentUserDetails(null));
        return callback && callback();


        // this.http.post('logout', {}).subscribe(() => {
        //     return callback && callback();
        // },
        // (error) => {
        //     console.log(error);
        //     return callback && callback();
        // });
    }


    // starting add, delete, update, view for IVR PORTAL

    getAllIVRContent() {
        this.http.get(this.BASEURL + CONSTANTS.API.IVRSERVICESVIEW).subscribe(response => {
            this.store.dispatch(UserActions.setIVRContents(response));
        },
            (error) => {
                console.log(error);
            });
    }


    //add ivr content

    addIVRContent(formdata: FormData, callback: any) {
        //  contentaddCopy.userid = this.store.getState().currentuserdetail.id;

        this.http.post(this.BASEURL + CONSTANTS.API.ADDIVRCONTENT, formdata).subscribe((response: Response) => {
            let res = (response.result.toLocaleUpperCase() === "SUCCESS");
            //update
            this.getAllIVRContent();
            return callback & callback(res);
        },
            (error) => {
                console.log(error);
                return callback & callback(false);
            });
    }

    //delete ivr content

    deleteIVRContent(id: string, callback: any) {
        this.http.post(this.BASEURL + CONSTANTS.API.DELETEIVRCONTENT, id).subscribe((response: Response) => {
            let res = (response.result.toLocaleUpperCase() === "SUCCESS");
            //update
            this.getAllIVRContent();
            return callback & callback(res);
        },
            (error) => {
                console.log(error);
                return callback & callback(false);
            });
    }

    updateIVRContent(formdata: FormData, callback) {
        this.http.post(this.BASEURL + CONSTANTS.API.UPDATEIVRCONTENT, formdata).subscribe((response: Response) => {
            let res = (response.result.toLocaleUpperCase() === "SUCCESS");
            //update
            this.getAllIVRContent();

            return callback && callback(res);
        },
            (error) => {
                console.log(error);
                return callback && callback(false);
            });
    }

    getDashboardDto(serviceid, callback) {
        this.http.get(this.BASEURL + CONSTANTS.API.DASHBOARDVIEW + serviceid).subscribe(response => {
            return callback && callback(response);
        },
            (error) => {
                console.log(error);
                return callback && callback(null);
            });
    }

    getAllServiceId() {
        this.http.get(this.BASEURL + CONSTANTS.API.ALLSERVICEID).subscribe(response => {
            this.store.dispatch(UserActions.setIVRServices(response));
        },
            (error) => {
                console.log(error);
            });
    }

}
