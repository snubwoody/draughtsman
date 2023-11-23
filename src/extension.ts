import * as vscode from 'vscode';
import {window,commands,ExtensionContext} from 'vscode';
import * as fs from 'fs';
import path from 'path/win32';

const root_dir = vscode.workspace.workspaceFolders[0].uri.fsPath;
const src_dir = `${root_dir}/src`;
const app_dir = `${src_dir}/app`;

export function activate(context: ExtensionContext) {
	
	let componentCommand = commands.registerCommand('codeGen.genComponent', async() => {

		const components = await window.showQuickPick(['Navbar','Button'],{canPickMany:true});
		
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

	context.subscriptions.push(componentCommand,pageCommand);
}

function genComponent(components:string[],ext_path:string){

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

function init(){
	if(!fs.readdirSync(`${src_dir}/components`)){
		fs.mkdirSync(`${src_dir}/components`);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
