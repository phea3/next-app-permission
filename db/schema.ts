import {
  int,
  mysqlTable,
  primaryKey,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
});

export const rolesTable = mysqlTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // admin, user, moderator
});

export const permissionsTable = mysqlTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  // e.g. view:comments, delete:comments
});

export const rolePermissionsTable = mysqlTable(
  "role_permissions",
  {
    roleId: serial("role_id")
      .notNull()
      .references(() => rolesTable.id),
    permissionId: int("permission_id")
      .notNull()
      .references(() => permissionsTable.id),
  },
  (table) => ({ pk: primaryKey(table.roleId, table.permissionId) })
);

export const userRolesTable = mysqlTable(
  "user_roles",
  {
    userId: serial("user_id")
      .notNull()
      .references(() => usersTable.id),
    roleId: int("role_id")
      .notNull()
      .references(() => rolesTable.id),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.roleId),
  })
);
