//TODO look for the type for input elemets to enable intellisense
//TODO find a way to make plaaceholder null
'use client';
export default function Input({label,onChange,placeholder=''}:InputType){
	return(
		<div className="flex flex-col gap-3">
			<p className=" font-medium">{label}</p>
			<input
				className="w-56 h-10 border-md shadow-lg outline-1 outline-blue-400 border-2 border-gray-200 rounded-md flex items-center px-3 text-gray-600"
				type="text"
				placeholder={placeholder}
				onChange={(event:any)=>{onChange(event)}}
			/>
		</div>
	)
}

interface InputType {
	label: string,
	onChange: (event:any)=> void,
	placeholder: string | undefined
} 