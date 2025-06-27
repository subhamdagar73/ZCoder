
export function InputBox({label, placeholder, onChange, isImportant=true}) {
    return <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
        {isImportant && <span className="text-red-500">*</span>}
      </div>
      <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
}