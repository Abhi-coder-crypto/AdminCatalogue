import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Database, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { mongoConfigSchema, type MongoConfig } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Setup() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [testingConnection, setTestingConnection] = useState(false);

  const form = useForm<MongoConfig>({
    resolver: zodResolver(mongoConfigSchema),
    defaultValues: {
      mongoUri: "",
    },
  });

  const { data: connectionStatus, isLoading: checkingStatus } = useQuery<{
    connected: boolean;
    message: string;
  }>({
    queryKey: ["/api/config/mongodb/status"],
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (data: MongoConfig) => {
      return await apiRequest("POST", "/api/config/mongodb", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Celebrity database connected successfully! Redirecting to catalogues...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config/mongodb/status"] });
      setTimeout(() => {
        setLocation("/catalogues");
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save MongoDB configuration",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MongoConfig) => {
    saveConfigMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Configuration</h1>
        <p className="text-muted-foreground">
          Connect your MongoDB database to start managing your celebrity catalog
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Connection Status
            </CardTitle>
            <CardDescription>Current database connection state</CardDescription>
          </CardHeader>
          <CardContent>
            {checkingStatus ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking connection...</span>
              </div>
            ) : connectionStatus?.connected ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium" data-testid="text-connection-status">
                  Connected - {connectionStatus.message}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                <span className="font-medium" data-testid="text-connection-status">
                  Not Connected - {connectionStatus?.message || "No database configured"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MongoDB Configuration</CardTitle>
            <CardDescription>
              Enter your MongoDB connection string to connect to your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="mongoUri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MongoDB URI</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="mongodb+srv://username:password@cluster.mongodb.net/dbname"
                          data-testid="input-mongo-uri"
                        />
                      </FormControl>
                      <FormDescription>
                        Your MongoDB connection string. Example: mongodb+srv://user:pass@cluster.mongodb.net/celebrities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={saveConfigMutation.isPending}
                    data-testid="button-save-config"
                  >
                    {saveConfigMutation.isPending && (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    )}
                    Save Configuration
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">1. Create a MongoDB Database</h4>
              <p className="text-sm text-muted-foreground">
                Sign up for MongoDB Atlas (free tier available) or use your existing MongoDB instance
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">2. Get Your Connection String</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to your cluster and click "Connect" → "Connect your application" to get your URI
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">3. Paste and Save</h4>
              <p className="text-sm text-muted-foreground">
                Copy your connection string, paste it above, and click "Save Configuration"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
