#!/usr/bin/env node

/**
 * Domain Setup Helper
 * Helps configure your project for custom domains
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const args = process.argv.slice(2)
const command = args[0]

if (!command) {
  console.log(`
🌐 Domain Setup Helper

Usage:
  npm run domain:setup <your-domain.com>
  npm run domain:check <your-domain.com>

Examples:
  npm run domain:setup mynonprofit.org
  npm run domain:check mynonprofit.org
`)
  process.exit(1)
}

const domain = args[1]

if (command === 'setup' && domain) {
  setupDomain(domain)
} else if (command === 'check' && domain) {
  checkDomain(domain)
} else {
  console.error('❌ Invalid command or missing domain')
  process.exit(1)
}

function setupDomain(domain) {
  console.log(`🚀 Setting up domain: ${domain}\n`)

  // Update GitHub Pages workflow
  try {
    const workflowPath = resolve('.github/workflows/demo-pages.yml')
    let workflow = readFileSync(workflowPath, 'utf8')
    
    // Add CNAME file creation
    if (!workflow.includes('CNAME')) {
      workflow = workflow.replace(
        'cp dist/index.html dist/404.html',
        `cp dist/index.html dist/404.html
          echo "demo.${domain}" > dist/CNAME`
      )
      
      writeFileSync(workflowPath, workflow)
      console.log('✅ Updated GitHub Pages workflow with CNAME')
    }
  } catch (error) {
    console.log('⚠️  Could not update workflow file:', error.message)
  }

  // Update README with domain info
  try {
    const readmePath = resolve('README.md')
    let readme = readFileSync(readmePath, 'utf8')
    
    if (!readme.includes(domain)) {
      readme = readme.replace(
        /Live Demo: https:\/\/.*\.github\.io\/.*\//g,
        `Live Demo: https://demo.${domain}/`
      )
      
      writeFileSync(readmePath, readme)
      console.log('✅ Updated README with new domain')
    }
  } catch (error) {
    console.log('⚠️  Could not update README:', error.message)
  }

  // Create domain-specific environment example
  const envContent = `# Production Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_BASE=/
VITE_APP_URL=https://app.${domain}

# Demo Environment Variables  
VITE_DEMO=1
VITE_BASE=/
VITE_APP_URL=https://demo.${domain}
`

  try {
    writeFileSync('.env.example', envContent)
    console.log('✅ Created .env.example with domain configuration')
  } catch (error) {
    console.log('⚠️  Could not create .env.example:', error.message)
  }

  console.log(`
🎉 Domain setup complete!

📋 Next steps:
1. Configure DNS in GoDaddy:
   • Add CNAME record: demo → yourusername.github.io
   • Add CNAME record: app → your-production-host.com

2. Enable GitHub Pages:
   • Go to repository Settings → Pages
   • Set custom domain: demo.${domain}
   • Wait for SSL certificate

3. Set up Supabase:
   • Add https://demo.${domain} to allowed origins
   • Add https://app.${domain} to allowed origins

4. Deploy and test:
   • Push changes to trigger GitHub Pages build
   • Visit https://demo.${domain} to test

📖 See DOMAIN_SETUP.md for detailed instructions.
`)
}

async function checkDomain(domain) {
  console.log(`🔍 Checking domain configuration: ${domain}\n`)

  // Check DNS resolution
  try {
    const { spawn } = await import('child_process')
    
    console.log('🔍 Checking DNS records...')
    
    // Check demo subdomain
    checkDNS(`demo.${domain}`, 'Demo site')
    
    // Check app subdomain  
    checkDNS(`app.${domain}`, 'Production app')
    
    // Check main domain
    checkDNS(domain, 'Main domain')
    
  } catch (error) {
    console.log('⚠️  Could not check DNS:', error.message)
  }

  console.log(`
📖 Manual checks you can do:
1. Visit https://demo.${domain} - should show demo version
2. Visit https://app.${domain} - should show production version  
3. Check SSL certificates are valid
4. Test authentication flows work correctly

🔧 Tools for checking:
• DNS: https://dnschecker.org
• SSL: https://www.sslshopper.com/ssl-checker.html
• Site speed: https://pagespeed.web.dev
`)
}

function checkDNS(hostname, description) {
  console.log(`  Checking ${description} (${hostname})...`)
  
  // This is a simplified check - in a real implementation you'd use DNS lookup
  console.log(`    → Use 'nslookup ${hostname}' to verify DNS`)
  console.log(`    → Visit https://${hostname} to test`)
}
