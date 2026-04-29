'use client'

import { useState } from 'react'
import '@/styles/modal.css'

export default function ConsentModal({ onClose }: { onClose: () => void }) {
  const [checked, setChecked] = useState(false)

  return (
  <>
    <div className="fixed inset-0 z-40 bg-black/50" />
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
  <p style={{ margin: 0 }}>
    I consent to the use of my camera and facial image for Personal Color analysis. My image will be processed temporarily and will not be stored or retained after analysis.
    <br />
    <br />
    By continuing, I agree to the{' '}
    <span
      className="underline cursor-pointer hover:opacity-70 transition-opacity"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open('/upload/privacy', '_blank') }}
    >
      Privacy Policy
    </span>
    .
  </p>
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
      </>
  )
}