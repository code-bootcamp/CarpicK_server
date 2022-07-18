import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ICurrentUser {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  phone?: number;
  isAuth?: boolean;
  revenue?: number;
}

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext): ICurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

export interface ICurrentAdmin {
  id?: string;
  adminId: string;
  password?: string;
}

export const CurrentAdmin = createParamDecorator(
  (data, context: ExecutionContext): ICurrentAdmin => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
