import { useRef, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import './QSLCard.css'

function QSLCard({ data }) {
  const cardRef = useRef(null)
  const [customCallsign, setCustomCallsign] = useState('')
  const [customCqZone, setCustomCqZone] = useState('')
  const [customItuZone, setCustomItuZone] = useState('')

  // Load custom settings from localStorage
  useEffect(() => {
    const savedCallsign = localStorage.getItem('customCallsign')
    const savedCqZone = localStorage.getItem('customCqZone')
    const savedItuZone = localStorage.getItem('customItuZone')
    
    if (savedCallsign) {
      setCustomCallsign(savedCallsign)
    }
    if (savedCqZone) {
      setCustomCqZone(savedCqZone)
    }
    if (savedItuZone) {
      setCustomItuZone(savedItuZone)
    }
  }, [])

  const saveQSLAsPNG = async () => {
    const element = cardRef.current
    
    // Wait for background image to load
    const backgroundImage = new Image()
    backgroundImage.crossOrigin = 'anonymous'
    backgroundImage.src = '/img/background.jpg'
    
    await new Promise((resolve) => {
      if (backgroundImage.complete) {
        resolve()
      } else {
        backgroundImage.onload = resolve
        backgroundImage.onerror = resolve
      }
    })
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true
    })
    
    // Convert canvas to PNG and download
    const link = document.createElement('a')
    link.download = `QSL_${data.callsign}_${data.year}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  return (
    <div className="qsl-card-container">
      <div className="qsl-card" ref={cardRef} id="qsl-card">
        {/* Header Section */}
        <div className="card-header">
          <div className="qsl-header">
            <div className="country-title">THAILAND</div>
            <div className="zone-info">CQ ZONE {customCqZone || 'SET'} ITU ZONE {customItuZone || 'SET'}</div>
          </div>
          
          {/* Main Call Sign */}
          <div className="main-callsign">
            <div className="callsign">{customCallsign || 'SET CALLSIGN'}</div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="card-content">
          {/* Data Table */}
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>CONFIRMING QSO WITH</th>
                  <th>DATE</th>
                  <th>UTC</th>
                  <th>MHz</th>
                  <th>RST</th>
                  <th>MODE 2-WAY</th>
                  <th>QSL</th>
                </tr>
                <tr className="sub-header">
                  <th></th>
                  <th>
                    <div className="date-sub-header">
                      <span>DAY</span>
                      <span>MONTH</span>
                      <span>YEAR</span>
                    </div>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="data-cell">{data.callsign}</td>
                  <td className="data-cell">
                    <div className="date-data">
                      <span>{data.day}</span>
                      <span>{data.month}</span>
                      <span>{data.year}</span>
                    </div>
                  </td>
                  <td className="data-cell">{data.utc}</td>
                  <td className="data-cell">{data.mhz}</td>
                  <td className="data-cell">{data.rst}</td>
                  <td className="data-cell">{data.mode}</td>
                  <td className="data-cell">{data.qsl}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={saveQSLAsPNG} className="save-png-btn">
          Save QSL Card as PNG
        </button>
      </div>
    </div>
  )
}

export default QSLCard
