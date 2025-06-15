const fetch = require('node-fetch')

async function testLogin() {
  try {
    console.log('🔍 Testando endpoint de login...')
    
    const response = await fetch('https://fbtrack-b796njrvt-verges1212-projects.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@superpixel.com',
        password: 'admin123'
      })
    })
    
    const data = await response.text()
    
    console.log('📊 Status:', response.status)
    console.log('📄 Response:', data)
    
    if (response.ok) {
      console.log('✅ Login funcionando!')
    } else {
      console.log('❌ Login com erro')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testLogin() 