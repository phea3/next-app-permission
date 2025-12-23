import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import {
  usersTable,
  rolesTable,
  permissionsTable,
  rolePermissionsTable,
  userRolesTable,
} from "../db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  // 1. Insert roles
  const roles = await db
    .insert(rolesTable)
    .values([{ name: "admin" }, { name: "moderator" }, { name: "user" }]);

  console.log("Roles seeded!");

  // 2. Insert permissions
  const permissions = await db
    .insert(permissionsTable)
    .values([
      { name: "view:comments" },
      { name: "delete:comments" },
      { name: "ban:users" },
    ]);

  console.log("Permissions seeded!");

  // 3. Assign permissions to roles
  // Example: admin gets all, moderator gets view+delete, user gets view only
  await db.insert(rolePermissionsTable).values([
    { roleId: 1, permissionId: 1 }, // admin -> view
    { roleId: 1, permissionId: 2 }, // admin -> delete
    { roleId: 1, permissionId: 3 }, // admin -> ban

    { roleId: 2, permissionId: 1 }, // moderator -> view
    { roleId: 2, permissionId: 2 }, // moderator -> delete

    { roleId: 3, permissionId: 1 }, // user -> view
  ]);

  console.log("Role-permissions seeded!");

  // 4. Insert users
  const users = await db.insert(usersTable).values([
    { name: "Alice", age: 25, email: "alice@example.com", role: "admin" },
    { name: "Bob", age: 28, email: "bob@example.com", role: "moderator" },
    { name: "Charlie", age: 35, email: "charlie@example.com", role: "user" },
  ]);

  console.log("Users seeded!");

  // 5. Assign roles to users
  await db.insert(userRolesTable).values([
    { userId: 1, roleId: 1 }, // Alice -> admin
    { userId: 2, roleId: 2 }, // Bob -> moderator
    { userId: 3, roleId: 3 }, // Charlie -> user
  ]);

  console.log("User-roles seeded!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
});
