
export default function Navbar(){
	return (
		<nav className="w-full h-[7vh] flex gap-10 items-center px-10">
			<p className="text-xl">Heading</p>
			<ul className="flex gap-5">
				<li><a href="#">Link</a></li>
				<li><a href="#">Link</a></li>
				<li><a href="#">Link</a></li>
			</ul>
		</nav>
	);
}