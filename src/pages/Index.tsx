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
import { Label } from "@/components/ui/label";

import { Loader2, Building2, Home, MapPin, DollarSign } from "lucide-react";

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
      const response = await fetch("https://fastapi-docker-starter.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to get price prediction");
      }

      const result = await response.json();
      setPredictedPrice(result.price);
      
      // Scroll to top to show the predicted price
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to get price prediction:", error);
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
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-card">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">NYC Rental Price Predictor</h1>
          <p className="text-muted-foreground text-lg">Enter your property details to get an accurate price estimate</p>
        </div>

        {/* Predicted Price Display */}
        {predictedPrice && (
          <Card className="mb-8 shadow-form border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">
                  ${predictedPrice.toLocaleString()}
                </h3>
                <p className="text-muted-foreground">Estimated Monthly Rent</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Property Details
            </CardTitle>
            <CardDescription>
              Fill out the details below to get an accurate rental price prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <FormLabel className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Subway Station (min)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="e.g., 10"
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

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Amenities & Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'noFee', label: 'No Fee' },
                      { key: 'hasRoofdeck', label: 'Roof Deck' },
                      { key: 'hasWasherDryer', label: 'In-Unit Washer/Dryer' },
                      { key: 'hasDoorman', label: 'Doorman' },
                      { key: 'hasElevator', label: 'Elevator' },
                      { key: 'hasDishwasher', label: 'Dishwasher' },
                      { key: 'hasPatio', label: 'Patio' },  
                      { key: 'hasGym', label: 'Gym' },
                    ].map(({ key, label }) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof PropertyForm}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                name={key}
                                checked={field.value as boolean}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </FormControl>
                            <Label htmlFor={key} className="text-sm cursor-pointer">
                              {label}
                            </Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-card transition-all duration-200 hover:shadow-form"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Property...
                      </>
                    ) : (
                      'Get Price Prediction'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
