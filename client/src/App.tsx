import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Setup from "@/pages/setup";
import Dashboard from "@/pages/dashboard";
import AddCelebrity from "@/pages/add-celebrity";
import EditCelebrity from "@/pages/edit-celebrity";
import LoginPage from "@/pages/login";
import type { Admin } from "@shared/schema";

function ProtectedRoute({ component: Component, dbRequired = true }: { component: React.ComponentType; dbRequired?: boolean }) {
  const [location] = useLocation();
  const { data: dbStatus, isLoading, isError, isFetching } = useQuery<{ connected: boolean; message: string }>({
    queryKey: ["/api/config/mongodb/status"],
    enabled: dbRequired,
    staleTime: 30000,
    retry: 2,
  });

  if (!dbRequired) {
    return <Component />;
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Checking database connection...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-lg text-destructive">Failed to check database connection</div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/config/mongodb/status"] })}>
          Retry
        </Button>
      </div>
    );
  }

  if (!dbStatus?.connected && location !== "/setup") {
    return <Redirect to="/setup" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/setup">
        <ProtectedRoute component={Setup} dbRequired={false} />
      </Route>
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/add">
        <ProtectedRoute component={AddCelebrity} />
      </Route>
      <Route path="/edit/:id">
        <ProtectedRoute component={EditCelebrity} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setAdmin(null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginPage onLoginSuccess={checkAuth} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between gap-4 p-4 border-b h-16">
                <div className="flex items-center gap-4">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {admin.name}
                  </span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-8">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
