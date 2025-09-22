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

interface NewsletterSubscriptionRequest {
  email: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Newsletter subscription function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing newsletter subscription request');
    const body = await req.text();
    console.log('Request body:', body);
    
    const { email, source }: NewsletterSubscriptionRequest = JSON.parse(body);
    console.log('Email to subscribe:', email, 'Source:', source);

    if (!email) {
      console.error('No email provided');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Store newsletter signup in database
    const { error: dbError } = await supabase
      .from('newsletter_signups')
      .insert({
        email,
        source: source || 'website'
      });

    if (dbError) {
      console.error("Error storing newsletter signup in database:", dbError);
      
      // Check if it's a duplicate email error
      if (dbError.code === '23505' || dbError.message?.includes('duplicate') || dbError.message?.includes('unique')) {
        console.log("Email already subscribed, continuing with notification email");
      } else {
        // For other database errors, log but continue
        console.error("Unexpected database error:", dbError);
      }
    } else {
      console.log("Newsletter signup stored successfully in database");
    }

    console.log('Sending email via Resend to hello@findproperty.es');
    
    // Send notification email to your inbox
    const emailResponse = await resend.emails.send({
      from: "Newsletter <hello@findproperty.es>",
      to: ["hello@findproperty.es"],
      reply_to: email,
      subject: `New Newsletter Subscription`,
      html: `
        <h1>New Newsletter Subscription</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p>Someone has subscribed to your newsletter using the email address above.</p>
        <p><strong>Note:</strong> This notification was sent to your verified email. The subscriber's email is: ${email}</p>
      `,
    });

    console.log("Newsletter subscription email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter-subscription function:", error);
    console.error("Error stack:", error.stack);
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