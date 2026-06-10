import { useState } from 'react'
import { apiUrl } from '../config'
import { Button } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { messageSendServices } from '../services/api/message-services';
export function Home() {
  const [loading, setLoading] = useState(false)

  const handleSendWhatsApp = async () => {
    setLoading(true)
    try {
      const response = await messageSendServices();

      if (response.success && response.message) {
        // Abrir WhatsApp en una nueva ventana
        window.open(response.message, '_blank')
      } else {
        console.error('Error en la respuesta:', response)
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
        <img src="/src/assets/girls.png" alt="Czech Girls Agency" style={{ width: '30%', height: '30%', margin: '0 auto' }} />
        <br />
        <h1>🌟 ¡Bienvenida a Czech Girls Agency! 🌟</h1>
        <p style={{ textAlign: 'center',  alignContent: 'center', margin: '0 auto', width: '50%' }}>
          Estás a un paso de descubrir una oportunidad real para generar ingresos, crecer y alcanzar nuevas metas.
          <br />
          Haz clic y habla directamente con una de nuestras managers, quien te acompañará en todo el proceso.
          <br />
          💎 Tu éxito comienza hoy.
        </p>
      </div>
      <Button
        color= "success"
        variant="contained" endIcon={<WhatsAppIcon />}
        onClick={handleSendWhatsApp}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Contactar por WhatsApp'}
        Contactar por WhatsApp
      </Button>
    </section>
  )
}
