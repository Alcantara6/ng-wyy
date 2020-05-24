import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolverService } from './home-resolve.service';


const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    data: { title: '发现' },
    resolve: { homeDatas: HomeResolverService }  // yj：Resolve预先获取数据
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeResolverService]  // yj: Resolve提供商
})
export class HomeRoutingModule { }
