import { useState, useEffect } from 'react'
import './QSLForm.css'

function QSLForm({ onSubmit, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    callsign: '',
    day: '',
    month: '',
    year: '',
    utc: '',
    mhz: '',
    rst: '',
    mode: '',
    qsl: ''
  })

  const [errors, setErrors] = useState({})
  const [currentTime, setCurrentTime] = useState('')
  const [customCallsign, setCustomCallsign] = useState('')
  const [customCqZone, setCustomCqZone] = useState('')
  const [customItuZone, setCustomItuZone] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // Load custom settings from localStorage on component mount
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

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const utcTime = now.toISOString().substr(11, 5) // Get HH:MM format
      setCurrentTime(`${utcTime} (Z)`)
    }
    
    updateTime() // Set initial time
    const interval = setInterval(updateTime, 1000) // Update every second
    
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value
    
    // Auto-capitalize callsign
    if (name === 'callsign') {
      processedValue = value.toUpperCase()
    }
    
    // Auto-append (Z) for UTC time input
    if (name === 'utc' && value && !value.includes('(Z)')) {
      // Check if it's in HH:MM format
      const timeRegex = /^\d{1,2}:\d{2}$/
      if (timeRegex.test(value)) {
        processedValue = `${value} (Z)`
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.callsign.trim()) {
        newErrors.callsign = 'Call sign is required'
      }
    } else if (step === 2) {
      if (!formData.day) {
        newErrors.day = 'Day is required'
      }
      if (!formData.month) {
        newErrors.month = 'Month is required'
      }
      if (!formData.year) {
        newErrors.year = 'Year is required'
      }
      if (!formData.utc.trim()) {
        newErrors.utc = 'UTC is required'
      }
    } else if (step === 3) {
      if (!formData.mhz.trim()) {
        newErrors.mhz = 'MHz is required'
      }
      if (!formData.rst.trim()) {
        newErrors.rst = 'RST is required'
      }
      if (!formData.mode.trim()) {
        newErrors.mode = 'Mode is required'
      }
      if (!formData.qsl.trim()) {
        newErrors.qsl = 'QSL is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!customCallsign.trim() || !customCqZone.trim() || !customItuZone.trim()) {
      alert('Please set your callsign, CQ Zone, and ITU Zone in Settings before creating a QSL card.')
      setShowSettings(true)
      return
    }
    if (validateStep(3)) {
      onSubmit(formData)
    }
  }

  const handleCustomCallsignChange = (e) => {
    setCustomCallsign(e.target.value.toUpperCase())
  }

  const handleCustomCqZoneChange = (e) => {
    setCustomCqZone(e.target.value)
  }

  const handleCustomItuZoneChange = (e) => {
    setCustomItuZone(e.target.value)
  }

  const saveCustomSettings = () => {
    if (customCallsign.trim() && customCqZone.trim() && customItuZone.trim()) {
      localStorage.setItem('customCallsign', customCallsign.trim())
      localStorage.setItem('customCqZone', customCqZone.trim())
      localStorage.setItem('customItuZone', customItuZone.trim())
      setShowSettings(false)
    } else {
      alert('Please fill in all fields: Callsign, CQ Zone, and ITU Zone')
    }
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  const setCurrentDateTime = () => {
    const now = new Date()
    
    // Set date
    const day = now.getDate().toString().padStart(2, '0')
    const month = now.toLocaleString('en-US', { month: 'short' })
    const year = now.getFullYear().toString()
    
    // Set time
    const utcTime = now.toISOString().substr(11, 5) // Get HH:MM format
    const timeWithZ = `${utcTime} (Z)`
    
    setFormData(prev => ({
      ...prev,
      day,
      month,
      year,
      utc: timeWithZ
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-card">
            <div className="step-header">
              <div className="progress-indicator">
                <div className="step-number active">1</div>
                <div className="step-label">Call Sign</div>
                <div className="step-number">2</div>
                <div className="step-label">Date & Time</div>
                <div className="step-number">3</div>
                <div className="step-label">QSO Details</div>
              </div>
            </div>
            
            <div className="step-content">
              <div className="input-group">
                <label htmlFor="callsign" className="input-label">Call Sign:</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="callsign"
                    name="callsign"
                    value={formData.callsign}
                    onChange={handleChange}
                    className={`form-input ${errors.callsign ? 'error' : ''} ${!customCallsign.trim() ? 'disabled' : ''}`}
                    placeholder={!customCallsign.trim() ? "Set your callsign in Settings first" : ""}
                    disabled={!customCallsign.trim()}
                  />
                  <span className="input-icon">📻</span>
                </div>
                {errors.callsign && <span className="error-message">{errors.callsign}</span>}
              </div>
              
            </div>
            
            <div className="step-actions">
              <button type="button" className="next-btn" onClick={handleNext}>
                Next Step
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-card">
            <div className="step-header">
              <div className="progress-indicator">
                <div className="step-number completed">✓</div>
                <div className="step-label">Call Sign</div>
                <div className="step-number active">2</div>
                <div className="step-label">Date & Time</div>
                <div className="step-number">3</div>
                <div className="step-label">QSO Details</div>
              </div>
            </div>
            
            <div className="step-content">
              <div className="readonly-field">
                <span className="field-label">Call Sign:</span>
                <span className="field-value">{formData.callsign}</span>
                <span className="checkmark">✓</span>
              </div>
              
              <div className="input-group">
                <div className="input-group-header">
                  <label className="input-label">Date:</label>
                  <button 
                    type="button" 
                    className={`now-btn ${!customCallsign.trim() ? 'disabled' : ''}`}
                    onClick={setCurrentDateTime}
                    title={!customCallsign.trim() ? "Set your callsign in Settings first" : "Fill with current date and time"}
                    disabled={!customCallsign.trim()}
                  >
                    📅 Today
                  </button>
                </div>
                <div className="date-inputs">
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className={`form-select ${errors.day ? 'error' : ''} ${!customCallsign.trim() ? 'disabled' : ''}`}
                    disabled={!customCallsign.trim()}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>
                        {day.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className={`form-select ${errors.month ? 'error' : ''} ${!customCallsign.trim() ? 'disabled' : ''}`}
                    disabled={!customCallsign.trim()}
                  >
                    <option value="">Month</option>
                    <option value="Jan">Jan</option>
                    <option value="Feb">Feb</option>
                    <option value="Mar">Mar</option>
                    <option value="Apr">Apr</option>
                    <option value="May">May</option>
                    <option value="Jun">Jun</option>
                    <option value="Jul">Jul</option>
                    <option value="Aug">Aug</option>
                    <option value="Sep">Sep</option>
                    <option value="Oct">Oct</option>
                    <option value="Nov">Nov</option>
                    <option value="Dec">Dec</option>
                  </select>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`form-select ${errors.year ? 'error' : ''} ${!customCallsign.trim() ? 'disabled' : ''}`}
                    disabled={!customCallsign.trim()}
                  >
                    <option value="">Year</option>
                    <option value={new Date().getFullYear().toString()}>
                      {new Date().getFullYear()}
                    </option>
                  </select>
                </div>
                {(errors.day || errors.month || errors.year) && (
                  <span className="error-message">Please select all date fields</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="utc" className="input-label">UTC Time:</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="utc"
                    name="utc"
                    value={formData.utc}
                    onChange={handleChange}
                    className={`form-input ${errors.utc ? 'error' : ''} ${!customCallsign.trim() ? 'disabled' : ''}`}
                    placeholder={!customCallsign.trim() ? "Set your callsign in Settings first" : "HH:MM (Z)"}
                    disabled={!customCallsign.trim()}
                  />
                  <span className="input-icon">🕐</span>
                </div>
                {errors.utc && <span className="error-message">{errors.utc}</span>}
              </div>

            </div>
            
            <div className="step-actions">
              <button type="button" className="prev-btn" onClick={handlePrevious}>
                Previous
              </button>
              <button type="button" className="next-btn" onClick={handleNext}>
                Next Step
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="step-card">
            <div className="step-header">
              <div className="progress-indicator">
                <div className="step-number completed">✓</div>
                <div className="step-label">Call Sign</div>
                <div className="step-number completed">✓</div>
                <div className="step-label">Date & Time</div>
                <div className="step-number active">3</div>
                <div className="step-label">QSO Details</div>
              </div>
            </div>
            
            <div className="step-content">
              <div className="readonly-field">
                <span className="field-label">Call Sign:</span>
                <span className="field-value">{formData.callsign}</span>
                <span className="checkmark">✓</span>
              </div>
              
              <div className="readonly-field">
                <span className="field-label">Date & Time:</span>
                <span className="field-value">{formData.day} {formData.month} {formData.year}, {formData.utc}</span>
                <span className="checkmark">✓</span>
              </div>
              
              
              <div className="qso-details">
                <div className="input-group">
                  <label htmlFor="mhz" className="input-label">Frequency (MHz):</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="mhz"
                      name="mhz"
                      value={formData.mhz}
                      onChange={handleChange}
                      className={`form-input ${errors.mhz ? 'error' : ''}`}
                      placeholder=""
                    />
                    <span className="input-icon">📡</span>
                  </div>
                  {errors.mhz && <span className="error-message">{errors.mhz}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="rst" className="input-label">RST:</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="rst"
                      name="rst"
                      value={formData.rst}
                      onChange={handleChange}
                      className={`form-input ${errors.rst ? 'error' : ''}`}
                      placeholder=""
                    />
                    <span className="input-icon">📊</span>
                  </div>
                  {errors.rst && <span className="error-message">{errors.rst}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="mode" className="input-label">Mode 2-Way:</label>
                  <div className="input-wrapper">
                    <select
                      id="mode"
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className={`form-select ${errors.mode ? 'error' : ''}`}
                    >
                      <option value="">Select Mode</option>
                      <option value="FM">FM</option>
                      <option value="CW">CW</option>
                      <option value="AM">AM</option>
                      <option value="DSTAR">DSTAR</option>
                      <option value="DMR">DMR</option>
                      <option value="DIGITAL VOICE">DIGITAL VOICE</option>
                      <option value="SSB">SSB</option>
                    </select>
                    <span className="input-icon">🔄</span>
                  </div>
                  {errors.mode && <span className="error-message">{errors.mode}</span>}
                </div>


                <div className="input-group">
                  <label htmlFor="qsl" className="input-label">QSL Message:</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="qsl"
                      name="qsl"
                      value={formData.qsl}
                      onChange={handleChange}
                      className={`form-input ${errors.qsl ? 'error' : ''}`}
                      placeholder=""
                    />
                    <span className="input-icon">💬</span>
                  </div>
                  {errors.qsl && <span className="error-message">{errors.qsl}</span>}
                </div>

              </div>
            </div>
            
            <div className="step-actions">
              <button type="button" className="prev-btn" onClick={handlePrevious}>
                Previous
              </button>
              <button type="button" className="submit-btn" onClick={handleSubmit}>
                Generate QSL Card
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="step-card success-card">
            <div className="step-header">
              <div className="progress-indicator">
                <div className="step-number completed">✓</div>
                <div className="step-label">Call Sign</div>
                <div className="step-number completed">✓</div>
                <div className="step-label">Date & Time</div>
                <div className="step-number completed">✓</div>
                <div className="step-label">QSO Details</div>
              </div>
            </div>
            
            <div className="success-content">
              <div className="success-icon">🎉</div>
              <h3>QSL Card Generated Successfully!</h3>
              <p>Your QSL card has been created with all the provided information.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="qsl-form-container">
      {onClose && (
        <button className="close-btn" onClick={onClose} aria-label="Close form">
          ✕
        </button>
      )}
      
      <div className="zulu-time">
        <span className="zulu-label">Zulu Time:</span>
        <span className="zulu-time-value">{currentTime}</span>
      </div>

      {/* Settings Widget */}
      <div className="settings-widget">
        <button className="settings-toggle" onClick={toggleSettings}>
          ⚙️ Settings
        </button>
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h3>QSL Card Settings</h3>
              <button className="close-settings" onClick={toggleSettings}>✕</button>
            </div>
            <div className="settings-content">
              <div className="input-group">
                <label htmlFor="customCallsign" className="input-label">Your Callsign:</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="customCallsign"
                    value={customCallsign}
                    onChange={handleCustomCallsignChange}
                    className="form-input"
                    placeholder="Enter your callsign"
                    maxLength="10"
                  />
                  <span className="input-icon">📻</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="customCqZone" className="input-label">CQ Zone:</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="customCqZone"
                    value={customCqZone}
                    onChange={handleCustomCqZoneChange}
                    className="form-input"
                    placeholder="Enter CQ Zone"
                    min="1"
                    max="40"
                  />
                  <span className="input-icon">🌍</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="customItuZone" className="input-label">ITU Zone:</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="customItuZone"
                    value={customItuZone}
                    onChange={handleCustomItuZoneChange}
                    className="form-input"
                    placeholder="Enter ITU Zone"
                    min="1"
                    max="90"
                  />
                  <span className="input-icon">📡</span>
                </div>
              </div>

              <p className="settings-help">
                <strong>Required:</strong> You must set your callsign, CQ Zone, and ITU Zone before creating QSL cards. These will be displayed on your QSL card.
              </p>

              <div className="settings-actions">
                <button 
                  type="button" 
                  className="save-settings-btn" 
                  onClick={saveCustomSettings}
                  disabled={!customCallsign.trim() || !customCqZone.trim() || !customItuZone.trim()}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="form-header">
        <div className="form-icon">📻</div>
        <h2>QSL Card Generator</h2>
        <p>Create your QSL card in simple steps</p>
        {(!customCallsign.trim() || !customCqZone.trim() || !customItuZone.trim()) && (
          <div className="settings-required-notice">
            ⚠️ Please set your callsign, CQ Zone, and ITU Zone in Settings before proceeding
          </div>
        )}
      </div>
      
      <div className="multi-step-form">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="form-footer">
        <p>QSL Card Generator System done by E26AFI ❤️</p>
      </div>
    </div>
  )
}

export default QSLForm
