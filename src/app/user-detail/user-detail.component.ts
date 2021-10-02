import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { flatMap, map, takeWhile } from 'rxjs/operators';
import { IUser } from '../core/interfaces/user.interface';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: IUser;
  similarUsers: IUser[];
  isComponentAlive: boolean;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isComponentAlive = true;
    this.route.paramMap.pipe(
      takeWhile(() => !!this.isComponentAlive),
      flatMap(params => {
        const userId = params.get('uuid');
        const user$ = this.userService.getUser(userId);
        const similarUsers$ = this.userService.getSimilarUsers(userId);
        return forkJoin([user$, similarUsers$]).pipe(
          map(([user, similarUssers]) => ({ user: user, similarUssers: similarUssers }))
        )
      })
    ).subscribe(({ user, similarUssers }) => {
      this.user = user;
      this.similarUsers = similarUssers;
    })
  }

  ngOnDestroy() {
    this.isComponentAlive = false;
  }

}
