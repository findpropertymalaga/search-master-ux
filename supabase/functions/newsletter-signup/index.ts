import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterSignupRequest {
  email: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Newsletter signup function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source }: NewsletterSignupRequest = await req.json();
    console.log('Received signup request:', { email, source });

    if (!email) {
      console.error('Email is required');
      return new Response(
        JSON.stringify({ error: 'Email is required' }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Try to insert, if duplicate then update the source
    let { data, error } = await supabase
      .from('newsletter_signups')
      .insert([
        { 
          email: email,
          source: source || 'unknown'
        }
      ])
      .select();

    if (error && error.code === '23505') {
      console.log('Email already exists, updating source...');
      // Update existing record with new source
      const { data: updateData, error: updateError } = await supabase
        .from('newsletter_signups')
        .update({ source: source || 'unknown' })
        .eq('email', email)
        .select();
      
      if (updateError) {
        console.error('Update error:', updateError);
      } else {
        data = updateData;
        console.log('Successfully updated existing record:', data);
      }
    } else if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save subscription' }), 
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } else {
      console.log('Successfully inserted new record:', data);
    }

    // Send notification email
    try {
      const emailResponse = await resend.emails.send({
        from: 'Newsletter <hello@findproperty.es>',
        to: ['hello@findproperty.es'],
        subject: 'New Newsletter Subscription',
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Source:</strong> ${source || 'unknown'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
      
      console.log('Notification email sent:', emailResponse);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the whole request if email fails
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in newsletter-signup function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);