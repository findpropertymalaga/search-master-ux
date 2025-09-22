
import { supabase } from '@/integrations/supabase/client';

export const debugDatabaseConnection = async () => {
  console.log('=== DATABASE DEBUG SESSION ===');
  
  try {
    // Test 1: Check if we can connect to the table at all
    console.log('TEST 1: Basic table connection test');
    const { data: testData, error: testError, count } = await (supabase as any)
      .from('resales_feed')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError);
      return;
    }
    
    console.log('✅ Basic connection successful');
    console.log('Total rows in table:', count);
    console.log('Sample data:', testData);
    
    // Test 2: Check specific columns we need
    console.log('\nTEST 2: Column structure test');
    if (testData && testData.length > 0) {
      const sampleRow = testData[0];
      console.log('Available columns:', Object.keys(sampleRow));
      console.log('property_id:', sampleRow.property_id);
      console.log('price:', sampleRow.price);
      console.log('town:', sampleRow.town);
      console.log('beds:', sampleRow.beds);
      console.log('baths:', sampleRow.baths);
      console.log('surface_area:', sampleRow.surface_area);
      console.log('images:', sampleRow.images);
      console.log('features:', sampleRow.features);
    }
    
    // Test 3: Check if there are any NULL values causing issues
    console.log('\nTEST 3: Data quality check');
    const { data: qualityData } = await (supabase as any)
      .from('resales_feed')
      .select('property_id, price, town, beds, baths')
      .not('property_id', 'is', null)
      .not('price', 'is', null)
      .limit(10);
    
    console.log('Non-null properties sample:', qualityData);
    
    // Test 4: Test a simple query with no filters
    console.log('\nTEST 4: Simple query test');
    const { data: simpleData, error: simpleError } = await (supabase as any)
      .from('resales_feed')
      .select('property_id, price, town, beds, baths')
      .order('price', { ascending: false })
      .limit(5);
      
    if (simpleError) {
      console.error('❌ Simple query failed:', simpleError);
    } else {
      console.log('✅ Simple query successful:', simpleData);
    }
    
  } catch (error) {
    console.error('❌ Database debug failed:', error);
  }
};

// Call this function to debug
if (typeof window !== 'undefined') {
  (window as any).debugDatabase = debugDatabaseConnection;
  console.log('💡 Run window.debugDatabase() in console to test database connection');
}
