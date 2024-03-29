import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DeckCardComponent } from './components/deck-card/deck-card.component';
import { ViewFlashcardsComponent } from './components/view-flashcards/view-flashcards.component';
import { ViewDecksComponent } from './components/view-decks/view-decks.component';
import { CreateFlashcardComponent } from './components/create-flashcard/create-flashcard.component';
import { CreateDecksComponent } from './components/create-decks/create-decks.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    DeckCardComponent,
    ViewFlashcardsComponent,
    ViewDecksComponent,
    CreateFlashcardComponent,
    CreateDecksComponent,
    MyprofileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
