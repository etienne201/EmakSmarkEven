import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Récupère l'utilisateur authentifié (injecté par JwtStrategy.validate) depuis
 * la requête. Optionnellement, on peut extraire une propriété précise :
 *   @CurrentUser() user            → l'objet User complet (role + organization)
 *   @CurrentUser('id') userId      → user.id
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
