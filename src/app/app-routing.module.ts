import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventosComponent } from './components/eventos/eventos.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { EventosDetalheComponent } from './components/eventos/eventos-detalhe/eventos-detalhe.component';
import { EventosListaComponent } from './components/eventos/eventos-lista/eventos-lista.component';
import { LoginComponent } from './components/user/login/login.component';
import { UserComponent } from './components/user/user.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', redirectTo: 'user/perfil' },
      { path: 'eventos', redirectTo: 'eventos/lista' },
      {
        path: 'eventos',
        component: EventosComponent,
        children: [
          { path: 'detalhe', component: EventosDetalheComponent },
          { path: 'detalhe/:id', component: EventosDetalheComponent },
          { path: 'lista', component: EventosListaComponent },
        ],
      },
      { path: 'palestrantes', component: PalestrantesComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeComponent },
      { path: 'user/perfil', component: PerfilComponent },
      { path: 'contatos', component: ContatosComponent },
    ],
  },

  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
    ],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
