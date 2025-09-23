
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
  name: z.string().min(2, { message: "Namnet måste innehålla minst 2 tecken." }),
  email: z.string().email({ message: "Vänligen ange en giltig e-postadress." }),
  phone: z.string().min(5, { message: "Vänligen ange ett giltigt telefonnummer." }),
  message: z.string().min(10, { message: "Meddelandet måste innehålla minst 10 tecken." }),
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
      message: `Jag är intresserad av att få mer information om fastigheten med referens ${displayRef}.`,
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
        title: "Begäran skickad",
        description: "Tack för ditt intresse. Vi kommer att kontakta dig inom kort.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte skicka din begäran. Försök igen senare.",
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
              <FormLabel>Namn</FormLabel>
              <FormControl>
                <Input placeholder="Ditt namn" {...field} />
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
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Din e-postadress" {...field} />
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
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Ditt telefonnummer" {...field} />
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
              <FormLabel>Meddelande</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ditt meddelande" 
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
          {isSubmitting ? "Skickar..." : "Begär Information"}
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
                "Vi talar flera europeiska språk – bara låt oss veta din preferens."
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Jakob Engfeldt, VD
              </p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PropertyRequestForm;
