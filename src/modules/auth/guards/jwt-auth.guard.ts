import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserError } from '@common/constants/error-message';
import { ApplicationError } from 'src/common/errors/application.error';
import { IS_PUBLIC_KEY } from '../../../common/decorators/requests/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isPublic && !user) {
      throw new ApplicationError(UserError.UNAUTHORIZED_ACCESS);
    }

    return user;
  }
}
