import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardTeacherComponent } from './board-teacher/board-teacher.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { ChangePassComponent } from './change_pass/change-pass.component';
import { AuthGuard} from './_services/auth.guards';
const routes: Routes = [
  {path: 'change_pass', component: ChangePassComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'user', component: BoardUserComponent},
  { path: 'teacher', component: BoardTeacherComponent},
  { path: 'admin', component: BoardAdminComponent  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
