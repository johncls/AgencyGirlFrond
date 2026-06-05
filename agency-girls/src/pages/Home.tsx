import { useState } from 'react'
import { apiUrl } from '../config'

export function Home() {  
  const [loading, setLoading] = useState(false)

  const handleSendWhatsApp = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/Message/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Aquí puedes agregar los datos que necesite el endpoint
        }),
      })
      
      const data = await response.json()  
      
      if (data.success && data.message) {
        // Abrir WhatsApp en una nueva ventana
        window.open(data.message, '_blank')
      } else {
        console.error('Error en la respuesta:', data)
        alert('Error al generar el enlace de WhatsApp')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="center">
      <div>
        <h1>Girls Agency</h1>
        <p>
          Escribenos para que te ayudemos 
        </p>
      </div>
      <button
        type="button"
        className="counter"
        onClick={handleSendWhatsApp}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Contactar por WhatsApp'}
      </button>
    </section>
  )
}
