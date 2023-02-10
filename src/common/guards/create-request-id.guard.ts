import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class CreateRequestId implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request['id'] = v4();
    return true;
  }
}
