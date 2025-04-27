// // import { inject } from '@angular/core';
// // import { CanActivateFn, Router } from '@angular/router';

// // export const authGuard: CanActivateFn = () => {
// //   console.log('🚨 Guard activated!'); // שורת Debug חשוב
// //   const router = inject(Router);
// //   const user = sessionStorage.getItem('user');
// //   console.log('👤 User from session:', user);

// //   if (!user) {
// //     router.navigate(['/login']);
// //     return false;
// //   }

// //   return true;
// // };
// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// export const authGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const user = sessionStorage.getItem('user');

//   if (!user) {
//     return router.createUrlTree(['/login']);
//   }

//   return true;
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');

  console.log('🚨 Guard activated!');
  console.log('👤 User from session:', user);

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
