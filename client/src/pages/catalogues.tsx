import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Database, Plus, CheckCircle2, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Celebrity } from "@shared/schema";

export default function Catalogues() {
  const { data: connectionStatus, isLoading: checkingStatus } = useQuery<{
    connected: boolean;
    message: string;
  }>({
    queryKey: ["/api/config/mongodb/status"],
  });

  const { data: celebrities = [], isLoading: loadingCelebrities } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
    enabled: connectionStatus?.connected,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Catalogues</h1>
          <p className="text-muted-foreground">
            Manage your celebrity databases and catalogues
          </p>
        </div>
        <Link href="/setup">
          <Button variant="outline" data-testid="button-add-catalogue">
            <Plus className="mr-2 w-4 h-4" />
            Add New Catalogue
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {checkingStatus ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : connectionStatus?.connected ? (
          <Link href="/dashboard">
            <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-md" data-testid="card-catalogue">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Celebrity Catalogue</CardTitle>
                  </div>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </Badge>
                </div>
                <CardDescription className="line-clamp-1">
                  {connectionStatus.message}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Total Celebrities</span>
                    </div>
                    <div className="text-2xl font-bold" data-testid="text-celebrity-count">
                      {loadingCelebrities ? "..." : celebrities.length}
                    </div>
                  </div>
                  <Button className="w-full" data-testid="button-manage-catalogue">
                    Manage Catalogue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">No Catalogue Connected</CardTitle>
              <CardDescription>
                Connect your MongoDB database to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/setup">
                <Button className="w-full" data-testid="button-setup-catalogue">
                  <Plus className="mr-2 w-4 h-4" />
                  Setup Catalogue
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">About Catalogues</h3>
        <p className="text-sm text-muted-foreground">
          Each catalogue represents a MongoDB database connection where you can store and manage celebrity profiles. 
          You can connect multiple databases to organize different sets of celebrities.
        </p>
      </div>
    </div>
  );
}
