import { db } from "@/db";
import {
  userRolesTable,
  rolesTable,
  rolePermissionsTable,
  permissionsTable,
  usersTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function hasPermission(
  user: { id: number; name: string; age: number; email: string; role: string },
  permissionName: string
): Promise<boolean> {
  // Step 1: resolve role id by role name
  const roleRow = await db
    .select({ id: rolesTable.id })
    .from(rolesTable)
    .where(eq(rolesTable.name, user.role))
    .limit(1);

  if (roleRow.length === 0) return false;
  const roleId = roleRow[0].id;

  // Step 2: get permissions for that role
  const perms = await db
    .select({ name: permissionsTable.name })
    .from(rolePermissionsTable)
    .innerJoin(
      permissionsTable,
      eq(rolePermissionsTable.permissionId, permissionsTable.id)
    )
    .where(eq(rolePermissionsTable.roleId, roleId));

  return perms.some((p) => p.name === permissionName);
}

// get all users
export async function getUsers() {
  const users = await db.query.usersTable.findMany();
  return users;
}

// get one user by id
export async function getUserById(id: number) {
  const user = await db.query.usersTable.findMany({
    where: eq(usersTable.id, id),
  });
  return user[0];
}
