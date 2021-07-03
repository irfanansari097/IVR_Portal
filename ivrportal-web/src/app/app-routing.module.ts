import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
import { RegisterpageComponent } from "./pages/examples/registerpage/registerpage.component";
import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";
import { AuthGuard } from './auth/auth.guard';
import { ManageivrcontentsComponent } from './pages/examples/manageivrcontents/manageivrcontents.component';
import { UploadivrcontentsComponent } from './pages/examples/uploadivrcontents/uploadivrcontents.component';

const routes: Routes = [
  { path: "", redirectTo: "signin", pathMatch: "full" },
  { path: "home", component: LandingpageComponent, canActivate : [AuthGuard] },
  { path: "signin", component: RegisterpageComponent },
  { path: "landing", component: IndexComponent, canActivate : [AuthGuard] },
  { path: "manageivrcontents", component: ManageivrcontentsComponent, canActivate : [AuthGuard]},
  { path: "uploadivrcontents", component: UploadivrcontentsComponent, canActivate : [AuthGuard]},
  { path: "profile", component: ProfilepageComponent , canActivate : [AuthGuard]},
  
 ];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule {}
