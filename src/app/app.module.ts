import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

import { NgxCurrencyModule } from 'ngx-currency';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { EventosDetalheComponent } from './components/eventos/eventos-detalhe/eventos-detalhe.component';
import { EventosListaComponent } from './components/eventos/eventos-lista/eventos-lista.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { PerfilDetalheComponent } from './components/user/perfil/perfil-detalhe/perfil-detalhe.component';
import { TitleComponent } from './shared/title/title.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './shared/nav/nav.component';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';

import { EventoService } from './services/evento.service';
import { LoteService } from './services/lote.service';
import { UserService } from './services/user.service';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HomeComponent } from './components/home/home.component';

defineLocale('pt-br', ptBrLocale);

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    NavComponent,
    TitleComponent,
    DashboardComponent,
    ContatosComponent,
    PerfilComponent,
    PerfilDetalheComponent,
    DateTimeFormatPipe,
    EventosDetalheComponent,
    EventosListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxCurrencyModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    EventoService,
    LoteService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class AppModule {}
