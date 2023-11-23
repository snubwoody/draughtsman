
export function Button({text,fn}:ButtonType){
	return (
		<button 
		onClick={()=>{fn()}} 
		className="w-36 h-10 rounded-lg flex items-center justify-center bg-blue-700 text-white">
			{text}
		</button>
	)
}

interface ButtonType{
	text:string,
	fn: () => void | VoidFunction
}