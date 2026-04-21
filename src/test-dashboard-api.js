// Test script to check all dashboard API endpoints
import { getAdminDashboard, getClasses, getTeachers } from './services/api.js';

async function testDashboardAPIs() {
  console.log('=== Testing Dashboard APIs ===');
  
  try {
    console.log('1. Testing getAdminDashboard...');
    const dashboardData = await getAdminDashboard();
    console.log('Dashboard data:', dashboardData);
    
    console.log('2. Testing getClasses...');
    const classesData = await getClasses();
    console.log('Classes data:', classesData);
    
    console.log('3. Testing getTeachers...');
    const teachersData = await getTeachers();
    console.log('Teachers data:', teachersData);
    
    console.log('=== All APIs working! ===');
  } catch (error) {
    console.error('=== API Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testDashboardAPIs();
