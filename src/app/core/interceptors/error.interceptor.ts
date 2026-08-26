import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SKIP_ERROR_TOAST } from '../http-context';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

interface ProblemDetailsBody {
  detail?: string;
  title?: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          auth.logout();
          router.navigateByUrl('/auth');
        } else if (req.context.get(SKIP_ERROR_TOAST)) {
        } else if (err.status !== 0) {
          const body = err.error as ProblemDetailsBody | undefined;
          const message = body?.detail ?? body?.title ?? 'Došlo je do greške.';
          toast.error(message);
        } else {
          toast.error('Server nije dostupan.');
        }
      }
      return throwError(() => err);
    }),
  );
};
