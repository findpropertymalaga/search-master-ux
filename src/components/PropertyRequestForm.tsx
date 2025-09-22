
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must contain at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must contain at least 10 characters." }),
});

type PropertyRequestFormProps = {
  propertyId: string;
  propertyTitle: string;
  propertyRef?: string | null;
};

const PropertyRequestForm = ({ propertyId, propertyTitle, propertyRef }: PropertyRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Use the actual property reference if available
  const displayRef = propertyRef || `ID: ${propertyId}`;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `I am interested in receiving more information about the property with reference ${displayRef}.`,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Send the form data to a serverless function that will send the email
      const { error } = await supabase.functions.invoke('send-property-inquiry', {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          propertyId,
          propertyTitle,
          propertyRef
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Request sent",
        description: "Thank you for your interest. We will contact you shortly.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send your request. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Your message" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-costa-600 hover:bg-costa-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Request information"}
        </Button>
        
        {/* CEO Message and Image */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/fff4216e-628c-43da-afaf-ca7e7db2a485.png" 
                alt="Jakob Engfeldt, CEO" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 italic">
                "We speak several European languages – just let us know your preference."
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Jakob Engfeldt, CEO
              </p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PropertyRequestForm;
