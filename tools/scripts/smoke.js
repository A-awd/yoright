#!/usr/bin/env node

const http = require('http');

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const tests = [
  { name: 'Health Check', path: '/health' },
  { name: 'OpenAPI Spec', path: '/openapi.json' },
  { name: 'Hotel Search', path: '/api/hotels/search?cityId=riyadh' },
  { name: 'FX Rates', path: '/api/fx/latest' },
  { name: 'City Intel', path: '/api/cityintel/riyadh' },
  { name: 'Admin Flags', path: '/api/admin/flags' },
];

let passed = 0;
let failed = 0;

console.log('🚀 Running smoke tests...\n');

async function runTest(test) {
  return new Promise((resolve) => {
    const url = new URL(test.path, BASE_URL);
    
    http.get(url.toString(), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${test.name} - PASSED (${res.statusCode})`);
          passed++;
        } else {
          console.log(`❌ ${test.name} - FAILED (${res.statusCode})`);
          failed++;
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`❌ ${test.name} - ERROR: ${err.message}`);
      failed++;
      resolve();
    });
  });
}

async function runAllTests() {
  for (const test of tests) {
    await runTest(test);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));
  
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();
