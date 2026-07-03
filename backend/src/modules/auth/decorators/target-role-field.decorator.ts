import { SetMetadata } from '@nestjs/common';

export const TARGET_ROLE_FIELD_KEY = 'target_role_field';

/**
 * Decorator to specify which request body field contains the role ID or role name being assigned.
 */
export const TargetRoleField = (fieldName: string) => SetMetadata(TARGET_ROLE_FIELD_KEY, fieldName);
