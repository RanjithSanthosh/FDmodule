import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Log {
  
  private _loggedin: boolean = false;

  constructor() {
    // Check if we are in a browser environment before accessing localStorage
    // (Prevents crashes if you are using Server-Side Rendering)
    if (typeof localStorage !== 'undefined') {
      const storedStatus = localStorage.getItem('isLoggedIn');
      console.log('Log Service Started. Found in storage:', storedStatus);
      this._loggedin = storedStatus === 'true';
    } else {
      console.warn('LocalStorage is not available in this environment.');
    }
  }

  get loggedin(): boolean {
    return this._loggedin;
  }

  set loggedin(value: boolean) {
    console.log(`Setting loggedin to: ${value}`);
    this._loggedin = value;
    
    if (typeof localStorage !== 'undefined') {
      if (value) {
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Saved "true" to LocalStorage');
      } else {
        localStorage.removeItem('isLoggedIn');
        console.log('Removed "isLoggedIn" from LocalStorage');
      }
    }
  }
}