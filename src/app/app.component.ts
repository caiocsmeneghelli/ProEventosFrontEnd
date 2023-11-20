import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/Identity/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public userService: UserService){}

  ngOnInit():void{
    this.setCurrentUser();
  }

  setCurrentUser(): void{
    let user ={} as User | null;
    if(localStorage.getItem('user')){
      user = JSON.parse(localStorage.getItem('user') ?? '{}');
    }else{
      user = null;
    }

    if(user)
      this.userService.setCurrentUser(user);
  }
}
