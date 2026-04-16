'use client'

import { useState } from 'react'
import '@/styles/modal.css'

export default function ConsentModal({ onClose }: { onClose: () => void }) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>VIRTUAL ANALYSIS</h2>

        <p className="desc">
          For the most accurate analysis results, please use Safari on iOS
          and Chrome on Android.
        </p>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>
            I consent to the scanning of my face and the processing of my images, as described in the Facial Analysis Data Notice, and agree to all terms and conditions, including data retention, data deletion, data usage, processing, and storage.
          </span>
        </label>

        <button
          className="ok-btn"
          disabled={!checked}
          onClick={onClose}
        >
          Ok
        </button>
      </div>
    </div>
  )
}
