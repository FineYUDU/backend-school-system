import { Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { SUBJECT_SEED } from './data/subjects.seed';


@Injectable()
export class SeedService {

  constructor(
    private readonly authService : AuthService,
  ) {

  }

  async executeSeed() {
    await this.insertSubjects();
    return 'SEED EXECUTED';

  }

  private async insertSubjects() {

    const subjects = SUBJECT_SEED

    // const subjects = initialUserData.users;

    // const insertPromises = [];

    // subjects.forEach( user =>  {
    //   insertPromises.push( this.authService.create(user));
    // });
    // await Promise.all( insertPromises );
    return true;
    
  }

  // private async insertUsers() {

  //   const users = initialUserData.users;

  //   const insertPromises = [];

  //   users.forEach( user =>  {
  //     insertPromises.push( this.authService.create(user));
  //   });
  //   await Promise.all( insertPromises );
  //   return true;
    
  // }
}
