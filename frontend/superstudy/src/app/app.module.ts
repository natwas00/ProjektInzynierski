import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardTeacherComponent } from './board-teacher/board-teacher.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { AuthGuard } from './_services/auth.guards';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ChangePassComponent } from './change_pass/change-pass.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from './not-found/not-found.component';
import { CreateSetComponent } from './create-set/create-set.component';
import { DisplayAllSetsComponent } from './display-all-sets/display-all-sets.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { ClassRoomComponent } from './class-room/class-room.component';
import { AllClassesComponent } from './all-classes/all-classes.component';
import { ClassInfoComponent } from './class-info/class-info.component';
import { CreateClassComponent } from './create-class/create-class.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardTeacherComponent,
    BoardUserComponent,
    ChangePassComponent,
    NotFoundComponent,
    CreateSetComponent,
    DisplayAllSetsComponent,
    FlashcardComponent,
    ClassRoomComponent,
    AllClassesComponent,
    ClassInfoComponent,
    CreateClassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ShowHidePasswordModule,
    FontAwesomeModule,
    NgbModule
],

  providers: [authInterceptorProviders, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
