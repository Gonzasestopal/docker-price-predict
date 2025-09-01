import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const propertySchema = z.object({
  borough: z.string().min(1, "Borough is required"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or greater"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or greater"),
  size: z.number().min(1, "Size must be greater than 0"),
  subwayDistance: z.number().min(0, "Subway distance must be 0 or greater"),
  floor: z.number().min(1, "Floor must be 1 or greater"),
  buildingAge: z.number().min(0, "Building age must be 0 or greater"),
  noFee: z.boolean(),
  hasRoofdeck: z.boolean(),
  hasWasherDryer: z.boolean(),
  hasDoorman: z.boolean(),
  hasElevator: z.boolean(),
  hasDishwasher: z.boolean(),
  hasPatio: z.boolean(),
  hasGym: z.boolean(),
});

type PropertyForm = z.infer<typeof propertySchema>;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      borough: "",
      bedrooms: 1,
      bathrooms: 1,
      size: 500,
      subwayDistance: 5,
      floor: 1,
      buildingAge: 10,
      noFee: false,
      hasRoofdeck: false,
      hasWasherDryer: false,
      hasDoorman: false,
      hasElevator: false,
      hasDishwasher: false,
      hasPatio: false,
      hasGym: false,
    },
  });

  const onSubmit = async (data: PropertyForm) => {
    setIsLoading(true);
    setPredictedPrice(null);
    
    try {
      // Call the FastAPI predict endpoint (Render)
      const response = await fetch("https://fastapi-docker-starter.onrender.com/api/v1/predict", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get price prediction");
      }

      const result = await response.json();
      setPredictedPrice(result.price);
      
      toast({
        title: "Price Prediction Complete",
        description: `Estimated price: $${result.price.toLocaleString()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get price prediction. Please verify the backend URL is reachable.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const boroughs = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island"
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Property Price Predictor</CardTitle>
            <CardDescription>
              Enter property details to get an estimated price prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Borough */}
                  <FormField
                    control={form.control}
                    name="borough"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Borough</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select borough" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {boroughs.map((borough) => (
                              <SelectItem key={borough} value={borough}>
                                {borough}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bedrooms */}
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bathrooms */}
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Size */}
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size (ft²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subway Distance */}
                  <FormField
                    control={form.control}
                    name="subwayDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subway Station (min)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Floor */}
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Building Age */}
                  <FormField
                    control={form.control}
                    name="buildingAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Age (years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Amenities Checkboxes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="noFee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            No Fee
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasRoofdeck"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Has Roofdeck
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasWasherDryer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            In-Unit Washer/Dryer
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasDoorman"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Has Doorman
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasElevator"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Has Elevator
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasDishwasher"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Has Dishwasher
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasPatio"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Has Patio
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasGym"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Has Gym
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Price Prediction
                </Button>

                {predictedPrice && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-primary">
                          Predicted Price: ${predictedPrice.toLocaleString()}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
