import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  insertCelebritySchema,
  type InsertCelebrity,
  genderOptions,
  eventTypeOptions,
  languageOptions,
  socialPlatformOptions,
} from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AddCelebrity() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertCelebrity>({
    resolver: zodResolver(insertCelebritySchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      image: "",
      bio: "",
      socialLinks: [],
      videoUrl: "",
      gender: undefined,
      language: [],
      location: "",
      eventTypes: [],
      isFeatured: false,
    },
  });

  const {
    fields: socialLinkFields,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCelebrity) => {
      return await apiRequest("POST", "/api/celebrities", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Celebrity created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/celebrities"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create celebrity",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCelebrity) => {
    createMutation.mutate(data);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!form.formState.dirtyFields.slug) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const imageUrl = form.watch("image");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Celebrity</h1>
        <p className="text-muted-foreground">
          Fill in the details below to add a new celebrity to your catalog
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the celebrity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g., Arijit Singh"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., arijit-singh"
                          data-testid="input-slug"
                        />
                      </FormControl>
                      <FormDescription>URL-friendly identifier (auto-generated from name)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Images and videos showcasing the celebrity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        data-testid="input-profile-image"
                      />
                    </FormControl>
                    <FormDescription>Direct link to the celebrity's profile image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {imageUrl && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Preview</p>
                  <img
                    src={imageUrl}
                    alt="Profile preview"
                    className="max-h-40 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {!imageUrl && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No image uploaded</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        data-testid="input-video-url"
                      />
                    </FormControl>
                    <FormDescription>YouTube embed link for showcase video</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Location, pricing, and service information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="A detailed description about the celebrity..."
                        className="h-32 resize-none"
                        data-testid="input-bio"
                      />
                    </FormControl>
                    <FormDescription>Detailed description about the celebrity</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Mumbai"
                        data-testid="input-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={() => (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {languageOptions.map((language) => (
                        <FormField
                          key={language}
                          control={form.control}
                          name="language"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={language}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(language)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, language])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== language)
                                          );
                                    }}
                                    data-testid={`checkbox-language-${language.toLowerCase()}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{language}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Event Types</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {eventTypeOptions.map((eventType) => (
                        <FormField
                          key={eventType}
                          control={form.control}
                          name="eventTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={eventType}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(eventType)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, eventType])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== eventType)
                                          );
                                    }}
                                    data-testid={`checkbox-event-${eventType.toLowerCase().replace(/\s+/g, "-")}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{eventType}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Social media profiles and online presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialLinkFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.platform`}
                    render={({ field }) => (
                      <FormItem className="w-[180px]">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid={`select-social-platform-${index}`}>
                              <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {socialPlatformOptions.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://..."
                            data-testid={`input-social-url-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                    data-testid={`button-remove-social-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendSocialLink({ platform: "Instagram", url: "" })}
                data-testid="button-add-social-link"
              >
                <Plus className="mr-2 w-4 h-4" />
                Add Social Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Additional configuration options</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Celebrity</FormLabel>
                      <FormDescription>
                        Display this celebrity in the featured section
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-featured"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              data-testid="button-save"
            >
              {createMutation.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save Celebrity
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
