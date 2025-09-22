
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PropertyInquiryRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
  propertyRef?: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, propertyId, propertyTitle, propertyRef }: PropertyInquiryRequest = await req.json();

    // Use the real property reference if available, otherwise use the ID
    const displayRef = propertyRef || `CS-${propertyId}`;

    // Store inquiry in database
    const { error: dbError } = await supabase
      .from('property_inquiries')
      .insert({
        name,
        email,
        phone,
        message,
        property_id: propertyId,
        property_title: propertyTitle,
        property_ref: propertyRef
      });

    if (dbError) {
      console.error("Error storing inquiry in database:", dbError);
      // Continue with email sending even if database insert fails
    } else {
      console.log("Inquiry stored successfully in database");
    }

    // Send email to the property manager
    const emailResponse = await resend.emails.send({
      from: "Property Inquiry <hello@findproperty.es>",
      to: ["hello@findproperty.es"],
      reply_to: email,
      subject: `Property Inquiry: ${propertyTitle} (Ref: ${displayRef})`,
      html: `
        <h1>New Property Inquiry</h1>
        <h2>Property: ${propertyTitle} (Ref: ${displayRef})</h2>
        <hr />
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <hr />
        <h3>Message</h3>
        <p>${message}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-property-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
