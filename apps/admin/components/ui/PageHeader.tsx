interface PageHeaderProps {
  title: string
  desc?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, desc, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {desc && <p className="text-gray-400 text-sm mt-1">{desc}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
