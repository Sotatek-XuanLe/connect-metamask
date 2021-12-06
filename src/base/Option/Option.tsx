import React from 'react'

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <div
      onClick={onClick}
      style={{cursor:'pointer'}}
      className={`flex items-center justify-between w-full p-3 rounded-box cursor-pointer ${
        !active ? 'bg-dark-800 hover:bg-dark-700' : 'bg-dark-1000'
      }`}
    >
      <div>
        <div className="flex items-center">
          {active && <div className="w-4 h-4 mr-4 rounded-box" style={{ background: color }} />}
          {header}
        </div>
        {subheader && <div className="mt-2.5 text-xs">{subheader}</div>}
      </div>
    </div>
  )
  if (link) {
    return <a href={link}>{content}</a>
  }

  return !active ? content : <div className="w-full p-px rounded-box bg-gradient-to-r from-blue to-pink">{content}</div>
}
