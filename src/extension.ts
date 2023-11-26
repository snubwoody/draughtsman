import {window,commands,ExtensionContext,workspace} from 'vscode';
import * as fs from 'fs';

const root_dir = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';
const src_dir = `${root_dir}/src`;
const app_dir = `${src_dir}/app`;
//TODO what happens if a route already exists
//TODO set up a backup on gitlab

export function activate(context: ExtensionContext) {

	init();
	
	let componentCommand = commands.registerCommand('dsm.genComponent', async() => {

		const components = await window.showQuickPick(['Button','Input'],{canPickMany:true});
		
		if (components) {
			genComponent(components,context.extensionPath);
		}
	});

	let pageCommand = commands.registerCommand('dsm.genPage', async() => {
		const pages = await window.showQuickPick(['Catalog'],{canPickMany:true});

		if(pages){
			genPage(pages,context.extensionPath);
		}
	});

	let routeCommand = commands.registerCommand('dsm.genRoute', async() => {
		
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
		file_content.push(fs.readFileSync(`${ext_path}/src/components/${component}.txt`));
	});

	for(let i = 0;i<components.length;i++){
		let component_name = components[i];
		let file = file_content[i];
		
		fs.writeFileSync(`${src_dir}/components/${component_name}.txt`,file);
		window.showInformationMessage(`${components[i]} Generated`);
	}
}

function genPage(pages:string[],ext_path:string){
	init();
	let file_content:Buffer[] = [];

	pages?.forEach((page:any)=> {
		file_content.push(fs.readFileSync(`${ext_path}/src/pages/${page}.txt`));
	});

	for(let i = 0;i<pages.length;i++){
		let pageName = pages[i];
		let file = file_content[i];
		fs.mkdirSync(`${app_dir}/${pageName.toLowerCase()}`);
		fs.writeFileSync(`${app_dir}/${pageName.toLowerCase()}/page.txt`,file);
		window.showInformationMessage(`${pages[i]} Generated`);
	}
}

function genRoute(routeName:string,ext_path:string){
	init();
	let file_content:Buffer = fs.readFileSync(`${ext_path}/src/pages/Default.txt`);

	fs.mkdirSync(`${app_dir}/${routeName.toLowerCase()}`);
	fs.writeFileSync(`${app_dir}/${routeName.toLowerCase()}/page.txt`,file_content);
	window.showInformationMessage(`New route ${routeName} Generated`);

}

function init(){
	if(!fs.existsSync(`${src_dir}/components`)){
		fs.mkdirSync(`${src_dir}/components`);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
