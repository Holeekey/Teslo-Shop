import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string [] = this.reflector.get(META_ROLES, context.getHandler())
    if(!validRoles)
      return true

    if(validRoles.length === 0) return true

    const user:User = context.switchToHttp().getRequest().user;

    if(!user)
      throw new BadRequestException('User not found (request)')

    for (const role of user.roles) {
      if(validRoles.includes(role)) return true
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: ${validRoles}`
    )

  }
}
