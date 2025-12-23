import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getUsers, hasPermission } from "../lib/auth";
import { Button } from "@/components/ui/button";

// ✅ mark component async so you can await inside
export default async function Home() {
  const users = await getUsers();
  // resolve permissions server-side before rendering
  const results = await Promise.all(
    users.map(async (user) => {
      const canViewAny = await hasPermission(user, "view:comments");
      const canCreateAny = await hasPermission(user, "create:comments");
      const canUpdateAny = await hasPermission(user, "update:comments");
      const canDeleteAny = await hasPermission(user, "delete:comments");
      const canDeleteOwn = await hasPermission(user, "delete:ownComments");
      const canBanAny = await hasPermission(user, "ban:users");
      return {
        ...user,
        canDeleteAny,
        canDeleteOwn,
        canUpdateAny,
        canViewAny,
        canCreateAny,
        canBanAny,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 my-6 space-y-6">
      {results.map((user) => (
        <Card key={user.id}>
          <CardHeader className="">{user.name} sees:</CardHeader>
          {user.canViewAny && (
            <CardContent>
              I can see the comment Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industrys standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book.
            </CardContent>
          )}
          <CardFooter className="gap-4">
            {user.canCreateAny && (
              <Button variant="default">Create (any comment)</Button>
            )}
            {user.canUpdateAny && (
              <Button variant="default">Update (any comment)</Button>
            )}
            {user.canDeleteAny && (
              <Button variant="destructive">Delete (any comment)</Button>
            )}
            {user.canDeleteOwn && (
              <Button variant="destructive">Delete (own comment)</Button>
            )}
            {user.canBanAny && (
              <Button variant="default">Ban (any comment)</Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
