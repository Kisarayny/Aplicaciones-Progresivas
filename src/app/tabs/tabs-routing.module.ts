import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'users',
        loadChildren: () => import('../users/users.module').then(m => m.UsersPageModule)
      },
      {
        path: 'add-user',
        loadChildren: () => import('../add-user/add-user.module').then(m => m.AddUserPageModule)
      },
      {
        path: 'edit-user',
        loadChildren: () => import('../edit-user/edit-user.module').then(m => m.EditUserPageModule)
      },
      // Otras rutas hijas
      {
        path: '',
        redirectTo: '/tabs/users',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
