import {window,commands,ExtensionContext,workspace} from 'vscode';
import * as fs from 'fs';

const root_dir = workspace.workspaceFolders[0].uri.fsPath;
const src_dir = `${root_dir}/src`;
const app_dir = `${src_dir}/app`;

export function activate(context: ExtensionContext) {

	init();
	
	let componentCommand = commands.registerCommand('codeGen.genComponent', async() => {

		const components = await window.showQuickPick(['Navbar','Button','Input'],{canPickMany:true});
		
		if (components) {
			genComponent(components,context.extensionPath);
		}
	});

	let pageCommand = commands.registerCommand('codeGen.genPage', async() => {
		const pages = await window.showQuickPick(['Catalog'],{canPickMany:true});

		if(pages){
			genPage(pages,context.extensionPath);
		}
	});

	let routeCommand = commands.registerCommand('codeGen.genRoute', async() => {
		
		const route_name = await window.showInputBox({placeHolder:'Type the name of the route'});

		if(route_name){
			genRoute(route_name,context.extensionPath);
		}
	});

	context.subscriptions.push(componentCommand,pageCommand,routeCommand);
}

function genComponent(components:string[],ext_path:string){
	init();
	let file_content:Buffer[] = [];

	components?.forEach((component:any)=> {
		file_content.push(fs.readFileSync(`${ext_path}/src/components/${component}.tsx`));
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

	pages?.forEach((page:any)=> {
		file_content.push(fs.readFileSync(`${ext_path}/src/pages/${page}.tsx`));
	});

	for(let i = 0;i<pages.length;i++){
		let pageName = pages[i];
		let file = file_content[i];
		fs.mkdirSync(`${app_dir}/${pageName.toLowerCase()}`);
		fs.writeFileSync(`${app_dir}/${pageName.toLowerCase()}/page.tsx`,file);
		window.showInformationMessage(`${pages[i]} Generated`);
	}
}

function genRoute(routeName:string,ext_path:string){
	init();
	let file_content:Buffer = fs.readFileSync(`${ext_path}/src/pages/Default.tsx`);

	fs.mkdirSync(`${app_dir}/${routeName.toLowerCase()}`);
	fs.writeFileSync(`${app_dir}/${routeName.toLowerCase()}/page.tsx`,file_content);
	window.showInformationMessage(`New route ${routeName} Generated`);

}

function init(){
	if(!fs.existsSync(`${src_dir}/components`)){
		fs.mkdirSync(`${src_dir}/components`);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
