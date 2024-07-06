"use strict";
(self["webpackChunkangular_16_jwt_auth"] = self["webpackChunkangular_16_jwt_auth"] || []).push([["main"],{

/***/ 1311:
/*!**********************************************!*\
  !*** ./src/app/_helpers/http.interceptor.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpRequestInterceptor": () => (/* binding */ HttpRequestInterceptor),
/* harmony export */   "httpInterceptorProviders": () => (/* binding */ httpInterceptorProviders)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 3765);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 5474);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 3158);
/* harmony import */ var _shared_event_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_shared/event.class */ 9043);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_storage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/storage.service */ 3897);
/* harmony import */ var _shared_event_bus_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_shared/event-bus.service */ 8097);







class HttpRequestInterceptor {
  constructor(storageService, eventBusService) {
    this.storageService = storageService;
    this.eventBusService = eventBusService;
    this.isRefreshing = false;
  }
  intercept(req, next) {
    req = req.clone({
      withCredentials: true
    });
    return next.handle(req).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      // logout when token is expired
      /*
              if (
                error instanceof HttpErrorResponse &&
                !req.url.includes('auth/signin') &&
                error.status === 401
              ) {
                return this.handle401Error(req, next);
              }
      */
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
    }));
  }
  handle401Error(request, next) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      if (this.storageService.isLoggedIn()) {
        this.eventBusService.emit(new _shared_event_class__WEBPACK_IMPORTED_MODULE_0__.EventData('logout', null));
      }
    }
    return next.handle(request);
  }
}
HttpRequestInterceptor.ɵfac = function HttpRequestInterceptor_Factory(t) {
  return new (t || HttpRequestInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.StorageService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_shared_event_bus_service__WEBPACK_IMPORTED_MODULE_2__.EventBusService));
};
HttpRequestInterceptor.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
  token: HttpRequestInterceptor,
  factory: HttpRequestInterceptor.ɵfac
});

const httpInterceptorProviders = [{
  provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HTTP_INTERCEPTORS,
  useClass: HttpRequestInterceptor,
  multi: true
}];

/***/ }),

/***/ 8368:
/*!*******************************************!*\
  !*** ./src/app/_services/auth.service.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthService": () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 3765);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);



const AUTH_API = 'http://localhost:8080/api/auth/';
const USER_KEY = 'USER ';
const httpOptions = {
  headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
    'Content-Type': 'application/json'
  })
};
// window.sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
class AuthService {
  constructor(http) {
    this.http = http;
  }
  // isAuthenticated():boolean
  login(username, password) {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, {
      observe: 'response',
      headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  loggedIn() {
    return !!window.sessionStorage.getItem('token');
  }
  register(username, email, password) {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }
  logout() {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
AuthService.ɵfac = function AuthService_Factory(t) {
  return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient));
};
AuthService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: AuthService,
  factory: AuthService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 281:
/*!*******************************************!*\
  !*** ./src/app/_services/load.service.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoadService": () => (/* binding */ LoadService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 3765);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);



const httpOptions = {
  headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
    'Content-Type': 'application/json'
  })
};
class LoadService {
  constructor(http) {
    this.http = http;
    this.apiUrl = 'http://localhost:8080/api/users';
  }
  getUserProfile(userId) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
}
LoadService.ɵfac = function LoadService_Factory(t) {
  return new (t || LoadService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient));
};
LoadService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: LoadService,
  factory: LoadService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 3609:
/*!*****************************************************!*\
  !*** ./src/app/_services/remove.service.service.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RemoveServiceService": () => (/* binding */ RemoveServiceService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 3765);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);



const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
    'Content-Type': 'application/json'
  })
};
class RemoveServiceService {
  constructor(http) {
    this.http = http;
  }
  remove(timer) {
    return this.http.delete(AUTH_API + 'remove', {
      body: timer
    });
  }
}
RemoveServiceService.ɵfac = function RemoveServiceService_Factory(t) {
  return new (t || RemoveServiceService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient));
};
RemoveServiceService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: RemoveServiceService,
  factory: RemoveServiceService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 3897:
/*!**********************************************!*\
  !*** ./src/app/_services/storage.service.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageService": () => (/* binding */ StorageService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6839);

const USER_KEY = 'auth-user';
class StorageService {
  constructor() {}
  clean() {
    window.sessionStorage.clear();
  }
  saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  getUser() {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  isLoggedIn() {
    const user = window.sessionStorage.getItem('token');
    if (user) {
      return true;
    }
    return false;
  }
}
StorageService.ɵfac = function StorageService_Factory(t) {
  return new (t || StorageService)();
};
StorageService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
  token: StorageService,
  factory: StorageService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 8365:
/*!*********************************************!*\
  !*** ./src/app/_services/submit.service.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SubmitService": () => (/* binding */ SubmitService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 3765);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);



const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
    'Content-Type': 'application/json'
  })
};
class SubmitService {
  constructor(http) {
    this.http = http;
  }
  submit(timer) {
    return this.http.post(AUTH_API + 'submit', {
      timer
    }, httpOptions);
  }
}
SubmitService.ɵfac = function SubmitService_Factory(t) {
  return new (t || SubmitService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient));
};
SubmitService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: SubmitService,
  factory: SubmitService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 5089:
/*!*******************************************!*\
  !*** ./src/app/_services/user.service.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserService": () => (/* binding */ UserService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 3765);


const API_URL = 'http://localhost:8080/api/test/';
class UserService {
  constructor(http) {
    this.http = http;
  }
  getPublicContent() {
    return this.http.get(API_URL + 'all', {
      responseType: 'text'
    });
  }
  getUserBoard() {
    return this.http.get(API_URL + 'user', {
      responseType: 'text'
    });
  }
  getModeratorBoard() {
    return this.http.get(API_URL + 'mod', {
      responseType: 'text'
    });
  }
  getAdminBoard() {
    return this.http.get(API_URL + 'admin', {
      responseType: 'text'
    });
  }
}
UserService.ɵfac = function UserService_Factory(t) {
  return new (t || UserService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
};
UserService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
  token: UserService,
  factory: UserService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 8097:
/*!**********************************************!*\
  !*** ./src/app/_shared/event-bus.service.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventBusService": () => (/* binding */ EventBusService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 228);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ 116);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 635);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6839);



class EventBusService {
  constructor() {
    this.subject$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__.Subject();
  }
  emit(event) {
    this.subject$.next(event);
  }
  on(eventName, action) {
    return this.subject$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.filter)(e => e.name === eventName), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(e => e["value"])).subscribe(action);
  }
}
EventBusService.ɵfac = function EventBusService_Factory(t) {
  return new (t || EventBusService)();
};
EventBusService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
  token: EventBusService,
  factory: EventBusService.ɵfac,
  providedIn: 'root'
});


/***/ }),

/***/ 9043:
/*!****************************************!*\
  !*** ./src/app/_shared/event.class.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventData": () => (/* binding */ EventData)
/* harmony export */ });
class EventData {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

/***/ }),

/***/ 158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 6679);
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./register/register.component */ 9087);
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login/login.component */ 8458);
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home/home.component */ 5067);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./profile/profile.component */ 6630);
/* harmony import */ var _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./board-user/board-user.component */ 4652);
/* harmony import */ var _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./board-moderator/board-moderator.component */ 9586);
/* harmony import */ var _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./board-admin/board-admin.component */ 5838);
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./auth.guard */ 2993);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 6839);











const routes = [{
  path: 'home',
  component: _home_home_component__WEBPACK_IMPORTED_MODULE_2__.HomeComponent
}, {
  path: 'login',
  component: _login_login_component__WEBPACK_IMPORTED_MODULE_1__.LoginComponent
}, {
  path: 'register',
  component: _register_register_component__WEBPACK_IMPORTED_MODULE_0__.RegisterComponent
}, {
  path: `profile/:username`,
  component: _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__.ProfileComponent,
  canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_7__.authGuard]
}, {
  path: 'user',
  component: _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_4__.BoardUserComponent
}, {
  path: 'mod',
  component: _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_5__.BoardModeratorComponent
}, {
  path: 'admin',
  component: _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__.BoardAdminComponent
}, {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}];
class AppRoutingModule {}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) {
  return new (t || AppRoutingModule)();
};
AppRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
  type: AppRoutingModule
});
AppRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forRoot(routes, {
    useHash: true
  }), _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule]
  });
})();

/***/ }),

/***/ 5041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_storage_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_services/storage.service */ 3897);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_services/auth.service */ 8368);
/* harmony import */ var _shared_event_bus_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_shared/event-bus.service */ 8097);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6477);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 6679);






function AppComponent_li_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "li", 4)(1, "a", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Admin Board");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function AppComponent_li_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "li", 4)(1, "a", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Moderator Board");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function AppComponent_ul_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ul", 11)(1, "li", 4)(2, "a", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Sign Up");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "li", 4)(5, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Login");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
}
function AppComponent_ul_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ul", 11)(1, "li", 4)(2, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "li", 4)(5, "a", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AppComponent_ul_11_Template_a_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r5);
      const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r4.logout());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "LogOut");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.username);
  }
}
class AppComponent {
  constructor(storageService, authService, eventBusService) {
    this.storageService = storageService;
    this.authService = authService;
    this.eventBusService = eventBusService;
    this.roles = [];
    this.isLoggedIn = false;
    this.showAdminBoard = false;
    this.showModeratorBoard = false;
  }
  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.username = user.username;
    }
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }
  logout() {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
AppComponent.ɵfac = function AppComponent_Factory(t) {
  return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_storage_service__WEBPACK_IMPORTED_MODULE_0__.StorageService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_shared_event_bus_service__WEBPACK_IMPORTED_MODULE_2__.EventBusService));
};
AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: AppComponent,
  selectors: [["app-root"]],
  decls: 14,
  vars: 4,
  consts: [["id", "app"], [1, "navbar", "navbar-expand", "navbar-dark", "bg-dark"], ["href", "#", 1, "navbar-brand"], ["routerLinkActive", "active", 1, "navbar-nav", "mr-auto"], [1, "nav-item"], ["href", "/home", "routerLink", "home", 1, "nav-link"], ["class", "nav-item", 4, "ngIf"], ["class", "navbar-nav ml-auto", 4, "ngIf"], [1, "container"], ["href", "/admin", "routerLink", "admin", 1, "nav-link"], ["href", "/mod", "routerLink", "mod", 1, "nav-link"], [1, "navbar-nav", "ml-auto"], ["href", "/register", "routerLink", "register", 1, "nav-link"], ["href", "/login", "routerLink", "login", 1, "nav-link"], ["href", "/profile/:username", "routerLink", "profile/:username", 1, "nav-link"], ["href", "home", 1, "nav-link", 3, "click"]],
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "nav", 1)(2, "a", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Clocky");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "ul", 3)(5, "li", 4)(6, "a", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "Home ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, AppComponent_li_8_Template, 3, 0, "li", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, AppComponent_li_9_Template, 3, 0, "li", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](10, AppComponent_ul_10_Template, 7, 0, "ul", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](11, AppComponent_ul_11_Template, 7, 1, "ul", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](13, "router-outlet");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showAdminBoard);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showModeratorBoard);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isLoggedIn);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isLoggedIn);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterOutlet, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLinkActive],
  styles: ["\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});


/***/ }),

/***/ 6747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/platform-browser */ 2512);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 9542);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common/http */ 3765);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 158);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 5041);
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login/login.component */ 8458);
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./register/register.component */ 9087);
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home/home.component */ 5067);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./profile/profile.component */ 6630);
/* harmony import */ var _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./board-admin/board-admin.component */ 5838);
/* harmony import */ var _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./board-moderator/board-moderator.component */ 9586);
/* harmony import */ var _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./board-user/board-user.component */ 4652);
/* harmony import */ var _helpers_http_interceptor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_helpers/http.interceptor */ 1311);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/platform-browser/animations */ 9240);
/* harmony import */ var _login_fc_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./login/fc.pipe */ 6578);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 6839);
















class AppModule {}
AppModule.ɵfac = function AppModule_Factory(t) {
  return new (t || AppModule)();
};
AppModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
  type: AppModule,
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
});
AppModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
  providers: [_helpers_http_interceptor__WEBPACK_IMPORTED_MODULE_9__.httpInterceptorProviders],
  imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_14__.HttpClientModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__.BrowserAnimationsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__.ProfileComponent]
});

(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _login_login_component__WEBPACK_IMPORTED_MODULE_2__.LoginComponent, _register_register_component__WEBPACK_IMPORTED_MODULE_3__.RegisterComponent, _home_home_component__WEBPACK_IMPORTED_MODULE_4__.HomeComponent,
    // ProfileComponent,
    _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__.BoardAdminComponent, _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_7__.BoardModeratorComponent, _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_8__.BoardUserComponent, _login_fc_pipe__WEBPACK_IMPORTED_MODULE_10__.FormControlPipe],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_14__.HttpClientModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__.BrowserAnimationsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__.ProfileComponent]
  });
})();

/***/ }),

/***/ 2993:
/*!*******************************!*\
  !*** ./src/app/auth.guard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "authGuard": () => (/* binding */ authGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 6679);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_services/auth.service */ 8368);



const authGuard = (route, state) => {
  const currentmenu = route.url[0].path;
  const router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  const service = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
  if (service.loggedIn()) {
    return true;
    // if (currentmenu == 'blog') {
    //   return true;
    // } else {
    //   alert('access denied');
    //   router.navigate(['']);
    //   return false;
    // }
  } else {
    alert('access denied');
    router.navigate(['login']);
    return false;
  }
};

/***/ }),

/***/ 5838:
/*!******************************************************!*\
  !*** ./src/app/board-admin/board-admin.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardAdminComponent": () => (/* binding */ BoardAdminComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 5089);


class BoardAdminComponent {
  constructor(userService) {
    this.userService = userService;
  }
  ngOnInit() {
    this.userService.getAdminBoard().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }
}
BoardAdminComponent.ɵfac = function BoardAdminComponent_Factory(t) {
  return new (t || BoardAdminComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService));
};
BoardAdminComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: BoardAdminComponent,
  selectors: [["app-board-admin"]],
  decls: 4,
  vars: 1,
  consts: [[1, "container"], [1, "jumbotron"]],
  template: function BoardAdminComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.content);
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});


/***/ }),

/***/ 9586:
/*!**************************************************************!*\
  !*** ./src/app/board-moderator/board-moderator.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardModeratorComponent": () => (/* binding */ BoardModeratorComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 5089);


class BoardModeratorComponent {
  constructor(userService) {
    this.userService = userService;
  }
  ngOnInit() {
    this.userService.getModeratorBoard().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }
}
BoardModeratorComponent.ɵfac = function BoardModeratorComponent_Factory(t) {
  return new (t || BoardModeratorComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService));
};
BoardModeratorComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: BoardModeratorComponent,
  selectors: [["app-board-moderator"]],
  decls: 4,
  vars: 1,
  consts: [[1, "container"], [1, "jumbotron"]],
  template: function BoardModeratorComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.content);
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});


/***/ }),

/***/ 4652:
/*!****************************************************!*\
  !*** ./src/app/board-user/board-user.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardUserComponent": () => (/* binding */ BoardUserComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 5089);


class BoardUserComponent {
  constructor(userService) {
    this.userService = userService;
  }
  ngOnInit() {
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }
}
BoardUserComponent.ɵfac = function BoardUserComponent_Factory(t) {
  return new (t || BoardUserComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService));
};
BoardUserComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: BoardUserComponent,
  selectors: [["app-board-user"]],
  decls: 4,
  vars: 1,
  consts: [[1, "container"], [1, "jumbotron"]],
  template: function BoardUserComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.content);
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});


/***/ }),

/***/ 5067:
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeComponent": () => (/* binding */ HomeComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 5089);


class HomeComponent {
  constructor(userService) {
    this.userService = userService;
  }
  ngOnInit() {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }
}
HomeComponent.ɵfac = function HomeComponent_Factory(t) {
  return new (t || HomeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService));
};
HomeComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: HomeComponent,
  selectors: [["app-home"]],
  decls: 4,
  vars: 1,
  consts: [[1, "container"], [1, "jumbotron"]],
  template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.content);
    }
  },
  styles: ["\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});


/***/ }),

/***/ 6578:
/*!**********************************!*\
  !*** ./src/app/login/fc.pipe.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormControlPipe": () => (/* binding */ FormControlPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6839);

class FormControlPipe {
  transform(value) {
    return value;
  }
}
FormControlPipe.ɵfac = function FormControlPipe_Factory(t) {
  return new (t || FormControlPipe)();
};
FormControlPipe.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
  name: "formControl",
  type: FormControlPipe,
  pure: true
});


/***/ }),

/***/ 8458:
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginComponent": () => (/* binding */ LoginComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 9542);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/auth.service */ 8368);
/* harmony import */ var _services_storage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/storage.service */ 3897);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 6679);






class LoginComponent {
  constructor(authService, storageService, route, router, formbuilder) {
    this.authService = authService;
    this.storageService = storageService;
    this.route = route;
    this.router = router;
    this.formbuilder = formbuilder;
    this.isSubmitted = false;
    this.isLoggedIn = false;
    this.isLoginFailed = false;
    this.errorMessage = '';
    this.roles = [];
  }
  ngOnInit() {
    this.loginForm = this.formbuilder.group({
      username: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required),
      password: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required)
    });
  }
  get fc() {
    return this.loginForm.controls;
  }
  Onsubmit() {
    // const { username, password } = this.form;
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    if (username && password) {
      this.authService.login(username, password).subscribe({
        next: Response => {
          console.log(Response.body);
          const token = Response.body.token;
          this.storageService.saveUser(Response);
          // const token = this.storageService.getUser().token;
          // const userId = this.storageService.getUser().id;
          console.log(window.sessionStorage);
          window.sessionStorage.setItem('token', token);
          // window.sessionStorage.setItem('id',userId);
          // const ID = window.sessionStorage.getItem('id');
          // console.log(userId);
          console.log(Response.username);
          // console.log(ID);
          console.log(this.route.snapshot);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          console.log('nice!');
          this.router.navigate(['/profile', username]);
          // this.router.navigate(['register'], { relativeTo: this.route })  
        },

        error: err => {
          // this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          console.log('error');
          console.log(username);
        }
      });
    } else {
      this.isLoginFailed = true;
      this.isLoggedIn = false;
      console.log('error');
      console.log(username);
    }
  }
  // profile_redirect(): void{
  //   if (this.isLoggedIn = true){
  //     this.router.navigate([`/profile`,this.fc['username'].value]);
  //     console.log("checking...");
  //   }
  // }
  reloadPage() {
    window.location.reload();
  }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) {
  return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_storage_service__WEBPACK_IMPORTED_MODULE_1__.StorageService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder));
};
LoginComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: LoginComponent,
  selectors: [["app-login"]],
  decls: 12,
  vars: 1,
  consts: [[1, "container"], [1, "details"], ["id", "myForm", "defa", "", 3, "formGroup", "ngSubmit"], ["type", "text", "label", "username", "placeholder", "enter username", "formControlName", "username"], ["type", "password", "label", "password", "placeholder", "enter password", "formControlName", "password"], ["type", "submit"], [1, "register"], ["routerLink", "/register"]],
  template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "title");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Login");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "form", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_4_listener() {
        return ctx.Onsubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "input", 3)(6, "input", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Login");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 6)(10, "a", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, " New user? Register here ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.loginForm);
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName],
  styles: [".container[_ngcontent-%COMP%]{\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  height: 100%;\r\n  margin-top: 3rem;\r\n  }\r\n  \r\n  .details[_ngcontent-%COMP%]{\r\n    width: 28rem;\r\n  }\r\n  \r\n  form[_ngcontent-%COMP%]{\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n  }\r\n\r\n  .register[_ngcontent-%COMP%]{\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEI7O0VBRUE7SUFDRSxZQUFZO0VBQ2Q7O0VBRUE7SUFDRSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLHVCQUF1QjtFQUN6Qjs7RUFFQTtJQUNFLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsbUJBQW1CO0VBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lcntcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIG1hcmdpbi10b3A6IDNyZW07XHJcbiAgfVxyXG4gIFxyXG4gIC5kZXRhaWxze1xyXG4gICAgd2lkdGg6IDI4cmVtO1xyXG4gIH1cclxuICBcclxuICBmb3Jte1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICB9XHJcblxyXG4gIC5yZWdpc3RlcntcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgfVxyXG4gICJdLCJzb3VyY2VSb290IjoiIn0= */"]
});


/***/ }),

/***/ 6630:
/*!**********************************************!*\
  !*** ./src/app/profile/profile.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProfileComponent": () => (/* binding */ ProfileComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6477);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 9542);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_submit_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/submit.service */ 8365);
/* harmony import */ var _services_remove_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/remove.service.service */ 3609);
/* harmony import */ var _services_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/storage.service */ 3897);
/* harmony import */ var _services_load_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/load.service */ 281);









function ProfileComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "div", 4)(2, "label", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "URL: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "hours:");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "minutes:");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "input", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "seconds:");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](13, "input", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_2_Template_button_click_14_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const newform_r1 = restoredCtx.$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r3.onSubmit(newform_r1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "button", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_2_Template_button_click_16_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const i_r2 = restoredCtx.index;
      const newform_r1 = restoredCtx.$implicit;
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r5.removeforms(i_r2, newform_r1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17, "Remove form");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const newform_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroupName", i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !newform_r1.valid);
  }
}
// import { timer } from 'rxjs';
class ProfileComponent {
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      newforms: this.formBuilder.array([])
    });
    const userId = this.storageService.getUser().body.id;
    console.log(userId);
    if (userId) {
      const loaded = this.loadservice.getUserProfile(userId).subscribe({
        next: Response => {
          console.log(Response);
          for (const timers of Response) {
            let old_timer = this.formBuilder.group({
              URL: timers.URL,
              hours: timers.hours,
              minutes: timers.minutes,
              seconds: timers.seconds
            });
            this.newforms.push(old_timer);
          }
        },
        error: err => {
          console.log('somethings wrong');
        }
      });
    }
  }
  get newforms() {
    return this.profileForm.get('newforms');
  }
  constructor(formBuilder, submitservice, removeservice, storageService, loadservice) {
    this.formBuilder = formBuilder;
    this.submitservice = submitservice;
    this.removeservice = removeservice;
    this.storageService = storageService;
    this.loadservice = loadservice;
  }
  // updateProfile() {
  //   this.profileForm.patchValue({
  //     firstName: 'Nancy',
  //     address: {
  //       street: '123 Drew Street',
  //     },
  //   });
  // }
  addforms() {
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,}\/?.*$/i;
    let timer = this.formBuilder.group({
      URL: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.pattern(urlPattern)],
      hours: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.min(0)]],
      minutes: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.min(0), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.max(59)]],
      seconds: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.min(0), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.max(59)]]
    });
    // const timerJson = JSON.stringify(timer.value);
    this.newforms.push(timer);
  }
  // serializeFormGroup(formGroup: FormGroup): string {
  //   const controls = formGroup.controls;
  //   const serializedForm: SerializedFormGroup = {};
  //   // Iterate over each control in the FormGroup
  //   Object.keys(controls).forEach(key => {
  //     const control = controls[key];
  //     // Serialize the control's validators
  //     const validators: { [key: string]: any } = {};
  //     if (control.validator) {
  //       Object.keys(control.validator(control)).forEach(validatorKey => {
  //         validators[validatorKey] = control.errors ? control.errors[validatorKey] : null;
  //       });
  //     }
  //     // Include the control's value and validators in the serialized form
  //     serializedForm[key] = {
  //       value: control.value,
  //       validators: Object.keys(validators).length > 0 ? validators : null
  //     };
  //   });
  //   // Convert the serialized form to JSON
  //   return JSON.stringify(serializedForm, null, 2); // Adding null and 2 for pretty printing
  // }
  getTimer(index) {
    return this.newforms.at(index);
  }
  removeforms(index, newform) {
    const formGroup = newform;
    console.log(formGroup.value);
    if (formGroup.value.URL) {
      console.log('aight');
      this.removeservice.remove(formGroup.value).subscribe({
        next: Response => {
          console.log('Delete request successful'); // Log success message
        },

        error: err => {
          console.error('Delete request failed:', err); // Log error message
        }
      });
    } else {
      console.log('nah');
    }
    this.newforms.removeAt(index);
  }
  onSubmit(newform) {
    // TODO: Use EventEmitter with form value
    const formGroup = newform;
    // const json_timer=this.newforms.at(this.newforms.length-1).value;
    // const real_json = JSON.parse(json_timer);
    this.submitservice.submit(formGroup.value).subscribe({});
    console.warn(this.profileForm.value);
  }
}
ProfileComponent.ɵfac = function ProfileComponent_Factory(t) {
  return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_submit_service__WEBPACK_IMPORTED_MODULE_0__.SubmitService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_remove_service_service__WEBPACK_IMPORTED_MODULE_1__.RemoveServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_storage_service__WEBPACK_IMPORTED_MODULE_2__.StorageService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_load_service__WEBPACK_IMPORTED_MODULE_3__.LoadService));
};
ProfileComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: ProfileComponent,
  selectors: [["app-profile"]],
  standalone: true,
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
  decls: 13,
  vars: 6,
  consts: [[3, "formGroup"], ["formArrayName", "newforms"], [4, "ngFor", "ngForOf"], ["type", "button", 3, "click"], [3, "formGroupName"], ["for", "street"], ["id", "URL", "type", "text", "formControlName", "URL"], ["formControlName", "hours"], ["formControlName", "minutes"], ["formControlName", "seconds"], ["type", "submit", 3, "disabled", "click"]],
  template: function ProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "form", 0)(1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, ProfileComponent_div_2_Template, 18, 2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_Template_button_click_3_listener() {
        return ctx.addforms();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Add form");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "Complete the form to enable button.");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "hr");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "json");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroup", ctx.profileForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.newforms.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Form Value: ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](10, 4, ctx.profileForm.value), "");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Form Status: ", ctx.profileForm.status, "");
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgFor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormArrayName, _angular_common__WEBPACK_IMPORTED_MODULE_6__.JsonPipe],
  styles: ["form[_ngcontent-%COMP%] {\r\n    padding-top: 1rem;\r\n  }\r\n  \r\n  label[_ngcontent-%COMP%] {\r\n    display: block;\r\n    margin: .5em 0;\r\n    font-weight: bold;\r\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0RBQWdEOztBQUVoRDtJQUNJLGlCQUFpQjtFQUNuQjs7RUFFQTtJQUNFLGNBQWM7SUFDZCxjQUFjO0lBQ2QsaUJBQWlCO0VBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLyogUHJvZmlsZUVkaXRvckNvbXBvbmVudCdzIHByaXZhdGUgQ1NTIHN0eWxlcyAqL1xyXG5cclxuZm9ybSB7XHJcbiAgICBwYWRkaW5nLXRvcDogMXJlbTtcclxuICB9XHJcbiAgXHJcbiAgbGFiZWwge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBtYXJnaW46IC41ZW0gMDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIH1cclxuICAiXSwic291cmNlUm9vdCI6IiJ9 */"]
});


/***/ }),

/***/ 9087:
/*!************************************************!*\
  !*** ./src/app/register/register.component.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegisterComponent": () => (/* binding */ RegisterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6839);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/auth.service */ 8368);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6477);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 9542);




function RegisterComponent_form_3_div_7_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Username is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Username must be at least 3 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Username must be at most 20 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_form_3_div_7_div_1_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_form_3_div_7_div_2_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, RegisterComponent_form_3_div_7_div_3_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors["minlength"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors["maxlength"]);
  }
}
function RegisterComponent_form_3_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Email is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_13_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Email must be a valid email address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_form_3_div_13_div_1_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_form_3_div_13_div_2_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r5.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r5.errors["email"]);
  }
}
function RegisterComponent_form_3_div_19_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Password is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_19_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Password must be at least 6 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_form_3_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_form_3_div_19_div_1_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_form_3_div_19_div_2_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r7.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r7.errors["minlength"]);
  }
}
function RegisterComponent_form_3_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Signup failed!");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx_r9.errorMessage, " ");
  }
}
const _c0 = function (a0) {
  return {
    "is-invalid": a0
  };
};
function RegisterComponent_form_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "form", 5, 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function RegisterComponent_form_3_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18);
      const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](1);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](_r2.form.valid && ctx_r17.onSubmit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 7)(3, "label", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Username");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "input", 9, 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function RegisterComponent_form_3_Template_input_ngModelChange_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18);
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r19.form.username = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, RegisterComponent_form_3_div_7_Template, 4, 3, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 7)(9, "label", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "input", 13, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function RegisterComponent_form_3_Template_input_ngModelChange_11_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18);
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r20.form.email = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, RegisterComponent_form_3_div_13_Template, 3, 2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 7)(15, "label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "input", 16, 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function RegisterComponent_form_3_Template_input_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18);
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r21.form.password = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, RegisterComponent_form_3_div_19_Template, 3, 2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 7)(21, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Sign Up");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, RegisterComponent_form_3_div_23_Template, 4, 1, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](1);
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](6);
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](12);
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](18);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.form.username)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](10, _c0, _r2.submitted && _r3.errors));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.form.email)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](12, _c0, _r2.submitted && _r5.errors));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r5.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.form.password)("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](14, _c0, _r2.submitted && _r7.errors));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r7.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r2.submitted && ctx_r0.isSignUpFailed);
  }
}
function RegisterComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please check your inbox for the registration confirmation mail ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class RegisterComponent {
  constructor(authService) {
    this.authService = authService;
    this.form = {
      username: null,
      email: null,
      password: null
    };
    this.isSuccessful = false;
    this.isSignUpFailed = false;
    this.errorMessage = '';
  }
  onSubmit() {
    const {
      username,
      email,
      password
    } = this.form;
    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
RegisterComponent.ɵfac = function RegisterComponent_Factory(t) {
  return new (t || RegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService));
};
RegisterComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: RegisterComponent,
  selectors: [["app-register"]],
  decls: 5,
  vars: 2,
  consts: [[1, "col-md-12"], [1, "card", "card-container"], ["id", "profile-img", "src", "//ssl.gstatic.com/accounts/ui/avatar_2x.png", 1, "profile-img-card"], ["name", "form", "novalidate", "", 3, "ngSubmit", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["name", "form", "novalidate", "", 3, "ngSubmit"], ["f", "ngForm"], [1, "form-group"], ["for", "username"], ["type", "text", "name", "username", "required", "", "minlength", "3", "maxlength", "20", 1, "form-control", 3, "ngModel", "ngClass", "ngModelChange"], ["username", "ngModel"], ["class", "invalid-feedback", 4, "ngIf"], ["for", "email"], ["type", "email", "name", "email", "required", "", "email", "", 1, "form-control", 3, "ngModel", "ngClass", "ngModelChange"], ["email", "ngModel"], ["for", "password"], ["type", "password", "name", "password", "required", "", "minlength", "6", 1, "form-control", 3, "ngModel", "ngClass", "ngModelChange"], ["password", "ngModel"], [1, "btn", "btn-primary", "btn-block"], ["class", "alert alert-warning", 4, "ngIf"], [1, "invalid-feedback"], [4, "ngIf"], [1, "alert", "alert-warning"], [1, "alert", "alert-success"]],
  template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "img", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, RegisterComponent_form_3_Template, 24, 16, "form", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, RegisterComponent_div_4_Template, 2, 0, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isSuccessful);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isSuccessful);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgForm],
  styles: ["label[_ngcontent-%COMP%] {\r\n  display: block;\r\n  margin-top: 10px;\r\n}\r\n\r\n.card-container.card[_ngcontent-%COMP%] {\r\n  max-width: 400px !important;\r\n  padding: 40px 40px;\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  background-color: #f7f7f7;\r\n  padding: 20px 25px 30px;\r\n  margin: 0 auto 25px;\r\n  margin-top: 50px;\r\n  border-radius: 2px;\r\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.profile-img-card[_ngcontent-%COMP%] {\r\n  width: 96px;\r\n  height: 96px;\r\n  margin: 0 auto 10px;\r\n  display: block;\r\n  border-radius: 50%;\r\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcmVnaXN0ZXIvcmVnaXN0ZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSwyQkFBMkI7RUFDM0Isa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsZ0JBQWdCO0VBR2hCLGtCQUFrQjtFQUdsQiwwQ0FBMEM7QUFDNUM7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLG1CQUFtQjtFQUNuQixjQUFjO0VBR2Qsa0JBQWtCO0FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsibGFiZWwge1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbn1cclxuXHJcbi5jYXJkLWNvbnRhaW5lci5jYXJkIHtcclxuICBtYXgtd2lkdGg6IDQwMHB4ICFpbXBvcnRhbnQ7XHJcbiAgcGFkZGluZzogNDBweCA0MHB4O1xyXG59XHJcblxyXG4uY2FyZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmNztcclxuICBwYWRkaW5nOiAyMHB4IDI1cHggMzBweDtcclxuICBtYXJnaW46IDAgYXV0byAyNXB4O1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIC1tb3otYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxufVxyXG5cclxuLnByb2ZpbGUtaW1nLWNhcmQge1xyXG4gIHdpZHRoOiA5NnB4O1xyXG4gIGhlaWdodDogOTZweDtcclxuICBtYXJnaW46IDAgYXV0byAxMHB4O1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIC1tb3otYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
});


/***/ }),

/***/ 4431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 2512);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 6747);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.7f399868b8661d60.js.map