import {window,commands,ExtensionContext,workspace} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const root_dir = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';
const src_dir = path.join(root_dir,'src');
const app_dir = path.join(src_dir,'app');
//TODO what happens if a route already exists
//TODO set up a backup on gitlab

export function activate(context: ExtensionContext) {

	init();
	
	let componentCommand = commands.registerCommand('dsm.genComponent', async() => {

		const components = await window.showQuickPick(['Button','Input','Card','Dropdown'],{canPickMany:true});
		
		if (components) {
			try{
				genComponent(components,context.extensionPath);
			}
			catch (err) {
				window.showInformationMessage(`${err}`);
			}
		}
	});

	let routeCommand = commands.registerCommand('dsm.genRoute', async() => {
		
		const route_name = await window.showInputBox({placeHolder:'Type the name of the route'});

		if(route_name){
			try {
				genRoute(route_name,context.extensionPath);
			}
			catch (err) {
				window.showInformationMessage(`${err}`);
			}
		}
	});

	let pageCommand = commands.registerCommand('dsm.genPage',async () => {
		const pages = await window.showQuickPick(['Signin','Catalog'],{canPickMany:true});

		if(pages){
			genPage(pages,context.extensionPath);
		}
	});

	context.subscriptions.push(componentCommand,routeCommand);
}

function genComponent(components:string[],ext_path:string){
	init();
	let file_content:Buffer[] = [];

	components?.forEach((component:any)=> {
		file_content.push(fs.readFileSync(path.join(ext_path,'out','components',`${component}.txt`)));
	});

	for(let i = 0;i<components.length;i++){
		let component_name = components[i];
		let file = file_content[i];
		
		fs.writeFileSync(`${src_dir}/components/${component_name}.tsx`,file);
		window.showInformationMessage(`${components[i]} Generated`);
	}
}

function genPage(pages:string[],ext_path:string){
	init();
	let file_content:Buffer[] = [];
	const jsonFile = fs.readFileSync(path.join(ext_path,'src','pages','requirements.json'));
	const requirements = JSON.parse(jsonFile.toString());

	pages?.forEach((page:any)=> {
		file_content.push(fs.readFileSync(`${ext_path}/out/pages/${page}.txt`));
	});

	for(let i = 0;i<pages.length;i++){
		let pageName = pages[i];
		let file = file_content[i];

		const pageRequirements = requirements[pageName];

		if (pageRequirements !== 0){
			genComponent(pageRequirements,ext_path);
		}
		
		fs.mkdirSync(`${app_dir}/${pageName.toLowerCase()}`);
		fs.writeFileSync(`${app_dir}/${pageName.toLowerCase()}/page.tsx`,file);
		window.showInformationMessage(`${pages[i]} Generated`);
	}
}

function genRoute(routeName:string,ext_path:string){
	init();
	let file_content:Buffer = fs.readFileSync(path.join(ext_path,'out','pages','Default.txt'));

	fs.mkdirSync(path.join(app_dir,routeName.toLowerCase()));
	fs.writeFileSync(path.join(app_dir,routeName.toLowerCase(),'page.tsx'),file_content);

	window.showInformationMessage(`New route ${routeName} Generated`);

}

function init(){
	if(!fs.existsSync(path.join(src_dir,'components'))){
		fs.mkdirSync(path.join(src_dir,'components'));
	}
}

